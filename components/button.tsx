import Styled from "styled-components";

export const InvisibleButton = Styled.button`
  padding: 0;
  margin: 0;
  border: none;
  background-color: transparent;
  cursor: pointer;

  svg {
    transition: opacity var(--animation-duration), transform var(--animation-duration);
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
  color: var(--white);
  font-family: var(--font-family);
  font-size: var(--font-size-text);
  cursor: pointer;
  transition: background-color var(--animation-duration), opacity var(--animation-duration);

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

export const VariantButton = Styled.button`
  margin: 0;
  border: none;
  padding: var(--text-padding-y) var(--text-padding-x);
  border-radius: var(--border-radius);
  background: var(--variant-dark);
  color: var(--white);
  font-family: var(--font-family);
  font-size: var(--font-size-text);
  cursor: pointer;
  transition: background-color var(--animation-duration), opacity var(--animation-duration);

  &:hover {
    background-color: var(--variant-light);
  }

  &:active {
    opacity: 0.4;
  }

  &:focus {
    background-color: var(--theme-light);
  }
`;
