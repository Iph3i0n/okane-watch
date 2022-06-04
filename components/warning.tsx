import React from "react";
import Styled from "styled-components";
import { Col, Row } from "./layout";

export const Warning = Styled.p`
  background: var(--error);
  color: var(--white);
  padding: var(--text-padding-y-large) var(--text-padding-x-large);
  border-radius: var(--border-radius);
`;

export const WarningRow: React.C = ({ children }) => (
  <Row>
    <Col xs="12">
      <Warning>{children}</Warning>
    </Col>
  </Row>
);
