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

test("menu items and the close button are 44px targets", () => {
  expect(ACCOUNT_CSS).toMatch(/\.enni-action-menu__list button \{ width: 100%; min-height: 44px;/);
  expect(ACCOUNT_CSS).toMatch(/\.enni-dialog__close \{ min-width: 44px; min-height: 44px;/);
});

test("it is on the page with the other primitives", () => {
  expect(PRIMITIVES_CSS).toContain(ACCOUNT_CSS);
});
