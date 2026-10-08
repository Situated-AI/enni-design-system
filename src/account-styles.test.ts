import { expect, test } from "bun:test";
import { ACCOUNT_CSS } from "./account-styles.ts";
import { LIGHT } from "./tokens.ts";
import { PRIMITIVES_CSS } from "./styles.ts";

test("names no colour by value — the palette lives in tokens.ts alone", () => {
  expect(ACCOUNT_CSS).not.toMatch(/#[0-9a-fA-F]{3,8}\b|\brgba?\(|oklch\(/);
});

test("every colour it names is a token that exists", () => {
  const named = [...ACCOUNT_CSS.matchAll(/var\(--enni-([a-z-]+)\)/g)].map((m) => m[1] ?? "");
  const colours = named.filter(
    (n) => !/^(space|radius|font|type|leading|tracking|shadow|motion|ease)-/.test(n),
  );
  expect(colours.length).toBeGreaterThan(20);
  for (const name of colours) expect(Object.keys(LIGHT)).toContain(name);
});

test("a chosen card is border-strong on sunken", () => {
  expect(ACCOUNT_CSS).toContain(
    '.enni-choice[data-selected="true"] { border-color: var(--enni-line-strong); background: var(--enni-sunken); }',
  );
});

test("on a phone: one step's label, the auth card and the dialog fill the screen", () => {
  const phone = ACCOUNT_CSS.slice(ACCOUNT_CSS.indexOf("@media (max-width: 40rem)"));
  expect(phone).toContain('.enni-steps li:not([data-state="current"]) .enni-steps__label');
  expect(phone).toMatch(/\.enni-auth \{ width: 100%; min-height: 100dvh;/);
  expect(phone).toMatch(/\.enni-dialog \{ width: 100vw;[^}]*height: 100dvh;/);
});

test("the auth card's padding is one step on all four sides, and nothing inside adds to a side (enni-v2 #480)", () => {
  const card = ACCOUNT_CSS.split("\n").find((line) => line.startsWith(".enni-auth {")) ?? "";
  expect(card).toContain(" padding: var(--enni-space-6);");
  const body = ACCOUNT_CSS.split("\n").filter((line) => line.includes(".enni-auth__body"));
  expect(body).toHaveLength(1);
  expect(body.join()).not.toContain("padding");
  // The heading sat low in a line box the page's reading leading made: it takes its own size's.
  expect(ACCOUNT_CSS).toMatch(
    /\.enni-auth__title \{[^}]* margin: 0;[^}]* line-height: var\(--enni-leading-xl\);/,
  );
  // On a phone the card is the screen: one smaller step, still the same on every side.
  const phone = ACCOUNT_CSS.slice(ACCOUNT_CSS.indexOf("@media (max-width: 40rem)"));
  expect(phone).toMatch(/\.enni-auth \{[^}]* padding: var\(--enni-space-4\);/);
});

test("menu items are 44px targets", () => {
  expect(ACCOUNT_CSS).toMatch(/\.enni-action-menu__list button \{ width: 100%; min-height: 44px;/);
});

const rule = (selector: string) =>
  ACCOUNT_CSS.split("\n").find((line) => line.startsWith(`${selector} {`)) ?? "";

test("a dialog is never taller than the window: its body scrolls and its footer stays (enni-v2 #473)", () => {
  // The window's own height less a margin — in dvh, so a phone's toolbars count.
  expect(rule(".enni-dialog")).toContain("max-height: calc(100dvh - 2 * var(--enni-space-4));");
  // The dialog itself never scrolls: that is what took the commit below the fold.
  expect(rule(".enni-dialog")).toContain("overflow: hidden;");
  // A column only while open — `display` on the closed rule would show a closed dialog.
  expect(rule(".enni-dialog[open]")).toBe(
    ".enni-dialog[open] { display: flex; flex-direction: column; }",
  );
  expect(rule(".enni-dialog")).not.toContain("display:");
  // The body gives way and scrolls; the header, the lede and the footer never shrink.
  expect(rule(".enni-dialog__body")).toMatch(
    /flex: 1 1 auto;.* min-height: 0;.* overflow-y: auto;/,
  );
  for (const fixed of [".enni-dialog__header", ".enni-dialog__lede", ".enni-dialog__footer"])
    expect(rule(fixed)).toContain(" flex: none;");
  expect(rule(".enni-dialog__footer")).not.toContain("overflow");
});

test("the scrolling body leaves room for the focus ring of what it holds", () => {
  expect(rule(".enni-dialog__body")).toContain(" padding: var(--enni-space-1);");
});

test("it is on the page with the other primitives", () => {
  expect(PRIMITIVES_CSS).toContain(ACCOUNT_CSS);
});
