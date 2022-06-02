import { Client } from "pg";

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
    Query(sql: string, ...params: any[]) {
      return new Promise<any[]>((res, rej) => {
        db.query(sql, params, function (err, final) {
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
