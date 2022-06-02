import { Execute, GetAll } from "$repositories/query";
import { BuildApi } from "$utils/api";

export default BuildApi({
  async GET(req) {
    return {
      status: 200,
      body: GetAll(),
    };
  },
});
