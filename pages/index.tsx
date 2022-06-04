import { Card } from "$components/card";
import { Chart } from "$components/chart";
import FormFor from "$components/form";
import { Col, Row } from "$components/layout";
import { UseUiText } from "$contexts/uitext";
import { ToDateString } from "$types/utility";
import { GetDateRange } from "$utils/date-range";
import {
  IsIntersection,
  IsNumber,
  IsObject,
  IsString,
} from "@paulpopat/safe-type";
import { NextPageContext } from "next";
import React from "react";
import { InvisibleButton, ThemeButton } from "../components/button";
import { IconEdit } from "../components/icons";
import Modal from "../components/modal";
import TableFor from "../components/table";
import { H1, H2 } from "../components/text";
import ApiClient from "../services/api";
import CreatePage from "../services/page";
import { Category, IsCategory } from "../types/category";
import { NextMonth, ThisMonth } from "../utils/constants";
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

function GetFullCategory(ctx: NextPageContext) {
  return async (category: Category) => ({
    ...category,
    spend: (
      await ApiClient.Categories.Spend({
        id: category.id,
        ...GetDateRange(ctx),
      })
    ).spend,
  });
}

export default CreatePage(
  async (ctx) => {
    const queries = await ApiClient.Query.GetAll();
    const default_query = queries.queries.find(
      (q) => q.slug === queries.default_query
    );

    const categories = await ApiClient.Categories.GetAll();
    return {
      categories: await Promise.all(categories.map(GetFullCategory(ctx))),
      query_result: await ApiClient.Query.Run({
        slug: default_query.slug,
        from_date: ToDateString(ThisMonth),
        to_date: ToDateString(NextMonth),
        person: undefined,
        category: undefined,
      }),
      query: default_query,
    };
  },
  (props) => {
    const [categories, set_categories] = React.useState(props.categories);
    const [editing, set_editing] = React.useState(false);
    const [current, set_current] = React.useState("");
    const [form_value, set_form_value] = React.useState(Form.default_value);
    const uitext = UseUiText();

    return (
      <>
        <Row>
          <Col xs="12">
            <H1>{uitext.overview}</H1>
          </Col>
        </Row>
        <Row>
          <Col xs="12" lg="6">
            <Card>
              <Table rows={categories}>
                <thead>
                  <tr>
                    <th>{uitext.category}</th>
                    <th>{uitext.budget}</th>
                    <th>{uitext.spend}</th>
                    <th>{uitext.diff}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <Table.Row>
                    {(row) => (
                      <>
                        <td>{row.name}</td>
                        <td>
                          {ToCurrencyString(
                            row.budget,
                            uitext.locale,
                            uitext.currency_label
                          )}
                        </td>
                        <td>
                          {ToCurrencyString(
                            row.spend,
                            uitext.locale,
                            uitext.currency_label
                          )}
                        </td>
                        <td>
                          {ToCurrencyString(
                            row.budget - row.spend,
                            uitext.locale,
                            uitext.currency_label
                          )}
                        </td>
                        <td>
                          <InvisibleButton
                            type="button"
                            onClick={() => {
                              set_current(row.id);
                              set_form_value({
                                name: row.name,
                                budget: row.budget,
                              });
                              set_editing(true);
                            }}
                          >
                            <IconEdit
                              colour="var(--body)"
                              width="24"
                              height="24"
                            />
                          </InvisibleButton>
                        </td>
                      </>
                    )}
                  </Table.Row>
                </tbody>
              </Table>
              <ThemeButton type="button" onClick={() => set_editing(true)}>
                {uitext.add}
              </ThemeButton>
            </Card>
          </Col>
          <Col xs="12" lg="6">
            <Card>
              <H2>{props.query.name}</H2>
              <Chart type={props.query.chart_type} data={props.query_result} />
            </Card>
          </Col>
        </Row>
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
                const final = {
                  ...response,
                  spend: categories.find((c) => c.id === current).spend,
                };
                set_categories((c) =>
                  c.map((c) => (c.id === final.id ? final : c))
                );
              } else {
                const response = await ApiClient.Categories.Add(v);
                const final = { ...response, spend: 0 };
                set_categories((c) => [...c, final]);
              }

              set_form_value(Form.default_value);
              set_editing(false);
            }}
          >
            <Form.TextInput name="name">{uitext.name}</Form.TextInput>
            <Form.NumberInput name="budget" min={0} decimal_places={2}>
              {uitext.budget} ({uitext.currency})
            </Form.NumberInput>
            <ThemeButton type="submit">{uitext.submit}</ThemeButton>
          </Form>
        </Modal>
      </>
    );
  }
);
