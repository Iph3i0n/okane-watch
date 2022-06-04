import { Assert, Checker } from "@paulpopat/safe-type";
import React from "react";
import Styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FromJsDate, IsDateObject, ToJsDate } from "$types/utility";

const Form = Styled.form`
  display: grid;
  grid-template-columns: auto;
  gap: var(--block-padding);
`;

const Label = Styled.label`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const DatePickerLabel = Styled.label`
  display: flex;
  align-items: center;
  justify-content: flex-start;

  input {
    flex: 1;
    font-family: var(--font-family);
    font-size: var(--font-size-text);
    font-weight: var(--font-weight-standard);
    background: var(--bg-surface);
    border: none;
    border-radius: var(--border-radius);
    margin-left: var(--block-padding);
    padding: var(--text-padding-y) var(--text-padding-x);
  }
`;

const Input = Styled.input`
  flex: 1;
  font-family: var(--font-family);
  font-size: var(--font-size-text);
  font-weight: var(--font-weight-standard);
  background: var(--bg-surface);
  border: none;
  border-radius: var(--border-radius);
  margin-left: var(--block-padding);
  padding: var(--text-padding-y) var(--text-padding-x);
`;

const Select = Styled.select`
  flex: 1;
  font-family: var(--font-family);
  font-size: var(--font-size-text);
  font-weight: var(--font-weight-standard);
  background: var(--bg-surface);
  border: none;
  border-radius: var(--border-radius);
  margin-left: var(--block-padding);
  padding: var(--text-padding-y) var(--text-padding-x);
  -webkit-appearance: none;
`;

type ContextObject<T extends Record<string, any>> = {
  get: <TKey extends keyof T>(key: TKey) => T[TKey];
  set: <TKey extends keyof T>(key: TKey, value: T[TKey]) => void;
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

        return (
          <Label>
            {children}
            <Input
              type="text"
              value={get(name)}
              onChange={(e) => set(name, e.currentTarget.value as any)}
            />
          </Label>
        );
      }) as React.C<{ name: keyof T }>,
      PasswordInput: (({ children, name }) => {
        const { get, set } = React.useContext(Context);

        return (
          <Label>
            {children}
            <Input
              type="password"
              value={get(name)}
              onChange={(e) => set(name, e.currentTarget.value as any)}
            />
          </Label>
        );
      }) as React.C<{ name: keyof T }>,
      NumberInput: (({ children, name, max, min, decimal_places }) => {
        const { get, set } = React.useContext(Context);
        const places = decimal_places ?? 1000;

        return (
          <Label>
            {children}
            <Input
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
              inputMode="decimal"
            />
          </Label>
        );
      }) as React.C<{
        name: keyof T;
        max?: number;
        min?: number;
        decimal_places?: number;
      }>,
      Select: (({ label, children, name }) => {
        const { get, set } = React.useContext(Context);

        return (
          <Label>
            {label}
            <Select
              value={get(name)}
              onChange={(e) => set(name, e.currentTarget.value as any)}
            >
              <option disabled value="">
                Pick One
              </option>
              {children}
            </Select>
          </Label>
        );
      }) as React.C<{ label: string; name: keyof T }>,
      DatePicker: (({ children, name }) => {
        const { get, set } = React.useContext(Context);
        const value = get(name);
        Assert(IsDateObject, value);
        const final = ToJsDate(value);

        return (
          <DatePickerLabel>
            {children}
            <DatePicker
              selected={final}
              onChange={(date) => set(name, FromJsDate(date) as any)}
              dateFormat="yyyy-MM-dd"
            />
          </DatePickerLabel>
        );
      }) as React.C<{ name: keyof T }>,
      default_value,
    }
  );
}
