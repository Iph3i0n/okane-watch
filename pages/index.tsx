import FormFor from "$components/form";
import { ToDateString } from "$types/utility";
import {
  IsIntersection,
  IsNumber,
  IsObject,
  IsString,
} from "@paulpopat/safe-type";
import React from "react";
import { InvisibleButton, ThemeButton } from "../components/button";
import { IconEdit } from "../components/icons";
import Modal from "../components/modal";
import TableFor from "../components/table";
import { H1 } from "../components/text";
import ApiClient from "../services/api";
import CreatePage from "../services/page";
import { Category, IsCategory } from "../types/category";
import { NextMonthObject, NowObject } from "../utils/constants";
import { ToCurrencyString } from "../utils/number";

const Table = TableFor(
  IsIntersection(
    IsObject({
      spend: IsNumber,
    }),
    IsCategory
  )
);

const Form = FormFor(IsObject({ name: IsString, budget: IsNumber }), {
  name: "",
  budget: 0,
});

async function GetFullCategory(category: Category) {
  return {
    ...category,
    spend: (
      await ApiClient.Categories.Spend({
        id: category.id,
        from: ToDateString(NowObject),
        to: ToDateString(NextMonthObject),
      })
    ).spend,
  };
}

export default CreatePage(
  async (ctx) => {
    const categories = await ApiClient.Categories.GetAll();
    return {
      categories: await Promise.all(categories.map(GetFullCategory)),
    };
  },
  (props) => {
    const [categories, set_categories] = React.useState(props.categories);
    const [editing, set_editing] = React.useState(false);
    const [current, set_current] = React.useState("");
    const [form_value, set_form_value] = React.useState(Form.default_value);

    return (
      <>
        <H1>Overview</H1>
        <Table rows={categories}>
          <thead>
            <tr>
              <th>Category</th>
              <th>Budget</th>
              <th>Spend</th>
              <th>Diff</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <Table.Row>
              {(row) => (
                <>
                  <td>{row.name}</td>
                  <td>{ToCurrencyString(row.budget)}</td>
                  <td>{ToCurrencyString(row.spend)}</td>
                  <td>{ToCurrencyString(row.budget - row.spend)}</td>
                  <td>
                    <InvisibleButton
                      type="button"
                      onClick={() => {
                        set_current(row.id);
                        set_form_value({ name: row.name, budget: row.budget });
                        set_editing(true);
                      }}
                    >
                      <IconEdit colour="var(--body)" width="24" height="24" />
                    </InvisibleButton>
                  </td>
                </>
              )}
            </Table.Row>
          </tbody>
        </Table>
        <ThemeButton type="button" onClick={() => set_editing(true)}>
          Add
        </ThemeButton>
        <Modal
          title="Category"
          open={editing}
          on_close={() => {
            set_editing(false);
            set_form_value(Form.default_value);
            set_current("");
          }}
        >
          <Form
            value={form_value}
            on_change={set_form_value}
            on_submit={async (v) => {
              if (current) {
                const response = await ApiClient.Categories.Update(
                  { id: current },
                  v
                );
                const final = await GetFullCategory(response);
                set_categories((c) =>
                  c.map((c) => (c.id === final.id ? final : c))
                );
              } else {
                const response = await ApiClient.Categories.Add(v);
                const final = await GetFullCategory(response);
                set_categories((c) => [...c, final]);
              }

              set_form_value(Form.default_value);
              set_editing(false);
            }}
          >
            <Form.TextInput name="name">Name</Form.TextInput>
            <Form.NumberInput name="budget" min={0} decimal_places={2}>
              Budget (£)
            </Form.NumberInput>
            <ThemeButton type="submit">Submit</ThemeButton>
          </Form>
        </Modal>
      </>
    );
  }
);
