/**
 * The two voices of the conversation (#284): the person's words and Enni's.
 *
 * **The person** is right-aligned in a rounded bubble, in the sans, at most ~80% of the column.
 * **Enni** is left-aligned, with no bubble, in the serif (`.enni-voice`, #278) a size up from the
 * interface, and it reads like someone writing. Cards (an answer, a guide, help) sit full width inside
 * Enni's turn and arrive with `enter` (#279).
 *
 * **A screen reader hears who said each turn.** `speaker` — *You said*, *Enni said* — is read before
 * the words and hidden from sight. It is a prop, because this package carries no product words.
 *
 * A **chip row** is the suggestions under Enni's turn: each a `SuggestionChip` that says its label
 * through `onSay`, the same path as typing it; the row wraps on a phone. A **hint** is the small line
 * under the chips.
 */
import type { ReactNode } from "react";
import { SuggestionChip } from "./button.tsx";

type TurnProps = {
  readonly who: "person" | "enni";
  /** Read before the words, hidden from sight: *You said*, *Enni said*. */
  readonly speaker: string;
  readonly children: ReactNode;
};

export function Turn({ who, speaker, children }: TurnProps) {
  return (
    <div className={`enni-say enni-say--${who}${who === "enni" ? " enni-voice enni-enter" : ""}`}>
      <span className="enni-visually-hidden">{speaker}: </span>
      {children}
    </div>
  );
}

type ChipRowProps = {
  readonly chips: readonly string[];
  readonly onSay: (sentence: string) => void;
  /** The row's name for a screen reader: *Suggestions*. */
  readonly label: string;
  readonly disabled?: boolean;
};

export function ChipRow({ chips, onSay, label, disabled }: ChipRowProps) {
  if (chips.length === 0) return null;
  return (
    <ul className="enni-chip-row" aria-label={label}>
      {chips.map((chip) => (
        <li key={chip}>
          <SuggestionChip label={chip} onSay={onSay} disabled={disabled} />
        </li>
      ))}
    </ul>
  );
}

export function Hint({ children }: { readonly children: ReactNode }) {
  return <p className="enni-hint">{children}</p>;
}
