/**
 * The answer's rules (#298) — the card, its parts, its sources and details, reading steps, the
 * refusal and the heard bubble, as 09–14 draw them. Tokens only (`answer-styles.test.ts`).
 *
 * Since 0.6.1 the card is the landing window's (enni-v2 #637): a 16px radius and the hairline shadow,
 * the key in mono in a 7px box, the sentence at the landing's 22–27px, *What's in the way* in a
 * sunken box with its reasons numbered, *Who knows* in its own, *Answer for* as the landing's
 * switch (a sunken row, the chosen option raised) and the citations in the accent's mono.
 */
export const ANSWER_CSS = `
.enni-answer-card { overflow: hidden; border: 1px solid var(--enni-line); border-radius: var(--enni-radius-xl); background: var(--enni-surface); box-shadow: var(--enni-shadow-rest); color: var(--enni-ink); font-family: var(--enni-font-sans); font-size: var(--enni-type-md); line-height: var(--enni-leading-md); }
.enni-answer-card__body { display: grid; gap: 18px; padding: clamp(18px, 3vw, 28px); }
.enni-answer-card__status { display: flex; flex-wrap: wrap; align-items: center; gap: var(--enni-space-2) 10px; margin: 0; }
.enni-answer-card__key { padding: 4px var(--enni-space-2); border: 1px solid var(--enni-line); border-radius: calc(var(--enni-radius-base) - 5px); color: var(--enni-ink-muted); font-family: var(--enni-font-mono); font-size: 0.75rem; font-weight: 500; letter-spacing: 0.06em; }
.enni-answer-card__title { color: var(--enni-ink); font-size: 0.96875rem; font-weight: 600; text-decoration: none; }
a.enni-answer-card__title:hover, a:hover > .enni-answer-card__title { text-decoration: underline; text-underline-offset: 2px; }
.enni-answer-card__sentence { margin: 0; color: var(--enni-ink); font-size: clamp(1.375rem, 2.4vw, 1.6875rem); line-height: 1.3; }
.enni-answer-card__sentence :is(b, strong) { font-weight: 700; }
.enni-answer-section { display: grid; gap: var(--enni-space-1); }
.enni-answer-section__title { margin: 0; color: var(--enni-ink-subtle); font-family: var(--enni-font-mono); font-size: 0.71875rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; }
.enni-answer-section--boxed { gap: 14px; padding: 18px; border: 1px solid var(--enni-line); border-radius: calc(var(--enni-radius-base) + 2px); background: var(--enni-sunken); }
.enni-reasons { display: grid; gap: 14px; margin: 0; padding: 0; list-style: none; }
.enni-answer-section .enni-reasons { padding: 0; }
.enni-reasons li { display: grid; grid-template-columns: 22px minmax(0, 1fr); gap: 10px; color: var(--enni-ink); font-size: 0.96875rem; }
.enni-reasons__n { padding-top: 1px; color: var(--enni-ink-muted); font-family: var(--enni-font-mono); font-size: 0.875rem; font-weight: 500; }
.enni-answer-who { display: grid; gap: 4px; margin: 0; padding: 14px 16px; border: 1px solid var(--enni-line); border-radius: var(--enni-radius-lg); background: var(--enni-sunken); }
.enni-answer-who b { font-size: 1rem; }
.enni-answer-who span { color: var(--enni-ink-muted); font-size: 0.875rem; }
.enni-answer-section ol, .enni-answer-section ul { display: grid; gap: var(--enni-space-1); margin: 0; padding-left: var(--enni-space-5); }
.enni-answer-section p { margin: 0; }
.enni-answer-pair { display: grid; grid-template-columns: 1fr 1fr; gap: var(--enni-space-3); }
.enni-answer-pair > :is(.enni-answer-section, .enni-answer-who) { padding: 14px 16px; border: 1px solid var(--enni-line); border-radius: var(--enni-radius-lg); background: var(--enni-sunken); }
.enni-cite { display: inline-flex; align-items: center; min-height: 24px; min-width: 24px; color: var(--enni-accent); font-family: var(--enni-font-mono); font-size: 0.78125rem; font-weight: 500; text-decoration: none; }
.enni-cite:hover { text-decoration: underline; text-underline-offset: 3px; }
.enni-answer-actions { display: flex; flex-wrap: wrap; align-items: center; gap: var(--enni-space-2); }
.enni-answer-actions > :last-child { margin-left: auto; }
.enni-segmented { display: inline-flex; flex-wrap: wrap; align-items: center; gap: var(--enni-space-2); min-width: 0; min-inline-size: 0; margin: 0; padding: 0; border: 0; color: var(--enni-ink-subtle); font-size: var(--enni-type-sm); }
.enni-segmented__options { display: inline-flex; padding: 2px; border: 1px solid var(--enni-line); border-radius: var(--enni-radius-lg); }
.enni-segmented:not(.enni-filter) { gap: 2px; padding: 3px; border: 1px solid var(--enni-line); border-radius: var(--enni-radius-lg); background: var(--enni-sunken); }
.enni-segmented:not(.enni-filter) .enni-segmented__label { padding: 0 var(--enni-space-2); color: var(--enni-ink-subtle); font-size: var(--enni-type-sm); }
.enni-segmented:not(.enni-filter) .enni-segmented__options { flex-wrap: wrap; gap: 2px; padding: 0; border: 0; }
.enni-segmented button { min-height: var(--enni-space-control); padding: 0 11px; border: 1px solid transparent; border-radius: calc(var(--enni-radius-base) - 3px); background: none; color: var(--enni-ink-muted); font: inherit; font-size: 0.875rem; font-weight: 600; cursor: pointer; }
.enni-filter label { display: inline-flex; align-items: center; min-height: var(--enni-space-control); padding: 0 var(--enni-space-2); border: 1px solid transparent; border-radius: var(--enni-radius-md); color: var(--enni-ink-muted); cursor: pointer; }
.enni-filter label:has(input:checked) { border-color: var(--enni-line-strong); background: var(--enni-sunken); color: var(--enni-ink); font-weight: 600; }
.enni-filter--chips .enni-segmented__options { flex-wrap: wrap; gap: var(--enni-space-2); padding: 0; border: 0; }
.enni-filter--chips label { border-color: var(--enni-line); border-radius: var(--enni-radius-pill); background: var(--enni-surface); }
.enni-filter label:has(input:focus-visible) { outline: 2px solid var(--enni-accent); outline-offset: 2px; }
.enni-segmented button[aria-busy="true"] { cursor: progress; opacity: 0.6; }
.enni-segmented button[aria-pressed="true"] { border-color: transparent; background: var(--enni-surface); color: var(--enni-ink); box-shadow: 0 0 0 1px var(--enni-line-strong); }
.enni-sources { border-top: 1px solid var(--enni-line); }
.enni-sources > summary { display: flex; align-items: center; gap: var(--enni-space-2); min-height: 44px; padding: var(--enni-space-1) clamp(18px, 3vw, 28px) 0; color: var(--enni-ink-muted); font-size: var(--enni-type-md); list-style: none; cursor: pointer; }
.enni-sources > ul { display: grid; gap: var(--enni-space-2); margin: 0; padding: 0 clamp(18px, 3vw, 28px) var(--enni-space-4); list-style: none; }
.enni-source { padding: var(--enni-space-2) var(--enni-space-3); border: 1px solid var(--enni-line); border-radius: var(--enni-radius-lg); font-size: var(--enni-type-sm); }
.enni-source:focus { outline: 2px solid var(--enni-focus); outline-offset: 2px; }
.enni-source__head { display: flex; align-items: flex-start; gap: var(--enni-space-2); }
.enni-source__mark { display: inline-flex; flex-shrink: 0; align-items: center; justify-content: center; width: 24px; height: 24px; border: 1px solid var(--enni-line); border-radius: var(--enni-radius-md); background: var(--enni-sunken); color: var(--enni-ink-muted); font-family: var(--enni-font-mono); font-size: var(--enni-type-sm); }
.enni-source__names { display: grid; flex: 1; min-width: 0; }
.enni-source__app { color: var(--enni-ink-subtle); }
.enni-source__title { color: var(--enni-ink); font-weight: 600; }
.enni-source__n { color: var(--enni-accent); font-family: var(--enni-font-mono); font-weight: 500; }
.enni-source__url { color: var(--enni-ink-subtle); font-family: var(--enni-font-mono); }
.enni-source__excerpt { margin: var(--enni-space-1) 0 0; color: var(--enni-ink-muted); }
.enni-source__url { margin: var(--enni-space-1) 0 0; overflow-wrap: anywhere; }
.enni-details-block { display: grid; gap: var(--enni-space-1); padding: var(--enni-space-2) var(--enni-space-4); border-top: 1px solid var(--enni-line); background: var(--enni-sunken); color: var(--enni-ink-subtle); font-family: var(--enni-font-mono); font-size: var(--enni-type-sm); }
.enni-details-block p { margin: 0; }
.enni-steps { display: grid; gap: var(--enni-space-1); margin: 0; padding: 0; list-style: none; font-family: var(--enni-font-sans); font-size: var(--enni-type-sm); }
.enni-steps__step { display: flex; align-items: center; gap: 10px; color: var(--enni-ink-muted); font-family: var(--enni-font-mono); font-size: 0.84375rem; }
.enni-steps__step[data-state="pending"] { color: var(--enni-ink-subtle); }
.enni-steps__step[data-state="failed"] { color: var(--enni-care-fg); }
.enni-steps__glyph { display: inline-flex; justify-content: center; width: 1rem; font-family: var(--enni-font-mono); }
.enni-refusal { display: grid; gap: var(--enni-space-2); padding: var(--enni-space-3) var(--enni-space-4); border: 1px solid var(--enni-line); border-radius: var(--enni-radius-lg); background: var(--enni-surface); box-shadow: var(--enni-shadow-card); font-family: var(--enni-font-sans); }
.enni-refusal__title { margin: 0; color: var(--enni-ink); font-size: var(--enni-type-sm); font-weight: 600; }
.enni-refusal__sentence { margin: 0; color: var(--enni-ink-muted); }
.enni-heard { width: fit-content; max-width: 80%; margin: 0 0 0 auto; padding: var(--enni-space-2) var(--enni-space-4); border: 1px dashed var(--enni-line-strong); border-radius: var(--enni-radius-2xl) var(--enni-radius-2xl) var(--enni-radius-sm) var(--enni-radius-2xl); color: var(--enni-ink-muted); font-family: var(--enni-font-sans); }
@media (max-width: 40rem) {
  .enni-answer-pair { grid-template-columns: 1fr; }
  .enni-answer-actions > :last-child { margin-left: 0; }
}
`;
