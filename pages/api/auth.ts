import { BuildApi } from "$utils/api";

export default BuildApi({
  GET: {
    require: "view",
    proc: async (req) => {
      return {
        status: 200,
        body: true,
      };
    },
  },
});
