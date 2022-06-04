import { IsNumber, IsObject, IsString } from "@paulpopat/safe-type";

export const IsPermission = IsObject({
  id: IsString,
  level: IsNumber,
  name: IsString,
});
