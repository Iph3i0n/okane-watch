import { IsArray, IsObject, IsString } from "@paulpopat/safe-type";

export const IsQueryMetadata = IsObject({
  slug: IsString,
  chart_type: IsString,
  parameters: IsArray(IsString),
  name: IsString,
});

export const IsQueries = IsObject({
  default_query: IsString,
  queries: IsArray(IsQueryMetadata),
});
