import { Assert, IsBoolean, IsObject, IsString } from "@paulpopat/safe-type";
import { Add, Get, GetAll } from "$repositories/person";
import { BuildApi } from "$utils/api";
import { AddAllPermissionsForUser } from "$services/admin";

const IsPost = IsObject({
  name: IsString,
  password: IsString,
  is_admin: IsBoolean,
});

export default BuildApi({
  POST: {
    require: "user-man",
    proc: async (req) => {
      const body = req.body;
      Assert(IsPost, body);
      const id = await Add(body.name, body.password);
      if (body.is_admin) await AddAllPermissionsForUser(id);
      return {
        status: 201,
        body: await Get(id),
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
