/**
 * Toggle (#306): one setting, on or off — a switch with its label and a muted hint, in a bordered row,
 * as 16 draws *Email me this every morning · Only on days something changed.*
 *
 * A real checkbox with \`role="switch"\`, so a screen reader says *switch, on* and Space flips it; the
 * label is the whole row, so the target is the row, not the knob. Every word is a prop (D-114).
 *
 * Since 0.6.1 it is the landing's switch (`.lp-tg`, enni-v2 #637): on is the accent, or with
 * `tone="ready"` the ready ink, as the landing's playground draws a condition that holds. `Toggles`
 * lays a few out as the landing does, as many across as fit.
 */
import { type ChangeEvent, type ReactNode, useId } from "react";

type ToggleProps = {
  readonly label: string;
  readonly hint?: string;
  readonly on: boolean;
  readonly disabled?: boolean;
  /** What on is drawn in: the accent, unless on means a condition holds (`ready`). */
  readonly tone?: "accent" | "ready";
  readonly onChange: (on: boolean) => void;
};

export function Toggle({ label, hint, on, disabled, tone, onChange }: ToggleProps) {
  const hintId = useId();
  return (
    <label className="enni-toggle" data-tone={tone === "ready" ? "ready" : undefined}>
      <span className="enni-toggle__text">
        <span className="enni-toggle__label">{label}</span>
        {hint === undefined ? null : (
          <span id={hintId} className="enni-toggle__hint">
            {hint}
          </span>
        )}
      </span>
      <input
        type="checkbox"
        role="switch"
        className="enni-toggle__switch"
        checked={on}
        aria-checked={on}
        aria-describedby={hint === undefined ? undefined : hintId}
        disabled={disabled}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.currentTarget.checked)}
      />
    </label>
  );
}

/** A few toggles, as many across as fit (the landing's `.lp-toggles`), named as a group. */
export function Toggles({
  label,
  children,
}: {
  readonly label: string;
  readonly children: ReactNode;
}) {
  return (
    <fieldset className="enni-toggles">
      <legend className="enni-visually-hidden">{label}</legend>
      {children}
    </fieldset>
  );
}
