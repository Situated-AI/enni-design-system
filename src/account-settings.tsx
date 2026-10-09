"use client";
/**
 * Running a space (#289, S01–S09): the **Dialog**, the **Settings card**, **Rows**, and the
 * **Action menu**.
 *
 * - **Dialog** is a native modal `<dialog>`: the page behind is inert, so focus stays inside, and
 *   `Esc` closes it. Focus goes back to what opened it on close. On a phone it is a full-screen
 *   sheet. Back closing it is the caller's history (#116 F9), as for a sheet. It is never taller
 *   than the window: its body scrolls, and its footer — Cancel, then the commit — stays.
 * - **Settings card** is a group with a one-sentence *why* and a header action (*Add a passkey*,
 *   *Sign out everywhere else*). Its title is optional (enni-v2 #483): a card that is the whole of
 *   its page leaves it out, so the page's heading is not said again one line below itself.
 * - **Row** is what it is about — an `icon` from the one set, or a person's initial as `monogram` —
 *   then a title, a detail line, and whatever trails: an action, a select, a badge or a menu. Two
 *   letters never stand in for an icon (enni-v2 #483). `Rows` is their list.
 * - **Action menu** is the `···` button and its menu. Destructive items go last and say so in
 *   `danger`. `Esc` closes it and returns focus to the button.
 *
 * Every word is a prop (D-114).
 */
import { type KeyboardEvent, type ReactNode, useEffect, useId, useRef, useState } from "react";
import { Button } from "./button.tsx";
import { CloseButton } from "./close-button.tsx";
import { Icon, type IconName } from "./icon.tsx";
import { syncDialog, useHeld, useLinger } from "./disclosure.tsx";

type DialogProps = {
  readonly title: string;
  readonly lede?: ReactNode;
  readonly open: boolean;
  readonly onClose: () => void;
  /** The close button's name: *"Close"*. */
  readonly closeLabel: string;
  readonly children: ReactNode;
} & DialogFooter;

/**
 * A dialog that commits says so in its footer, and the footer always has the way back beside it
 * (enni-v2 #473): `commit` cannot be given without `cancelLabel`. The commit is the caller's
 * button — a form's submit names its form with `form=` — and Cancel is the dialog's `onClose`.
 */
type DialogFooter =
  | { readonly commit: ReactNode; readonly cancelLabel: string }
  | { readonly commit?: undefined; readonly cancelLabel?: undefined };

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

export function Dialog({ open, onClose, closeLabel, ...given }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const heading = useId();
  const shown = useLinger(open);
  const { title, lede, children, commit, cancelLabel } = useHeld(open, given);
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
      {/* enni-v2 #531: closed, it has no heading. One left in the page was read out of place, and
          with nothing to name it yet: "Remove ?". */}
      {shown ? (
        <header className="enni-dialog__header">
          <h2 id={heading}>{title}</h2>
          <CloseButton label={closeLabel} onClick={onClose} />
        </header>
      ) : null}
      {shown && lede !== undefined ? <div className="enni-dialog__lede">{lede}</div> : null}
      {shown ? <div className="enni-dialog__body">{children}</div> : null}
      {shown && commit !== undefined ? (
        <footer className="enni-dialog__footer">
          <Button onClick={onClose}>{cancelLabel}</Button>
          {commit}
        </footer>
      ) : null}
    </dialog>
  );
}

type CardProps = {
  /** Left out where the card is its page's only subject: the page's heading already says it. */
  readonly title?: string;
  readonly why?: ReactNode;
  readonly action?: ReactNode;
  readonly children: ReactNode;
};

export function SettingsCard({ title, why, action, children }: CardProps) {
  const heading = useId();
  const reason = why === undefined ? null : <p className="enni-settings-card__why">{why}</p>;
  return (
    <section
      className="enni-settings-card"
      aria-labelledby={title === undefined ? undefined : heading}
    >
      <header className="enni-settings-card__header">
        {title === undefined ? reason : <h2 id={heading}>{title}</h2>}
        {action}
      </header>
      {title === undefined ? null : reason}
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
  /** What the row is about, drawn from the one set. Wins over `monogram`. */
  readonly icon?: IconName;
  /** A person's or a place's initial — who, never a stand-in for an icon. */
  readonly monogram?: string;
  readonly title: ReactNode;
  readonly detail?: ReactNode;
  readonly trailing?: ReactNode;
  /** #308: what the row's action opened — a card, a confirmation — across the row's full width. */
  readonly below?: ReactNode;
};

/** The row's leading tile: an icon, else an initial, else nothing. */
function Leading({ icon, monogram }: Pick<RowProps, "icon" | "monogram">) {
  if (icon !== undefined)
    return (
      <span className="enni-row__icon" aria-hidden="true">
        <Icon name={icon} />
      </span>
    );
  if (monogram === undefined) return null;
  return (
    <span className="enni-row__monogram" aria-hidden="true">
      {monogram}
    </span>
  );
}

export function Row({ icon, monogram, title, detail, trailing, below }: RowProps) {
  return (
    <li className="enni-row">
      <Leading icon={icon} monogram={monogram} />
      <span className="enni-row__text">
        <span className="enni-row__title">{title}</span>
        {detail === undefined ? null : <span className="enni-row__detail">{detail}</span>}
      </span>
      {trailing === undefined ? null : <span className="enni-row__trailing">{trailing}</span>}
      {below === undefined ? null : <div className="enni-row__below">{below}</div>}
    </li>
  );
}

export type MenuItem = {
  readonly label: string;
  readonly onSelect: () => void;
  readonly danger?: boolean;
  /** The one of a set that is chosen now (enni-v2 #481): said as `aria-current`, drawn heavier. */
  readonly current?: boolean;
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
  /**
   * What the button shows, in place of `···` (enni-v2 #481): a menu opened from a name, as the
   * rail's space is. `label` is still the accessible name, so it should begin with what is shown.
   */
  readonly trigger?: ReactNode;
};

export function ActionMenu({ label, items, trigger }: MenuProps) {
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
        {trigger ?? "···"}
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
              aria-current={item.current === true ? "true" : undefined}
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
