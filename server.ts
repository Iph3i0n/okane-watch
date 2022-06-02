import { createServer as CreateServer } from "http";
import { parse as Parse } from "url";
import Next from "next";
import Path from "path";
import Fs from "fs-extra";
import Dotenv from "dotenv";
import { GetDb } from "$services/database";

Dotenv.config();

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const app = Next({ dev, hostname, port });
const handle = app.getRequestHandler();

(async () => {
  const db = await GetDb();
  const update_scripts_base = Path.join(__dirname, "update-scripts");
  for (const file of await Fs.readdir(update_scripts_base)) {
    const loc = Path.join(update_scripts_base, file);
    const data = await Fs.readFile(loc, "utf-8");
    await db.Query(data);
  }

  await db.End();

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
