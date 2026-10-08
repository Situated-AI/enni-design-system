/**
 * The primitives' stylesheet (#61) — class rules over the tokens, and nothing but tokens.
 *
 * Plain CSS on custom properties rather than a utility framework: the surface is small, a class
 * per primitive reads as what it is, and nothing is compiled between this file and the page. A
 * colour here is always `var(--enni-…)`; `styles.test.ts` fails on a hex, so the palette stays in
 * `tokens.ts` and one theme switch reaches every primitive.
 *
 * **Focus is always visible** — a ring on `:focus-visible` for every control — and every target is
 * at least 44px tall, because the phone layout is half of the 54 screens.
 */

import { ACCOUNT_CSS } from "./account-styles.ts";
import { ANSWER_CSS } from "./answer-styles.ts";
import { BILLING_CSS } from "./billing-styles.ts";
import { GUIDED_CSS } from "./guided-styles.ts";
import { MOTION_CSS } from "./motion-styles.ts";
import { TONE_TOKENS } from "./status.tsx";

const BASE = `
*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; background: var(--enni-canvas); color: var(--enni-ink); font-family: var(--enni-font-sans); font-size: var(--enni-type-md); line-height: var(--enni-leading-md); }
a { color: inherit; }
:focus-visible { outline: 2px solid var(--enni-focus); outline-offset: 2px; }
.enni-visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
`;

/**
 * Enni's voice (#278, D-135). What Enni says is set in the serif, once, by the `.enni-voice` a turn
 * carries — no screen chooses a font for it. Controls inside a turn (a chip, a confirm, a field)
 * are the interface speaking, so they stay in the sans. The eyebrow is mono, spaced and in capitals;
 * the display is the landing's headline.
 */
const TYPOGRAPHY = `
.enni-voice { font-family: var(--enni-font-serif); font-size: var(--enni-type-lg); line-height: var(--enni-leading-lg); }
.enni-voice :is(button, input, textarea, select, summary, .enni-mark, .enni-orb) { font-family: var(--enni-font-sans); font-size: var(--enni-type-md); }
.enni-eyebrow { font-family: var(--enni-font-mono); font-size: var(--enni-type-sm); letter-spacing: var(--enni-tracking-eyebrow); text-transform: uppercase; color: var(--enni-ink-muted); }
.enni-display { font-size: var(--enni-type-display); line-height: var(--enni-leading-display); letter-spacing: var(--enni-tracking-display); font-weight: 600; }
code, kbd, samp { font-family: var(--enni-font-mono); }
`;

const BUTTON = `
.enni-button { display: inline-flex; align-items: center; justify-content: center; gap: var(--enni-space-2); min-height: 44px; padding: 0 var(--enni-space-4); border-radius: var(--enni-radius-lg); border: 1px solid transparent; font: inherit; font-weight: 600; text-decoration: none; cursor: pointer; transition: background var(--enni-motion-quick); }
.enni-button--lg { min-height: 48px; padding: 0 var(--enni-space-5); }
.enni-button--block { display: flex; width: 100%; }
.enni-button--secondary { background: var(--enni-surface); color: var(--enni-ink); border-color: var(--enni-line); }
.enni-button--secondary:not([disabled]):hover { background: var(--enni-hover); }
.enni-button[disabled] { cursor: not-allowed; opacity: 0.6; }
.enni-button--primary { background: var(--enni-accent); color: var(--enni-accent-ink); }
.enni-button--primary:not([disabled]):hover { background: var(--enni-accent-hover); }
.enni-button--quiet:not([disabled]):hover, .enni-chip:hover { background: var(--enni-hover); }
.enni-button--quiet { background: transparent; color: var(--enni-ink); border-color: var(--enni-line); }
.enni-button--danger { background: var(--enni-danger-fg); color: var(--enni-surface); }
.enni-chip { display: inline-flex; align-items: center; min-height: 44px; padding: 0 var(--enni-space-3); border-radius: var(--enni-radius-pill); border: 1px solid var(--enni-line); background: var(--enni-surface); color: var(--enni-ink-muted); font: inherit; font-size: var(--enni-type-sm); cursor: pointer; }
.enni-chip:hover { color: var(--enni-ink); }
`;

