import { IsString } from "@paulpopat/safe-type";

export default function C(...classes: (string | [string, boolean])[]) {
  return classes
    .map((c) => (IsString(c) ? c : c[1] ? c[0] : ""))
    .filter((c) => c)
    .join(" ");
}
