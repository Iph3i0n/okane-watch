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

export const ThemeButton = Styled.button`
  margin: 0;
  border: none;
  padding: var(--text-padding-y) var(--text-padding-x);
  border-radius: var(--border-radius);
  background: var(--theme-dark);
  color: var(--bg-white);
  font-family: var(--font-family);
  font-size: var(--font-size-text);
  margin:  var(--text-padding-y) var(--text-padding-x);
  cursor: pointer;
  transition: background-color 100ms, opacity 100ms;

  &:hover {
    background-color: var(--theme-light);
  }

  &:active {
    opacity: 0.4;
  }

  &:focus {
    background-color: var(--theme-light);
  }
`;
