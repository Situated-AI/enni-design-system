"use client";
/**
 * Running a space (#289, S01–S09): the **Dialog**, the **Settings card**, **Rows**, and the
 * **Action menu**.
 *
 * - **Dialog** is a native modal `<dialog>`: the page behind is inert, so focus stays inside, and
 *   `Esc` closes it. Focus goes back to what opened it on close. On a phone it is a full-screen
 *   sheet. Back closing it is the caller's history (#116 F9), as for a sheet.
 * - **Settings card** is a titled group with a one-sentence *why* and a header action (*Add a
 *   passkey*, *Sign out everywhere else*).
 * - **Row** is a monogram (`PK`, initials), a title, a detail line, and whatever trails: an action,
 *   a select, a badge or a menu. `Rows` is their list.
 * - **Action menu** is the `···` button and its menu. Destructive items go last and say so in
 *   `danger`. `Esc` closes it and returns focus to the button.
 *
 * Every word is a prop (D-114).
 */
import { type KeyboardEvent, type ReactNode, useEffect, useId, useRef, useState } from "react";
import { Button } from "./button.tsx";
import { syncDialog } from "./disclosure.tsx";

type DialogProps = {
  readonly title: string;
  readonly lede?: ReactNode;
  readonly open: boolean;
  readonly onClose: () => void;
  /** The close button's name: *"Close"*. */
  readonly closeLabel: string;
  readonly children: ReactNode;
};

/** Where focus was when the dialog opened, so closing gives it back. */
function useReturnFocus(open: boolean): void {
  const opener = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (open) {
      opener.current = document.activeElement as HTMLElement | null;
      return;
    }
    opener.current?.focus();
    opener.current = null;
  }, [open]);
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

/** Tab past the last control comes back to the first, and Shift-Tab the other way: focus stays in. */
export function wrapTab(event: KeyboardEvent<HTMLElement>): void {
  if (event.key !== "Tab") return;
  const all = [...event.currentTarget.querySelectorAll<HTMLElement>(FOCUSABLE)];
  const first = all[0];
  const last = all[all.length - 1];
  const at = document.activeElement;
  if (event.shiftKey && at === first) last?.focus();
  else if (!event.shiftKey && at === last) first?.focus();
  else return;
  event.preventDefault();
}

export function Dialog({ title, lede, open, onClose, closeLabel, children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const heading = useId();
  useReturnFocus(open);
  useEffect(() => syncDialog(ref.current, open), [open]);
  return (
    <dialog
      ref={ref}
      className="enni-dialog"
      aria-labelledby={heading}
      // What the dialog was asked to be — so a screenshot can wait for `showModal` to catch up.
      data-open={open}
      onClose={onClose}
      onKeyDown={wrapTab}
    >
      <header className="enni-dialog__header">
        <h2 id={heading}>{title}</h2>
        <button
          type="button"
          className="enni-dialog__close"
          aria-label={closeLabel}
          onClick={onClose}
        >
          ×
        </button>
      </header>
      {lede === undefined ? null : <div className="enni-dialog__lede">{lede}</div>}
      {open ? <div className="enni-dialog__body">{children}</div> : null}
    </dialog>
  );
}

type CardProps = {
  readonly title: string;
  readonly why?: ReactNode;
  readonly action?: ReactNode;
  readonly children: ReactNode;
};

export function SettingsCard({ title, why, action, children }: CardProps) {
  const heading = useId();
  return (
    <section className="enni-settings-card" aria-labelledby={heading}>
      <header className="enni-settings-card__header">
        <h2 id={heading}>{title}</h2>
        {action}
      </header>
      {why === undefined ? null : <p className="enni-settings-card__why">{why}</p>}
      {children}
    </section>
  );
}

export function Rows({
  label,
  children,
}: {
  readonly label?: string;
  readonly children: ReactNode;
}) {
  return (
    <ul className="enni-rows" aria-label={label}>
      {children}
    </ul>
  );
}

type RowProps = {
  readonly monogram?: string;
  readonly title: ReactNode;
  readonly detail?: ReactNode;
  readonly trailing?: ReactNode;
};

export function Row({ monogram, title, detail, trailing }: RowProps) {
  return (
    <li className="enni-row">
      {monogram === undefined ? null : (
        <span className="enni-row__monogram" aria-hidden="true">
          {monogram}
        </span>
      )}
      <span className="enni-row__text">
        <span className="enni-row__title">{title}</span>
        {detail === undefined ? null : <span className="enni-row__detail">{detail}</span>}
      </span>
      {trailing === undefined ? null : <span className="enni-row__trailing">{trailing}</span>}
    </li>
  );
}

export type MenuItem = {
  readonly label: string;
  readonly onSelect: () => void;
  readonly danger?: boolean;
};

/** Destructive items last, the rest in the order given — so the reflexive pick is the harmless one. */
export function orderMenu(items: readonly MenuItem[]): MenuItem[] {
  return [...items.filter((i) => !i.danger), ...items.filter((i) => i.danger)];
}

/** Arrow keys move between items; `Esc` closes and returns to the button. */
function onMenuKey(event: KeyboardEvent<HTMLDivElement>, close: () => void): void {
  const items = [...event.currentTarget.querySelectorAll<HTMLButtonElement>("[role=menuitem]")];
  const at = items.indexOf(document.activeElement as HTMLButtonElement);
  if (event.key === "Escape") close();
  else if (event.key === "ArrowDown") items[(at + 1) % items.length]?.focus();
  else if (event.key === "ArrowUp") items[(at - 1 + items.length) % items.length]?.focus();
  else return;
  event.preventDefault();
}

type MenuProps = {
  /** The button's name: *"Actions for Sam Reyes"*. */
  readonly label: string;
  readonly items: readonly MenuItem[];
};

export function ActionMenu({ label, items }: MenuProps) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const menu = useId();
  const close = () => {
    setOpen(false);
    button.current?.focus();
  };
  useEffect(() => {
    if (open) document.querySelector<HTMLButtonElement>(`[id="${menu}"] [role=menuitem]`)?.focus();
  }, [open, menu]);
  return (
    <span className="enni-action-menu">
      <Button
        ref={button}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menu}
        onClick={() => setOpen((o) => !o)}
      >
        ···
      </Button>
      {open ? (
        <div
          id={menu}
          role="menu"
          aria-label={label}
          className="enni-action-menu__list"
          onKeyDown={(e) => onMenuKey(e, close)}
        >
          {orderMenu(items).map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              data-danger={item.danger === true}
              onClick={() => {
                close();
                item.onSelect();
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </span>
  );
}
