import { FromDateString, ToDateString } from "$types/utility";
import { IsString } from "@paulpopat/safe-type";
import { NextPageContext } from "next";
import { NextMonth, ThisMonth } from "./constants";

export function GetDateRange(ctx: NextPageContext) {
  const to = IsString(ctx.query.to) ? FromDateString(ctx.query.to) : NextMonth;
  const from = IsString(ctx.query.from)
    ? FromDateString(ctx.query.from)
    : ThisMonth;
  return { from: ToDateString(from), to: ToDateString(to) };
}

export function GetDateRangeObjects(ctx: NextPageContext) {
  const to = IsString(ctx.query.to) ? FromDateString(ctx.query.to) : NextMonth;
  const from = IsString(ctx.query.from)
    ? FromDateString(ctx.query.from)
    : ThisMonth;
  return { from, to };
}
