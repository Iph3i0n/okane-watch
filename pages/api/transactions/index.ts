import { FromDateString } from "$types/utility";
import { Assert, IsNumber, IsObject, IsString } from "@paulpopat/safe-type";
import { Add, GetTransactions } from "$repositories/transaction";
import { BuildApi } from "$utils/api";

const IsPost = IsObject({
  person: IsString,
  category: IsString,
  description: IsString,
  amount: IsNumber,
  when: IsObject({ day: IsNumber, month: IsNumber, year: IsNumber }),
});

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
        body: await GetTransactions(
          FromDateString(query.from),
          FromDateString(query.to)
        ),
      };
    },
  },
  POST: {
    require: "all-tx",
    proc: async (req) => {
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
  },
});
