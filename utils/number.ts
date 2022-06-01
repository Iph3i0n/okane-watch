export function ToCurrencyString(item: number) {
  return item.toLocaleString("en-GB", { style: "currency", currency: "GBP" });
}