const FORM = `
.enni-field { display: grid; gap: var(--enni-space-1); }
.enni-field label { font-weight: 600; }
.enni-field input, .enni-field textarea { min-height: 44px; padding: var(--enni-space-2) var(--enni-space-3); border: 1px solid var(--enni-line); border-radius: var(--enni-radius-md); background: var(--enni-surface); color: var(--enni-ink); font: inherit; }
.enni-field__hint { color: var(--enni-ink-muted); font-size: var(--enni-type-sm); }
.enni-field__error { color: var(--enni-danger-fg); font-size: var(--enni-type-sm); }
.enni-confirm { margin: 0; min-width: 0; display: grid; gap: var(--enni-space-3); padding: var(--enni-space-4); border: 1px solid var(--enni-line); border-radius: var(--enni-radius-lg); background: var(--enni-surface); }
.enni-confirm__actions { display: flex; flex-wrap: wrap; gap: var(--enni-space-2); }
`;

const DISCLOSURE = `
.enni-details { border-top: 1px solid var(--enni-line); padding-top: var(--enni-space-2); }
.enni-details > summary { min-height: 44px; display: flex; align-items: center; cursor: pointer; color: var(--enni-ink-muted); font-weight: 600; }
.enni-sheet { box-shadow: var(--enni-shadow-lift); width: min(100vw, var(--enni-measure-sheet)); max-width: 100vw; height: 100dvh; max-height: 100dvh; margin: 0 0 0 auto; padding: var(--enni-space-5); border: 0; border-left: 1px solid var(--enni-line); background: var(--enni-surface); color: var(--enni-ink); }
.enni-sheet::backdrop { background: color-mix(in srgb, var(--enni-ink) 35%, transparent); }
.enni-sheet__header { display: flex; align-items: center; justify-content: space-between; gap: var(--enni-space-3); margin-bottom: var(--enni-space-4); }
.enni-sheet__header h2 { margin: 0; font-size: var(--enni-type-xl); }
.enni-close { display: inline-flex; flex: none; align-items: center; justify-content: center; min-width: 44px; min-height: 44px; margin: calc(-1 * var(--enni-space-2)); padding: 0; border: 0; border-radius: var(--enni-radius-md); background: none; color: var(--enni-ink-muted); font: inherit; font-size: var(--enni-type-lg); line-height: 1; cursor: pointer; }
@media (max-width: 40rem) { .enni-sheet { width: 100vw; border-left: 0; } }
`;

/** One rule per tone, generated — a tone added to `TONE_TOKENS` is styled by the same commit. */
const TONES = Object.entries(TONE_TOKENS)
  .map(
    ([tone, { ink, ground, edge }]) =>
      `.enni-tone--${tone} { --enni-tone-ink: var(--enni-${ink}); --enni-tone-ground: var(--enni-${ground}); --enni-tone-edge: var(--enni-${edge}); --enni-tone-glow: var(--enni-orb-${tone}-glow); --enni-tone-deep: var(--enni-orb-${tone}-deep); }`,
  )
  .join("\n");

/**
 * The mark and the orb (#111, #279). The glyph is drawn in the tone's ink and the word sits beside it
 * in the ordinary ink — so the word stays readable whatever the hue. The orb's sphere is its tone's
 * gradient (`ORB` in `tokens.ts`), lit from 35% 30%: 88px as the hero (72px on a phone), 20px inline.
 */
