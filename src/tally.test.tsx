import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { PRIMITIVES_CSS } from "./styles.ts";
import { Tally } from "./tally.tsx";

const PARTS = [
  { kind: "passed", count: 1, tone: "ready" },
  { kind: "caveat", count: 0, tone: "care" },
  { kind: "unread", count: 4, tone: "limited", hollow: true },
] as const;

describe("Tally (enni-v2 #461)", () => {
  const html = renderToStaticMarkup(<Tally parts={PARTS} />);
  const segments = [...html.matchAll(/class="enni-tally__segment ([^"]+)"([^>]*)>/g)];

  test("one segment per thing counted, in the order given", () => {
    expect(segments).toHaveLength(5);
    expect(segments.map((s) => s[1])).toEqual([
      "enni-tone--ready",
      ...Array(4).fill("enni-tone--limited"),
    ]);
  });

  test("what was not read is hollow — a shape, not only a colour (D-115)", () => {
    expect(segments[0]?.[2]).not.toContain("data-hollow");
    for (const unread of segments.slice(1)) expect(unread[2]).toContain('data-hollow="true"');
    expect(PRIMITIVES_CSS).toContain(
      '.enni-tally__segment[data-hollow="true"] { background: none; }',
    );
  });

  test("it is decoration beside the words: hidden from a screen reader", () => {
    expect(html).toStartWith('<span class="enni-tally" aria-hidden="true">');
  });

  test("nothing counted draws nothing, and a fraction or a negative draws no part of a segment", () => {
    expect(renderToStaticMarkup(<Tally parts={[]} />)).toBe("");
    expect(renderToStaticMarkup(<Tally parts={[{ kind: "x", count: -2, tone: "ready" }]} />)).toBe(
      "",
    );
    const odd = renderToStaticMarkup(<Tally parts={[{ kind: "x", count: 2.7, tone: "ready" }]} />);
    expect(odd.match(/enni-tally__segment/g)).toHaveLength(2);
  });

  test("a segment is drawn from its tone's tokens, on the shared tone map", () => {
    expect(PRIMITIVES_CSS).toMatch(
      /\.enni-tally__segment \{[^}]*border: 1px solid var\(--enni-tone-ink\);[^}]*background: var\(--enni-tone-ink\);/,
    );
  });
});
