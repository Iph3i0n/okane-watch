import { Assert, IsObject, IsString } from "@paulpopat/safe-type";
import { Add, GetAll } from "$repositories/person";
import { BuildApi } from "$utils/api";

const IsPost = IsObject({
  name: IsString,
  password: IsString,
});

export default BuildApi({
  POST: {
    require: "user-man",
    proc: async (req) => {
      const body = req.body;
      Assert(IsPost, body);
      const id = await Add(body.name, body.password);
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