const STATUS = `
.enni-mark, .enni-orb__mark { display: inline-flex; align-items: center; gap: var(--enni-space-1); }
.enni-mark__glyph, .enni-orb__glyph { color: var(--enni-tone-ink); font-weight: 700; }
.enni-orb { display: inline-flex; align-items: center; gap: var(--enni-space-2); }
.enni-orb__text { display: grid; min-width: 0; }
.enni-orb__label { font-weight: 600; }
.enni-orb--hero { flex-direction: column; gap: var(--enni-space-3); align-self: center; text-align: center; }
.enni-orb__sphere { display: inline-block; flex-shrink: 0; width: 20px; height: 20px; border-radius: var(--enni-radius-pill); background: radial-gradient(circle at 35% 30%, var(--enni-tone-glow) 0%, var(--enni-tone-ink) 55%, var(--enni-tone-deep) 100%); }
.enni-orb--hero .enni-orb__sphere { width: 88px; height: 88px; box-shadow: var(--enni-shadow-lift); }
@media (max-width: 40rem) { .enni-orb--hero .enni-orb__sphere { width: 72px; height: 72px; } }
.enni-orb[data-moving="true"]:not([data-listening="true"]) .enni-orb__sphere { animation: enni-breath var(--enni-motion-breath) var(--enni-ease-standard) infinite; }
.enni-orb[data-listening="true"] .enni-orb__sphere { animation: enni-listen var(--enni-motion-calm) var(--enni-ease-standard) infinite; }
`;

/**
 * Motion (#279) — each one because something happened: a sphere breathes while sources settle, rings
 * while the mic is open; a turn or a sheet arrives. Every duration is a `MOTION` token, and
 * `prefers-reduced-motion` zeroes them all in `TOKENS_CSS`, so a still reader gets the end state.
 */
/** #306: a setting, on or off — the row is the target; the switch is drawn, the checkbox is real. */
const TOGGLE = `
.enni-toggle { display: flex; align-items: center; justify-content: space-between; gap: var(--enni-space-3); min-height: 52px; padding: var(--enni-space-2) var(--enni-space-3); border: 1px solid var(--enni-line); border-radius: var(--enni-radius-lg); background: var(--enni-surface); cursor: pointer; }
.enni-toggle__text { display: grid; min-width: 0; }
.enni-toggle__label { color: var(--enni-ink); }
.enni-toggle__hint { color: var(--enni-ink-subtle); font-size: var(--enni-type-sm); }
.enni-toggle__switch { appearance: none; position: relative; flex-shrink: 0; width: 40px; height: 24px; margin: 0; border: 1px solid var(--enni-line-strong); border-radius: var(--enni-radius-pill); background: var(--enni-sunken); cursor: pointer; transition: background var(--enni-motion-quick); }
.enni-toggle__switch::after { content: ""; position: absolute; top: 2px; left: 2px; width: 18px; height: 18px; border-radius: var(--enni-radius-pill); background: var(--enni-surface); box-shadow: var(--enni-shadow-card); transition: transform var(--enni-motion-quick); }
.enni-toggle__switch:checked { border-color: var(--enni-accent); background: var(--enni-accent); }
.enni-toggle__switch:checked::after { transform: translateX(16px); }
`;

const KEYFRAMES = `
@keyframes enni-breath { 0%, 100% { transform: scale(1); opacity: 0.92; } 50% { transform: scale(1.04); opacity: 1; } }
@keyframes enni-listen { 0%, 100% { box-shadow: 0 0 0 4px color-mix(in oklch, var(--enni-tone-ink) 22%, transparent); } 50% { box-shadow: 0 0 0 10px color-mix(in oklch, var(--enni-tone-ink) 22%, transparent); } }
@keyframes enni-enter { from { opacity: 0; } to { opacity: 1; } }
@keyframes enni-sheet-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
.enni-enter { animation: enni-enter var(--enni-motion-enter) var(--enni-ease-standard) both; }
`;

/**
 * Surfaces, marks and badges (#280). A card is lifted by `shadow-card`; the brand tile's fills are
 * the accent and its ink; a status badge is the tone triplet (ground, edge, ink) from the same
 * `enni-tone--*` rule `StatusMark` reads; a count is the accent on its soft ground; a tally's
 * segment is its tone's ink, filled, or its outline alone when nothing stands behind it.
 */
