import { describe, expect, test } from "bun:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Icon } from "./icon.tsx";
import { MARK_PATHS, MARKS } from "./icon-marks.ts";

describe("an app's own mark (enni-v2 #483)", () => {
  test("every named mark has its path, and nothing else is in the table", () => {
    expect(Object.keys(MARK_PATHS).sort()).toEqual([...MARKS].sort());
    expect(MARKS.length).toBeGreaterThan(1);
  });

  test.each([...MARKS])("%s is one filled path in one colour, never stroked", (name) => {
    const html = renderToStaticMarkup(createElement(Icon, { name }));
    expect(html.match(/<path /g)).toHaveLength(1);
    expect(html).toContain('fill="currentColor"');
    expect(html).not.toContain("stroke");
    expect(html).not.toMatch(/#[0-9a-f]{3,6}\b|oklch|rgb/i);
  });

  test.each([...MARKS])("%s keeps its proportions: its own square box, no transform", (name) => {
    const { box, d } = MARK_PATHS[name];
    const html = renderToStaticMarkup(createElement(Icon, { name }));
    expect(html).toContain(`viewBox="0 0 ${box} ${box}"`);
    expect(html).toContain(`d="${d}"`);
    expect(html).not.toMatch(/transform|preserveAspectRatio/);
  });

  test.each([...MARKS])("%s starts inside its box", (name) => {
    const { box, d } = MARK_PATHS[name];
    const starts = [...d.matchAll(/M(-?[\d.]+)[ ,](-?[\d.]+)/g)].flatMap((m) => [
      Number(m[1]),
      Number(m[2]),
    ]);
    expect(starts.length).toBeGreaterThan(1);
    for (const n of starts) {
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThanOrEqual(box);
    }
  });

  test("the three apps a space connects each have their own mark (enni-v2 #475)", () => {
    expect([...MARKS].sort()).toEqual(["github", "linear", "slack"]);
  });

  test("slack's mark is its four pairs, eight closed shapes, on a 24 box", () => {
    const { box, d } = MARK_PATHS.slack;
    expect(box).toBe(24);
    expect(d.match(/M/g)).toHaveLength(8);
    expect(d.match(/z/g)).toHaveLength(8);
  });
});
