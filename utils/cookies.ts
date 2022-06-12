import { getCookie, setCookies, removeCookies } from "cookies-next";
import { OptionsType } from "cookies-next/lib/types";
import { AuthTokenKey } from "./constants";

let options_override: OptionsType = undefined;

export function OverrideOptions(options: OptionsType) {
  options_override = options;
}

export function GetAuth() {
  return getCookie(AuthTokenKey, options_override)?.toString();
}

export function SetAuth(value: string) {
  setCookies(AuthTokenKey, value, options_override);
}

export function ClearAuth() {
  removeCookies(AuthTokenKey, options_override);
  window.location.reload();
}
