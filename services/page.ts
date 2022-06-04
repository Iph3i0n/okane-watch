import { OverrideOptions } from "$utils/cookies";
import { NextPage, NextPageContext } from "next";
import ApiClient from "./api";

export default function CreatePage<TProps>(
  get_props: (ctx: NextPageContext, permissions: string[]) => Promise<TProps>,
  page: NextPage<TProps>,
  no_auth?: "no-auth"
) {
  page.getInitialProps = async (ctx) => {
    if (no_auth) {
      return await get_props(ctx, []);
    }

    const need_login = () => {
      if (ctx.res) ctx.res.writeHead(307, { Location: "/login" }).end();
      else window.location.href = "/login";
    };

    if (ctx.req) OverrideOptions({ req: ctx.req, res: ctx.res });

    try {
      const permissions = await ApiClient.AuthCheck();
      if (permissions.length) return await get_props(ctx, permissions);
      else need_login();
    } catch {
      need_login();
    }
  };

  return page;
}
