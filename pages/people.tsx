import React from "react";
import { InvisibleButton, ThemeButton } from "$components/button";
import { IconEdit } from "$components/icons";
import Modal from "$components/modal";
import TableFor from "$components/table";
import { H1 } from "$components/text";
import ApiClient from "$services/api";
import CreatePage from "$services/page";
import { IsPerson } from "$types/person";

const Table = TableFor(IsPerson);

export default CreatePage(
  async (ctx) => {
    return {
      people: await ApiClient.People.GetAll(),
    };
  },
  (props) => {
    const [adding, set_adding] = React.useState(false);

    return (
      <>
        <H1>Transactions</H1>
        <Table rows={props.people}>
          <thead>
            <tr>
              <th>Name</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <Table.Row>
              {(row) => (
                <>
                  <td>{row.name}</td>
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
