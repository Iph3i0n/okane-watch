import { Permissions } from "$services/jwt";
import { BuildApi } from "$utils/api";
import { GetJwt } from "$utils/request";

export default BuildApi({
  GET: {
    require: "view",
    proc: async (req) => {
      const jwt = GetJwt(req.headers);
      if (!jwt) return { status: 401 };
      return { status: 200, body: await Permissions(jwt) };
    },
  },
});
