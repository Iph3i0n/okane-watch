import { Assert, IsNumber, IsObject, IsString } from "@paulpopat/safe-type";
import { Delete, Update } from "../../../repositories/transaction";
import { BuildApi } from "../../../utils/api";

const IsQuery = IsObject({
  id: IsString,
});

const IsPutBody = IsObject({
  user: IsString,
  category: IsString,
  description: IsString,
  amount: IsNumber,
  when: IsObject({ day: IsNumber, month: IsNumber, year: IsNumber }),
});

export default BuildApi({
  async PUT(req) {
    const query = req.query;
    Assert(IsQuery, query);
    const body = req.body;
    Assert(IsPutBody, body);
    const id = await Update(query.id, { ...body });
    return {
      status: 200,
      body: {
        ...body,
        id,
      },
    };
  },
  async DELETE(req) {
    const query = req.query;
    Assert(IsQuery, query);
    await Delete(query.id);
    return { status: 204 };
  },
});
