import { IsObject, IsString, IsType } from "@paulpopat/safe-type";

export const IsPerson = IsObject({
  id: IsString,
  name: IsString,
});

export type Person = IsType<typeof IsPerson>;
