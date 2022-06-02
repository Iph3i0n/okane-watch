import FormFor from "$components/form";
import { IsDateObject, ToDateString } from "$types/utility";
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
import CreatePage from "../services/page";
import { IsCompleteTransaction, Transaction } from "../types/transaction";
import { Year, Month, Day } from "../utils/constants";
import { ToCurrencyString } from "../utils/number";

const Table = TableFor(IsCompleteTransaction);

const Form = FormFor(
  IsObject({
    when: IsDateObject,
    user: IsString,
    description: IsString,
    category: IsString,
    amount: IsNumber,
  }),
  {
    when: { day: Day, month: Month, year: Year },
    user: "",
    description: "",
    category: "",
    amount: 0,
  }
);

async function GetFullTransaction(transaction: Transaction) {
  return {
    ...transaction,
    user: await ApiClient.People.Get({ id: transaction.user }),
    category: await ApiClient.Categories.Get({ id: transaction.category }),
  };
}

export default CreatePage(
  async (ctx) => {
    const transactions = await ApiClient.Transactions.GetMonth({
      month: Month.toString(),
      year: Year.toString(),
    });

    return {
      transactions: await Promise.all(transactions.map(GetFullTransaction)),
      categories: await ApiClient.Categories.GetAll(),
      people: await ApiClient.People.GetAll(),
    };
  },
  (props) => {
    const [transactions, set_transactions] = React.useState(props.transactions);
    const [editing, set_editing] = React.useState(false);
    const [current, set_current] = React.useState("");
    const [form_value, set_form_value] = React.useState(Form.default_value);
    const [deleting, set_deleting] = React.useState("");

    return (
      <>
        <H1>Transactions</H1>
        <Table rows={transactions}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Person</th>
              <th>Description</th>
              <th>Category</th>
              <th>Amount</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <Table.Row>
              {(row) => (
                <>
                  <td>{ToDateString(row.when)}</td>
                  <td>{row.user.name}</td>
                  <td>{row.description}</td>
                  <td>{row.category.name}</td>
                  <td>{ToCurrencyString(row.amount)}</td>
                  <td>
                    <InvisibleButton
                      type="button"
                      onClick={() => {
                        set_current(row.id);
                        set_form_value({
                          when: row.when,
                          user: row.user.id,
                          description: row.description,
                          category: row.category.id,
                          amount: row.amount,
                        });
                        set_editing(true);
                      }}
                    >
                      <IconEdit colour="var(--body)" width="24" height="24" />
                    </InvisibleButton>
                    <InvisibleButton
                      type="button"
                      onClick={() => {
                        set_deleting(row.id);
                      }}
                    >
                      <IconDelete colour="var(--body)" width="24" height="24" />
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
                const response = await ApiClient.Transactions.Update(
                  { id: current },
                  v
                );
                const final = await GetFullTransaction(response);
                set_transactions((t) =>
                  t.map((c) => (c.id === final.id ? final : c))
                );
              } else {
                const response = await ApiClient.Transactions.Add(v);
                const final = await GetFullTransaction(response);
                set_transactions((t) => [...t, final]);
              }

              set_form_value(Form.default_value);
              set_editing(false);
            }}
          >
            <Form.TextInput name="description">Description</Form.TextInput>
            <Form.DatePicker name="when">When</Form.DatePicker>
            <Form.Select name="user" label="Person">
              {props.people.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Form.Select>
            <Form.Select name="category" label="Category">
              {props.categories.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Form.Select>
            <Form.NumberInput name="amount" min={0} decimal_places={2}>
              Amount (£)
            </Form.NumberInput>
            <ThemeButton type="submit">Submit</ThemeButton>
          </Form>
        </Modal>
        <Modal
          title="Are you sure?"
          open={!!deleting}
          on_close={() => set_deleting("")}
        >
          <p>
            Are you sure you wish to delete this transaction?
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
              Delete
            </ThemeButton>
            &nbsp;
            <VariantButton type="button" onClick={() => set_deleting("")}>
              Cancel
            </VariantButton>
          </div>
        </Modal>
      </>
    );
  }
);
