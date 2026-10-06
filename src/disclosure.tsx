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
import { type ReactNode, useEffect, useId, useRef, useState } from "react";
import { Button } from "./button.tsx";
import { MOTION } from "./tokens.ts";

export function Details({
  summary,
  open,
  children,
}: {
  summary: string;
  /** Opened from outside — #300's switch. A person can still open or close each one. */
  open?: boolean;
  children: ReactNode;
}) {
  return (
    <details className="enni-details" open={open}>
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

/** How long a sheet or a dialog takes to leave: `MOTION.exit`, as a number a timer can take. */
export const EXIT_MS = Number.parseInt(MOTION.exit, 10);

/**
 * Whether a sheet's content should still be rendered: while it is open, and for as long as it takes
 * to leave afterwards (enni-v2 #428). Without this the content vanished the moment `open` flipped,
 * and the sheet faded out empty.
 */
export function useLinger(open: boolean): boolean {
  const [kept, setKept] = useState(open);
  useEffect(() => {
    if (open) {
      setKept(true);
      return;
    }
    const timer = setTimeout(() => setKept(false), EXIT_MS);
    return () => clearTimeout(timer);
  }, [open]);
  return open || kept;
}

export function Sheet({ title, open, onClose, children }: SheetProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const heading = useId();
  const shown = useLinger(open);
  useEffect(() => syncDialog(ref.current, open), [open]);
  return (
    <dialog
      ref={ref}
      className="enni-sheet"
      aria-labelledby={heading}
      // What the sheet was asked to be — so a screenshot can wait for `showModal` to catch up.
      data-open={open}
      onClose={onClose}
    >
      <header className="enni-sheet__header">
        <h2 id={heading}>{title}</h2>
        <Button onClick={onClose} aria-label={`Close ${title}`}>
          Close
        </Button>
      </header>
      {shown ? children : null}
    </dialog>
  );
}
