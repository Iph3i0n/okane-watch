import React from "react";
import { InvisibleButton, ThemeButton } from "../components/button";
import { IconDelete, IconEdit } from "../components/icons";
import Modal from "../components/modal";
import TableFor from "../components/table";
import { H1 } from "../components/text";
import ApiClient from "../services/api";
import CreatePage from "../services/page";
import { IsCompleteTransaction } from "../types/transaction";
import { Year, Month } from "../utils/constants";
import { ToCurrencyString } from "../utils/number";

const Table = TableFor(IsCompleteTransaction);

export default CreatePage(
  async (ctx) => {
    const transactions = await ApiClient.Transactions.GetMonth({
      month: Month.toString(),
      year: Year.toString(),
    });
    return {
      transactions: await Promise.all(
        transactions.map(async (t) => ({
          ...t,
          user: await ApiClient.People.Get({ id: t.user }),
          category: await ApiClient.Categories.Get({ id: t.category }),
        }))
      ),
    };
  },
  (props) => {
    const [adding, set_adding] = React.useState(false);

    return (
      <>
        <H1>Transactions</H1>
        <Table rows={props.transactions}>
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
                  <td>
                    {row.when.year.toString().padStart(4, "0")}-
                    {row.when.month.toString().padStart(2, "0")}-
                    {row.when.day.toString().padStart(2, "0")}
                  </td>
                  <td>{row.user.name}</td>
                  <td>{row.description}</td>
                  <td>{row.category.name}</td>
                  <td>{ToCurrencyString(row.amount)}</td>
                  <td>
                    <InvisibleButton type="button">
                      <IconEdit colour="var(--body)" width="24" height="24" />
                    </InvisibleButton>
                    <InvisibleButton type="button">
                      <IconDelete colour="var(--body)" width="24" height="24" />
                    </InvisibleButton>
                  </td>
                </>
              )}
            </Table.Row>
          </tbody>
        </Table>
        <ThemeButton type="button" onClick={() => set_adding(true)}>
          Add
        </ThemeButton>
        <Modal open={adding}></Modal>
      </>
    );
  }
);
