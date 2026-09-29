import { describe, expect, test } from "bun:test";
import { colour, DARK, LIGHT, paletteCss, SPACE, scaleCss, TOKENS_CSS } from "./tokens.ts";

describe("the two themes", () => {
  test("name the same tokens, so a primitive never finds one missing in the dark", () => {
    expect(Object.keys(DARK).sort()).toEqual(Object.keys(LIGHT).sort());
  });

  test("every value is a six-digit hex — one notation, so a diff reads as a colour change", () => {
    for (const value of [...Object.values(LIGHT), ...Object.values(DARK)]) {
      expect(value).toMatch(/^#[0-9a-f]{6}$/);
    }
  });

  test("the themes differ where it matters: canvas and ink swap ends", () => {
    expect(LIGHT.canvas).not.toBe(DARK.canvas);
    expect(LIGHT.ink).not.toBe(DARK.ink);
  });
});

describe("the stylesheet is generated from the tables", () => {
  test("every palette token is declared as a custom property", () => {
    for (const [name, value] of Object.entries(LIGHT)) {
      expect(paletteCss(LIGHT)).toContain(`--enni-${name}: ${value};`);
    }
  });

  test("every step of the spacing scale is declared", () => {
    for (const step of Object.keys(SPACE)) expect(scaleCss()).toContain(`--enni-space-${step}:`);
  });

  test("dark applies by preference, and reduced motion stills every animation", () => {
    expect(TOKENS_CSS).toContain("@media (prefers-color-scheme: dark)");
    expect(TOKENS_CSS).toContain(paletteCss(DARK));
    expect(TOKENS_CSS).toContain("prefers-reduced-motion: reduce");
  });
});

test("a colour is named through its variable, never as a value", () => {
  expect(colour("accent")).toBe("var(--enni-accent)");
});
