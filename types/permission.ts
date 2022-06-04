import {
  IsLiteral,
  IsNumber,
  IsObject,
  IsString,
  IsType,
  IsUnion,
} from "@paulpopat/safe-type";

export const PermissionOptions = [
  "view",
  "all-tx",
  "cat-man",
  "user-man",
] as const;

export const IsPermissionName = IsUnion(
  ...PermissionOptions.map((o) => IsLiteral(o))
);

export type PermissionName = IsType<typeof IsPermissionName>;

export const IsPermission = IsObject({
  id: IsString,
  level: IsNumber,
  name: IsPermissionName,
});
