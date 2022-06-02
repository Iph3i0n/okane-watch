const now = new Date();

export const Day = now.getDate();
export const Month = now.getMonth() + 1;
export const Year = now.getFullYear();
export const Now = now.getTime();

export const NowObject = { day: Day, month: Month, year: Year };
export const LastMonthObject = { day: Day, month: Month - 1, year: Year };
export const NextMonthObject = { day: Day, month: Month + 1, year: Year };

if (LastMonthObject.month < 1) {
  LastMonthObject.month = 12;
  LastMonthObject.year -= 1;
}

if (NextMonthObject.month > 12) {
  LastMonthObject.month = 1;
  LastMonthObject.year += 1;
}
