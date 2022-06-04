import { Assert, Checker } from "@paulpopat/safe-type";
import React from "react";
import Styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DateObject, FromJsDate, IsDateObject, ToJsDate } from "$types/utility";
import { UseUiText } from "$contexts/uitext";

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
    color: var(--body);
    font-family: var(--font-family);
    font-size: var(--font-size-text);
    font-weight: var(--font-weight-standard);
    background: var(--bg-surface);
    border: none;
    border-radius: var(--border-radius);
    margin-left: var(--block-padding);
    padding: var(--text-padding-y) var(--text-padding-x);
  }

  .react-datepicker__triangle {
    display: none;
  }

  .react-datepicker__header {
    background: var(--bg-surface);
    border: none;
  }

  .react-datepicker {
    background: var(--bg-white);
    border: none;
    box-shadow: var(--box-shadow);
    border-radius: var(--border-radius);
  }

  .react-datepicker__day-name,
  .react-datepicker__day,
  .react-datepicker__time-name,
  .react-datepicker__current-month {
    color: var(--body);
  }

  .react-datepicker__navigation:hover *::before {
    border-color: var(--body);
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--in-selecting-range,
  .react-datepicker__day--in-range,
  .react-datepicker__month-text--selected,
  .react-datepicker__month-text--in-selecting-range,
  .react-datepicker__month-text--in-range,
  .react-datepicker__quarter-text--selected,
  .react-datepicker__quarter-text--in-selecting-range,
  .react-datepicker__quarter-text--in-range,
  .react-datepicker__year-text--selected,
  .react-datepicker__year-text--in-selecting-range,
  .react-datepicker__year-text--in-range {
    background-color: var(--theme-dark);
    color: var(--white);
    border-radius: var(--border-radius);
  }

  .react-datepicker__day:hover,
  .react-datepicker__month-text:hover,
  .react-datepicker__quarter-text:hover,
  .react-datepicker__year-text:hover {
    background-color: var(--bg-surface);
    border-radius: var(--border-radius);
  }

  .react-datepicker__input-container {
    display: flex;
  }

  .react-datepicker__day--outside-month {
    opacity: 0.7;
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
  color: var(--body);
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
  color: var(--body);
`;

type ContextObject<T extends Record<string, any>> = {
  get: <TKey extends keyof T>(key: TKey) => T[TKey];
  set: <TKey extends keyof T>(key: TKey, value: T[TKey]) => void;
};

export const SelectDate: React.C<{
  date: DateObject;
  set_date: (value: DateObject) => void;
}> = ({ date, set_date, children }) => {
  return (
    <DatePickerLabel>
      {children}
      <DatePicker
        selected={ToJsDate(date)}
        onChange={(date) => set_date(FromJsDate(date))}
        dateFormat="yyyy-MM-dd"
      />
    </DatePickerLabel>
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
              step="0.01"
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
        const uitext = UseUiText();

        return (
          <Label>
            {label}
            <Select
              value={get(name)}
              onChange={(e) => set(name, e.currentTarget.value as any)}
            >
              <option disabled value="">
                {uitext.pick_one}
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
          <SelectDate date={value} set_date={(v) => set(name, v as any)}>
            {children}
          </SelectDate>
        );
      }) as React.C<{ name: keyof T }>,
      Checkbox: (({ children, name }) => {
        const { get, set } = React.useContext(Context);

        return (
          <Label>
            {children}
            <Input
              type="checkbox"
              checked={get(name)}
              onChange={(e) => set(name, e.currentTarget.checked as any)}
            />
          </Label>
        );
      }) as React.C<{ name: keyof T }>,
      default_value,
    }
  );
}
