import { Assert, IsNumber, IsObject, IsString } from "@paulpopat/safe-type";
import { Add, GetAll } from "$repositories/category";
import { BuildApi } from "$utils/api";

const IsPost = IsObject({
  name: IsString,
  budget: IsNumber,
});

export default BuildApi({
  POST: {
    require: "cat-man",
    proc: async (req) => {
      const body = req.body;
      Assert(IsPost, body);
      const id = await Add(body.name, body.budget);
      return {
        status: 201,
        body: {
          ...body,
          id,
        },
      };
    },
  },
  GET: {
    require: "view",
    proc: async (req) => {
      return {
        status: 200,
        body: await GetAll(),
      };
    },
  },
});
