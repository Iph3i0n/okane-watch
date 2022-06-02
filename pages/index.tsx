import { IsIntersection, IsNumber, IsObject } from "@paulpopat/safe-type";
import React from "react";
import { InvisibleButton, ThemeButton } from "../components/button";
import { IconEdit } from "../components/icons";
import Modal from "../components/modal";
import TableFor from "../components/table";
import { H1 } from "../components/text";
import ApiClient from "../services/api";
import CreatePage from "../services/page";
import { IsCategory } from "../types/category";
import { Year, Month } from "../utils/constants";
import { ToCurrencyString } from "../utils/number";

const Table = TableFor(
  IsIntersection(
    IsObject({
      spend: IsNumber,
    }),
    IsCategory
  )
);

export default CreatePage(
  async (ctx) => {
    const categories = await ApiClient.Categories.GetAll();
    return {
      categories: await Promise.all(
        categories.map(async (c) => ({
          ...c,
          spend: (
            await ApiClient.Categories.Spend({
              id: c.id,
              month: Month.toString(),
              year: Year.toString(),
            })
          ).spend,
        }))
      ),
    };
  },
  (props) => {
    const [adding, set_adding] = React.useState(false);

    return (
      <>
        <H1>Overview</H1>
        <Table rows={props.categories}>
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
                    <InvisibleButton type="button">
                      <IconEdit colour="var(--body)" width="24" height="24" />
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
