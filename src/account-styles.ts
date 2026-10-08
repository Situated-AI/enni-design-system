/**
 * The account primitives' rules (#289): steps, the auth card, the notice, choice cards, codes, the
 * copy field, the QR block, the device prompt, the dialog, settings cards, rows and the action menu,
 * as A01–A12 and S01–S09 draw them. Tokens only (`account-styles.test.ts`).
 */
const FLOW = `
.enni-steps { display: flex; flex-wrap: wrap; align-items: center; gap: var(--enni-space-1); margin: 0; padding: 0; list-style: none; color: var(--enni-ink-subtle); font-size: var(--enni-type-sm); }
.enni-steps li { display: inline-flex; align-items: center; gap: var(--enni-space-1); }
.enni-steps li + li::before { content: ""; width: var(--enni-space-3); height: 1px; margin-right: var(--enni-space-1); background: var(--enni-line); }
.enni-steps__mark { display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; border: 1px solid var(--enni-line); border-radius: var(--enni-radius-pill); font-size: var(--enni-type-sm); }
.enni-steps li[data-state="done"] .enni-steps__mark { border-color: var(--enni-accent); background: var(--enni-accent); color: var(--enni-accent-ink); }
.enni-steps li[data-state="current"] { color: var(--enni-ink); }
.enni-steps li[data-state="current"] .enni-steps__mark { border-color: var(--enni-accent); color: var(--enni-accent); }
.enni-steps li[data-state="done"] { color: var(--enni-ink-muted); }
.enni-auth { display: grid; align-content: start; gap: var(--enni-space-5); width: min(100%, 30rem); margin: var(--enni-space-5) auto; padding: var(--enni-space-6); border: 1px solid var(--enni-line); border-radius: var(--enni-radius-2xl); background: var(--enni-canvas); box-shadow: var(--enni-shadow-card); color: var(--enni-ink); }
.enni-auth__body { display: grid; align-content: start; gap: var(--enni-space-4); }
.enni-auth__title { display: flex; align-items: center; gap: var(--enni-space-2); margin: 0; font-family: var(--enni-font-sans); font-size: var(--enni-type-xl); line-height: var(--enni-leading-xl); letter-spacing: var(--enni-tracking-display); }
.enni-auth__lede { color: var(--enni-ink-muted); }
.enni-auth__lede p { margin: 0 0 var(--enni-space-2); }
.enni-auth__content { display: grid; gap: var(--enni-space-4); }
.enni-auth__content form { display: grid; gap: var(--enni-space-4); }
.enni-auth__footer { color: var(--enni-ink-muted); font-size: var(--enni-type-sm); }
.enni-auth__footer a { color: var(--enni-ink); }
.enni-notice { margin: 0; padding: var(--enni-space-2) var(--enni-space-3); border: 1px solid var(--enni-danger-border); border-radius: var(--enni-radius-md); background: var(--enni-danger-bg); color: var(--enni-danger-fg); }
`;

