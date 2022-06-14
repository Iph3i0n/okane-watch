import { Transaction } from "$types/transaction";
import { v4 as Guid } from "uuid";
import {
  Assert,
  IsArray,
  IsDate,
  IsIntersection,
  IsNumber,
  IsObject,
  IsString,
  IsTuple,
  IsType,
  IsUnion,
  Optional,
} from "@paulpopat/safe-type";
import { DateObject, FromJsDate, ToJsDate } from "$types/utility";
import { DatabaseContext } from "$contexts/database";
import { CanPostTo, Get as GetCategory } from "./category";
import { Get as GetPerson } from "./person";
import { UserContext } from "$contexts/user";

const IsTransactionDto = IsObject({
  id: IsString,
  person: IsString,
  category: IsString,
  description: IsString,
  amount: IsNumber,
  date: IsDate,
});

type TransactionDto = IsType<typeof IsTransactionDto>;

async function FromDto(transaction: TransactionDto) {
  return {
    id: transaction.id,
    person: await GetPerson(transaction.person),
    category: await GetCategory(transaction.category),
    description: transaction.description,
    amount: transaction.amount,
    when: FromJsDate(transaction.date),
  };
}

export async function Add(
  transaction: Omit<Omit<Transaction, "id">, "person">
) {
  const user = UserContext.Use();
  if (!(await CanPostTo(transaction.category)))
    throw new Error("Permission denied");

  const db = DatabaseContext.Use();
  const id = Guid();
  await db.Query(
    `INSERT INTO transactions(id, person, category, description, amount, date)
     VALUES (:id, :person, :category, :description, :amount, :when)`,
    {
      id,
      person: user.id,
      category: transaction.category,
      description: transaction.description,
      amount: transaction.amount,
      when: ToJsDate(transaction.when),
    }
  );

  return id;
}

export async function GetTransactions(
  from: DateObject,
  to: DateObject,
  user_id: string | undefined,
  category_id: string | undefined,
  skip: number,
  take: number
) {
  const db = DatabaseContext.Use();
  const rows = await db.Query(
    `SELECT id, person, category, description, amount, date, count(*) OVER() AS full_count
     FROM transactions
     WHERE date >= :from_date AND date < :to_date ${
       user_id ? "AND person = :person" : ""
     } ${category_id ? "AND category = :category" : ""}
     ORDER BY date DESC, person DESC, description DESC
     LIMIT :take OFFSET :skip`,
    {
      from_date: ToJsDate(from),
      to_date: ToJsDate(to),
      person: user_id,
      category: category_id,
      skip,
      take,
    }
  );

  Assert(
    IsArray(
      IsIntersection(IsTransactionDto, IsObject({ full_count: IsString }))
    ),
    rows
  );

  if (rows.length === 0) return { total: 0, data: [] };

  return {
    total: parseInt(rows[0].full_count),
    data: await Promise.all(rows.map(FromDto)),
  };
}

export async function Get(id: string) {
  const db = DatabaseContext.Use();
  const rows = await db.Query(
    `SELECT id, person, category, description, amount, date
     FROM transactions
     WHERE id = :id`,
    { id }
  );

  Assert(IsTuple(IsTransactionDto), rows);
  return await FromDto(rows[0]);
}

export async function GetTotalForCategory(
  category_id: string,
  from: DateObject,
  to: DateObject
) {
  const db = DatabaseContext.Use();
  const rows = await db.Query(
    `SELECT SUM(amount) as total
     FROM transactions
     WHERE date >= :from_date 
      AND date < :to_date
      AND category = :category_id`,
    {
      from_date: ToJsDate(from),
      to_date: ToJsDate(to),
      category_id,
    }
  );

  Assert(
    IsTuple(IsObject({ total: Optional(IsUnion(IsNumber, IsString)) })),
    rows
  );
  return parseFloat(rows[0].total?.toString() ?? "0");
}

export async function GetTotalForCategoryWIthCurrentUser(
  category_id: string,
  from: DateObject,
  to: DateObject
) {
  const db = DatabaseContext.Use();
  const user = UserContext.Use();
  const rows = await db.Query(
    `SELECT SUM(amount) as total
     FROM transactions
     WHERE date >= :from_date
      AND date < :to_date
      AND category = :category_id
      AND person = :user_id`,
    {
      from_date: ToJsDate(from),
      to_date: ToJsDate(to),
      category_id,
      user_id: user.id,
    }
  );

  Assert(
    IsTuple(IsObject({ total: Optional(IsUnion(IsNumber, IsString)) })),
    rows
  );
  return parseFloat(rows[0].total?.toString() ?? "0");
}

export async function Update(id: string, transaction: Omit<Transaction, "id">) {
  const user = UserContext.Use();
  const existing = await Get(id);
  if (
    !existing ||
    user.id !== existing.person.id ||
    !(await CanPostTo(transaction.category))
  )
    throw new Error("Permission denied");

  const db = DatabaseContext.Use();
  await db.Query(
    `UPDATE transactions
     SET person = :person,
         category = :category,
         description = :description,
         amount = :amount,
         date = :when
     WHERE id = :id`,
    {
      id,
      person: transaction.person,
      category: transaction.category,
      description: transaction.description,
      amount: transaction.amount,
      when: ToJsDate(transaction.when),
    }
  );

  return id;
}

export async function Delete(id: string) {
  const user = UserContext.Use();
  const existing = await Get(id);
  if (
    !existing ||
    user.id !== existing.person.id ||
    !(await CanPostTo(existing.category.id))
  )
    throw new Error("Permission denied");

  const db = DatabaseContext.Use();
  await db.Query(
    `DELETE FROM transactions
     WHERE id = :id`,
    { id }
  );
}
