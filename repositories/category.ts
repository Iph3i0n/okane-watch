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
     WHERE person = $1 OR person IS NULL
     ORDER BY name ASC`,
    user.id
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
     WHERE person = $1 OR person IS NULL
     ORDER BY name ASC`,
    user.id
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
     WHERE person = $1 OR person IS NULL
     ORDER BY name ASC`,
    user.id
  );

  Assert(IsArray(IsCategoryDto), rows);
  return await Promise.all(rows.map(ToSummaryCategory(from, to)));
}

export async function Get(id: string) {
  const db = DatabaseContext.Use();
  const rows = await db.Query(
    `SELECT id, name, budget, person FROM categories WHERE id = $1`,
    id
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
      `INSERT INTO categories(id, name, budget, person) VALUES ($1, $2, $3, $4)`,
      id,
      name,
      budget,
      user.id
    );
  else
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
  const user = UserContext.Use();

  if (subject.personal)
    await db.Query(
      `UPDATE categories
       SET name = $2,
           budget = $3,
           person = $4
       WHERE id = $1`,
      id,
      subject.name,
      subject.budget,
      user.id
    );
  else
    await db.Query(
      `UPDATE categories
       SET name = $2,
           budget = $3
           person = NULL
       WHERE id = $1`,
      id,
      subject.name,
      subject.budget
    );

  return id;
}
