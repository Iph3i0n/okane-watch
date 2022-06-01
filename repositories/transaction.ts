import { GetDb } from "../services/database";
import { IsTransaction, Transaction } from "../types/transaction";
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
  user: IsString,
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
    user: transaction.user,
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

export async function Init() {
  const db = await GetDb();
  await db.Run(`CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    user TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    amount INTEGER NOT NULL,
    day INTEGER NOT NULL,
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    FOREIGN KEY (category) REFERENCES categories (id),
    FOREIGN KEY (user) REFERENCES people (id)
  ) WITHOUT ROWID`);
}

export async function Add(transaction: Omit<Transaction, "id">) {
  const id = Guid();
  const db = await GetDb();
  await db.Run(
    `INSERT INTO transactions VALUES (
       $id, $user, $category, $description, $amount, $day, $month, $year
     )`,
    {
      $id: id,
      $user: transaction.user,
      $category: transaction.category,
      $description: transaction.description,
      $amount: transaction.amount,
      $day: transaction.when.day,
      $month: transaction.when.month,
      $year: transaction.when.year,
    }
  );

  return id;
}

export async function GetTransactions(month: number, year: number) {
  const db = await GetDb();
  const rows = await db.All(
    `SELECT id, user, category, description, amount, day, month, year
     FROM transactions
     WHERE month = $month AND year = $year`,
    { $month: month, $year: year }
  );

  Assert(IsArray(IsTransactionDto), rows);
  return rows.map(FromDto);
}

export async function GetTotalForCategory(
  category_id: string,
  month: number,
  year: number
) {
  const db = await GetDb();
  const rows = await db.All(
    `SELECT SUM(amount) as total
     FROM transactions
     WHERE month = $month AND year = $year AND category = $category`,
    {
      $month: month,
      $year: year,
      $category: category_id,
    }
  );

  Assert(IsTuple(IsObject({ total: Optional(IsNumber) })), rows);
  return rows[0].total ?? 0;
}

export async function Update(id: string, transaction: Omit<Transaction, "id">) {
  const db = await GetDb();
  await db.Run(
    `UPDATE transactions
     SET user = $user,
         category = $category,
         description = $description,
         amount = $amount,
         day = $day,
         month = $month,
         year = $year
     WHERE id = $id`,
    {
      $id: id,
      $user: transaction.user,
      $category: transaction.category,
      $description: transaction.description,
      $amount: transaction.amount,
      $day: transaction.when.day,
      $month: transaction.when.month,
      $year: transaction.when.year,
    }
  );

  return id;
}

export async function Delete(id: string) {
  const db = await GetDb();
  await db.Run(
    `DELETE FROM transactions
     WHERE id = $id`,
    { $id: id }
  );
}
