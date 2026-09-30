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

/**
 * The orb: a disc carrying its glyph, pulsing when `moving`, with its word beside it. `role=status`
 * so a change — *Reading your apps*, then *Needs care* — is announced as it happens.
 */
export function Orb({ glyph, word, tone, moving = false }: Mark) {
  return (
    <span className={`enni-orb enni-tone--${tone}`} role="status" data-moving={moving}>
      <span className="enni-orb__disc" aria-hidden="true">
        {glyph}
      </span>
      <span className="enni-orb__word">{word}</span>
    </span>
  );
}
