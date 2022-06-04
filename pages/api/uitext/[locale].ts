import { Execute } from "$repositories/query";
import { BuildApi } from "$utils/api";
import { Assert, IsObject, IsString } from "@paulpopat/safe-type";
import Fs from "fs-extra";

const IsQuery = IsObject({
  locale: IsString,
});

export default BuildApi({
  GET: {
    proc: async (req) => {
      const query = req.query;
      Assert(IsQuery, query);

      if (await Fs.pathExists(`./resources/${query.locale}.json`))
        return {
          status: 200,
          body: await Fs.readJson(`./resources/${query.locale}.json`),
        };
      else
        return {
          status: 200,
          body: await Fs.readJson(`./resources/en-GB.json`),
        };
    },
  },
});
