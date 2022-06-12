import Config from "$queries/config.json";
import { pg } from "yesql";
import Fs from "fs-extra";
import Path from "path";
import { DatabaseContext } from "$contexts/database";

type PossibleParameters = {
  from_date?: string;
  to_date?: string;
  person?: string;
  category?: string;
};

export function GetAll() {
  return Config;
}

export async function Execute(slug: string, parameters: PossibleParameters) {
  const metadata = Config.queries.find((q) => q.slug === slug);

  for (const key of metadata.parameters) {
    if (!parameters[key]) throw new Error("Missing parameter data");
  }

  const db = DatabaseContext.Use();
  const query = await Fs.readFile(
    Path.join(".", "queries", slug + ".sql"),
    "utf-8"
  );

  const final_query = pg(query)(parameters);
  const response = await db.Query(final_query.text, ...final_query.values);
  return response;
}
