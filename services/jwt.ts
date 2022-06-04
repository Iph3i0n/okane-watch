import { GetUserPermissions } from "$repositories/permissions";
import Jwt from "jsonwebtoken";

export function Generate(user_id: string) {
  return new Promise<string>(async (res, rej) => {
    const permissions = await GetUserPermissions(user_id);
    Jwt.sign(
      permissions,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) rej(err);
        else res(token);
      }
    );
  });
}

export function Can(token: string, check: string) {
  return new Promise<boolean>((res, rej) => {
    Jwt.verify(token, process.env.JWT_SECRET, (err, permissions) => {
      if (err) {
        rej(err);
        return;
      }

      res(permissions.includes(check));
    });
  });
}
