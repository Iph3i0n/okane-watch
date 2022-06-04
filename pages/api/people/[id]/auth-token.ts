import { Assert, IsObject, IsString } from "@paulpopat/safe-type";
import { GetByName, IsCorrectPassword } from "$repositories/person";
import { BuildApi } from "$utils/api";
import { Generate } from "$services/jwt";

const IsQuery = IsObject({
  name: IsString,
  password: IsString,
});

export default BuildApi({
  GET: {
    require: "view",
    proc: async (req) => {
      const query = req.query;
      Assert(IsQuery, query);
      if (await IsCorrectPassword(query.name, query.password)) {
        return {
          status: 200,
          body: { token: await Generate(await GetByName(query.name)) },
        };
      }
    },
  },
});
