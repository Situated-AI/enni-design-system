/**
 * The landing's controls, made the primitives' (enni-v2 #637, v0.6.1): its button (`.lp-btn`), its
 * chip, pill and tag (`.lp-chip`, `.lp-pill`, `.lp-tag`) and its fields (`.lp-fld`, `.lp-try__box`).
 * The same sizes, radii and states as the landing draws them, on the tokens: every colour is a
 * `var(--enni-…)`, so the light and the dark come from the theme.
 *
 * **A button** is 15px semibold on a 12px radius. The primary is the ink fill with the violet glow
 * beneath it and a sheen that crosses it under a hover; `ghost` is outlined in the strong line,
 * `glow` a surface whose edge turns in the accent. `sm` is the landing's small button. How each
 * moves (the spring under a hover and a press) is `motion-styles.ts`'; a disabled button is one
 * look whatever its variant (enni-v2 #480), and is never moved.
 *
 * **A field** is outlined in the strong line and rings in the accent's soft ground when focused; it
 * says what is wrong under itself, and a field that is right shows a tick inside it.
 */

const BUTTON = `
.enni-button { position: relative; isolation: isolate; display: inline-flex; align-items: center; justify-content: center; gap: var(--enni-space-2); min-height: var(--enni-space-control); padding: 0 20px; border-radius: var(--enni-radius-lg); border: 1px solid transparent; font: inherit; font-size: var(--enni-type-md); font-weight: 600; line-height: 1.2; letter-spacing: -0.01em; text-decoration: none; white-space: nowrap; cursor: pointer; }
.enni-button:focus-visible { outline: 2px solid var(--enni-focus); outline-offset: 3px; }
.enni-button > svg { flex: none; width: 16px; height: 16px; }
.enni-button--sm { padding: 0 14px; border-radius: calc(var(--enni-radius-base) - 2px); font-size: 0.875rem; }
.enni-button--lg { min-height: 48px; padding: 0 var(--enni-space-5); }
.enni-button--block { display: flex; width: 100%; }
.enni-button--secondary { background: var(--enni-surface); color: var(--enni-ink); border-color: var(--enni-line-strong); }
.enni-button--secondary:not([disabled]):hover { border-color: var(--enni-accent); }
.enni-button[disabled], .enni-talk[disabled], .enni-composer__send[disabled] { border-color: var(--enni-line); background: var(--enni-disabled); color: var(--enni-ink-subtle); cursor: not-allowed; }
.enni-button--primary { overflow: hidden; background: var(--enni-btn); color: var(--enni-btn-ink); box-shadow: var(--enni-shadow-rest), 0 8px 24px -10px var(--enni-glow); }
.enni-button--primary:not([disabled]):hover { background: var(--enni-btn-hover); box-shadow: var(--enni-shadow-rest), 0 14px 34px -10px var(--enni-glow); }
.enni-button--primary:not([disabled])::after { content: ""; position: absolute; inset: 0; z-index: -1; pointer-events: none; background: linear-gradient(110deg, transparent 30%, color-mix(in oklab, var(--enni-accent) 45%, transparent) 50%, transparent 70%); translate: -130% 0; }
.enni-button--primary:not([disabled]):hover::after { translate: 130% 0; }
.enni-button--ghost { background: transparent; color: var(--enni-ink); border-color: var(--enni-line-strong); }
.enni-button--ghost:not([disabled]):hover, .enni-button--quiet:not([disabled]):hover, .enni-chip:hover { background: var(--enni-hover); }
.enni-button--quiet { background: transparent; color: var(--enni-ink); border-color: var(--enni-line); }
.enni-button--glow { background: var(--enni-surface); background-image: linear-gradient(var(--enni-surface), var(--enni-surface)), conic-gradient(from var(--enni-angle), var(--enni-accent), transparent 30%, var(--enni-accent-hover), transparent 70%, var(--enni-accent)); background-origin: border-box; background-clip: padding-box, border-box; color: var(--enni-ink); animation: enni-orbit var(--enni-motion-orbit) linear infinite; }
.enni-button--danger { background: var(--enni-danger-fg); color: var(--enni-surface); }
.enni-button__arrow { display: inline-block; }
@property --enni-angle { syntax: "<angle>"; inherits: false; initial-value: 0deg; }
@keyframes enni-orbit { to { --enni-angle: 360deg; } }
`;

/**
 * A chip is a suggestion to take; a status badge the landing's verdict chip, a pill in its tone with
 * an optional live dot; a pill the hero's *New* line, glass with a badge; a tag a milestone's mono
 * word, on its tone's ground. Every tone is the `enni-tone--*` rule `StatusMark` reads.
 */
