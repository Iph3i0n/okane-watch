const now = new Date();

export const Day = now.getDate();
export const Month = now.getMonth() + 1;
export const Year = now.getFullYear();
export const Now = now.getTime();

export const ThisMonth = { day: 1, month: Month, year: Year };
export const LastMonth = { day: 1, month: Month - 1, year: Year };
export const NextMonth = { day: 1, month: Month + 1, year: Year };

if (LastMonth.month < 1) {
  LastMonth.month = 12;
  LastMonth.year -= 1;
}

if (NextMonth.month > 12) {
  LastMonth.month = 1;
  LastMonth.year += 1;
}

export const AuthTokenKey = "auth-token";
