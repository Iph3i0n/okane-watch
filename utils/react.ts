import React from "react";

export function UseRefEffect<TRef>(proc: (value: TRef) => void) {
  const subject = React.createRef<TRef>();
  React.useEffect(() => {
    const current = subject.current;
    if (!current) return;
    proc(current);
  }, [subject.current]);

  return subject;
}
