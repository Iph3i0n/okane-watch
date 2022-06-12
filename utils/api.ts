import { DatabaseContext } from "$contexts/database";
import { UserContext } from "$contexts/user";
import { GetDb } from "$services/database";
import { IsAble, Permissions, Person } from "$services/jwt";
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
    const jwt = GetJwt(req.headers);

    if (handler.require) {
      if (!jwt) return res.status(401).send(undefined);
      if (!(await IsAble(jwt, handler.require)))
        return res.status(401).send(undefined);
    }

    try {
      const database = await GetDb();
      DatabaseContext.Provide(database);
      try {
        if (jwt)
          UserContext.Provide({
            ...(await Person(jwt)),
            permissions: await Permissions(jwt),
          });
      } catch (err) {
        console.warn(err);
      }

      const response = await handler.proc(req);
      await database.End();

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
