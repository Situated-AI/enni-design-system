import { describe, expect, test } from "bun:test";
import { PRIMITIVES_CSS } from "./styles.ts";
import { LIGHT } from "./tokens.ts";

describe("the primitives' stylesheet", () => {
  test("names no colour by value — the palette lives in tokens.ts alone", () => {
    expect(PRIMITIVES_CSS).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(PRIMITIVES_CSS).not.toMatch(/\brgba?\(/);
  });

  test("every colour variable it names is a token that exists", () => {
    const named = [...PRIMITIVES_CSS.matchAll(/var\(--enni-([a-z-]+)\)/g)].map((m) => m[1] ?? "");
    const colours = named.filter(
      (n) => !/^(space|radius|font|type|motion|measure|tone|shadow|leading|tracking)-/.test(n),
    );
    expect(colours.length).toBeGreaterThan(10);
    for (const name of colours) expect(Object.keys(LIGHT)).toContain(name);
  });

  test("Enni's voice is the serif, and a control inside it stays the sans (#278)", () => {
    expect(PRIMITIVES_CSS).toContain(".enni-voice { font-family: var(--enni-font-serif);");
    expect(PRIMITIVES_CSS).toMatch(
      /\.enni-voice :is\(button[^)]*\) \{ font-family: var\(--enni-font-sans\)/,
    );
  });

  test("the eyebrow is mono and tracked; the display is the display size", () => {
    expect(PRIMITIVES_CSS).toMatch(
      /\.enni-eyebrow \{[^}]*--enni-font-mono[^}]*--enni-tracking-eyebrow/,
    );
    expect(PRIMITIVES_CSS).toMatch(
      /\.enni-display \{[^}]*--enni-type-display[^}]*--enni-leading-display/,
    );
  });

  test("focus is always visible", () => {
    expect(PRIMITIVES_CSS).toContain(":focus-visible");
  });

  test("controls are at least 44px tall", () => {
    expect(PRIMITIVES_CSS.match(/min-height: 44px/g)?.length).toBeGreaterThanOrEqual(3);
  });
});
