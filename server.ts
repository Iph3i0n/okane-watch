import { createServer as CreateServer } from "http";
import { parse as Parse } from "url";
import Next from "next";
import Path from "path";
import Fs from "fs-extra";
import Dotenv from "dotenv";
import { GetDb } from "$services/database";
import * as People from "$repositories/person";
import * as Permissions from "$repositories/permissions";
import { PermissionOptions } from "$types/permission";
import { DatabaseContext } from "$contexts/database";

Dotenv.config();

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const app = Next({ dev, hostname, port });
const handle = app.getRequestHandler();

async function RunMigrations() {
  const db = DatabaseContext.Use();
  const update_scripts_base = Path.join(".", "update-scripts");
  for (const file of await Fs.readdir(update_scripts_base)) {
    const loc = Path.join(update_scripts_base, file);
    const data = await Fs.readFile(loc, "utf-8");
    await db.Query(data);
  }
}

async function ShouldAddAdmin() {
  for (const person of await People.GetAll()) {
    const user_perms = await Permissions.GetUserPermissions(person.id);
    if (user_perms.includes("user-man")) return false;
  }

  return true;
}

async function AddAdmin() {
  console.log(
    "No user admin detected. Creating one using defaults from environment variables."
  );
  const id = await People.Add(
    process.env.ADMIN_USERNAME,
    process.env.ADMIN_PASSWORD
  );

  const permissions = await Permissions.GetAll();
  for (const permission of permissions)
    await Permissions.AddForUser(id, permission.id);
}

async function AddAllPermissions() {
  const check = (await Permissions.GetAll()).map((p) => p.name);

  for (const permission of PermissionOptions)
    if (!check.includes(permission))
      await Permissions.AddPermission(0, permission);
}

(async () => {
  const db = await GetDb();
  DatabaseContext.Provide(db);
  await RunMigrations();
  await AddAllPermissions();
  if (await ShouldAddAdmin()) await AddAdmin();
  db.End();

  await app.prepare();
  CreateServer(async (req, res) => {
    try {
      const parsedUrl = Parse(req.url, true);

      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  }).listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
})().catch((err) => {
  console.error(err);
});
