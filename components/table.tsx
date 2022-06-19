import { UseUiText } from "$contexts/uitext";
import { AddMetadataToTable } from "$utils/html";
import { ToCurrencyString } from "$utils/number";
import { UseRefEffect } from "$utils/react";
import { Assert, Checker, IsArray } from "@paulpopat/safe-type";
import React from "react";
import Styled from "styled-components";
import { BreakPoints } from "./layout";

const Table = Styled.table`
  width: 100%;
  border-collapse: collapse; 
  text-align: left;
  overflow: hidden;
  margin-bottom: 2rem;

  thead tr {
    border: none;
    border-bottom: 1px solid var(--body);
  }

  tbody tr:nth-child(even) {
    background: var(--bg-surface);
  }

  tbody tr:nth-child(odd) {
    background: var(--bg-white);
  }

  th, td {
    padding: var(--text-padding-y) var(--text-padding-x);
  }

  th {
    font-weight: var(--font-weight-large);
  }

  td {
    font-weight: var(--font-weight-standard);
  }

  @media screen and (max-width: ${BreakPoints.md}) {
    overflow: visible;

    thead {
      display: none;
    }

    tbody tr:nth-child(even),
    tbody tr:nth-child(odd) {
      background: var(--bg-white);
    }

    tr {
      margin: var(--block-padding);
      padding-top: var(--block-padding);
      border-radius: var(--border-radius);
    }

    td {
      display: block;
    }

    td::before {
      content: attr(aria-label);
      margin-right: 5px;
      font-weight: var(--font-weight-large);
    }

    tr {
      display: flex;
      flex-wrap: wrap;
    }
  }
`;

export const HighlightRow = Styled.tr`
  tbody & {
    border-top: 1px solid var(--body);

    td {
      font-weight: var(--font-weight-large);
    }

    @media screen and (max-width: ${BreakPoints.md}) {
      margin-top: calc(var(--block-padding) * 3);
      border-top: none;
      box-shadow: var(--box-shadow);

      td::before {
        font-weight: var(--font-weight-thin);
      }
    }
  }
`;

export const BadCell = Styled.td`
  color: var(--error);
`;

export const GoodCell = Styled.td`
  color: var(--success);
`;

export const GoodBadCurrencyCell: React.FC<{ number: number }> = ({
  number,
}) => {
  const uitext = UseUiText();
  const children = ToCurrencyString(
    number,
    uitext.locale,
    uitext.currency_label
  );

  if (number > 0) return <GoodCell>{children}</GoodCell>;
  return <BadCell>{children}</BadCell>;
};

export default function TableFor<T>(schema: Checker<T>) {
  const TableContext = React.createContext([] as T[]);

  return Object.assign(
    (({ children, rows }) => {
      Assert(IsArray(schema), rows);
      const ref = UseRefEffect<HTMLTableElement>(AddMetadataToTable);

      return (
        <Table ref={ref}>
          <TableContext.Provider value={rows}>{children}</TableContext.Provider>
        </Table>
      );
    }) as React.C<{ rows: T[] }>,
    {
      Row: (({ children }) => {
        const rows = React.useContext(TableContext);

        return (
          <>
            {rows.map((r, i) => (
              <tr key={i}>{children(r)}</tr>
            ))}
          </>
        );
      }) as React.FC<{ children: (row: T) => JSX.Element }>,
    }
  );
}
