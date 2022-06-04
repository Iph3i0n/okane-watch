import { IncomingHttpHeaders } from "http";

export function GetJwt(headers: IncomingHttpHeaders) {
  const head = headers.authorization;
  if (!head || !head.match(/Bearer .+/gm)) return undefined;

  return head.replace("Bearer ", "");
}
