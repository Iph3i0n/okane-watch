import C from "$utils/class-name";
import React from "react";
import Styled from "styled-components";

const ColumnCount = 12;
type Cols =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12";

const BreakPoints = {
  xs: "0",
  sm: "450px",
  md: "700px",
  lg: "1100px",
  xl: "1250px",
};

type BreakPointLabels = keyof typeof BreakPoints;
type ColProps = Partial<Record<BreakPointLabels, Cols>>;

export const Container = Styled.main`
  max-width: var(--screen-max-width);
  margin: 0 auto;
  padding: 0 2rem;
`;

export const Row = Styled.section`
  display: grid;
  grid-template-columns: repeat(${ColumnCount}, minmax(0, 1fr));
  gap: var(--block-padding);
  margin-bottom: var(--block-padding);
`;

export const ColBase = Styled.div`
  position: relative;

  ${Object.keys(BreakPoints)
    .map(
      (b) => `
    @media screen and (min-width: ${BreakPoints[b]}) {
      ${Array.apply(null, Array(ColumnCount))
        .map(
          (_, i: number) => `
        &.${b}-${i + 1} {
          grid-column: span ${i + 1};
        }
      `
        )
        .join(" ")}
    }
  `
    )
    .join(" ")}
`;

export const Col: React.C<ColProps> = (props) => {
  return (
    <ColBase
      className={C(
        ...Object.keys(props)
          .filter((p) => p !== "children")
          .map((k) => `${k}-${props[k]}`)
      )}
    >
      {props.children}
    </ColBase>
  );
};
