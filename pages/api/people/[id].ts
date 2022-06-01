import { Assert, IsObject, IsString } from "@paulpopat/safe-type";
import { Update } from "../../../repositories/person";
import { BuildApi } from "../../../utils/api";

const IsPutQuery = IsObject({
  id: IsString,
});

const IsPutBody = IsObject({
  name: IsString,
});

export default BuildApi({
  async PUT(req) {
    const query = req.query;
    Assert(IsPutQuery, query);
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
