import { Assert, Checker } from "@paulpopat/safe-type";
import React from "react";
import Styled from "styled-components";
import "react-datepicker/dist/react-datepicker.css";
import {
  DateObject,
  FromDateString,
  IsDateObject,
  ToDateString,
  ToJsDate,
} from "$types/utility";
import { BreakPoints, Col, Row } from "./layout";
import { v4 as Guid } from "uuid";

const Form = Styled.form`
  display: grid;
  grid-template-columns: auto;
  gap: var(--block-padding);
`;

const InputContainer = Styled.div`
  input, select {
    width: 100%;
    color: var(--body);
    font-family: var(--font-family);
    font-size: var(--font-size-text);
    font-weight: var(--font-weight-standard);
    background: var(--bg-white);
    border: none;
    border-radius: var(--border-radius);
    box-sizing: border-box;
    padding: var(--text-padding-y) var(--text-padding-x);
    margin: 0;
    -webkit-appearance: none;
  }
`;

const LabelText = Styled.label`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 100%;

  @media screen and (min-width: ${BreakPoints.md}) {
    justify-content: flex-end;
  }
`;

type ContextObject<T extends Record<string, any>> = {
  get: <TKey extends keyof T>(key: TKey) => T[TKey];
  set: <TKey extends keyof T>(key: TKey, value: T[TKey]) => void;
};

const Label: React.C<{ id: string; label: string }> = ({
  label,
  id,
  children,
}) => (
  <Row>
    <Col xs="12" md="3">
      <LabelText htmlFor={id}>{label}</LabelText>
    </Col>
    <Col xs="12" md="9">
      <InputContainer>{children}</InputContainer>
    </Col>
  </Row>
);

export const SelectDate: React.FC<{
  date: DateObject;
  children: string;
  set_date: (value: DateObject) => void;
}> = ({ date, set_date, children }) => {
  const [id] = React.useState(() => Guid());
  return (
    <Label label={children} id={id}>
      <input
        id={id}
        type="date"
        value={ToDateString(date)}
        onChange={(e) => set_date(FromDateString(e.currentTarget.value))}
      />
    </Label>
  );
};

export const Checkbox: React.FC<{
  checked: boolean;
  set_checked: (val: boolean) => void;
  children: string;
}> = ({ checked, set_checked, children }) => {
  const [id] = React.useState(() => Guid());
  return (
    <Label label={children} id={id}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => set_checked(e.currentTarget.checked)}
      />
    </Label>
  );
};

export const Dropdown: React.C<{
  value: string;
  set_value: (value: string) => void;
  label: string;
}> = ({ children, label, value, set_value }) => {
  const [id] = React.useState(() => Guid());
  return (
    <Label label={label} id={id}>
      <select
        id={id}
        value={value}
        onChange={(e) => set_value(e.currentTarget.value)}
      >
        {children}
      </select>
    </Label>
  );
};

export default function FormFor<T extends Record<string, any>>(
  schema: Checker<T>,
  default_value: T
) {
  const Context = React.createContext<ContextObject<T>>(undefined);

  return Object.assign(
    (({ value, on_change, on_submit, children }) => {
      Assert(schema, value);

      return (
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            on_submit(value);
          }}
        >
          <Context.Provider
            value={{
              get: (k) => value[k],
              set: (k, v) => on_change({ ...value, [k]: v }),
            }}
          >
            {children}
          </Context.Provider>
        </Form>
      );
    }) as React.C<{
      value: T;
      on_change: (v: T) => void;
      on_submit: (v: T) => void;
    }>,
    {
      TextInput: (({ children, name }) => {
        const { get, set } = React.useContext(Context);
        const [id] = React.useState(() => Guid());
        return (
          <Label label={children} id={id}>
            <input
              id={id}
              type="text"
              value={get(name)}
              onChange={(e) => set(name, e.currentTarget.value as any)}
            />
          </Label>
        );
      }) as React.FC<{ children: string; name: keyof T }>,
      PasswordInput: (({ children, name }) => {
        const { get, set } = React.useContext(Context);
        const [id] = React.useState(() => Guid());
        return (
          <Label label={children} id={id}>
            <input
              id={id}
              type="password"
              value={get(name)}
              onChange={(e) => set(name, e.currentTarget.value as any)}
            />
          </Label>
        );
      }) as React.FC<{ children: string; name: keyof T }>,
      NumberInput: (({ children, name, max, min, decimal_places }) => {
        const { get, set } = React.useContext(Context);
        const places = decimal_places ?? 1000;
        const [id] = React.useState(() => Guid());

        return (
          <Label label={children} id={id}>
            <input
              id={id}
              type="number"
              value={get(name)}
              onChange={(e) =>
                set(
                  name,
                  parseFloat(
                    parseFloat(e.currentTarget.value).toFixed(places)
                  ) as any
                )
              }
              max={max}
              min={min}
              step="0.01"
            />
          </Label>
        );
      }) as React.FC<{
        children: string;
        name: keyof T;
        max?: number;
        min?: number;
        decimal_places?: number;
      }>,
      Select: (({ label, children, name }) => {
        const { get, set } = React.useContext(Context);
        return (
          <Dropdown
            label={label}
            value={get(name)}
            set_value={(v) => set(name, v as any)}
          >
            {children}
          </Dropdown>
        );
      }) as React.C<{ label: string; name: keyof T }>,
      DatePicker: (({ children, name }) => {
        const { get, set } = React.useContext(Context);
        const value = get(name);
        Assert(IsDateObject, value);
        const final = ToJsDate(value);

        return (
          <SelectDate date={value} set_date={(v) => set(name, v as any)}>
            {children}
          </SelectDate>
        );
      }) as React.FC<{ children: string; name: keyof T }>,
      Checkbox: (({ children, name }) => {
        const { get, set } = React.useContext(Context);

        return (
          <Checkbox
            checked={get(name)}
            set_checked={(c) => set(name, c as any)}
          >
            {children}
          </Checkbox>
        );
      }) as React.FC<{ children: string; name: keyof T }>,
      default_value,
    }
  );
}
