/**
 * The orb and the status mark (#111, F2) — status drawn in shape, word **and** colour.
 *
 * Neither primitive chooses what a status is called: the glyph and the word arrive as props, from
 * core's `ORB_MARKS` and `CONNECTOR_MARKS` (this package imports nothing of ours, D-114). What this
 * file owns is the rule that **every mark renders both**, whatever the caller passes — the glyph as
 * a shape a colourblind reader can see, the word as text a screen reader says. A mark with no word
 * is not a quieter mark; it is the F2 finding again.
 *
 * `Tone` names the same five meanings core's `TONES` does. They meet in the web app, where a
 * mismatch is a type error rather than a silent grey.
 */
import type { ReactNode } from "react";
import type { ColourToken } from "./tokens.ts";

export type Tone = "accent" | "ready" | "care" | "limited" | "danger";

type ToneTokens = { ink: ColourToken; ground: ColourToken; edge: ColourToken };

/** The tokens each tone draws in — its ink, its ground and its edge: the status triplet (#277). */
export const TONE_TOKENS: Readonly<Record<Tone, ToneTokens>> = {
  accent: { ink: "accent", ground: "accent-soft", edge: "accent" },
  ready: { ink: "ready-fg", ground: "ready-bg", edge: "ready-border" },
  care: { ink: "care-fg", ground: "care-bg", edge: "care-border" },
  limited: { ink: "limited-fg", ground: "limited-bg", edge: "limited-border" },
  danger: { ink: "danger-fg", ground: "danger-bg", edge: "danger-border" },
};

export type Mark = {
  readonly glyph: string;
  readonly word: string;
  readonly tone: Tone;
  readonly moving?: boolean;
};

/** A glyph and a word, inline — the connector's state on the status line. */
export function StatusMark({ glyph, word, tone }: Mark) {
  return (
    <span className={`enni-mark enni-tone--${tone}`}>
      <span className="enni-mark__glyph" aria-hidden="true">
        {glyph}
      </span>
      <span className="enni-mark__word">{word}</span>
    </span>
  );
}

/** `hero`: large and centred, the first run's. `inline`: small, beside a name or a status line. */
export type OrbSize = "hero" | "inline";

type OrbProps = Mark & {
  readonly size?: OrbSize;
  /** The mic is open (#69): the sphere pulses a ring rather than breathing. */
  readonly listening?: boolean;
  /**
   * #282: what the orb belongs to, above its mark — the header's *Enni · Meridian Payments*. Outside
   * the announced region, so a status change is heard without the name read again.
   */
  readonly label?: ReactNode;
};

/**
 * The orb (#279): a lit sphere in its tone's gradient, and beside it the glyph and the word. The
 * sphere is decoration — hidden from a screen reader and never the only carrier of the status
 * (D-115); the glyph is the shape and the word is the text. `moving` breathes the sphere while
 * sources settle; `listening` pulses a ring instead. Both are the caller's state, never a timer.
 * The mark is `role=status` so a change — *Reading your apps*, then *Needs care* — is announced as
 * it happens.
 */
export function Orb({
  glyph,
  word,
  tone,
  moving = false,
  size = "inline",
  listening = false,
  label,
}: OrbProps) {
  const mark = (
    <span className="enni-orb__mark" role="status">
      <span className="enni-orb__glyph" aria-hidden="true">
        {glyph}
      </span>
      <span className="enni-orb__word">{word}</span>
    </span>
  );
  return (
    <span
      className={`enni-orb enni-orb--${size} enni-tone--${tone}`}
      data-moving={moving}
      data-listening={listening}
    >
      <span className="enni-orb__sphere" aria-hidden="true" />
      {label === undefined ? (
        mark
      ) : (
        <span className="enni-orb__text">
          <span className="enni-orb__label">{label}</span>
          {mark}
        </span>
      )}
    </span>
  );
}
