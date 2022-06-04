import React from "react";
import { ThemeButton } from "$components/button";
import FormFor from "$components/form";
import { Col, Row } from "$components/layout";
import CreatePage from "$services/page";
import { IsObject, IsString } from "@paulpopat/safe-type";
import ApiClient from "$services/api";
import { useRouter } from "next/router";
import { H1 } from "$components/text";
import { setCookies } from "cookies-next";
import { AuthTokenKey } from "$utils/constants";
import { SetAuth } from "$utils/cookies";
import { UseUiText } from "$contexts/uitext";

const Form = FormFor(IsObject({ name: IsString, password: IsString }), {
  name: "",
  password: "",
});

export default CreatePage(
  async (ctx) => {
    return {};
  },
  (props) => {
    const router = useRouter();
    const uitext = UseUiText();
    const [form, set_form] = React.useState(Form.default_value);

    return (
      <Form
        value={form}
        on_change={set_form}
        on_submit={async (v) => {
          const res = await ApiClient.People.Login(v);
          SetAuth(res.token);
          router.push("/");
        }}
      >
        <Row>
          <Col xs="12">
            <H1>{uitext.login}</H1>
          </Col>
        </Row>
        <Row>
          <Col xs="12" lg="6">
            <Form.TextInput name="name">{uitext.name}</Form.TextInput>
          </Col>
          <Col xs="12" lg="6">
            <Form.PasswordInput name="password">
              {uitext.password}
            </Form.PasswordInput>
          </Col>
        </Row>
        <Row>
          <Col xs="12">
            <ThemeButton type="submit">{uitext.submit}</ThemeButton>
          </Col>
        </Row>
      </Form>
    );
  },
  "no-auth"
);
