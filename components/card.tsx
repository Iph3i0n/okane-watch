import Styled from "styled-components";

export const Card = Styled.div`
  opacity: 1;
  background: var(--bg-surface);
  border-radius: var(--border-radius);
  padding: var(--block-padding);

  animation: card-fade-in 500ms;

  .loading & {
    opacity: 0;
    animation: card-fade-out 500ms;
  }
`;
