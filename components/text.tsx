import React from "react";
import Styled from "styled-components";

export const H1 = Styled.h1`
  font-size: var(--font-size-h1);
  font-weight: var(--font-weight-large);
  margin: 0;
`;

export const H2 = Styled.h2`
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-standard);
  margin: 0 0 var(--text-padding-y-large);
`;

export const Badge = Styled.small`
  font-size: var(--font-size-badge);
  font-weight: var(--font-weight-thin);
  margin: 0 6px 0 0;
  padding: 4px 8px;
  color: var(--white);
  background: var(--theme-dark);
  border-radius: var(--border-radius);
  vertical-align: super;
`;

export const LinkButton: React.C<{ action: () => void }> = ({
  action,
  children,
}) => (
  <a
    href="#"
    onClick={(e) => {
      e.preventDefault();
      action();
    }}
  >
    {children}
  </a>
);
