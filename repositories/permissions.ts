import { DatabaseContext } from "$contexts/database";
import { IsPermission, PermissionName } from "$types/permission";
import { Assert, IsObject, IsString, IsArray } from "@paulpopat/safe-type";
import { v4 as Guid } from "uuid";

export async function GetUserPermissions(user_id: string) {
  const db = DatabaseContext.Use();
  const rows = await db.Query(
    `
    SELECT p.name
    FROM people_permissions a
      INNER JOIN permissions p ON a.permission = p.id
    WHERE a.person = $1`,
    user_id
  );

  Assert(IsArray(IsObject({ name: IsString })), rows);
  return rows.map((r) => r.name);
}

export async function GetAll() {
  const db = DatabaseContext.Use();
  const rows = await db.Query(`SELECT id, level, name FROM permissions`);

  Assert(IsArray(IsPermission), rows);
  return rows;
}

export async function AddPermission(level: number, name: PermissionName) {
  const db = DatabaseContext.Use();
  const id = Guid();
  await db.Query(
    `INSERT INTO permissions(id, level, name) VALUES ($1, $2, $3)`,
    id,
    level,
    name
  );

  return id;
}

export async function AddForUser(user_id: string, permission_id: string) {
  const db = DatabaseContext.Use();
  const id = Guid();
  await db.Query(
    `INSERT INTO people_permissions(id, person, permission) VALUES ($1, $2, $3)`,
    id,
    user_id,
    permission_id
  );

  return id;
}

export async function RemoveForUser(user_id: string, permission_id: string) {
  const db = DatabaseContext.Use();
  await db.Query(
    `DELETE FROM people_permissions WHERE person = $1 AND permission = $2`,
    user_id,
    permission_id
  );
}
