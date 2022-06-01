import { IsNumber, IsObject, IsString, IsType } from "@paulpopat/safe-type";
import { IsCategory } from "./category";
import { IsPerson } from "./person";

export const IsTransaction = IsObject({
  id: IsString,
  user: IsString,
  category: IsString,
  description: IsString,
  amount: IsNumber,
  when: IsObject({ day: IsNumber, month: IsNumber, year: IsNumber }),
});

export const IsCompleteTransaction = IsObject({
  id: IsString,
  user: IsPerson,
  category: IsCategory,
  description: IsString,
  amount: IsNumber,
  when: IsObject({ day: IsNumber, month: IsNumber, year: IsNumber }),
});

export type Transaction = IsType<typeof IsTransaction>;
