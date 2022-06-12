import { v4 as Guid } from "uuid";
import { Assert, IsArray, IsTuple } from "@paulpopat/safe-type";
import { Category, IsCategory } from "$types/category";
import { DatabaseContext } from "$contexts/database";

export async function GetAll() {
  const db = DatabaseContext.Use();
  const rows = await db.Query(
    `SELECT id, name, budget FROM categories ORDER BY name ASC`
  );

  Assert(IsArray(IsCategory), rows);
  return rows;
}

export async function Get(id: string) {
  const db = DatabaseContext.Use();
  const rows = await db.Query(
    `SELECT id, name, budget FROM categories WHERE id = $1`,
    id
  );

  Assert(IsTuple(IsCategory), rows);
  return rows[0];
}

export async function Add(name: string, budget: number) {
  const db = DatabaseContext.Use();
  const id = Guid();
  await db.Query(
    `INSERT INTO categories(id, name, budget) VALUES ($1, $2, $3)`,
    id,
    name,
    budget
  );

  return id;
}

export async function Update(id: string, subject: Omit<Category, "id">) {
  const db = DatabaseContext.Use();
  await db.Query(
    `UPDATE categories
     SET name = $2,
         budget = $3
     WHERE id = $1`,
    id,
    subject.name,
    subject.budget
  );

  return id;
}
