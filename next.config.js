import Dotenv from "dotenv";
Dotenv.config();

module.exports = {
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.SITE_URL,
  },
  i18n: {
    locales: ["en-GB"],
    defaultLocale: "en-GB",
  },
};
