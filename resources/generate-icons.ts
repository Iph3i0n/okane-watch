import Favicons, { FaviconResponse } from "favicons";
import Fs from "fs-extra";
import Path from "path";
import Sharp from "sharp";

type RawImage = {
  data: Buffer;
  info: Sharp.OutputInfo;
};

const logo_location = "./resources/logo.svg";
const html_path = "./resources/header-images.tsx";
const icon_path = "/icons";
const icon_file_path = "./public/icons";

function WriteIcon(name: string, content: Buffer | RawImage) {
  return Fs.outputFile(
    Path.join(icon_file_path, name),
    "data" in content ? content.data : content
  );
}

function WriteFile(name: string, content: string) {
  return Fs.outputFile(Path.join(icon_file_path, name), content);
}

console.log("Starting the generation");
Favicons(
  logo_location,
  {
    path: icon_path,
    lang: "",
    start_url: "/",
  },
  async (err: any, response: FaviconResponse) => {
    if (err) {
      console.error(err);
      process.exit(1);
      return;
    }

    console.log("Finished generation. Writing output.");
    for (const { name, contents } of response.images) {
      await WriteIcon(name, contents);
    }

    await Fs.copyFile(logo_location, Path.join(icon_file_path, "icon.svg"));
    for (const { name, contents } of response.files) {
      await WriteFile(name, contents);
    }

    await Fs.outputFile(
      html_path,
      `
import React from "react";

export const HeaderImageIncludes: React.FC = () => (
  <>
    ${response.html.map((e) => e.replace(">", "/>")).join("\n    ")}
  </>
)
`
    );

    console.log("Finished writing out. Job done.");
  }
);
