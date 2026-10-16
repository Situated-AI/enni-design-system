import { describe, expect, test } from "bun:test";
import { contrastRatio, linearSrgb, luminance, parseOklch, srgbHex } from "./contrast.ts";

describe("parseOklch", () => {
  test("reads lightness, chroma and hue", () => {
    expect(parseOklch("oklch(0.4 0.095 276)")).toEqual([0.4, 0.095, 276]);
  });

  test("refuses any other notation, rather than measuring a guess", () => {
    expect(() => parseOklch("#ffffff")).toThrow("not an oklch");
    expect(() => parseOklch("oklch(0.3 0.02 62 / 0.5)")).toThrow("not an oklch");
  });
});

describe("the conversion", () => {
  test("white and black are the ends of sRGB", () => {
    for (const channel of linearSrgb("oklch(1 0 0)")) expect(channel).toBeCloseTo(1, 3);
    expect(linearSrgb("oklch(0 0 0)")).toEqual([0, 0, 0]);
  });

  test("a colour outside the gamut is clipped, as the browser paints it", () => {
    for (const channel of linearSrgb("oklch(0.7 0.4 150)")) {
      expect(channel).toBeGreaterThanOrEqual(0);
      expect(channel).toBeLessThanOrEqual(1);
    }
  });

  test("luminance of a neutral grey matches its cube", () => {
    expect(luminance("oklch(0.5 0 0)")).toBeCloseTo(0.125, 3);
  });
});

describe("contrastRatio", () => {
  test("black on white is 21, and the order does not matter", () => {
    expect(contrastRatio("oklch(0 0 0)", "oklch(1 0 0)")).toBeCloseTo(21, 1);
    expect(contrastRatio("oklch(1 0 0)", "oklch(0 0 0)")).toBeCloseTo(21, 1);
  });

  test("a colour on itself is 1", () => {
    expect(contrastRatio("oklch(0.5 0.1 276)", "oklch(0.5 0.1 276)")).toBeCloseTo(1, 5);
  });
});

describe("srgbHex", () => {
  test("white, black and the slate ink come back as the hex they were converted from", () => {
    expect(srgbHex("oklch(1 0 0)")).toBe("#FFFFFF");
    expect(srgbHex("oklch(0 0 0)")).toBe("#000000");
    expect(srgbHex("oklch(0.208 0.04 266)")).toBe("#0F172A");
  });

  test("it is always six upper-case digits, even out of gamut", () => {
    expect(srgbHex("oklch(0.7 0.4 150)")).toMatch(/^#[0-9A-F]{6}$/);
  });
});
