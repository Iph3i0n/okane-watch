import { NextPage, NextPageContext } from "next";

export default function CreatePage<TProps>(get_props: (ctx: NextPageContext) => Promise<TProps>, page: NextPage<TProps>) {
  page.getInitialProps = get_props;
  return page;
}