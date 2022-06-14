import Config from "$queries/config.json";
import Fs from "fs-extra";
import Path from "path";
import { DatabaseContext } from "$contexts/database";
import object from "$utils/object";
import { IsDate } from "@paulpopat/safe-type";
import { FromJsDate, ToDateString } from "$types/utility";

type PossibleParameters = {
  from_date?: string;
  to_date?: string;
  person?: string;
  category?: string;
};

export function GetAll() {
  return Config;
}

export async function Execute(
  slug: keyof typeof Config,
  parameters: PossibleParameters
) {
  const metadata = Config[slug];

  for (const key of metadata.parameters) {
    if (!parameters[key]) throw new Error("Missing parameter data");
  }

  const db = DatabaseContext.Use();
  const query = await Fs.readFile(
    Path.join(".", "queries", slug + ".sql"),
    "utf-8"
  );

  const response = await db.Query(query, parameters);
  return response.map((r) =>
    typeof r === "object"
      ? object.MapKeys(r, (k, v) =>
          IsDate(v) ? ToDateString(FromJsDate(v)) : (v as any)
        )
      : r
  );
}
