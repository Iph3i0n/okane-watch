import { UserContext } from "$contexts/user";
import { BuildApi } from "$utils/api";

export default BuildApi({
  GET: {
    proc: async (req) => {
      const user = UserContext.Use();
      if (!user) return { status: 401 };
      return { status: 200, body: user };
    },
  },
});
