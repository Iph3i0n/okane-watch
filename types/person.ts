import {
  IsArray,
  IsIntersection,
  IsObject,
  IsString,
  IsType,
} from "@paulpopat/safe-type";

export const IsPerson = IsObject({
  id: IsString,
  name: IsString,
});

export type Person = IsType<typeof IsPerson>;

export const IsUser = IsIntersection(
  IsPerson,
  IsObject({ permissions: IsArray(IsString) })
);

export type User = IsType<typeof IsUser>;
