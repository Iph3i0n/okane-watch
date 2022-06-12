import { Transaction } from "$types/transaction";
import { v4 as Guid } from "uuid";
import {
  Assert,
  IsArray,
  IsDate,
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
     VALUES ($1, $2, $3, $4, $5, $6)`,
    id,
    user.id,
    transaction.category,
    transaction.description,
    transaction.amount,
    ToJsDate(transaction.when)
  );

  return id;
}

export async function GetTransactions(from: DateObject, to: DateObject) {
  const db = DatabaseContext.Use();
  const rows = await db.Query(
    `SELECT id, person, category, description, amount, date
     FROM transactions
     WHERE date >= $1 AND date < $2
     ORDER BY date DESC, person DESC, description DESC`,
    ToJsDate(from),
    ToJsDate(to)
  );

  Assert(IsArray(IsTransactionDto), rows);
  return await Promise.all(rows.map(FromDto));
}

export async function Get(id: string) {
  const db = DatabaseContext.Use();
  const rows = await db.Query(
    `SELECT id, person, category, description, amount, date
     FROM transactions
     WHERE id = $1`,
    id
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
     WHERE date >= $1 AND date < $2 AND category = $3`,
    ToJsDate(from),
    ToJsDate(to),
    category_id
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
     WHERE date >= $1 AND date < $2 AND category = $3 AND person = $4`,
    ToJsDate(from),
    ToJsDate(to),
    category_id,
    user.id
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
     SET person = $2,
         category = $3,
         description = $4,
         amount = $5,
         date = $6
     WHERE id = $1`,
    id,
    transaction.person,
    transaction.category,
    transaction.description,
    transaction.amount,
    ToJsDate(transaction.when)
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
     WHERE id = $1`,
    id
  );
}
