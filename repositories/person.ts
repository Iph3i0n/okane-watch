import { GetDb } from "$services/database";
import { v4 as Guid } from "uuid";
import {
  Assert,
  IsArray,
  IsObject,
  IsString,
  IsTuple,
} from "@paulpopat/safe-type";
import { IsPerson, Person } from "$types/person";
import BCrypt from "bcrypt";

export function Encrypt(data: string) {
  return BCrypt.hash(data, 10);
}

export function Matches(data: string, encrypted: string) {
  return BCrypt.compare(data, encrypted);
}

export async function GetAll() {
  const db = await GetDb();

  const rows = await db.Query(`SELECT id, name FROM people`);
  Assert(IsArray(IsPerson), rows);
  return rows;
}

export async function Get(id: string) {
  const db = await GetDb();
  const rows = await db.Query(
    `SELECT id, name FROM people
     WHERE id = $1`,
    id
  );

  await db.End();
  Assert(IsTuple(IsPerson), rows);
  return rows[0];
}

export async function GetByName(name: string) {
  const db = await GetDb();
  const rows = await db.Query(
    `SELECT id, name FROM people
     WHERE name = $1`,
    name
  );

  await db.End();
  Assert(IsTuple(IsPerson), rows);
  return rows[0].id;
}

export async function Add(name: string, password: string) {
  const id = Guid();
  const db = await GetDb();

  await db.Query(
    `INSERT INTO people(id, name, password) VALUES ($1, $2, $3)`,
    id,
    name,
    await Encrypt(password)
  );

  await db.End();
  return id;
}

export async function Update(id: string, subject: Omit<Person, "id">) {
  const db = await GetDb();
  await db.Query(
    `UPDATE people
     SET name = $2
     WHERE id = $1`,
    id,
    subject.name
  );

  await db.End();
  return id;
}

export async function IsCorrectPassword(name: string, password: string) {
  const db = await GetDb();
  const rows = await db.Query(
    `SELECT password FROM people
     WHERE name = $1`,
    name
  );

  await db.End();
  Assert(IsTuple(IsObject({ password: IsString })), rows);
  return await Matches(password, rows[0].password);
}
