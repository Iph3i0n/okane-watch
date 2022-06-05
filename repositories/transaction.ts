import { GetDb } from "$services/database";
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
  Optional,
} from "@paulpopat/safe-type";
import { DateObject, FromJsDate, ToJsDate } from "$types/utility";

const IsTransactionDto = IsObject({
  id: IsString,
  person: IsString,
  category: IsString,
  description: IsString,
  amount: IsNumber,
  date: IsDate,
});

type TransactionDto = IsType<typeof IsTransactionDto>;

function FromDto(transaction: TransactionDto): Transaction {
  return {
    id: transaction.id,
    person: transaction.person,
    category: transaction.category,
    description: transaction.description,
    amount: transaction.amount,
    when: FromJsDate(transaction.date),
  };
}

export async function Add(transaction: Omit<Transaction, "id">) {
  const id = Guid();
  const db = await GetDb();
  await db.Query(
    `INSERT INTO transactions(id, person, category, description, amount, date)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    id,
    transaction.person,
    transaction.category,
    transaction.description,
    transaction.amount,
    ToJsDate(transaction.when)
  );

  await db.End();
  return id;
}

export async function GetTransactions(from: DateObject, to: DateObject) {
  const db = await GetDb();
  const rows = await db.Query(
    `SELECT id, person, category, description, amount, date
     FROM transactions
     WHERE date >= $1 AND date < $2`,
    ToJsDate(from),
    ToJsDate(to)
  );

  await db.End();
  Assert(IsArray(IsTransactionDto), rows);
  return rows.map(FromDto);
}

export async function GetTotalForCategory(
  category_id: string,
  from: DateObject,
  to: DateObject
) {
  const db = await GetDb();
  const rows = await db.Query(
    `SELECT SUM(amount) as total
     FROM transactions
     WHERE date >= $1 AND date < $2 AND category = $3`,
    ToJsDate(from),
    ToJsDate(to),
    category_id
  );

  await db.End();
  Assert(IsTuple(IsObject({ total: Optional(IsString) })), rows);
  return parseInt(rows[0].total ?? "0");
}

export async function Update(id: string, transaction: Omit<Transaction, "id">) {
  const db = await GetDb();
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

  await db.End();
  return id;
}

export async function Delete(id: string) {
  const db = await GetDb();
  await db.Query(
    `DELETE FROM transactions
     WHERE id = $1`,
    id
  );

  await db.End();
}
