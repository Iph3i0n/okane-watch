import {
  IsBoolean,
  IsIntersection,
  IsNumber,
  IsObject,
  IsString,
  IsType,
} from "@paulpopat/safe-type";

export const IsCategory = IsObject({
  id: IsString,
  name: IsString,
  budget: IsNumber,
  personal: IsBoolean,
});

export type Category = IsType<typeof IsCategory>;

export const IsSpend = IsObject({ spend: IsNumber, diff: IsNumber });
export const IsSummaryCategory = IsIntersection(
  IsCategory,
  IsObject({ total: IsSpend, your: IsSpend })
);

export type SummaryCategory = IsType<typeof IsSummaryCategory>;
