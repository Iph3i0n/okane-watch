import { GetDb } from "$services/database";
import { v4 as Guid } from "uuid";
import { Assert, IsArray, IsTuple } from "@paulpopat/safe-type";
import { IsPerson, Person } from "$types/person";

export async function Init() {
  const db = await GetDb();
  await db.Run(`CREATE TABLE IF NOT EXISTS people (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
  ) WITHOUT ROWID`);
}

export async function GetAll() {
  const db = await GetDb();

  const rows = await db.All(`SELECT id, name FROM people`);
  Assert(IsArray(IsPerson), rows);
  return rows;
}

export async function Get(id: string) {
  const db = await GetDb();
  const rows = await db.All(
    `SELECT id, name FROM people
     WHERE id = $id`,
    { $id: id }
  );

  Assert(IsTuple(IsPerson), rows);
  return rows[0];
}

export async function Add(name: string) {
  const id = Guid();
  const db = await GetDb();

  await db.Run(`INSERT INTO people VALUES ($id, $name)`, {
    $id: id,
    $name: name,
  });

  return id;
}

export async function Update(id: string, subject: Omit<Person, "id">) {
  const db = await GetDb();
  await db.Run(
    `UPDATE people
     SET name = $name
     WHERE id = $id`,
    {
      $id: id,
      $name: subject.name,
    }
  );

  return id;
}
