"use client";
/**
 * What is hidden until asked (#61): the Details disclosure and the sheet.
 *
 * **`Details`** is the answer's *Details* switch (§3.12) and the connected-apps sheet's *what each
 * key may do* (§8) — a native `<details>`, so it opens with a keyboard, announces its state and
 * needs no script. *"Nothing is hidden, just ordered."*
 *
 * **`Sheet`** is everything that is not Conversation or Today (§2). A native `<dialog>` opened with
 * `showModal()`, which is what makes it behave: focus moves in and is trapped there, `Esc` closes
 * it, the page behind is inert, and focus returns to what opened it. The design's open question on
 * stacking and focus (#116 F9) starts from the platform's answer rather than a hand-rolled one.
 */
import { type ReactNode, useEffect, useId, useRef } from "react";
import { Button } from "./button.tsx";

export function Details({ summary, children }: { summary: string; children: ReactNode }) {
  return (
    <details className="enni-details">
      <summary>{summary}</summary>
      {children}
    </details>
  );
}

type SheetProps = {
  readonly title: string;
  readonly open: boolean;
  /** Called on every way out — the close button, `Esc`, or the backdrop's own cancel. */
  readonly onClose: () => void;
  readonly children: ReactNode;
};

/** What the sheet's dialog does when `open` changes: show it modally, or close it. */
export function syncDialog(
  dialog: Pick<HTMLDialogElement, "open" | "showModal" | "close"> | null,
  open: boolean,
): void {
  if (dialog === null) return;
  if (open && !dialog.open) dialog.showModal();
  if (!open && dialog.open) dialog.close();
}

export function Sheet({ title, open, onClose, children }: SheetProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const heading = useId();
  useEffect(() => syncDialog(ref.current, open), [open]);
  return (
    <dialog ref={ref} className="enni-sheet" aria-labelledby={heading} onClose={onClose}>
      <header className="enni-sheet__header">
        <h2 id={heading}>{title}</h2>
        <Button onClick={onClose} aria-label={`Close ${title}`}>
          Close
        </Button>
      </header>
      {open ? children : null}
    </dialog>
  );
}
