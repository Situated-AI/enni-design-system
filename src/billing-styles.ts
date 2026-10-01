/**
 * Billing's rules (#311) — summary cards and their grid, the meter, plan cards, the pack chooser,
 * receipt rows and the hosted card field, as B01–B11 draw them. Tokens only
 * (`billing-styles.test.ts`).
 */
export const BILLING_CSS = `
.enni-summary-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--enni-space-4); }
.enni-summary { display: grid; align-content: start; gap: var(--enni-space-2); padding: var(--enni-space-4); border: 1px solid var(--enni-line); border-radius: var(--enni-radius-lg); background: var(--enni-surface); box-shadow: var(--enni-shadow-card); }
.enni-summary__header { display: flex; align-items: baseline; justify-content: space-between; gap: var(--enni-space-2); }
.enni-summary__header h3 { margin: 0; color: var(--enni-ink); font-size: var(--enni-type-sm); font-weight: 600; }
.enni-summary__header a { color: var(--enni-ink-muted); font-size: var(--enni-type-sm); }
.enni-summary__aside { color: var(--enni-ink-subtle); font-size: var(--enni-type-sm); }
.enni-summary__figure { margin: 0; color: var(--enni-ink); font-size: var(--enni-type-display); font-weight: 600; letter-spacing: var(--enni-tracking-display); line-height: 1.1; }
.enni-summary__unit { color: var(--enni-ink-muted); font-size: var(--enni-type-lg); font-weight: 500; letter-spacing: 0; }
.enni-summary__detail { color: var(--enni-ink-muted); font-size: var(--enni-type-sm); }
.enni-summary__detail p { margin: 0 0 var(--enni-space-1); }
.enni-meter { display: grid; gap: var(--enni-space-2); }
.enni-meter__track { overflow: hidden; height: 8px; border-radius: var(--enni-radius-pill); background: var(--enni-sunken); }
.enni-meter__fill { display: block; height: 100%; border-radius: var(--enni-radius-pill); background: var(--enni-accent); }
.enni-meter--care .enni-meter__fill { background: var(--enni-care-border); }
.enni-meter__caption { margin: 0; color: var(--enni-ink-muted); font-size: var(--enni-type-sm); }
.enni-meter--care .enni-meter__caption { color: var(--enni-care-fg); }
.enni-plan { display: grid; grid-template-rows: auto auto auto 1fr auto; gap: var(--enni-space-2); padding: var(--enni-space-4); border: 1px solid var(--enni-line); border-radius: var(--enni-radius-lg); background: var(--enni-surface); }
.enni-plan[data-current="true"] { border-color: var(--enni-line-strong); background: var(--enni-sunken); }
.enni-plan__header { display: flex; align-items: center; justify-content: space-between; gap: var(--enni-space-2); }
.enni-plan__header h3 { margin: 0; font-size: var(--enni-type-sm); font-weight: 600; }
.enni-plan__tag { padding: 0 var(--enni-space-2); border: 1px solid var(--enni-line); border-radius: var(--enni-radius-pill); color: var(--enni-ink-muted); font-size: var(--enni-type-sm); }
.enni-plan__price { margin: 0; font-size: var(--enni-type-xl); font-weight: 600; }
.enni-plan__per { margin: 0; color: var(--enni-ink-muted); font-size: var(--enni-type-sm); }
.enni-plan__features { display: grid; align-content: start; gap: var(--enni-space-1); margin: 0; padding: 0; list-style: none; }
.enni-plan__features span { color: var(--enni-ink-subtle); }
.enni-plan__action > * { width: 100%; }
.enni-packs { display: grid; gap: var(--enni-space-3); }
.enni-packs__choices { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--enni-space-2); margin: 0; padding: 0; border: 0; min-inline-size: 0; }
.enni-pack { display: grid; align-content: start; gap: 2px; min-height: 44px; padding: var(--enni-space-3); border: 1px solid var(--enni-line); border-radius: var(--enni-radius-lg); background: var(--enni-surface); cursor: pointer; }
.enni-pack:has(input:checked) { border-color: var(--enni-line-strong); background: var(--enni-sunken); }
.enni-pack:has(input:focus-visible) { outline: 2px solid var(--enni-focus); outline-offset: 2px; }
.enni-pack__amount { font-size: var(--enni-type-lg); font-weight: 600; }
.enni-pack__unit { color: var(--enni-ink-subtle); font-size: var(--enni-type-sm); }
.enni-pack__price { margin-top: var(--enni-space-2); }
.enni-pack__tag { color: var(--enni-ready-fg); font-size: var(--enni-type-sm); }
.enni-packs__charge { display: flex; justify-content: space-between; gap: var(--enni-space-2); padding: var(--enni-space-2) var(--enni-space-3); border-radius: var(--enni-radius-md); background: var(--enni-sunken); color: var(--enni-ink-muted); }
.enni-receipts { width: 100%; border-collapse: separate; border-spacing: 0 var(--enni-space-2); font-size: var(--enni-type-sm); }
.enni-receipts td { padding: var(--enni-space-2) var(--enni-space-3); border-block: 1px solid var(--enni-line); background: var(--enni-surface); }
.enni-receipts td:first-child { border-left: 1px solid var(--enni-line); border-radius: var(--enni-radius-md) 0 0 var(--enni-radius-md); }
.enni-receipts td:last-child { border-right: 1px solid var(--enni-line); border-radius: 0 var(--enni-radius-md) var(--enni-radius-md) 0; text-align: right; }
.enni-receipts__date { white-space: nowrap; color: var(--enni-ink-muted); }
.enni-receipts__what { width: 100%; }
.enni-receipts__amount { font-family: var(--enni-font-mono); text-align: right; white-space: nowrap; }
.enni-receipts__status { padding: 0 var(--enni-space-2); border: 1px solid var(--enni-ready-border); border-radius: var(--enni-radius-pill); background: var(--enni-ready-bg); color: var(--enni-ready-fg); }
.enni-receipts a { color: var(--enni-ink-muted); }
.enni-hosted { display: grid; gap: var(--enni-space-3); }
.enni-hosted__slot { display: grid; gap: var(--enni-space-3); min-height: 44px; }
.enni-hosted__footer { display: flex; flex-wrap: wrap; align-items: center; gap: var(--enni-space-2); }
.enni-hosted__by { margin-left: auto; color: var(--enni-ink-subtle); font-size: var(--enni-type-sm); }
.enni-hosted__by strong { color: var(--enni-ink-muted); }
.enni-hosted__note { margin: 0; color: var(--enni-ink-subtle); font-size: var(--enni-type-sm); }
.enni-refusal__actions { display: flex; flex-wrap: wrap; gap: var(--enni-space-2); }
.enni-refusal__footnote { margin: 0; color: var(--enni-ink-subtle); font-size: var(--enni-type-sm); }
@media (max-width: 40rem) {
  .enni-summary-grid, .enni-packs__choices { grid-template-columns: 1fr; }
  .enni-receipts, .enni-receipts tbody, .enni-receipts tr, .enni-receipts td { display: block; }
  .enni-receipts tr { display: grid; grid-template-columns: 1fr auto; gap: var(--enni-space-1) var(--enni-space-2); margin-bottom: var(--enni-space-2); padding: var(--enni-space-2) var(--enni-space-3); border: 1px solid var(--enni-line); border-radius: var(--enni-radius-md); background: var(--enni-surface); }
  .enni-receipts td, .enni-receipts td:first-child, .enni-receipts td:last-child { padding: 0; border: 0; border-radius: 0; background: none; text-align: left; }
  .enni-receipts__what { grid-column: 1 / -1; }
}
`;
