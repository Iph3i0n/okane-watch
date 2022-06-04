export function ToCurrencyString(item: number, locale: string, label: string) {
  return item.toLocaleString(locale, { style: "currency", currency: label });
}
