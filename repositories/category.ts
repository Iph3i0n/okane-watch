import { GetDb } from "$services/database";
import { v4 as Guid } from "uuid";
import { Assert, IsArray, IsTuple } from "@paulpopat/safe-type";
import { Category, IsCategory } from "$types/category";

export async function Init() {
  const db = await GetDb();
  await db.Run(`CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    budget REAL NOT NULL
  ) WITHOUT ROWID`);
}

export async function GetAll() {
  const db = await GetDb();

  const rows = await db.All(`SELECT id, name, budget FROM categories`);
  Assert(IsArray(IsCategory), rows);
  return rows;
}

export async function Get(id: string) {
  const db = await GetDb();

  const rows = await db.All(
    `SELECT id, name, budget FROM categories WHERE id = $id`,
    { $id: id }
  );
  Assert(IsTuple(IsCategory), rows);
  return rows[0];
}

export async function Add(name: string, budget: number) {
  const id = Guid();
  const db = await GetDb();

  await db.Run(`INSERT INTO categories VALUES ($id, $name, $budget)`, {
    $id: id,
    $name: name,
    $budget: budget,
  });

  return id;
}

export async function Update(id: string, subject: Omit<Category, "id">) {
  const db = await GetDb();
  await db.Run(
    `UPDATE categories
     SET name = $name,
         budget = $budget
     WHERE id = $id`,
    {
      $id: id,
      $name: subject.name,
      $budget: subject.budget,
    }
  );

  return id;
}
