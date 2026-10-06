/**
 * How the primitives answer a pointer, a press and a change of state (enni-v2 #428).
 *
 * Before this, four rules in the whole stylesheet had a transition and most controls did not answer
 * a hover at all. The rules here are added last, so they extend the primitives without restating
 * them:
 *
 * - **Every control eases** between its states, on `motion-quick`, and gives a little under a press.
 * - **A sheet and a dialog leave as they arrived.** They had an entrance and no exit; one now slides
 *   and fades in over `motion-enter` and out over `motion-exit`, with its backdrop (`allow-discrete`
 *   keeps it painted until it has left).
 * - **A disclosure opens over its own height** where the browser can interpolate to `auto`, and
 *   snaps open where it cannot.
 * - **A skeleton** stands in for what is still being fetched, so nothing arrives as a layout jump.
 * - **`enni-stagger`** lets a short list arrive one item after another.
 *
 * Every duration is a `MOTION` token, so `prefers-reduced-motion` stills all of it in `TOKENS_CSS`.
 */

const EASED = [
  ".enni-button",
  ".enni-chip",
  ".enni-talk",
  ".enni-composer__send",
  ".enni-choice",
  ".enni-pack",
  ".enni-segmented button",
  ".enni-action-menu__list button",
  ".enni-dialog__close",
  ".enni-toggle",
  ".enni-new-tab",
  ".enni-card--interactive",
  ".enni-details > summary",
  ".enni-sources > summary",
  ".enni-guided__footer summary",
].join(", ");

const PROPERTIES = ["background", "border-color", "color", "box-shadow", "transform"]
  .map((property) => `${property} var(--enni-motion-quick) var(--enni-ease-standard)`)
  .join(", ");

const STATES = `
${EASED} { transition: ${PROPERTIES}; }
.enni-button:not([disabled]):active, .enni-chip:active, .enni-talk:not([disabled]):active, .enni-composer__send:not([disabled]):active { transform: scale(0.97); }
.enni-chip:hover, .enni-toggle:hover, .enni-choice:hover, .enni-pack:hover { border-color: var(--enni-line-strong); }
.enni-composer__send:not([disabled]):hover, .enni-dialog__close:hover { background: var(--enni-hover); }
.enni-segmented button:hover, .enni-details > summary:hover, .enni-sources > summary:hover, .enni-guided__footer summary:hover { color: var(--enni-ink); }
.enni-card--interactive { cursor: pointer; }
.enni-card--interactive:hover { border-color: var(--enni-line-strong); box-shadow: var(--enni-shadow-lift); transform: translateY(-1px); }
.enni-card--interactive:active { transform: none; box-shadow: var(--enni-shadow-card); }
.enni-field input, .enni-field textarea, .enni-composer textarea { transition: border-color var(--enni-motion-quick) var(--enni-ease-standard), box-shadow var(--enni-motion-quick) var(--enni-ease-standard); }
.enni-field input:hover, .enni-field textarea:hover, .enni-composer textarea:hover { border-color: var(--enni-line-strong); }
.enni-field input:focus, .enni-field textarea:focus, .enni-composer textarea:focus { border-color: var(--enni-accent); }
`;

const moves = (duration: string, ease: string): string =>
  [
    `opacity var(--enni-motion-${duration}) var(--enni-ease-${ease})`,
    `transform var(--enni-motion-${duration}) var(--enni-ease-${ease})`,
    `overlay var(--enni-motion-${duration}) allow-discrete`,
    `display var(--enni-motion-${duration}) allow-discrete`,
  ].join(", ");

/**
 * A sheet and a dialog, arriving and leaving. Both are transitions rather than a keyframe: a
 * transition does not start from a value a filled animation was holding, so the old `enni-sheet-in`
 * entrance made every exit a jump. The closed rule carries the exit's timing and the open rule the
 * entrance's, because a transition takes its timing from the state it is going to.
 */
const LEAVING = `
.enni-sheet, .enni-dialog { opacity: 0; transition: ${moves("exit", "standard")}; }
.enni-sheet { transform: translateX(var(--enni-space-4)); }
.enni-dialog { transform: translateY(var(--enni-space-2)); }
.enni-sheet[open], .enni-dialog[open] { opacity: 1; transform: none; transition: ${moves("enter", "out")}; }
.enni-sheet::backdrop, .enni-dialog::backdrop { opacity: 0; transition: ${moves("exit", "standard")}; }
.enni-sheet[open]::backdrop, .enni-dialog[open]::backdrop { opacity: 1; }
@starting-style {
  .enni-sheet[open] { opacity: 0; transform: translateX(var(--enni-space-4)); }
  .enni-dialog[open] { opacity: 0; transform: translateY(var(--enni-space-2)); }
  .enni-sheet[open]::backdrop, .enni-dialog[open]::backdrop { opacity: 0; }
}
`;

const OPENING = `
@supports (interpolate-size: allow-keywords) {
  .enni-details, .enni-sources { interpolate-size: allow-keywords; }
  .enni-details::details-content, .enni-sources::details-content { block-size: 0; overflow: clip; transition: block-size var(--enni-motion-enter) var(--enni-ease-standard), content-visibility var(--enni-motion-enter) allow-discrete; }
  .enni-details[open]::details-content, .enni-sources[open]::details-content { block-size: auto; }
}
`;

/** How many items a staggered list delays one by one; the rest arrive with the last. */
export const STAGGER_STEPS = 6;

const stagger = (): string =>
  Array.from({ length: STAGGER_STEPS }, (_, index) => {
    const nth = index === STAGGER_STEPS - 1 ? `n + ${index + 1}` : `${index + 1}`;
    return `.enni-stagger > :nth-child(${nth}) { animation-delay: calc(var(--enni-motion-stagger) * ${index}); }`;
  }).join("\n");

const ARRIVING = `
@keyframes enni-rise { from { opacity: 0; transform: translateY(var(--enni-space-2)); } to { opacity: 1; transform: none; } }
@keyframes enni-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.45; } }
.enni-rise, .enni-stagger > * { animation: enni-rise var(--enni-motion-enter) var(--enni-ease-out) both; }
${stagger()}
.enni-skeleton { display: grid; gap: var(--enni-space-2); }
.enni-skeleton__line { display: block; height: 0.875rem; border-radius: var(--enni-radius-sm); background: var(--enni-sunken); animation: enni-pulse var(--enni-motion-calm) var(--enni-ease-standard) infinite; }
.enni-skeleton__line:last-child:not(:first-child) { width: 60%; }
.enni-skeleton--block .enni-skeleton__line { height: 4.5rem; border-radius: var(--enni-radius-lg); }
`;

/** The states, exits, openings and arrivals, in one string `PRIMITIVES_CSS` ends with. */
export const MOTION_CSS = [STATES, LEAVING, OPENING, ARRIVING].join("\n").trim();
