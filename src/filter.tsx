/**
 * A filter of a few (#309): *All · 4 · PAY · 3 · OPS · 1* — one of them chosen, drawn as the
 * segmented control *Answer for* uses, and built as what it is: **a radio group**.
 *
 * Native radios in a named fieldset: arrow keys move between the options and choose as they go, a
 * screen reader hears *Project, radio group, PAY · 3, 2 of 3*, and the count is part of each name.
 * The label is the fieldset's legend, hidden — the design draws no word before the options.
 *
 * `look="chips"` draws the same group as separate pills (#307: *Claude Code · Cursor · Something
 * else*) — a choice that changes what follows, rather than a filter over one list.
 */
import { useId } from "react";

type FilterProps = {
  readonly label: string;
  readonly options: readonly { readonly value: string; readonly label: string }[];
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly look?: "segmented" | "chips";
};

export function Filter({ label, options, value, onChange, look = "segmented" }: FilterProps) {
  const name = useId();
  return (
    <fieldset className={`enni-segmented enni-filter enni-filter--${look}`}>
      <legend className="enni-visually-hidden">{label}</legend>
      <span className="enni-segmented__options">
        {options.map((option) => (
          <label key={option.value}>
            <input
              className="enni-visually-hidden"
              type="radio"
              name={name}
              value={option.value}
              checked={option.value === value}
              onChange={() => onChange(option.value)}
            />
            {option.label}
          </label>
        ))}
      </span>
    </fieldset>
  );
}
