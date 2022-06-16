import Fs from "fs-extra";
import Path from "path";

const UiTextDirectory = "./resources/uitext";

function GetLocalePath(locale: string) {
  return Path.join(UiTextDirectory, `${locale}.json`);
}

export async function HasLocale(locale: string) {
  return await Fs.pathExists(GetLocalePath(locale));
}

export async function GetUiText(locale: string) {
  if (await HasLocale(locale))
    return {
      actual: locale,
      data: await Fs.readJson(GetLocalePath(locale)),
    };
  return {
    actual: "en-GB",
    data: await Fs.readJson(GetLocalePath("en-GB")),
  };
}
