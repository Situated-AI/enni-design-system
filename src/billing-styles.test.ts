import { expect, test } from "bun:test";
import { BILLING_CSS } from "./billing-styles.ts";
import { LIGHT } from "./tokens.ts";

test("names no colour by value — the palette lives in tokens.ts alone", () => {
  expect(BILLING_CSS).not.toMatch(/#[0-9a-fA-F]{3,8}\b|\brgba?\(|oklch\(/);
});

test("every colour it names is a token that exists", () => {
  const named = [...BILLING_CSS.matchAll(/var\(--enni-([a-z-]+)\)/g)].map((m) => m[1] ?? "");
  const colours = named.filter(
    (n) => !/^(space|radius|font|type|leading|tracking|shadow)-/.test(n),
  );
  expect(colours.length).toBeGreaterThan(10);
  for (const name of colours) expect(Object.keys(LIGHT)).toContain(name);
});

test("B11: a meter running low changes colour and its caption's too — the words say it either way", () => {
  expect(BILLING_CSS).toContain(".enni-meter--care .enni-meter__fill");
  expect(BILLING_CSS).toContain(".enni-meter--care .enni-meter__caption");
});

test("on a phone the cards and packs stack, and receipts become stacked rows", () => {
  const phone = BILLING_CSS.slice(BILLING_CSS.indexOf("@media (max-width: 40rem)"));
  expect(phone).toContain(
    ".enni-summary-grid, .enni-packs__choices { grid-template-columns: 1fr; }",
  );
  expect(phone).toContain(".enni-receipts tr { display: grid;");
});
