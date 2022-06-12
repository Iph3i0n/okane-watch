import { User } from "$types/person";
import React from "react";

const Context = React.createContext<User>(undefined);

export const UserProvider: React.C<{ user: User }> = ({ children, user }) => (
  <Context.Provider value={user}>{children}</Context.Provider>
);

export function UseCurrentUser() {
  return React.useContext(Context);
}
