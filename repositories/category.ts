import { GetDb } from "$services/database";
import { v4 as Guid } from "uuid";
import { Assert, IsArray, IsTuple } from "@paulpopat/safe-type";
import { Category, IsCategory } from "$types/category";

export async function GetAll() {
  const db = await GetDb();

  const rows = await db.Query(
    `SELECT id, name, budget FROM categories ORDER BY name DESC`
  );
  Assert(IsArray(IsCategory), rows);
  return rows;
}

export async function Get(id: string) {
  const db = await GetDb();

  const rows = await db.Query(
    `SELECT id, name, budget FROM categories WHERE id = $1`,
    id
  );
  await db.End();
  Assert(IsTuple(IsCategory), rows);
  return rows[0];
}

export async function Add(name: string, budget: number) {
  const id = Guid();
  const db = await GetDb();

  await db.Query(
    `INSERT INTO categories(id, name, budget) VALUES ($1, $2, $3)`,
    id,
    name,
    budget
  );

  await db.End();
  return id;
}

export async function Update(id: string, subject: Omit<Category, "id">) {
  const db = await GetDb();
  await db.Query(
    `UPDATE categories
     SET name = $2,
         budget = $3
     WHERE id = $1`,
    id,
    subject.name,
    subject.budget
  );

  await db.End();
  return id;
}