const SURFACES = `
.enni-card { padding: var(--enni-space-4); border: 1px solid var(--enni-line); border-radius: var(--enni-radius-lg); background: var(--enni-surface); box-shadow: var(--enni-shadow-card); }
.enni-checklist { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: var(--enni-space-1); color: var(--enni-ink-subtle); font-size: var(--enni-type-sm); }
.enni-checklist li { display: flex; align-items: baseline; gap: var(--enni-space-2); }
.enni-checklist__mark { font-family: var(--enni-font-mono); }
.enni-brand { display: inline-flex; align-items: center; gap: var(--enni-space-2); color: var(--enni-ink); font-weight: 600; letter-spacing: var(--enni-tracking-display); text-decoration: none; }
a.enni-brand { min-height: 44px; }
.enni-brand__ground { fill: var(--enni-accent); }
.enni-brand__bar { fill: var(--enni-accent-ink); }
.enni-badge { display: inline-flex; align-items: center; gap: var(--enni-space-2); padding: var(--enni-space-1) var(--enni-space-3); border: 1px solid var(--enni-tone-edge); border-radius: var(--enni-radius-lg); background: var(--enni-tone-ground); color: var(--enni-tone-ink); font-size: var(--enni-type-sm); font-weight: 600; white-space: nowrap; }
.enni-tally { display: inline-flex; flex-wrap: wrap; align-items: center; gap: 3px; vertical-align: middle; }
.enni-tally__segment { display: inline-block; width: var(--enni-space-4); height: var(--enni-space-2); border: 1px solid var(--enni-tone-ink); border-radius: var(--enni-radius-sm); background: var(--enni-tone-ink); }
.enni-tally__segment[data-hollow="true"] { background: none; }
.enni-count { display: inline-flex; align-items: center; justify-content: center; min-width: 1.25rem; padding: 0 var(--enni-space-1); border-radius: var(--enni-radius-pill); background: var(--enni-accent-soft); color: var(--enni-accent); font-size: var(--enni-type-sm); font-weight: 600; }
`;

/**
 * The composer (#283): a rounded field on a surface, the round talk button beside it, **Send**, and
 * the hint under them — the desktop's keys, or the phone's. The talk button is outlined at rest at
 * every width and an accent ring while it listens; **Send** is the one solid control, so the
 * composer's main action is the same at a phone's width as at a desk's (enni-v2 #486).
 */
const COMPOSER = `
.enni-composer { position: sticky; bottom: 0; display: grid; gap: var(--enni-space-1); padding: var(--enni-space-3) 0 var(--enni-space-2); border-top: 1px solid var(--enni-line); background: var(--enni-canvas); }
.enni-composer__row { display: flex; align-items: flex-end; gap: var(--enni-space-2); }
.enni-composer textarea { flex: 1; min-width: 0; min-height: 44px; padding: var(--enni-space-2) var(--enni-space-3); border: 1px solid var(--enni-line); border-radius: var(--enni-radius-lg); background: var(--enni-surface); color: var(--enni-ink); font: inherit; line-height: var(--enni-leading-md); resize: none; field-sizing: content; max-height: 12rem; }
.enni-composer textarea::placeholder { color: var(--enni-ink-subtle); }
.enni-talk { display: inline-flex; flex-shrink: 0; align-items: center; justify-content: center; width: 44px; height: 44px; border: 1px solid var(--enni-line); border-radius: var(--enni-radius-pill); background: var(--enni-surface); color: var(--enni-ink-muted); font-size: 0; cursor: pointer; transition: background var(--enni-motion-quick); }
.enni-talk .enni-icon { width: 20px; height: 20px; }
.enni-talk:not([disabled]):hover { background: var(--enni-hover); }
.enni-talk[data-listening="true"] { border-color: var(--enni-accent); background: var(--enni-accent-soft); color: var(--enni-accent); animation: enni-listen var(--enni-motion-calm) var(--enni-ease-standard) infinite; --enni-tone-ink: var(--enni-accent); }
.enni-talk[disabled], .enni-composer__send[disabled] { cursor: not-allowed; opacity: 0.6; }
.enni-composer__send { flex-shrink: 0; min-height: 44px; padding: 0 var(--enni-space-4); border: 0; border-radius: var(--enni-radius-lg); background: var(--enni-accent); color: var(--enni-accent-ink); font: inherit; font-weight: 600; cursor: pointer; }
.enni-composer__send:not([disabled]):hover { background: var(--enni-accent-hover); }
.enni-composer__hint { margin: 0; color: var(--enni-ink-subtle); font-size: var(--enni-type-sm); }
.enni-composer__hint--narrow { display: none; }
@media (max-width: 40rem) {
  .enni-composer__hint--wide { display: none; }
  .enni-composer__hint--narrow { display: inline; }
}
`;

