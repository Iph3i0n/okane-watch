import C from "$utils/class-name";
import React from "react";
import Styled from "styled-components";
import { InvisibleButton } from "./button";
import { IconClose } from "./icons";
import { H2 } from "./text";

const ModalContainer = Styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  align-items: center;
  justify-content: center;

  &.open {
    opacity: 1;
    display: flex;
    animation: fade-in var(--animation-duration);
  }

  &.closed {
    opacity: 0;
    display: none;
    animation: fade-out var(--animation-duration);
  }

  .modal-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: var(--backdrop-opacity);
    background: var(--body);
    z-index: 100;
  }

  .modal-body {
    position: relative;
    max-width: var(--modal-width);
    max-height: var(--modal-height);
    width: calc(100% - (var(--block-padding) * 2));
    margin: var(--block-padding);

    background: var(--bg-white);
    padding: var(--block-padding);
    border-radius: var(--border-radius);
    z-index: 101;
    
    &.open {
      animation: modal-fade-in var(--animation-duration);
    }

    &.closed {
      animation: modal-fade-out var(--animation-duration);
    }
  }
`;

const CloseButtonContainer = Styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
`;

const Modal: React.C<{
  open: boolean;
  on_close: () => void;
  title: string;
}> = ({ children, open, on_close, title }) => {
  return (
    <ModalContainer className={open ? "open" : "closed"}>
      <div className="modal-backdrop" onClick={on_close} />
      <section className={C("modal-body", open ? "open" : "closed")}>
        <H2>{title}</H2>
        <CloseButtonContainer>
          <InvisibleButton type="button" onClick={on_close}>
            <IconClose width="24" height="24" colour="var(--body)" />
          </InvisibleButton>
        </CloseButtonContainer>
        {children}
      </section>
    </ModalContainer>
  );
};

export default Modal;
