import React from "react";
import { InvisibleButton, ThemeButton } from "$components/button";
import { IconEdit } from "$components/icons";
import Modal from "$components/modal";
import TableFor from "$components/table";
import { H1 } from "$components/text";
import ApiClient from "$services/api";
import CreatePage from "$utils/page";
import { IsPerson } from "$types/person";
import FormFor from "$components/form";
import { IsBoolean, IsObject, IsString } from "@paulpopat/safe-type";
import { UseUiText } from "$contexts/uitext";
import { Col, Row } from "$components/layout";

const Table = TableFor(IsPerson);

const Form = FormFor(
  IsObject({ name: IsString, password: IsString, is_admin: IsBoolean }),
  {
    name: "",
    password: "",
    is_admin: false,
  }
);

export default CreatePage(
  async (ctx) => {
    return {
      people: await ApiClient.People.GetAll(),
    };
  },
  (props) => {
    const uitext = UseUiText();
    const [people, set_people] = React.useState(props.people);
    const [form_value, set_form_value] = React.useState(Form.default_value);
    const [editing, set_editing] = React.useState(false);
    const [current, set_current] = React.useState("");

    return (
      <>
        <Row>
          <Col xs="12">
            <H1>{uitext.people}</H1>
          </Col>
        </Row>
        <Row>
          <Col xs="12">
            <Table rows={people}>
              <thead>
                <tr>
                  <th>{uitext.name}</th>
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
                          onClick={async () => {
                            set_current(row.id);
                            set_form_value({
                              name: row.name,
                              password: "",
                              is_admin: (
                                await ApiClient.People.IsAdmin({ id: row.id })
                              ).is_admin,
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
            <Form.TextInput name="name">{uitext.name}</Form.TextInput>
            <Form.PasswordInput name="password">
              {uitext.password}
            </Form.PasswordInput>
            <Form.Checkbox name="is_admin">{uitext.admin}</Form.Checkbox>
            <ThemeButton type="submit">{uitext.submit}</ThemeButton>
          </Form>
        </Modal>
      </>
    );
  }
);
