import { NextApiRequest, NextApiResponse } from "next";

type ApiResponse = {
  status: number;
  body?: any;
  headers?: Record<string, string>;
};

type ApiHandler = (request: NextApiRequest) => Promise<ApiResponse>;

type Api = Record<string, ApiHandler>;

export function BuildApi(handlers: Api) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const method = req.method.toUpperCase();
    const handler = handlers[method];
    if (!handler) {
      res.status(404).send(undefined);
      return;
    }

    try {
      const response = await handler(req);
      for (const key in response.headers ?? {}) {
        if (!response.headers?.hasOwnProperty(key)) continue;

        res = res.setHeader(key, response.headers[key]);
      }

      if (response.body) res.status(response.status).json(response.body);
      else res.status(response.status).send(undefined);
      return;
    } catch (err) {
      console.error(err);
      res.status(500).send(undefined);
    }
  };
}
