import { Assert, IsObject, IsString, Optional } from "@paulpopat/safe-type";
import { Get, Update } from "$repositories/person";
import { BuildApi } from "$utils/api";

const IsQuery = IsObject({
  id: IsString,
});

const IsPutBody = IsObject({
  name: IsString,
  password: Optional(IsString),
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
    require: "user-man",
    proc: async (req) => {
      const query = req.query;
      Assert(IsQuery, query);
      const body = req.body;
      Assert(IsPutBody, body);
      const id = await Update(query.id, body.name, body.password);
      return {
        status: 200,
        body: await Get(id),
      };
    },
  },
});
