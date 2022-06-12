import CreateContext from "./node-context";
import { Person } from "$types/person";

export const UserContext = CreateContext<Person & { permissions: string[] }>();