/**
 * The two voices (#284). The person: right, a rounded bubble with its tail corner small, in the sans,
 * at most 80% wide. Enni: left, no bubble, the serif a size up; its sentences keep a reading measure
 * (54ch) while its cards run the column's full width. Chips wrap; the hint is small and subtle.
 */
const TURNS = `
.enni-say--person { width: fit-content; max-width: 80%; margin-left: auto; padding: var(--enni-space-2) var(--enni-space-4); border-radius: var(--enni-radius-2xl) var(--enni-radius-2xl) var(--enni-radius-sm) var(--enni-radius-2xl); background: var(--enni-accent-soft); color: var(--enni-ink); overflow-wrap: anywhere; }
.enni-say--person > * { margin: 0; }
.enni-say--enni { display: grid; gap: var(--enni-space-3); color: var(--enni-ink-muted); }
.enni-say--enni > p, .enni-say--enni > ul, .enni-say--enni > ol { max-width: 54ch; margin: 0; }
.enni-say--enni article, .enni-say--enni .enni-card { color: var(--enni-ink); }
.enni-chip-row { display: flex; flex-wrap: wrap; gap: var(--enni-space-2); margin: 0; padding: 0; list-style: none; }
.enni-help { display: grid; grid-template-columns: 1fr 1fr; gap: var(--enni-space-3); margin: 0; list-style: none; font-family: var(--enni-font-sans); font-size: var(--enni-type-sm); line-height: var(--enni-leading-sm); }
.enni-help li { display: flex; gap: var(--enni-space-3); }
.enni-help strong { color: var(--enni-ink); font-weight: 600; }
.enni-help__text { color: var(--enni-ink-muted); }
.enni-help__glyph { display: inline-flex; flex-shrink: 0; align-items: center; justify-content: center; width: 24px; height: 24px; border: 1px solid var(--enni-line); border-radius: var(--enni-radius-md); background: var(--enni-sunken); color: var(--enni-ink-muted); font-family: var(--enni-font-mono); font-size: var(--enni-type-sm); }
@media (max-width: 40rem) { .enni-help { grid-template-columns: 1fr; } }
.enni-hint { margin: 0; color: var(--enni-ink-subtle); font-family: var(--enni-font-sans); font-size: var(--enni-type-sm); }
`;

/** Every rule the primitives need, in one string for the root layout to put on the page. */
export const PRIMITIVES_CSS = [
  BASE,
  TYPOGRAPHY,
  BUTTON,
  FORM,
  DISCLOSURE,
  TONES,
  STATUS,
  SURFACES,
  COMPOSER,
  TURNS,
  ANSWER_CSS,
  ACCOUNT_CSS,
  GUIDED_CSS,
  BILLING_CSS,
  TOGGLE,
  KEYFRAMES,
  MOTION_CSS,
]
  .join("\n")
  .trim();
