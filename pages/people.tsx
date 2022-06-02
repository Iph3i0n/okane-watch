import React from "react";
import { InvisibleButton, ThemeButton } from "$components/button";
import { IconEdit } from "$components/icons";
import Modal from "$components/modal";
import TableFor from "$components/table";
import { H1 } from "$components/text";
import ApiClient from "$services/api";
import CreatePage from "$services/page";
import { IsPerson } from "$types/person";
import FormFor from "$components/form";
import { IsObject, IsString } from "@paulpopat/safe-type";

const Table = TableFor(IsPerson);

const Form = FormFor(IsObject({ name: IsString }), { name: "" });

export default CreatePage(
  async (ctx) => {
    return {
      people: await ApiClient.People.GetAll(),
    };
  },
  (props) => {
    const [people, set_people] = React.useState(props.people);
    const [form_value, set_form_value] = React.useState(Form.default_value);
    const [editing, set_editing] = React.useState(false);
    const [current, set_current] = React.useState("");

    return (
      <>
        <H1>Transactions</H1>
        <Table rows={people}>
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
                    <InvisibleButton
                      type="button"
                      onClick={() => {
                        set_current(row.id);
                        set_form_value({ name: row.name });
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
          title="Person"
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
                const response = await ApiClient.People.Update(
                  { id: current },
                  v
                );
                set_people((p) =>
                  p.map((c) => (c.id === response.id ? response : c))
                );
              } else {
                const response = await ApiClient.People.Add(v);
                set_people((p) => [...p, response]);
              }

              set_form_value(Form.default_value);
              set_editing(false);
            }}
          >
            <Form.TextInput name="name">Name</Form.TextInput>
            <ThemeButton type="submit">Submit</ThemeButton>
          </Form>
        </Modal>
      </>
    );
  }
);
