import { Assert, IsObject, IsString } from "@paulpopat/safe-type";
import { Add, GetAll } from "../../../repositories/person";
import { BuildApi } from "../../../utils/api";

const IsPost = IsObject({
  name: IsString,
});

export default BuildApi({
  async POST(req) {
    const body = req.body;
    Assert(IsPost, body);
    const id = await Add(body.name);
    return {
      status: 201,
      body: {
        ...body,
        id,
      },
    };
  },
  async GET(req) {
    return {
      status: 200,
      body: await GetAll(),
    };
  },
});
