import { Assert, IsObject, IsString } from "@paulpopat/safe-type";
import { GetTotalForCategory } from "../../../../repositories/transaction";
import { BuildApi } from "../../../../utils/api";

const IsGet = IsObject({
  id: IsString,
  month: IsString,
  year: IsString,
});

export default BuildApi({
  async GET(req) {
    const query = req.query;
    Assert(IsGet, query);

    return {
      status: 200,
      body: {
        spend: await GetTotalForCategory(
          query.id,
          parseInt(query.month),
          parseInt(query.year)
        ),
      },
    };
  },
});
