"use client";

import React, { useState, KeyboardEvent } from "react";

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

/** Single expand/collapse row. Ported from the original .acc / .acc-head / .acc-body markup. */
export default function Accordion({ title, children, defaultOpen = false }: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`acc ${open ? "open" : ""}`}>
      <div
        className="acc-head"
        role="button"
        tabIndex={0}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((o) => !o);
          }
        }}
        aria-expanded={open}
      >
        <span className="t">{title}</span>
        <span className="plus" aria-hidden="true">
          +
        </span>
      </div>
      <div className="acc-body">{children}</div>
    </div>
  );
}
