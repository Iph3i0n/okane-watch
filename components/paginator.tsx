import { UseUiText } from "$contexts/uitext";
import React from "react";
import Styled from "styled-components";
import { Dropdown } from "./form";
import { IconFirst, IconLast, IconNext, IconPrevious } from "./icons";

const Container = Styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;

  label {
    margin-right: var(--block-padding);
  }
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
    opacity: 0;

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
`;

const Context = React.createContext({
  pages: 0,
  current_page: 0,
  set_page: (page: number) => {},
  set_page_size: (size: number) => {},
});

export const Button: React.C<{ page: number }> = ({ page, children }) => {
  const { pages, current_page, set_page } = React.useContext(Context);
  if (current_page === page)
    return (
      <Item type="button" className="current" disabled>
        {children}
      </Item>
    );

  if (page >= 0 && page < pages)
    return (
      <Item type="button" onClick={() => set_page(page)}>
        {children}
      </Item>
    );

  return (
    <Item type="button" disabled>
      {children}
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
      <Container>
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
        <Button page={0}>
          <IconFirst colour="var(--body)" width="24" height="24" />
        </Button>
        <Button page={page - 1}>
          <IconPrevious colour="var(--body)" width="24" height="24" />
        </Button>
        <Button page={page - 2}>{page - 2 + 1 || 1}</Button>
        <Button page={page - 1}>{page - 1 + 1 || 1}</Button>
        <Button page={page}>{page + 1}</Button>
        <Button page={page + 1}>{page + 1 + 1}</Button>
        <Button page={page + 2}>{page + 2 + 1}</Button>
        <Button page={page + 1}>
          <IconNext colour="var(--body)" width="24" height="24" />
        </Button>
        <Button page={pages}>
          <IconLast colour="var(--body)" width="24" height="24" />
        </Button>
      </Container>
    </Context.Provider>
  );
};
