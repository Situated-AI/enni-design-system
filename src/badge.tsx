/**
 * Badges (#280): a status in a pill, and a count beside a name.
 *
 * A **status badge** is the answer's *! Needs care*: the glyph and the word in the tone's ink, on
 * its ground, inside its edge — the status triplet (#277). It shares `StatusMark`'s tones through
 * the same `enni-tone--*` class, so there is one tone map (`TONE_TOKENS`), and it is never colour
 * alone (D-115): the glyph is the shape, the word the text.
 *
 * A **count badge** is *Today 3* or *Payments · PAY 2*. The number is text; `label` is what a
 * screen reader hears instead when the number alone would not say what it counts.
 */
import type { Mark } from "./status.tsx";

export function StatusBadge({ glyph, word, tone }: Omit<Mark, "moving">) {
  return (
    <span className={`enni-badge enni-tone--${tone}`}>
      <span className="enni-badge__glyph" aria-hidden="true">
        {glyph}
      </span>
      <span>{word}</span>
    </span>
  );
}

type CountProps = {
  readonly count: number | string;
  readonly label?: string;
};

export function CountBadge({ count, label }: CountProps) {
  if (label === undefined) return <span className="enni-count">{count}</span>;
  return (
    <span className="enni-count">
      <span aria-hidden="true">{count}</span>
      <span className="enni-visually-hidden">{label}</span>
    </span>
  );
}