const INPUTS = `
.enni-choices { display: grid; gap: var(--enni-space-2); min-inline-size: 0; margin: 0; padding: 0; border: 0; }
.enni-choices__legend { margin-bottom: var(--enni-space-1); padding: 0; font-weight: 600; }
.enni-choice { display: flex; align-items: flex-start; gap: var(--enni-space-3); padding: var(--enni-space-3); border: 1px solid var(--enni-line); border-radius: var(--enni-radius-lg); background: var(--enni-surface); cursor: pointer; }
.enni-choice[data-selected="true"] { border-color: var(--enni-line-strong); background: var(--enni-sunken); }
.enni-choice:has(input:focus-visible) { outline: 2px solid var(--enni-focus); outline-offset: 2px; }
.enni-choice input { margin-top: 4px; accent-color: var(--enni-accent); }
.enni-choice__text { display: grid; gap: 2px; }
.enni-choice__label { color: var(--enni-ink); font-weight: 500; }
.enni-choice__hint { color: var(--enni-ink-muted); font-size: var(--enni-type-sm); }
.enni-code-input input { font-family: var(--enni-font-mono); font-size: var(--enni-type-lg); letter-spacing: 0.08em; }
.enni-code-list { display: grid; gap: var(--enni-space-3); padding: var(--enni-space-4); border: 1px solid var(--enni-line); border-radius: var(--enni-radius-lg); background: var(--enni-surface); box-shadow: var(--enni-shadow-card); }
.enni-code-list ul { display: grid; grid-template-columns: repeat(2, max-content); gap: var(--enni-space-1) calc(2 * var(--enni-space-5)); margin: 0; padding: 0; list-style: none; color: var(--enni-ink); font-family: var(--enni-font-mono); }
.enni-code-list__actions, .enni-copy-field { display: flex; flex-wrap: wrap; align-items: center; gap: var(--enni-space-2); }
.enni-copy-field { padding: 2px 2px 2px var(--enni-space-3); border: 1px solid var(--enni-line); border-radius: var(--enni-radius-md); background: var(--enni-sunken); }
.enni-copy-field code { flex: 1; min-width: 0; overflow-wrap: anywhere; white-space: pre-wrap; color: var(--enni-ink); font-family: var(--enni-font-mono); font-size: var(--enni-type-sm); }
.enni-copy-field__status:empty { display: none; }
.enni-copy-field__status, .enni-code-list__actions [role="status"] { color: var(--enni-ink-muted); font-size: var(--enni-type-sm); }
.enni-qr { display: flex; gap: var(--enni-space-4); padding: var(--enni-space-4); border: 1px solid var(--enni-line); border-radius: var(--enni-radius-lg); background: var(--enni-surface); box-shadow: var(--enni-shadow-card); }
.enni-qr__code { flex-shrink: 0; width: 140px; padding: var(--enni-space-2); border: 1px solid var(--enni-line); border-radius: var(--enni-radius-md); background: var(--enni-surface); }
.enni-qr__code svg { display: block; width: 100%; height: auto; }
.enni-qr__text { display: grid; align-content: start; gap: var(--enni-space-2); min-width: 0; }
.enni-qr__text p { margin: 0; }
.enni-qr__intro, .enni-qr__note { color: var(--enni-ink-muted); font-size: var(--enni-type-sm); }
.enni-device-prompt { display: grid; grid-template-columns: auto 1fr; gap: var(--enni-space-2) var(--enni-space-3); padding: var(--enni-space-3) var(--enni-space-4); border: 1px solid var(--enni-line); border-radius: var(--enni-radius-lg); background: var(--enni-surface); box-shadow: var(--enni-shadow-lift); }
.enni-device-prompt__glyph { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: var(--enni-radius-md); background: var(--enni-sunken); color: var(--enni-ink-muted); }
.enni-device-prompt__text { display: grid; }
.enni-device-prompt__title { color: var(--enni-ink); font-weight: 500; }
.enni-device-prompt__detail { color: var(--enni-ink-muted); font-size: var(--enni-type-sm); }
.enni-device-prompt__actions { display: flex; grid-column: 1 / -1; justify-content: flex-end; gap: var(--enni-space-2); font-size: var(--enni-type-sm); }
.enni-device-prompt__cancel, .enni-device-prompt__confirm { padding: var(--enni-space-1) var(--enni-space-3); border: 1px solid var(--enni-line); border-radius: var(--enni-radius-md); }
.enni-device-prompt__confirm { border-color: var(--enni-accent); background: var(--enni-accent); color: var(--enni-accent-ink); }
`;

