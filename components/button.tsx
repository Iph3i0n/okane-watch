import Styled from "styled-components";

export const InvisibleButton = Styled.button`
  padding: 0;
  margin: 0;
  border: none;
  background-color: transparent;
  cursor: pointer;

  svg {
    transition: opacity 100ms, transform 100ms;
  }

  &:hover svg {
    opacity: 0.4;
  }

  &:active svg {
    transform: scale(1.1);
  }

  &:focus svg {
    transform: scale(0.9);
  }
`;
