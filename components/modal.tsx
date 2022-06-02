import React from "react";
import Styled from "styled-components";

const ModalBackdrop = Styled.div`
  display: none;
  opacity: 0;
  
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  background: var(--body);
  z-index: 100;

  @keyframes fade-in {
    0% {
      display: none;
      opacity: 0;
    }

    1% {
      display: block;
      opacity: 0;
    }

    100% {
      opacity: var(--backdrop-opacity);
    }
  }

  @keyframes fade-out {
    0% {
      display: block;
      opacity: var(--backdrop-opacity);
    }

    99% {
      display: block;
      opacity: 0;
    }

    100% {
      display: none;
      opacity: 0;
    }
  }

  &.open {
    display: block;
    opacity: var(--backdrop-opacity);
    animation-duration: var(--animation-duration);
    animation-name: fade-in;
  }

  &.closed {
    opacity: 0;
    display: none;
    animation-duration: var(--animation-duration);
    animation-name: fade-out;
  }
`;

const Modal: React.C<{ open: boolean }> = ({ children, open }) => {
  return (
    <ModalBackdrop className={open ? "open" : "closed"}>
      {children}
    </ModalBackdrop>
  );
};

export default Modal;
