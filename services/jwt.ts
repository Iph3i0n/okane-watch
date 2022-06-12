import { GetUserPermissions } from "$repositories/permissions";
import { Get } from "$repositories/person";
import {
  Assert,
  IsArray,
  IsNumber,
  IsObject,
  IsString,
  IsType,
} from "@paulpopat/safe-type";
import Jwt from "jsonwebtoken";

const Secret = process.env.JWT_SECRET;
const Expires = 60 * 30;

const IsPayload = IsObject({
  permissions: IsArray(IsString),
  user_id: IsString,
  iat: IsNumber,
  exp: IsNumber,
});

type Payload = IsType<typeof IsPayload>;

function Verify(token: string) {
  return new Promise<Payload>((res, rej) => {
    Jwt.verify(token, Secret, (err, payload: unknown) => {
      if (err) {
        rej(err);
        return;
      }

      Assert(IsPayload, payload);
      res(payload);
    });
  });
}

export function Generate(user_id: string) {
  return new Promise<string>(async (res, rej) => {
    const permissions = await GetUserPermissions(user_id);
    Jwt.sign(
      { permissions, user_id },
      Secret,
      { expiresIn: Expires },
      (err, token) => {
        if (err) rej(err);
        else res(token);
      }
    );
  });
}

export async function IsAble(token: string, check: string) {
  const payload = await Verify(token);
  return payload.permissions.includes(check);
}

export async function Permissions(token: string) {
  const payload = await Verify(token);
  return payload.permissions;
}

export async function Person(token: string) {
  const payload = await Verify(token);
  return await Get(payload.user_id);
}
