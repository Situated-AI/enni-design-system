/**
 * Toggle (#306): one setting, on or off — a switch with its label and a muted hint, in a bordered row,
 * as 16 draws *Email me this every morning · Only on days something changed.*
 *
 * A real checkbox with \`role="switch"\`, so a screen reader says *switch, on* and Space flips it; the
 * label is the whole row, so the target is the row, not the knob. Every word is a prop (D-114).
 */
import { type ChangeEvent, useId } from "react";

type ToggleProps = {
  readonly label: string;
  readonly hint?: string;
  readonly on: boolean;
  readonly disabled?: boolean;
  readonly onChange: (on: boolean) => void;
};

export function Toggle({ label, hint, on, disabled, onChange }: ToggleProps) {
  const hintId = useId();
  return (
    <label className="enni-toggle">
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
