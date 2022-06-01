import Sqlite3 from "sqlite3";
import Path from "path";
import Fs from "fs-extra";

let cache: Sqlite3.Database;

export async function GetDb() {
  const db = await new Promise<Sqlite3.Database>(async (res, rej) => {
    if (cache) res(cache);
    else {
      const dir = Path.dirname(process.env.SQL_DB_LOCATION);
      if (!(await Fs.pathExists(dir))) {
        await Fs.mkdirp(dir);
      }

      cache = new Sqlite3.Database(process.env.SQL_DB_LOCATION, (err) => {
        if (err) rej(err);
        else res(cache);
      });
    }
  });

  return {
    Run(sql: string, params?: any) {
      return new Promise<Sqlite3.RunResult>((res, rej) => {
        db.run(sql, params, function (err) {
          if (err) rej(err);
          res(this);
        });
      });
    },
    All(sql: string, params?: any) {
      return new Promise<unknown[]>((res, rej) => {
        db.all(sql, params, function (err, rows) {
          if (err) rej(err);
          res(rows);
        });
      });
    },
  };
}
