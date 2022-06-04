import React from "react";

const UiTextContext = React.createContext(undefined as any);

export function UseUiText() {
  return React.useContext(UiTextContext);
}

export const UiTextProvider: React.C<{ uitext: any }> = ({
  children,
  uitext,
}) => {
  return (
    <UiTextContext.Provider value={uitext}>{children}</UiTextContext.Provider>
  );
};
