import { Card } from "$components/card";
import FormFor from "$components/form";
import { Col, Row } from "$components/layout";
import { UseCurrentUser } from "$contexts/react-user";
import { UseUiText } from "$contexts/uitext";
import { IsDateObject, ToDateString } from "$types/utility";
import { GetDateRange } from "$utils/date-range";
import { IsNumber, IsObject, IsString } from "@paulpopat/safe-type";
import React from "react";
import {
  InvisibleButton,
  ThemeButton,
  VariantButton,
} from "../components/button";
import { IconDelete, IconEdit } from "../components/icons";
import Modal from "../components/modal";
import TableFor from "../components/table";
import { H1 } from "../components/text";
import ApiClient from "../services/api";
import CreatePage from "../utils/page";
import { IsCompleteTransaction } from "../types/transaction";
import { Year, Month, Day } from "../utils/constants";
import { ToCurrencyString } from "../utils/number";

const Table = TableFor(IsCompleteTransaction);

const Form = FormFor(
  IsObject({
    when: IsDateObject,
    description: IsString,
    category: IsString,
    amount: IsNumber,
  }),
  {
    when: { day: Day, month: Month, year: Year },
    description: "",
    category: "",
    amount: 0,
  }
);

export default CreatePage(
  async (ctx) => {
    return {
      transactions: await ApiClient.Transactions.GetMonth(GetDateRange(ctx)),
      categories: await ApiClient.Categories.GetAll(),
    };
  },
  (props) => {
    const uitext = UseUiText();
    const user = UseCurrentUser();
    const [transactions, set_transactions] = React.useState(props.transactions);
    const [editing, set_editing] = React.useState(false);
    const [current, set_current] = React.useState("");
    const [form_value, set_form_value] = React.useState(Form.default_value);
    const [deleting, set_deleting] = React.useState("");

    return (
      <>
        <Row>
          <Col xs="12">
            <H1>{uitext.transactions}</H1>
          </Col>
        </Row>
        <Row>
          <Col xs="12">
            <Card>
              <Table rows={transactions}>
                <thead>
                  <tr>
                    <th>{uitext.date}</th>
                    <th>{uitext.person}</th>
                    <th>{uitext.description}</th>
                    <th>{uitext.category}</th>
                    <th>{uitext.amount}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <Table.Row>
                    {(row) => (
                      <>
                        <td>{ToDateString(row.when)}</td>
                        <td>{row.person.name}</td>
                        <td>{row.description}</td>
                        <td>{row.category.name}</td>
                        <td>
                          {ToCurrencyString(
                            row.amount,
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
                                when: row.when,
                                description: row.description,
                                category: row.category.id,
                                amount: row.amount,
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
                          <InvisibleButton
                            type="button"
                            onClick={() => {
                              set_deleting(row.id);
                            }}
                          >
                            <IconDelete
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
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xs="12">
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
          title="Transaction"
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
                const original = transactions.find((t) => t.id === current);
                const response = await ApiClient.Transactions.Update(
                  { id: current },
                  { ...v, person: original.person.id }
                );
                const final = {
                  ...response,
                  person: original.person,
                  category: props.categories.find(
                    (c) => c.id === response.category
                  ),
                };
                set_transactions((t) =>
                  t.map((c) => (c.id === final.id ? final : c))
                );
              } else {
                const response = await ApiClient.Transactions.Add(v);
                const final = {
                  ...response,
                  person: user,
                  category: props.categories.find(
                    (c) => c.id === response.category
                  ),
                };
                set_transactions((t) => [...t, final]);
              }

              set_form_value(Form.default_value);
              set_editing(false);
            }}
          >
            <Form.TextInput name="description">
              {uitext.description}
            </Form.TextInput>
            <Form.DatePicker name="when">{uitext.when}</Form.DatePicker>
            <Form.Select name="category" label={uitext.category}>
              {props.categories.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Form.Select>
            <Form.NumberInput name="amount" min={0} decimal_places={2}>
              {uitext.amount} ({uitext.currency})
            </Form.NumberInput>
            <ThemeButton type="submit">{uitext.submit}</ThemeButton>
          </Form>
        </Modal>
        <Modal
          title={uitext.are_you_sure}
          open={!!deleting}
          on_close={() => set_deleting("")}
        >
          <p>
            {uitext.delete_transaction}
            <br />
            <small>
              {transactions.find((t) => t.id === deleting)?.description}
            </small>
          </p>
          <div>
            <ThemeButton
              type="button"
              onClick={async () => {
                await ApiClient.Transactions.Delete({ id: deleting });
                set_transactions((t) => t.filter((t) => t.id !== deleting));
                set_deleting("");
              }}
            >
              {uitext.delete}
            </ThemeButton>
            &nbsp;
            <VariantButton type="button" onClick={() => set_deleting("")}>
              {uitext.cancel}
            </VariantButton>
          </div>
        </Modal>
      </>
    );
  }
);
