import { Person } from "$types/person";
import { OverrideOptions } from "$utils/cookies";
import { NextPage, NextPageContext } from "next";
import ApiClient from "../services/api";

export type AppPageContext = NextPageContext & {
  user?: Person & { permissions: string[] };
};

export default function CreatePage<TProps>(
  get_props: (ctx: AppPageContext) => Promise<TProps>,
  page: NextPage<TProps>,
  no_auth?: "no-auth"
) {
  page.getInitialProps = async (ctx: AppPageContext) => {
    if (no_auth) {
      return await get_props(ctx);
    }

    const need_login = () => {
      if (ctx.res) ctx.res.writeHead(307, { Location: "/login" }).end();
      else window.location.href = "/login";
    };

    try {
      if (ctx.user.permissions.length) return await get_props(ctx);
      else need_login();
    } catch {
      need_login();
    }
  };

  return page;
}
