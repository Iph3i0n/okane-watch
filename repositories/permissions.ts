import { GetDb } from "$services/database";
import { IsPermission } from "$types/permission";
import { Assert, IsObject, IsString, IsArray } from "@paulpopat/safe-type";
import { v4 as Guid } from "uuid";

export async function GetUserPermissions(user_id: string) {
  const db = await GetDb();

  const rows = await db.Query(
    `
    SELECT p.name
    FROM people_permissions a
      INNER JOIN permissions p ON a.permission = p.id
    WHERE a.id = $1`,
    user_id
  );

  await db.End();

  Assert(IsArray(IsObject({ name: IsString })), rows);
  return rows.map((r) => r.name);
}

export async function GetAll() {
  const db = await GetDb();
  const rows = await db.Query(`SELECT id, level, name FROM permissions`);
  await db.End();

  Assert(IsArray(IsPermission), rows);
  return rows;
}

export async function AddForUser(user_id: string, permission_id: string) {
  const id = Guid();

  const db = await GetDb();

  await db.Query(
    `INSERT INTO people_permissions(id, person, permission) VALUES ($1, $2, $3)`,
    id,
    user_id,
    permission_id
  );

  await db.End();
  return id;
}
