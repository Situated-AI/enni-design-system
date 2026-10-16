/**
 * Badges (#280): a status in a pill, a count beside a name, and the landing's pill and tag.
 *
 * A **status badge** is the answer's *! Needs care*: the glyph and the word in the tone's ink, on
 * its ground, inside its edge — the status triplet (#277). It shares `StatusMark`'s tones through
 * the same `enni-tone--*` class, so there is one tone map (`TONE_TOKENS`), and it is never colour
 * alone (D-115): the glyph is the shape, the word the text. Since 0.6.1 it is drawn as the landing's
 * verdict chip (`.lp-chip`, enni-v2 #637), a pill; with `dot` it leads with the landing's live dot,
 * which pulses where motion is allowed.
 *
 * A **count badge** is *Today 3* or *Payments · PAY 2*. The number is text; `label` is what a
 * screen reader hears instead when the number alone would not say what it counts.
 *
 * A **pill** is the landing's *New* line above the headline (`.lp-pill`): glass, with an optional
 * badge in the accent before the words; with `href` it is a link. A **tag** is a milestone's mono
 * word in capitals (`.lp-tag`): *Live*, *Next*, *Shipped*, on its tone's ground. The capitals are
 * CSS, so a screen reader hears the word as written.
 */
import type { ReactNode } from "react";
import type { Mark, Tone } from "./status.tsx";

type StatusBadgeProps = Omit<Mark, "moving" | "glyph"> & {
  /** The status glyph. Absent, the chip is the dot and the word only, as the landing draws it (0.6.2). */
  readonly glyph?: Mark["glyph"];
  /** The landing's live dot before the glyph (enni-v2 #637): decoration, hidden from a reader. */
  readonly dot?: boolean;
};

export function StatusBadge({ glyph, word, tone, dot }: StatusBadgeProps) {
  return (
    <span className={`enni-badge enni-tone--${tone}`}>
      {dot === true ? <span className="enni-badge__dot" aria-hidden="true" /> : null}
      {glyph === undefined ? null : (
        <span className="enni-badge__glyph" aria-hidden="true">
          {glyph}
        </span>
      )}
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

type PillProps = {
  /** The accent badge before the words: *New*. */
  readonly badge?: string;
  readonly href?: string;
  readonly children: ReactNode;
};

export function Pill({ badge, href, children }: PillProps) {
  const inner = (
    <>
      {badge === undefined ? null : <b className="enni-pill__badge">{badge}</b>}
      <span>{children}</span>
    </>
  );
  return href === undefined ? (
    <span className="enni-pill">{inner}</span>
  ) : (
    <a className="enni-pill" href={href}>
      {inner}
    </a>
  );
}

type TagProps = {
  /** Its ground and ink: `ready` (the landing's *Shipped*), `accent` (*Live*), `care` (*Next*). */
  readonly tone?: Tone;
  readonly children: ReactNode;
};

export function Tag({ tone = "ready", children }: TagProps) {
  return <span className={`enni-tag enni-tone--${tone}`}>{children}</span>;
}
