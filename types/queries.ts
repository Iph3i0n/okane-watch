import { IsArray, IsObject, IsRecord, IsString } from "@paulpopat/safe-type";

export const IsQueryMetadata = IsObject({
  chart_type: IsString,
  parameters: IsArray(IsString),
});

export const IsQueries = IsRecord(IsString, IsQueryMetadata);
