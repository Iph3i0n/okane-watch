import { IsNumber, IsObject, IsString, IsType } from "@paulpopat/safe-type";

export const IsTransaction = IsObject({
  id: IsString,
  user: IsString,
  category: IsString,
  description: IsString,
  amount: IsNumber,
  when: IsObject({ day: IsNumber, month: IsNumber, year: IsNumber }),
});

export type Transaction = IsType<typeof IsTransaction>;
