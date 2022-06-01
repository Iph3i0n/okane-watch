import React from "react";

declare module "react" {
  export type C<P = {}> = React.FunctionComponent<React.PropsWithChildren<P>>;
}
