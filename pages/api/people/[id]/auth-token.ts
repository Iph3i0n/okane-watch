import { Assert, IsObject, IsString } from "@paulpopat/safe-type";
import { GetByName, IsCorrectPassword } from "$repositories/person";
import { BuildApi } from "$utils/api";
import { Generate } from "$services/jwt";

const IsQuery = IsObject({
  id: IsString,
  password: IsString,
});

export default BuildApi({
  GET: {
    proc: async (req) => {
      const query = req.query;
      Assert(IsQuery, query);
      if (await IsCorrectPassword(query.id, query.password)) {
        return {
          status: 200,
          body: { token: await Generate(await GetByName(query.id)) },
        };
      }

      return { status: 401 };
    },
  },
});