const SETTINGS = `
.enni-dialog { width: min(calc(100vw - 2 * var(--enni-space-4)), 28rem); max-height: calc(100dvh - 2 * var(--enni-space-4)); padding: var(--enni-space-5); border: 1px solid var(--enni-line); border-radius: var(--enni-radius-lg); background: var(--enni-surface); box-shadow: var(--enni-shadow-lift); color: var(--enni-ink); overflow: hidden; }
.enni-dialog[open] { display: flex; flex-direction: column; }
.enni-dialog::backdrop { background: color-mix(in srgb, var(--enni-ink) 35%, transparent); }
.enni-dialog__header { display: flex; flex: none; align-items: flex-start; justify-content: space-between; gap: var(--enni-space-3); }
.enni-dialog__header h2 { margin: 0; font-family: var(--enni-font-sans); font-size: var(--enni-type-xl); letter-spacing: normal; text-transform: none; }
.enni-dialog__lede { flex: none; margin-top: var(--enni-space-2); color: var(--enni-ink-muted); }
.enni-dialog__body { display: grid; flex: 1 1 auto; align-content: start; gap: var(--enni-space-4); min-height: 0; margin: var(--enni-space-3) calc(-1 * var(--enni-space-1)) 0; padding: var(--enni-space-1); overflow-y: auto; }
.enni-dialog__footer { display: flex; flex: none; flex-wrap: wrap; justify-content: flex-end; gap: var(--enni-space-2); margin-top: var(--enni-space-3); }
.enni-settings-card { display: grid; gap: var(--enni-space-3); padding: var(--enni-space-4); border: 1px solid var(--enni-line); border-radius: var(--enni-radius-lg); background: var(--enni-surface); box-shadow: var(--enni-shadow-card); }
.enni-settings-card__header { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: var(--enni-space-2); }
.enni-settings-card__header h2 { margin: 0; font-family: var(--enni-font-sans); font-size: var(--enni-type-md); font-weight: 600; letter-spacing: normal; text-transform: none; }
.enni-settings-card__why { margin: 0; color: var(--enni-ink-muted); }
.enni-settings-card__header > .enni-settings-card__why { flex: 1 1 14rem; }
.enni-settings-card__header > :only-child:not(h2, p) { margin-left: auto; }
.enni-rows { display: grid; gap: var(--enni-space-2); margin: 0; padding: 0; list-style: none; }
.enni-row { display: flex; flex-wrap: wrap; align-items: center; gap: var(--enni-space-3); min-height: 52px; padding: var(--enni-space-2) var(--enni-space-3); border: 1px solid var(--enni-line); border-radius: var(--enni-radius-lg); background: var(--enni-surface); }
.enni-row__monogram, .enni-row__icon { display: inline-flex; flex-shrink: 0; align-items: center; justify-content: center; width: 28px; height: 28px; border: 1px solid var(--enni-line); border-radius: var(--enni-radius-md); background: var(--enni-sunken); color: var(--enni-ink-muted); font-family: var(--enni-font-mono); font-size: var(--enni-type-sm); }
.enni-row__text { display: grid; flex: 1 1 12rem; min-width: 0; }
.enni-row__title { overflow-wrap: anywhere; color: var(--enni-ink); }
.enni-row__detail { overflow-wrap: anywhere; color: var(--enni-ink-subtle); font-size: var(--enni-type-sm); }
.enni-row__below { flex-basis: 100%; min-width: 0; }
.enni-row__trailing { display: inline-flex; flex-shrink: 0; align-items: center; gap: var(--enni-space-2); margin-left: auto; }
.enni-action-menu { position: relative; display: inline-flex; }
.enni-action-menu__list { position: absolute; top: calc(100% + var(--enni-space-1)); right: 0; z-index: 5; display: grid; min-width: 14rem; margin: 0; padding: var(--enni-space-1); border: 1px solid var(--enni-line); border-radius: var(--enni-radius-lg); background: var(--enni-surface); box-shadow: var(--enni-shadow-lift); list-style: none; }
.enni-action-menu__list button { width: 100%; min-height: 44px; padding: 0 var(--enni-space-3); border: 0; border-radius: var(--enni-radius-md); background: none; color: var(--enni-ink); font: inherit; text-align: left; cursor: pointer; }
.enni-action-menu__list button:hover, .enni-action-menu__list button:focus-visible { background: var(--enni-hover); }
.enni-action-menu__list button[data-danger="true"] { color: var(--enni-danger-fg); }
.enni-action-menu__list button[aria-current="true"] { font-weight: 600; }
@media (max-width: 40rem) {
  .enni-steps li:not([data-state="current"]) .enni-steps__label { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
  .enni-auth { width: 100%; min-height: 100dvh; margin: 0; padding: var(--enni-space-4); border: 0; border-radius: 0; box-shadow: none; }
  .enni-qr { flex-direction: column; }
  .enni-dialog { width: 100vw; max-width: 100vw; height: 100dvh; max-height: 100dvh; margin: 0; border: 0; border-radius: 0; }
  .enni-action-menu__list { position: fixed; top: auto; right: 0; bottom: 0; left: 0; border-radius: var(--enni-radius-lg) var(--enni-radius-lg) 0 0; }
}
`;

export const ACCOUNT_CSS = [FLOW, INPUTS, SETTINGS].join("\n").trim();
