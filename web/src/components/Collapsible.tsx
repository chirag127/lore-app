import { useState, type ReactNode } from 'react';

type Props = {
  summary: ReactNode;
  children?: ReactNode;
  defaultOpen?: boolean;
};

export default function Collapsible({ summary, children, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <details
      open={open}
      onClick={(e) => {
        e.preventDefault();
        setOpen((v) => !v);
      }}
      className="ba-collapsible"
    >
      <summary>{summary}</summary>
      {open ? <div className="ba-collapsible-body">{children}</div> : null}
    </details>
  );
}
