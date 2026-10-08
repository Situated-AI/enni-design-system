"use client";
/**
 * What is hidden until asked (#61): the Details disclosure and the sheet.
 *
 * **`Details`** is the answer's *Details* switch (§3.12) and the connected-apps sheet's *what each
 * key may do* (§8) — a native `<details>`, so it opens with a keyboard, announces its state and
 * needs no script. *"Nothing is hidden, just ordered."* Its summary carries a chevron that turns as
 * it opens (enni-v2 #483): bold text alone gave no sign that it opened. One that hides something
 * that cannot be undone takes `tone="danger"`, and reads so before it is opened.
 *
 * **`Sheet`** is everything that is not Conversation or Today (§2). A native `<dialog>` opened with
 * `showModal()`, which is what makes it behave: focus moves in and is trapped there, `Esc` closes
 * it, the page behind is inert, and focus returns to what opened it. The design's open question on
 * stacking and focus (#116 F9) starts from the platform's answer rather than a hand-rolled one.
 */
import { type ReactNode, useEffect, useId, useRef, useState } from "react";
import { CloseButton } from "./close-button.tsx";
import { Icon } from "./icon.tsx";
import { MOTION } from "./tokens.ts";

export function Details({
  summary,
  open,
  tone,
  children,
}: {
  summary: string;
  /** What it hides cannot be undone: the summary reads as destructive (enni-v2 #483). */
  tone?: "danger";
  /** Opened from outside — #300's switch. A person can still open or close each one. */
  open?: boolean;
  children: ReactNode;
}) {
  return (
    <details className="enni-details" data-tone={tone} open={open}>
      <summary>
        <Icon name="chevron" />
        {summary}
      </summary>
      {children}
    </details>
  );
}

type SheetProps = {
  readonly title: string;
  /** The close button's name: *"Close"* (enni-v2 #473: the word is the caller's, D-114). */
  readonly closeLabel: string;
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
    const timer = setTimeout(() => setKept(false), lingerMs(prefersStill(globalThis)));
    return () => clearTimeout(timer);
  }, [open]);
  return open || kept;
}

/** How long content outlives `open`: the exit, or nothing for a reader who switched motion off. */
export const lingerMs = (still: boolean): number => (still ? 0 : EXIT_MS);

type Asks = { readonly matchMedia?: (query: string) => { readonly matches: boolean } };

/** Whether this reader asked for no motion — `false` where nothing can be asked (a server). */
export const prefersStill = (page: Asks): boolean =>
  page.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

/**
 * What an overlay shows: what it is given while it is open, and what it last showed while it leaves
 * (enni-v2 #473). A caller says *closed* by clearing the state its title and content are drawn
 * from, so lingering alone kept nothing: the panel left with its close button and no content.
 */
export function heldWhile<T>(store: { current: T }, open: boolean, given: T): T {
  if (open) store.current = given;
  return store.current;
}

export const useHeld = <T,>(open: boolean, given: T): T => heldWhile(useRef(given), open, given);

export function Sheet({ open, onClose, closeLabel, ...given }: SheetProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const heading = useId();
  const shown = useLinger(open);
  const { title, children } = useHeld(open, given);
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
        <CloseButton label={closeLabel} onClick={onClose} />
      </header>
      {shown ? children : null}
    </dialog>
  );
}
