import { Assert, IsBoolean, IsNumber, IsObject, IsString } from "@paulpopat/safe-type";
import { Update, Get } from "$repositories/category";
import { BuildApi } from "$utils/api";

const IsQuery = IsObject({
  id: IsString,
});

const IsPutBody = IsObject({
  name: IsString,
  budget: IsNumber,
  personal: IsBoolean,
});

export default BuildApi({
  GET: {
    require: "view",
    proc: async (req) => {
      const query = req.query;
      Assert(IsQuery, query);
      return {
        status: 200,
        body: await Get(query.id),
      };
    },
  },
  PUT: {
    require: "cat-man",
    proc: async (req) => {
      const query = req.query;
      Assert(IsQuery, query);
      const body = req.body;
      Assert(IsPutBody, body);
      const id = await Update(query.id, { ...body });
      return {
        status: 200,
        body: {
          ...body,
          id,
        },
      };
    },
  },
});
