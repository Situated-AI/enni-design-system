import { describe, expect, test } from "bun:test";
import {
  BRAND_ICON_SVG,
  BRAND_LOGO_DARK_SVG,
  BRAND_LOGO_SVG,
  BRAND_MARK_SVG,
  LOCKUP,
  MARK_SHAPES,
  roundedPath,
  WORDMARK,
  wordmarkPath,
} from "./brand-mark.ts";
import { srgbHex } from "./contrast.ts";
import { BRAND, DARK, LIGHT } from "./palette.ts";

const fills = (svg: string): string[] =>
  [...svg.matchAll(/fill="([^"]+)"/g)].map((m) => m[1] ?? "");

describe("roundedPath", () => {
  const square = [
    [0, 0],
    [10, 0],
    [10, 10],
    [0, 10],
  ] as const;

  test("a radius of 0 keeps the corner sharp", () => {
    expect(roundedPath(square, [0, 0, 0, 0])).toBe("M0 0L10 0L10 10L0 10Z");
  });

  test("a right angle is cut back by its radius along both edges, and bridged by an arc", () => {
    expect(roundedPath(square, [0, 2, 0, 0])).toBe("M0 0L8 0A2 2 0 0 1 10 2L10 10L0 10Z");
  });

  test("a reflex corner sweeps the other way", () => {
    const notch = [
      [0, 0],
      [10, 0],
      [10, 10],
      [5, 10],
      [5, 5],
      [0, 5],
    ] as const;
    expect(roundedPath(notch, [0, 0, 0, 0, 1, 0])).toContain("A1 1 0 0 0");
  });
});

describe("the mark", () => {
  test("three layers, two overlaps, the white rings and bars, three dots — back to front", () => {
    expect(MARK_SHAPES.map((shape) => shape.tone)).toEqual([
      "indigo",
      "violet",
      "iris",
      "lavender",
      "lilac",
      "ring",
      "ring",
      "violet",
      "plum",
      "ink",
    ]);
  });

  test("it stays inside its 64-unit square", () => {
    for (const { d } of MARK_SHAPES)
      for (const n of d.match(/-?\d+(?:\.\d+)?/g) ?? [])
        expect(Math.abs(Number(n))).toBeLessThan(64);
  });
});

describe("the standalone SVG strings", () => {
  test("every fill is a BRAND tone, converted — no colour is typed for them", () => {
    const tones = new Set(Object.values(BRAND).map(srgbHex));
    for (const fill of fills(BRAND_MARK_SVG)) expect(tones.has(fill)).toBe(true);
    expect(fills(BRAND_MARK_SVG)).toHaveLength(MARK_SHAPES.length);
  });

  test("the favicon is the mark alone, on a transparent ground", () => {
    expect(BRAND_MARK_SVG).toMatch(
      /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="0 0 64 64">/,
    );
    expect(BRAND_MARK_SVG).not.toContain("<rect");
  });

  test("the app icon is the mark on a white, rounded tile", () => {
    expect(BRAND_ICON_SVG).toContain(
      `<rect width="64" height="64" rx="14" fill="${srgbHex(BRAND.ring)}"/>`,
    );
    expect(BRAND_ICON_SVG).toContain(BRAND_MARK_SVG.slice(BRAND_MARK_SVG.indexOf("<path"), -6));
  });

  test("the lockup's wordmark is the theme's ink: slate on light, near-white on obsidian", () => {
    expect(BRAND_LOGO_SVG).toContain(`viewBox="0 0 ${LOCKUP.width} ${LOCKUP.height}"`);
    expect(fills(BRAND_LOGO_SVG).at(-1)).toBe(srgbHex(LIGHT.ink));
    expect(fills(BRAND_LOGO_DARK_SVG).at(-1)).toBe(srgbHex(DARK.ink));
  });
});

describe("the wordmark", () => {
  test("four letters, four closed paths, each inside its box", () => {
    const path = wordmarkPath();
    expect(path.match(/M/g)).toHaveLength(4);
    expect(path.match(/Z/g)).toHaveLength(4);
    const xs = [...path.matchAll(/[ML](-?[\d.]+) (-?[\d.]+)/g)].map((m) => Number(m[1]));
    expect(Math.min(...xs)).toBeGreaterThanOrEqual(0);
    expect(Math.max(...xs)).toBeLessThanOrEqual(WORDMARK.width);
  });

  test("it is set beside the mark, its cap about 0.55 of the mark's height", () => {
    expect(LOCKUP.x).toBeGreaterThan(64);
    expect(WORDMARK.height / LOCKUP.height).toBeWithin(0.5, 0.6);
  });
});
