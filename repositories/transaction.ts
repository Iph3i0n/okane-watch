import { GetDb } from "$services/database";
import { Transaction } from "$types/transaction";
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

const IsTransactionDto = IsObject({
  id: IsString,
  person: IsString,
  category: IsString,
  description: IsString,
  amount: IsNumber,
  day: IsNumber,
  month: IsNumber,
  year: IsNumber,
});

type TransactionDto = IsType<typeof IsTransactionDto>;

function FromDto(transaction: TransactionDto): Transaction {
  return {
    id: transaction.id,
    person: transaction.person,
    category: transaction.category,
    description: transaction.description,
    amount: transaction.amount,
    when: {
      day: transaction.day,
      month: transaction.month,
      year: transaction.year,
    },
  };
}

export async function Add(transaction: Omit<Transaction, "id">) {
  const id = Guid();
  const db = await GetDb();
  await db.Query(
    `INSERT INTO transactions(id, person, category, description, amount, day, month, year)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    id,
    transaction.person,
    transaction.category,
    transaction.description,
    transaction.amount,
    transaction.when.day,
    transaction.when.month,
    transaction.when.year
  );

  await db.End();
  return id;
}

export async function GetTransactions(month: number, year: number) {
  const db = await GetDb();
  const rows = await db.Query(
    `SELECT id, person, category, description, amount, day, month, year
     FROM transactions
     WHERE month = $1 AND year = $2`,
    month,
    year
  );

  await db.End();
  Assert(IsArray(IsTransactionDto), rows);
  return rows.map(FromDto);
}

export async function GetTotalForCategory(
  category_id: string,
  month: number,
  year: number
) {
  const db = await GetDb();
  const rows = await db.Query(
    `SELECT SUM(amount) as total
     FROM transactions
     WHERE month = $1 AND year = $2 AND category = $3`,
    month,
    year,
    category_id
  );

  await db.End();
  Assert(IsTuple(IsObject({ total: Optional(IsNumber) })), rows);
  return rows[0].total ?? 0;
}

export async function Update(id: string, transaction: Omit<Transaction, "id">) {
  const db = await GetDb();
  await db.Query(
    `UPDATE transactions
     SET person = $2,
         category = $3,
         description = $4,
         amount = $5,
         day = $6,
         month = $7,
         year = $8
     WHERE id = $1`,
    id,
    transaction.person,
    transaction.category,
    transaction.description,
    transaction.amount,
    transaction.when.day,
    transaction.when.month,
    transaction.when.year
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
