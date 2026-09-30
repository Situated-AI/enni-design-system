import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { CountBadge, StatusBadge } from "./badge.tsx";
import { StatusMark } from "./status.tsx";

describe("StatusBadge", () => {
  const html = renderToStaticMarkup(<StatusBadge glyph="!" word="Needs care" tone="care" />);

  test("the glyph is a shape and the word is text — never colour alone (D-115)", () => {
    expect(html).toContain('<span class="enni-badge__glyph" aria-hidden="true">!</span>');
    expect(html).toContain("<span>Needs care</span>");
  });

  test("shares StatusMark's tone map: the same enni-tone class", () => {
    const mark = renderToStaticMarkup(<StatusMark glyph="!" word="Needs care" tone="care" />);
    expect(html).toContain("enni-tone--care");
    expect(mark).toContain("enni-tone--care");
  });
});

describe("CountBadge", () => {
  test("a number, as text", () => {
    expect(renderToStaticMarkup(<CountBadge count={3} />)).toBe(
      '<span class="enni-count">3</span>',
    );
  });

  test("with a label, a screen reader hears what it counts rather than a bare number", () => {
    const html = renderToStaticMarkup(<CountBadge count={3} label="3 new" />);
    expect(html).toContain('<span aria-hidden="true">3</span>');
    expect(html).toContain('<span class="enni-visually-hidden">3 new</span>');
  });

  test("a dash for nothing yet is a count too", () => {
    expect(renderToStaticMarkup(<CountBadge count="—" />)).toContain(">—</span>");
  });
});
