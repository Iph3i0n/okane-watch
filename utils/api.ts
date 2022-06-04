import { Can } from "$services/jwt";
import { PermissionName } from "$types/permission";
import { NextApiRequest, NextApiResponse } from "next";
import { GetJwt } from "./request";

type ApiResponse = {
  status: number;
  body?: any;
  headers?: Record<string, string>;
};

type ApiHandler = {
  require?: PermissionName;
  proc: (request: NextApiRequest) => Promise<ApiResponse>;
};

type Api = Record<string, ApiHandler>;

export function BuildApi(handlers: Api) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const method = req.method.toUpperCase();
    const handler = handlers[method];
    if (!handler) return res.status(404).send(undefined);

    if (handler.require) {
      const jwt = GetJwt(req.headers);
      if (!jwt) return res.status(401).send(undefined);
      if (!(await Can(jwt, handler.require)))
        return res.status(401).send(undefined);
    }

    try {
      const response = await handler.proc(req);
      for (const key in response.headers ?? {}) {
        if (!response.headers?.hasOwnProperty(key)) continue;

        res = res.setHeader(key, response.headers[key]);
      }

      if (response.body) return res.status(response.status).json(response.body);
      return res.status(response.status).send(undefined);
    } catch (err) {
      console.error(err);
      res.status(500).send(undefined);
    }
  };
}
