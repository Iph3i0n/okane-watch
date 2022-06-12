import { Assert, IsObject, IsString } from "@paulpopat/safe-type";
import { GetOverview } from "$repositories/category";
import { BuildApi } from "$utils/api";
import { FromDateString } from "$types/utility";

const IsGet = IsObject({
  from: IsString,
  to: IsString,
});

export default BuildApi({
  GET: {
    require: "view",
    proc: async (req) => {
      const query = req.query;
      Assert(IsGet, query);

      return {
        status: 200,
        body: await GetOverview(
          FromDateString(query.from),
          FromDateString(query.to)
        ),
      };
    },
  },
});
