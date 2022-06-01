import { Assert, IsObject, IsString } from "@paulpopat/safe-type";
import { Get, Update } from "../../../repositories/person";
import { BuildApi } from "../../../utils/api";

const IsQuery = IsObject({
  id: IsString,
});

const IsPutBody = IsObject({
  name: IsString,
});

export default BuildApi({
  async GET(req) {
    const query = req.query;
    Assert(IsQuery, query);
    return {
      status: 200,
      body: await Get(query.id),
    };
  },
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
});
