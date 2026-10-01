import { expect, test } from "bun:test";
import { GUIDED_CSS } from "./guided-styles.ts";
import { PRIMITIVES_CSS } from "./styles.ts";
import { LIGHT } from "./tokens.ts";

test("names no colour by value — the palette lives in tokens.ts alone", () => {
  expect(GUIDED_CSS).not.toMatch(/#[0-9a-fA-F]{3,8}\b|\brgba?\(|oklch\(/);
});

test("every colour it names is a token that exists", () => {
  const named = [...GUIDED_CSS.matchAll(/var\(--enni-([a-z-]+)\)/g)].map((m) => m[1] ?? "");
  const colours = named.filter(
    (n) => !/^(space|radius|font|type|leading|tracking|shadow|motion|ease)-/.test(n),
  );
  expect(colours.length).toBeGreaterThan(10);
  for (const name of colours) expect(Object.keys(LIGHT)).toContain(name);
});

test("a step bar is accent when on and line when ahead", () => {
  expect(GUIDED_CSS).toContain(".enni-segments__bar { height: 3px;");
  expect(GUIDED_CSS).toContain("background: var(--enni-line); }");
  expect(GUIDED_CSS).toContain(
    '.enni-segments__bar[data-on="true"] { background: var(--enni-accent); }',
  );
});

test("the secret field and its button are 44px targets, side by side", () => {
  expect(GUIDED_CSS).toContain(".enni-secret__row { display: flex;");
  expect(GUIDED_CSS).toMatch(/\.enni-secret input \{[^}]*min-height: 44px;/);
});

test("it is on the page with the other primitives", () => {
  expect(PRIMITIVES_CSS).toContain(GUIDED_CSS);
});
