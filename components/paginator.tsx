import { UseUiText } from "$contexts/uitext";
import C from "$utils/class-name";
import React from "react";
import Styled from "styled-components";
import { Dropdown } from "./form";
import { IconFirst, IconLast, IconNext, IconPrevious } from "./icons";
import { BreakPoints, Col, Row } from "./layout";

const ButtonContainer = Styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Item = Styled.button`
  border-radius: var(--border-radius);
  font-size: var(--font-size-text);
  border: none;
  background: var(--bg-white);
  cursor: pointer;
  color: var(--body);
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 0.25rem;

  svg {
    fill: var(--body) !important;
    width: var(--font-size-text) !important;
    height: var(--font-size-text) !important;
  }

  &[disabled] {
    background: var(--bg-surface);
    color: var(--body);
    cursor: unset;
    opacity: 0.75;

    svg {
      fill: var(--body) !important;
    }
  }

  &.current {
    background: var(--theme-dark);
    color: var(--white);
    cursor: unset;
    opacity: 1;

    svg {
      fill: var(--white) !important;
    }
  }

  @media screen and (max-width: ${BreakPoints.md}) {
    &.no-small {
      display: none;
    }
  }
`;

const Context = React.createContext({
  pages: 0,
  current_page: 0,
  set_page: (page: number) => {},
  set_page_size: (size: number) => {},
});

export const Button: React.C<{ page: number; no_small?: boolean }> = ({
  page,
  children,
  no_small,
}) => {
  const { pages, current_page, set_page } = React.useContext(Context);
  const child = typeof children === "number" ? Math.max(1, children) : children;

  if (current_page === page)
    return (
      <Item
        type="button"
        className={C("current", ["no-small", no_small])}
        disabled
      >
        {child}
      </Item>
    );

  if (page >= 0 && page < pages)
    return (
      <Item
        type="button"
        onClick={() => set_page(page)}
        className={C(["no-small", no_small])}
      >
        {child}
      </Item>
    );

  return (
    <Item type="button" disabled className={C(["no-small", no_small])}>
      {child}
    </Item>
  );
};

export const Paginator: React.FC<{
  skip: number;
  take: number;
  total: number;
  set_values: (skip: number, take: number) => void;
}> = ({ skip, take, set_values, total }) => {
  const pages = Math.ceil(total / take);
  const page = skip / take;
  const uitext = UseUiText();
  return (
    <Context.Provider
      value={{
        pages,
        current_page: page,
        set_page: (page) => set_values(page * take, take),
        set_page_size: (size) => set_values(0, size),
      }}
    >
      <Row>
        <Col xs="12" md="9">
          <ButtonContainer>
            <Button page={0}>
              <IconFirst colour="var(--body)" width="24" height="24" />
            </Button>
            <Button page={page - 1}>
              <IconPrevious colour="var(--body)" width="24" height="24" />
            </Button>
            <Button page={page - 2} no_small>
              {page - 2 + 1}
            </Button>
            <Button page={page - 1}>{page - 1 + 1}</Button>
            <Button page={page}>{page + 1}</Button>
            <Button page={page + 1}>{page + 1 + 1}</Button>
            <Button page={page + 2} no_small>
              {page + 2 + 1}
            </Button>
            <Button page={page + 1}>
              <IconNext colour="var(--body)" width="24" height="24" />
            </Button>
            <Button page={pages - 1}>
              <IconLast colour="var(--body)" width="24" height="24" />
            </Button>
          </ButtonContainer>
        </Col>
        <Col xs="12" md="3">
          <Dropdown
            label={uitext.items}
            value={take.toString()}
            set_value={(v) => set_values(0, parseInt(v))}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </Dropdown>
        </Col>
      </Row>
    </Context.Provider>
  );
};
