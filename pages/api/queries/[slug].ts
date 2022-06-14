import { Execute } from "$repositories/query";
import { BuildApi } from "$utils/api";
import { Assert, IsObject, IsString, Optional } from "@paulpopat/safe-type";

const IsQuery = IsObject({
  slug: IsString,
  from_date: Optional(IsString),
  to_date: Optional(IsString),
  person: Optional(IsString),
  category: Optional(IsString),
});

export default BuildApi({
  GET: {
    require: "view",
    proc: async (req) => {
      const query = req.query;
      Assert(IsQuery, query);
      return {
        status: 200,
        body: await Execute(query.slug as any, query),
      };
    },
  },
});
