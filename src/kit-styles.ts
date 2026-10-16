/**
 * The landing's pieces, made the primitives' (enni-v2 #637, v0.6.1): its tabs (`.lp-tabs`), its
 * questions (`.lp-faq`), its code panel and terminal (`.lp-code`, `.lp-copy`, `.lp-term`), and what
 * Enni shows while it reads (`.lp-thinking`, `.lp-spin`). Tokens only (`kit-styles.test.ts`).
 *
 * **The code panel is dark in both themes**: its ground, inks and edge are the `code-*` tokens,
 * which do not change with the theme, and its copy button is a glass chip on the dark, focused in
 * the code panel's own violet so the ring reads on it.
 */

const TABS = `
.enni-tabs { display: grid; justify-items: start; gap: var(--enni-space-4); min-width: 0; }
.enni-tabs__list { position: relative; display: inline-flex; flex-wrap: wrap; gap: var(--enni-space-1); max-width: 100%; padding: var(--enni-space-1); border: 1px solid var(--enni-line); border-radius: var(--enni-radius-lg); background: var(--enni-sunken); }
.enni-tab { min-height: var(--enni-space-control); padding: 0 14px; border: 0; border-radius: calc(var(--enni-radius-base) - 3px); background: transparent; color: var(--enni-ink-muted); font: inherit; font-size: 0.90625rem; font-weight: 600; cursor: pointer; }
.enni-tab:hover { color: var(--enni-ink); }
.enni-tab[aria-selected="true"] { background: var(--enni-surface); color: var(--enni-ink); box-shadow: 0 0 0 1px var(--enni-line), var(--enni-shadow-rest); }
.enni-tab-panel { display: grid; grid-template-columns: minmax(0, 1fr); gap: var(--enni-space-3); width: 100%; min-width: 0; }
.enni-tab-panel[hidden] { display: none; }
.enni-tab-panel > p { max-width: 70ch; margin: 0; color: var(--enni-ink-muted); }
`;

const FAQ = `
.enni-faq { border-top: 1px solid var(--enni-line); }
.enni-faq details { border-bottom: 1px solid var(--enni-line); }
.enni-faq summary { display: flex; align-items: center; justify-content: space-between; gap: var(--enni-space-4); min-height: 44px; padding: 20px 4px; font-size: 1.09375rem; font-weight: 600; letter-spacing: -0.01em; list-style: none; cursor: pointer; }
.enni-faq summary::-webkit-details-marker { display: none; }
.enni-faq summary::after { content: "+"; flex: none; color: var(--enni-ink-subtle); font-family: var(--enni-font-mono); font-size: 1.25rem; font-weight: 400; line-height: 1; }
.enni-faq details[open] summary::after { rotate: 45deg; }
.enni-faq summary:hover { color: var(--enni-accent); }
.enni-faq__answer { max-width: 64ch; padding: 0 4px 22px; color: var(--enni-ink-muted); font-size: 1rem; }
.enni-faq__answer > p { margin: 0; }
.enni-faq__answer > p + p { margin-top: var(--enni-space-3); }
`;

const CODE = `
.enni-term { margin: 0; padding: 16px 18px; border: 1px solid color-mix(in oklab, var(--enni-code-ink) 6%, transparent); border-radius: var(--enni-radius-lg); background: var(--enni-code-bg); color: var(--enni-code-ink); font-family: var(--enni-font-mono); font-size: 0.84375rem; line-height: 1.7; overflow-x: auto; white-space: pre; }
.enni-term code { font: inherit; }
.enni-term__pre { margin: 0; font: inherit; white-space: inherit; }
.enni-term__line { display: block; min-height: 1.7em; }
.enni-term__dim { color: var(--enni-code-dim); }
.enni-term__accent { color: var(--enni-code-accent); }
.enni-term__ready { color: var(--enni-code-ready); }
.enni-term__care { color: var(--enni-code-care); }
.enni-term__danger { color: var(--enni-code-danger); }
.enni-term:focus-visible, .enni-copy:focus-visible { outline: 2px solid var(--enni-code-accent); outline-offset: 2px; }
.enni-code { position: relative; width: 100%; min-width: 0; margin: 0; }
.enni-code .enni-term { padding-right: 96px; white-space: pre-wrap; overflow-wrap: anywhere; }
.enni-copy { position: absolute; top: 10px; right: 10px; display: inline-flex; align-items: center; min-height: 30px; padding: 6px 10px; border: 1px solid color-mix(in oklab, var(--enni-code-ink) 16%, transparent); border-radius: var(--enni-radius-md); background: color-mix(in oklab, var(--enni-code-ink) 6%, transparent); color: var(--enni-code-ink); font: inherit; font-size: 0.78125rem; font-weight: 500; line-height: 1.2; cursor: pointer; }
.enni-copy:hover { background: color-mix(in oklab, var(--enni-code-ink) 14%, transparent); }
@media (pointer: coarse) { .enni-copy { min-height: 44px; } }
`;

const THINKING = `
.enni-thinking { display: flex; align-items: center; gap: 10px; margin: 0; color: var(--enni-ink-muted); font-family: var(--enni-font-mono); font-size: 0.84375rem; }
.enni-spin { display: inline-block; flex: none; width: 14px; height: 14px; border: 2px solid var(--enni-line-strong); border-top-color: var(--enni-accent); border-radius: var(--enni-radius-pill); animation: enni-spin var(--enni-motion-spin) linear infinite; }
@keyframes enni-spin { to { rotate: 360deg; } }
`;

/** The tabs, the questions, the code and the thinking line, in one string `PRIMITIVES_CSS` takes. */
export const KIT_CSS = [TABS, FAQ, CODE, THINKING].join("\n").trim();
