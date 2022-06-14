import { v4 as Guid } from "uuid";
import {
  Assert,
  IsArray,
  IsNumber,
  IsObject,
  IsString,
  IsTuple,
  IsType,
  Optional,
} from "@paulpopat/safe-type";
import { Category } from "$types/category";
import { DatabaseContext } from "$contexts/database";
import { UserContext } from "$contexts/user";
import {
  GetTotalForCategory,
  GetTotalForCategoryWIthCurrentUser,
} from "./transaction";
import { DateObject } from "$types/utility";

const IsCategoryDto = IsObject({
  id: IsString,
  name: IsString,
  budget: IsNumber,
  person: Optional(IsString),
});

type CategoryDto = IsType<typeof IsCategoryDto>;

function ToSummaryCategory(from: DateObject, to: DateObject) {
  return async (dto: CategoryDto) => {
    const spend = await GetTotalForCategory(dto.id, from, to);
    const current_user_spend = await GetTotalForCategoryWIthCurrentUser(
      dto.id,
      from,
      to
    );
    return {
      id: dto.id,
      name: dto.name,
      budget: dto.budget,
      personal: dto.person ? true : false,
      total: { spend: spend, diff: dto.budget - spend },
      your: {
        spend: current_user_spend,
        diff: dto.budget - current_user_spend,
      },
    };
  };
}

function ToDomainCategory(dto: CategoryDto) {
  return {
    id: dto.id,
    name: dto.name,
    budget: dto.budget,
    personal: dto.person ? true : false,
  };
}

export async function GetAll() {
  const db = DatabaseContext.Use();
  const rows = await db.Query(
    `SELECT id, name, budget, person
     FROM categories
     ORDER BY name ASC`
  );

  Assert(IsArray(IsCategoryDto), rows);
  return rows.map(ToDomainCategory);
}

export async function GetOptions() {
  const db = DatabaseContext.Use();
  const user = UserContext.Use();
  const rows = await db.Query(
    `SELECT id, name, budget, person
     FROM categories
     WHERE person = :id OR person IS NULL
     ORDER BY name ASC`,
    { id: user.id }
  );

  Assert(IsArray(IsCategoryDto), rows);
  return rows.map(ToDomainCategory);
}

export async function CanPostTo(category_id: string) {
  const db = DatabaseContext.Use();
  const user = UserContext.Use();
  const rows = await db.Query(
    `SELECT id, name, budget, person
     FROM categories
     WHERE person = :id OR person IS NULL
     ORDER BY name ASC`,
    { id: user.id }
  );

  Assert(IsArray(IsCategoryDto), rows);
  return !!rows.find((r) => r.id === category_id);
}

export async function GetOverview(from: DateObject, to: DateObject) {
  const db = DatabaseContext.Use();
  const user = UserContext.Use();
  const rows = await db.Query(
    `SELECT id, name, budget, person
     FROM categories
     WHERE person = :id OR person IS NULL
     ORDER BY name ASC`,
    { id: user.id }
  );

  Assert(IsArray(IsCategoryDto), rows);
  return await Promise.all(rows.map(ToSummaryCategory(from, to)));
}

export async function Get(id: string) {
  const db = DatabaseContext.Use();
  const rows = await db.Query(
    `SELECT id, name, budget, person FROM categories WHERE id = :id`,
    { id }
  );

  Assert(IsTuple(IsCategoryDto), rows);
  return rows.map(ToDomainCategory)[0];
}

export async function Add(name: string, budget: number, personal: boolean) {
  const db = DatabaseContext.Use();
  const user = UserContext.Use();
  const id = Guid();
  if (personal)
    await db.Query(
      `INSERT INTO categories(id, name, budget, person)
       VALUES (:id, :name, :budget, :user_id)`,
      { id, name, budget, user_id: user.id }
    );
  else
    await db.Query(
      `INSERT INTO categories(id, name, budget)
       VALUES (:id, :name, :budget)`,
      { id, name, budget }
    );

  return id;
}

export async function Update(id: string, subject: Omit<Category, "id">) {
  const db = DatabaseContext.Use();
  const user = UserContext.Use();

  if (subject.personal)
    await db.Query(
      `UPDATE categories
       SET name = :name,
           budget = :budget,
           person = :person
       WHERE id = :id`,
      { id, name: subject.name, budget: subject.budget, user_id: user.id }
    );
  else
    await db.Query(
      `UPDATE categories
       SET name = :name,
           budget = :budget
           person = NULL
       WHERE id = :id`,
      { id, name: subject.name, subject: subject.budget }
    );

  return id;
}
