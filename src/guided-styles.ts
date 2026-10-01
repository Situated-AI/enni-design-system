/**
 * The guided card's rules (#296): the card, its step bars, numbered instructions, the new-tab link,
 * the secret field with its inline button, answer chips and the confirmation line, as 06–08 and
 * M02–M03b draw them. Tokens only (`guided-styles.test.ts`).
 */
const CARD = `
.enni-guided { display: grid; gap: var(--enni-space-3); width: 100%; padding: var(--enni-space-4); border: 1px solid var(--enni-line); border-radius: var(--enni-radius-lg); background: var(--enni-surface); box-shadow: var(--enni-shadow-card); color: var(--enni-ink); font-family: var(--enni-font-sans); font-size: var(--enni-type-md); line-height: var(--enni-leading-md); }
.enni-guided__header { display: flex; align-items: baseline; justify-content: space-between; gap: var(--enni-space-3); }
.enni-guided__header h2 { margin: 0; font-size: var(--enni-type-md); font-weight: 600; letter-spacing: normal; text-transform: none; }
.enni-guided__step { flex-shrink: 0; color: var(--enni-ink-muted); font-size: var(--enni-type-sm); }
.enni-guided__body { display: grid; gap: var(--enni-space-3); }
.enni-guided__body > p { margin: 0; }
.enni-guided__footer { display: flex; flex-wrap: wrap; align-items: center; column-gap: var(--enni-space-1); margin: 0; color: var(--enni-ink-muted); font-size: var(--enni-type-sm); }
.enni-guided__footer details[open] { flex-basis: 100%; }
.enni-guided__footer summary { font-size: var(--enni-type-sm); display: inline-flex; align-items: center; min-height: 44px; color: var(--enni-ink); text-decoration: underline; text-underline-offset: 2px; cursor: pointer; list-style: none; }
.enni-guided__footer summary::-webkit-details-marker { display: none; }
.enni-guided__footer details[open] p { margin: 0; color: var(--enni-ink); font-size: var(--enni-type-md); }
.enni-segments { display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; gap: var(--enni-space-1); margin-top: calc(-1 * var(--enni-space-1)); }
.enni-segments__bar { height: 3px; border-radius: var(--enni-radius-pill); background: var(--enni-line); }
.enni-segments__bar[data-on="true"] { background: var(--enni-accent); }
.enni-confirmation { display: grid; gap: var(--enni-space-1); }
.enni-confirmation p { margin: 0; }
.enni-confirmation__title { color: var(--enni-ready-fg); font-weight: 600; }
.enni-confirmation__more { color: var(--enni-ink-muted); }
.enni-confirmation__more a { color: var(--enni-ink); font-weight: 600; }
`;

const INPUTS = `
.enni-instructions { display: grid; gap: var(--enni-space-2); margin: 0; padding: 0; list-style: none; }
.enni-instructions li { display: flex; align-items: flex-start; gap: var(--enni-space-3); }
.enni-instructions__number { display: inline-flex; flex-shrink: 0; align-items: center; justify-content: center; width: 20px; height: 20px; margin-top: 2px; border: 1px solid var(--enni-line); border-radius: var(--enni-radius-pill); color: var(--enni-ink-muted); font-size: var(--enni-type-sm); }
.enni-instructions strong { font-weight: 600; }
.enni-instructions__why { color: var(--enni-ink-muted); }
.enni-new-tab { color: var(--enni-ink-muted); text-decoration: underline; text-underline-offset: 2px; }
.enni-new-tab:hover { color: var(--enni-ink); }
.enni-secret { display: grid; gap: var(--enni-space-1); }
.enni-secret__row { display: flex; gap: var(--enni-space-2); }
.enni-secret input { flex: 1 1 auto; min-width: 0; min-height: 44px; padding: var(--enni-space-2) var(--enni-space-3); border: 1px solid var(--enni-line); border-radius: var(--enni-radius-md); background: var(--enni-surface); color: var(--enni-ink); font: inherit; }
.enni-secret input::placeholder { color: var(--enni-ink-subtle); }
.enni-secret .enni-button { flex-shrink: 0; }
/* Inside Enni's turn the voice sizes every button; the card's chips stay the chips' size. */
.enni-guided .enni-chip { font-size: var(--enni-type-sm); }
.enni-answers { display: flex; flex-wrap: wrap; gap: var(--enni-space-2); min-width: 0; margin: 0; padding: 0; border: 0; }
`;

export const GUIDED_CSS = [CARD, INPUTS].join("\n").trim();
