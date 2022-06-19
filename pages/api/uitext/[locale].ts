import { GetUiText } from "$repositories/uitext";
import { BuildApi } from "$utils/api";
import { Assert, IsObject, IsString } from "@paulpopat/safe-type";

const IsQuery = IsObject({
  locale: IsString,
});

export default BuildApi({
  GET: {
    proc: async (req) => {
      const query = req.query;
      Assert(IsQuery, query);

      return {
        status: 200,
        body: await GetUiText(query.locale),
      };
    },
  },
});
