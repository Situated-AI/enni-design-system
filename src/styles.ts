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

const BASE = `
*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; background: var(--enni-canvas); color: var(--enni-ink); font-family: var(--enni-font-sans); font-size: var(--enni-type-md); line-height: 1.5; }
:focus-visible { outline: 2px solid var(--enni-focus); outline-offset: 2px; }
.enni-visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
`;

const BUTTON = `
.enni-button { display: inline-flex; align-items: center; justify-content: center; gap: var(--enni-space-2); min-height: 44px; padding: 0 var(--enni-space-4); border-radius: var(--enni-radius-md); border: 1px solid transparent; font: inherit; font-weight: 600; cursor: pointer; transition: background var(--enni-motion-quick); }
.enni-button[disabled] { cursor: not-allowed; opacity: 0.6; }
.enni-button--primary { background: var(--enni-accent); color: var(--enni-accent-ink); }
.enni-button--quiet { background: transparent; color: var(--enni-ink); border-color: var(--enni-line); }
.enni-button--danger { background: var(--enni-danger); color: var(--enni-surface); }
.enni-chip { display: inline-flex; align-items: center; min-height: 44px; padding: 0 var(--enni-space-4); border-radius: var(--enni-radius-pill); border: 1px solid var(--enni-line); background: var(--enni-surface); color: var(--enni-ink); font: inherit; cursor: pointer; }
`;

const FORM = `
.enni-field { display: grid; gap: var(--enni-space-1); }
.enni-field label { font-weight: 600; }
.enni-field input, .enni-field textarea { min-height: 44px; padding: var(--enni-space-2) var(--enni-space-3); border: 1px solid var(--enni-line); border-radius: var(--enni-radius-md); background: var(--enni-surface); color: var(--enni-ink); font: inherit; }
.enni-field__hint { color: var(--enni-ink-muted); font-size: var(--enni-type-sm); }
.enni-field__error { color: var(--enni-danger); font-size: var(--enni-type-sm); }
.enni-confirm { margin: 0; min-width: 0; display: grid; gap: var(--enni-space-3); padding: var(--enni-space-4); border: 1px solid var(--enni-line); border-radius: var(--enni-radius-lg); background: var(--enni-surface); }
.enni-confirm__actions { display: flex; flex-wrap: wrap; gap: var(--enni-space-2); }
`;

const DISCLOSURE = `
.enni-details { border-top: 1px solid var(--enni-line); padding-top: var(--enni-space-2); }
.enni-details > summary { min-height: 44px; display: flex; align-items: center; cursor: pointer; color: var(--enni-ink-muted); font-weight: 600; }
.enni-sheet { width: min(100vw, var(--enni-measure-sheet)); max-width: 100vw; height: 100dvh; max-height: 100dvh; margin: 0 0 0 auto; padding: var(--enni-space-5); border: 0; border-left: 1px solid var(--enni-line); background: var(--enni-surface); color: var(--enni-ink); }
.enni-sheet::backdrop { background: color-mix(in srgb, var(--enni-ink) 35%, transparent); }
.enni-sheet__header { display: flex; align-items: center; justify-content: space-between; gap: var(--enni-space-3); margin-bottom: var(--enni-space-4); }
.enni-sheet__header h2 { margin: 0; font-size: var(--enni-type-xl); }
@media (max-width: 40rem) { .enni-sheet { width: 100vw; border-left: 0; } }
`;

/** Every rule the primitives need, in one string for the root layout to put on the page. */
export const PRIMITIVES_CSS = [BASE, BUTTON, FORM, DISCLOSURE].join("\n").trim();
