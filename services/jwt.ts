import { GetUserPermissions } from "$repositories/permissions";
import Jwt from "jsonwebtoken";

export function Generate(user_id: string) {
  return new Promise<string>(async (res, rej) => {
    const permissions = await GetUserPermissions(user_id);
    Jwt.sign(
      { permissions },
      process.env.JWT_SECRET,
      { expiresIn: 60 * 30 },
      (err, token) => {
        if (err) rej(err);
        else res(token);
      }
    );
  });
}

export function Can(token: string, check: string) {
  return new Promise<boolean>((res, rej) => {
    Jwt.verify(token, process.env.JWT_SECRET, (err, payload: any) => {
      if (err) {
        rej(err);
        return;
      }

      res(payload.permissions.includes(check));
    });
  });
}

export function Permissions(token: string) {
  return new Promise<string[]>((res, rej) => {
    Jwt.verify(token, process.env.JWT_SECRET, (err, payload: any) => {
      if (err) {
        rej(err);
        return;
      }

      res(payload.permissions);
    });
  });
}
