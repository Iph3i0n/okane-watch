import { Chart } from "$components/chart";
import FormFor from "$components/form";
import { Col, Row } from "$components/layout";
import { UseUiText } from "$contexts/uitext";
import { GetDateRange } from "$utils/date-range";
import { IsBoolean, IsNumber, IsObject, IsString } from "@paulpopat/safe-type";
import React from "react";
import { InvisibleButton, ThemeButton } from "../components/button";
import { IconEdit } from "../components/icons";
import Modal from "../components/modal";
import TableFor, {
  GoodBadCurrencyCell,
  HighlightRow,
} from "../components/table";
import { Badge, H1, H2 } from "../components/text";
import ApiClient from "../services/api";
import CreatePage from "../utils/page";
import { IsSummaryCategory } from "../types/category";
import { ToCurrencyString } from "../utils/number";

const Table = TableFor(IsSummaryCategory);

const Form = FormFor(
  IsObject({ name: IsString, budget: IsNumber, personal: IsBoolean }),
  { name: "", budget: 0, personal: false }
);

export default CreatePage(
  async (ctx) => {
    const queries = await ApiClient.Query.GetAll();
    const query_options = Object.keys(queries);
    const range = GetDateRange(ctx);
    return {
      categories: await ApiClient.Categories.GetOverview(range),
      queries: [
        {
          name: query_options[0],
          metadata: queries[query_options[0]],
          value: await ApiClient.Query.Run({
            slug: query_options[0],
            from_date: range.from,
            to_date: range.to,
            person: undefined,
            category: undefined,
          }),
        },
        {
          name: query_options[1],
          metadata: queries[query_options[1]],
          value: await ApiClient.Query.Run({
            slug: query_options[1],
            from_date: range.from,
            to_date: range.to,
            person: undefined,
            category: undefined,
          }),
        },
      ] as const,
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
          {props.queries.map((q) => (
            <Col xs="12" md="6" key={q.name}>
              <H2>{uitext.query_names[q.name]}</H2>
              <Chart type={q.metadata.chart_type} data={q.value} />
            </Col>
          ))}
        </Row>
        <Row>
          <Col xs="12">
            <Table rows={categories}>
              <thead>
                <tr>
                  <th>{uitext.category}</th>
                  <th>{uitext.budget}</th>
                  <th>{uitext.spend}</th>
                  <th>{uitext.diff}</th>
                  <th>{uitext.personal}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <Table.Row>
                  {(row) => (
                    <>
                      <td>
                        {row.personal && <Badge>{uitext.personal_badge}</Badge>}
                        {row.name}
                      </td>
                      <td>
                        {ToCurrencyString(
                          row.budget,
                          uitext.locale,
                          uitext.currency_label
                        )}
                      </td>
                      <td>
                        {ToCurrencyString(
                          row.total.spend,
                          uitext.locale,
                          uitext.currency_label
                        )}
                      </td>
                      <GoodBadCurrencyCell number={row.total.diff} />
                      <td>
                        {ToCurrencyString(
                          row.your.spend,
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
                              personal: row.personal,
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
                <HighlightRow>
                  <td>{uitext.total}</td>
                  <td>
                    {ToCurrencyString(
                      categories
                        .map((c) => c.budget)
                        .reduce((c, n) => c + n, 0),
                      uitext.locale,
                      uitext.currency_label
                    )}
                  </td>
                  <td>
                    {ToCurrencyString(
                      categories
                        .map((c) => c.total.spend)
                        .reduce((c, n) => c + n, 0),
                      uitext.locale,
                      uitext.currency_label
                    )}
                  </td>
                  <GoodBadCurrencyCell
                    number={categories
                      .map((c) => c.total.diff)
                      .reduce((c, n) => c + n, 0)}
                  />
                  <td>
                    {ToCurrencyString(
                      categories
                        .map((c) => c.your.spend)
                        .reduce((c, n) => c + n, 0),
                      uitext.locale,
                      uitext.currency_label
                    )}
                  </td>
                  <td />
                </HighlightRow>
              </tbody>
            </Table>
            <ThemeButton
              type="button"
              onClick={() => {
                set_editing(true);
                set_current("");
                set_form_value(Form.default_value);
              }}
            >
              {uitext.add}
            </ThemeButton>
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

                const existing = categories.find((c) => c.id === current);
                const final = {
                  ...existing,
                  ...response,
                };
                set_categories((c) =>
                  c.map((c) => (c.id === final.id ? final : c))
                );
              } else {
                const response = await ApiClient.Categories.Add(v);
                const final = {
                  ...response,
                  total: { spend: 0, diff: response.budget },
                  your: { spend: 0, diff: response.budget },
                };
                set_categories((c) => [...c, final]);
              }

              set_form_value(Form.default_value);
              set_editing(false);
            }}
          >
            <Form.TextInput name="name">{uitext.name}</Form.TextInput>
            <Form.NumberInput name="budget" min={0} decimal_places={2}>
              {`${uitext.budget} (${uitext.currency})`}
            </Form.NumberInput>
            <Form.Checkbox name="personal">{uitext.personal}</Form.Checkbox>
            <ThemeButton type="submit">{uitext.submit}</ThemeButton>
          </Form>
        </Modal>
      </>
    );
  }
);
