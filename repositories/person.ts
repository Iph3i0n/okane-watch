import { v4 as Guid } from "uuid";
import {
  Assert,
  IsArray,
  IsObject,
  IsString,
  IsTuple,
} from "@paulpopat/safe-type";
import { IsPerson } from "$types/person";
import BCrypt from "bcrypt";
import { DatabaseContext } from "$contexts/database";

export function Encrypt(data: string) {
  return BCrypt.hash(data, 10);
}

export function Matches(data: string, encrypted: string) {
  return BCrypt.compare(data, encrypted);
}

export async function GetAll() {
  const db = DatabaseContext.Use();
  const rows = await db.Query(`SELECT id, name FROM people ORDER BY name DESC`);
  Assert(IsArray(IsPerson), rows);
  return rows;
}

export async function Get(id: string) {
  const db = DatabaseContext.Use();
  const rows = await db.Query(
    `SELECT id, name FROM people
     WHERE id = $1`,
    id
  );

  Assert(IsTuple(IsPerson), rows);
  return rows[0];
}

export async function GetByName(name: string) {
  const db = DatabaseContext.Use();
  const rows = await db.Query(
    `SELECT id, name FROM people
     WHERE name = $1`,
    name
  );

  Assert(IsTuple(IsPerson), rows);
  return rows[0].id;
}

export async function Add(name: string, password: string) {
  const db = DatabaseContext.Use();
  const id = Guid();
  await db.Query(
    `INSERT INTO people(id, name, password) VALUES ($1, $2, $3)`,
    id,
    name,
    await Encrypt(password)
  );

  return id;
}

export async function Update(id: string, name: string, password: string) {
  const db = DatabaseContext.Use();
  await db.Query(
    `UPDATE people
     SET name = $2
     WHERE id = $1`,
    id,
    name
  );

  if (password)
    await db.Query(
      `UPDATE people
       SET password = $2
       WHERE id = $1`,
      id,
      await Encrypt(password)
    );

  return id;
}

export async function IsCorrectPassword(name: string, password: string) {
  const db = DatabaseContext.Use();
  const rows = await db.Query(
    `SELECT password FROM people
     WHERE name = $1`,
    name
  );

  Assert(IsTuple(IsObject({ password: IsString })), rows);
  return await Matches(password, rows[0].password);
}
