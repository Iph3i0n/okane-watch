import CreateContext from "./node-context";
import { Database } from "$services/database";

export const DatabaseContext = CreateContext<Omit<Database, "End">>();
