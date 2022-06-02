import { IsNumber, IsObject, IsType } from "@paulpopat/safe-type";

export const IsDateObject = IsObject({
  day: IsNumber,
  month: IsNumber,
  year: IsNumber,
});

export type DateObject = IsType<typeof IsDateObject>;

export function ToDateString(date: DateObject) {
  return `${date.year.toString().padStart(4, "0")}-${date.month
    .toString()
    .padStart(2, "0")}-${date.day.toString().padStart(2, "0")}`;
}

export function ToJsDate(date: DateObject) {
  return new Date(ToDateString(date));
}

export function FromJsDate(date: Date) {
  return {
    day: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear(),
  };
}