const CHIPS = `
.enni-chip { display: inline-flex; align-items: center; min-height: var(--enni-space-control); padding: 0 var(--enni-space-3); border-radius: var(--enni-radius-pill); border: 1px solid var(--enni-line); background: var(--enni-surface); color: var(--enni-ink-muted); font: inherit; font-size: var(--enni-type-sm); cursor: pointer; }
.enni-chip:hover { color: var(--enni-ink); }
.enni-badge { display: inline-flex; align-items: center; gap: var(--enni-space-2); padding: 5px 12px; border: 1px solid var(--enni-tone-edge); border-radius: var(--enni-radius-pill); background: var(--enni-tone-ground); color: var(--enni-tone-ink); font-size: 0.875rem; font-weight: 600; line-height: 1.3; white-space: nowrap; }
.enni-badge__dot { flex: none; width: 7px; height: 7px; border-radius: var(--enni-radius-pill); background: currentColor; animation: enni-ring var(--enni-motion-ring) var(--enni-ease-out) infinite; }
.enni-pill { justify-self: start; display: inline-flex; align-items: center; gap: 10px; padding: 6px 14px; border: 1px solid var(--enni-line); border-radius: var(--enni-radius-pill); background: var(--enni-glass); color: var(--enni-ink-muted); font-size: 0.875rem; text-decoration: none; }
.enni-pill:has(.enni-pill__badge) { padding-left: 6px; }
a.enni-pill:hover { border-color: var(--enni-accent); }
.enni-pill__badge { padding: 3px 9px; border-radius: var(--enni-radius-pill); background: var(--enni-accent-soft); color: var(--enni-accent); font-family: var(--enni-font-mono); font-size: 0.71875rem; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; }
.enni-tag { flex: none; display: inline-flex; align-items: center; padding: 3px 8px; border-radius: var(--enni-radius-sm); background: var(--enni-tone-ground); color: var(--enni-tone-ink); font-family: var(--enni-font-mono); font-size: 0.71875rem; font-weight: 500; letter-spacing: 0.06em; line-height: 1.4; text-transform: uppercase; white-space: nowrap; }
.enni-count { display: inline-flex; align-items: center; justify-content: center; min-width: 1.25rem; padding: 0 var(--enni-space-1); border-radius: var(--enni-radius-pill); background: var(--enni-accent-soft); color: var(--enni-accent); font-size: var(--enni-type-sm); font-weight: 600; font-variant-numeric: tabular-nums; }
@keyframes enni-ring { 0% { box-shadow: 0 0 0 0 color-mix(in oklab, currentColor 55%, transparent); } 80%, 100% { box-shadow: 0 0 0 7px transparent; } }
`;

const FIELDS = `
.enni-field { display: grid; gap: 6px; min-width: 0; }
.enni-field label { color: var(--enni-ink); font-size: 0.84375rem; font-weight: 600; }
.enni-field :is(input, textarea, select) { width: 100%; min-width: 0; min-height: 44px; padding: 12px 14px; border: 1px solid var(--enni-line-strong); border-radius: var(--enni-radius-lg); background: var(--enni-surface); color: var(--enni-ink); font: inherit; font-size: var(--enni-type-md); }
.enni-field textarea { min-height: 6rem; resize: vertical; field-sizing: content; }
.enni-field :is(input, textarea, select):focus { outline: none; border-color: var(--enni-accent); box-shadow: 0 0 0 4px var(--enni-accent-soft); }
.enni-field :is(input, textarea)::placeholder { color: var(--enni-ink-subtle); }
.enni-field__hint { color: var(--enni-ink-subtle); font-size: 0.8125rem; }
.enni-field__error { color: var(--enni-danger-fg); font-size: 0.8125rem; }
.enni-field[data-state="bad"] :is(input, textarea, select) { border-color: var(--enni-danger-fg); }
.enni-field[data-state="good"] :is(input, textarea, select) { border-color: var(--enni-ready-fg); }
.enni-field__in { position: relative; }
.enni-field__in > input { padding-right: 40px; }
.enni-field__tick { position: absolute; top: 50%; right: 12px; width: 18px; height: 18px; color: var(--enni-ready-fg); opacity: 0; scale: 0.5; translate: 0 -50%; pointer-events: none; }
.enni-field[data-state="good"] .enni-field__tick { opacity: 1; scale: 1; }
.enni-action-field { display: grid; gap: 10px; min-width: 0; }
.enni-action-field > label { color: var(--enni-ink); font-size: 0.90625rem; font-weight: 600; }
.enni-action-field__box { display: flex; flex-wrap: wrap; gap: var(--enni-space-2); padding: 6px; border: 1px solid var(--enni-line-strong); border-radius: var(--enni-radius-2xl); background: var(--enni-surface); box-shadow: var(--enni-shadow-card); }
.enni-action-field__box:focus-within { border-color: var(--enni-accent); box-shadow: 0 0 0 4px var(--enni-accent-soft), var(--enni-shadow-card); }
.enni-action-field[data-state="bad"] .enni-action-field__box { border-color: var(--enni-danger-fg); animation: enni-shake var(--enni-motion-spring) var(--enni-ease-standard); }
.enni-action-field__box input { flex: 1 1 240px; min-width: 0; min-height: 44px; padding: 10px 12px; border: 0; outline: none; background: transparent; color: var(--enni-ink); font: inherit; font-size: var(--enni-type-md); }
.enni-action-field--mono .enni-action-field__box input { font-family: var(--enni-font-mono); }
.enni-action-field__box input::placeholder { color: var(--enni-ink-subtle); }
.enni-action-field .enni-field__error { font-size: 0.875rem; }
@keyframes enni-shake { 0%, 100% { translate: 0; } 20% { translate: -6px; } 40% { translate: 5px; } 60% { translate: -3px; } 80% { translate: 2px; } }
`;

/** The buttons, the chips and the fields, in one string `PRIMITIVES_CSS` takes. */
export const CONTROL_CSS = [BUTTON, CHIPS, FIELDS].join("\n").trim();
