import { Promised } from "$types/utility";
import { Client } from "pg";
import { pg } from "yesql";

export async function GetDb() {
  const db = new Client({
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT),
    host: process.env.DB_HOST,
    keepAlive: true,
  });
  await db.connect();

  return {
    Query(sql: string, params?: Record<string, any>) {
      const query = pg(sql)(params ?? {});
      return new Promise<unknown[]>((res, rej) => {
        db.query(query.text, query.values, function (err, final) {
          if (err) rej(err);
          else res(final.rows);
        });
      });
    },
    End() {
      return db.end();
    },
  };
}

export type Database = Promised<ReturnType<typeof GetDb>>;
