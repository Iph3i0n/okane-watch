import { Assert, IsObject, IsString } from "@paulpopat/safe-type";
import { BuildApi } from "$utils/api";
import { GetUserPermissions } from "$repositories/permissions";
import { PermissionOptions } from "$types/permission";

const IsQuery = IsObject({
  id: IsString,
});

export default BuildApi({
  GET: {
    require: "user-man",
    proc: async (req) => {
      const query = req.query;
      Assert(IsQuery, query);
      const data = await GetUserPermissions(query.id);
      return {
        status: 200,
        body: { is_admin: data.length === PermissionOptions.length },
      };
    },
  },
});
