import {
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
});

export type Category = IsType<typeof IsCategory>;

export const IsSummaryCategory = IsIntersection(
  IsCategory,
  IsObject({ spend: IsNumber, diff: IsNumber })
);

export type SummaryCategory = IsType<typeof IsSummaryCategory>;
