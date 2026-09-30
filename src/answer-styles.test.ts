import { expect, test } from "bun:test";
import { ANSWER_CSS } from "./answer-styles.ts";
import { LIGHT } from "./tokens.ts";

test("names no colour by value — the palette lives in tokens.ts alone", () => {
  expect(ANSWER_CSS).not.toMatch(/#[0-9a-fA-F]{3,8}\b|\brgba?\(|oklch\(/);
});

test("every colour it names is a token that exists", () => {
  const named = [...ANSWER_CSS.matchAll(/var\(--enni-([a-z-]+)\)/g)].map((m) => m[1] ?? "");
  const colours = named.filter(
    (n) => !/^(space|radius|font|type|leading|tracking|shadow)-/.test(n),
  );
  expect(colours.length).toBeGreaterThan(10);
  for (const name of colours) expect(Object.keys(LIGHT)).toContain(name);
});

test("on a phone the pair stacks", () => {
  expect(ANSWER_CSS.slice(ANSWER_CSS.indexOf("@media (max-width: 40rem)"))).toContain(
    ".enni-answer-pair { grid-template-columns: 1fr; }",
  );
});

test("the segmented control's options are 44px targets, and a source card shows its focus", () => {
  expect(ANSWER_CSS).toMatch(/\.enni-segmented button \{ min-height: 44px;/);
  expect(ANSWER_CSS).toContain(".enni-source:focus { outline: 2px solid var(--enni-focus);");
});
