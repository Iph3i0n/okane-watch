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

export function FromDateString(date: string) {
  if (!date.match(/[0-9][0-9][0-9][0-9]\-[0-9][0-9]\-[0-9][0-9]/gm)) {
    throw new Error("Invalid date format");
  }

  const [year, month, day] = date.split("-");

  return { year: parseInt(year), month: parseInt(month), day: parseInt(day) };
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

export type Promised<T> = T extends Promise<infer A> ? A : unknown;
