import { Assert, IsNumber, IsObject, IsString } from "@paulpopat/safe-type";
import { Add, GetTransactions } from "../../../repositories/transaction";
import { BuildApi } from "../../../utils/api";

const IsPost = IsObject({
  user: IsString,
  category: IsString,
  description: IsString,
  amount: IsNumber,
  when: IsObject({ day: IsNumber, month: IsNumber, year: IsNumber }),
});

const IsGet = IsObject({
  month: IsString,
  year: IsString,
});

export default BuildApi({
  async GET(req) {
    const query = req.query;
    Assert(IsGet, query);

    return {
      status: 200,
      body: await GetTransactions(parseInt(query.month), parseInt(query.year)),
    };
  },
  async POST(req) {
    const body = req.body;
    Assert(IsPost, body);
    const id = await Add({ ...body });
    return {
      status: 201,
      body: {
        ...body,
        id,
      },
    };
  },
});
