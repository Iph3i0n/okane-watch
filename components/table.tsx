import { Assert, Checker, IsArray } from "@paulpopat/safe-type";
import React from "react";
import Styled from "styled-components";

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
`;

export default function TableFor<T>(schema: Checker<T>) {
  const TableContext = React.createContext([] as T[]);

  return Object.assign(
    (({ children, rows }) => {
      Assert(IsArray(schema), rows);
      return (
        <Table>
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
