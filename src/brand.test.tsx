import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { BrandLogo, BrandMark, BrandTile } from "./brand.tsx";
import { MARK_SHAPES } from "./brand-mark.ts";
import { PRIMITIVES_CSS } from "./styles.ts";

describe("BrandMark", () => {
  const html = renderToStaticMarkup(<BrandMark name="Enni" />);

  test("the mark and the drawn wordmark are hidden; the name, from the caller, is what is read", () => {
    expect(html).toContain('<svg class="enni-brand__tile"');
    expect(html).toContain('<svg class="enni-brand__word"');
    expect(html.match(/aria-hidden="true"/g)).toHaveLength(2);
    expect(html).toContain('<span class="enni-visually-hidden">Enni</span>');
  });

  test("no colour is typed in the mark — every path is classed by its tone, over a token", () => {
    expect(html).not.toMatch(/fill=|oklch|#[0-9a-f]{3,6}\b/i);
    for (const { tone } of MARK_SHAPES) {
      expect(html).toContain(`class="enni-brand__${tone}"`);
      expect(PRIMITIVES_CSS).toContain(`.enni-brand__${tone} { fill: var(--enni-brand-${tone}); }`);
    }
  });

  test("the wordmark is the ink around it, so it follows the theme", () => {
    expect(PRIMITIVES_CSS).toContain(".enni-brand__word { fill: currentColor; }");
  });

  test("with an href it is a link home, named by the name", () => {
    const link = renderToStaticMarkup(<BrandMark name="Enni" href="/" />);
    expect(link).toMatch(/^<a class="enni-brand" href="\/">/);
    expect(link).toContain(">Enni</span></a>");
  });
});

describe("BrandTile", () => {
  test("is the mark alone on its 64-unit square, every shape drawn", () => {
    const html = renderToStaticMarkup(<BrandTile />);
    expect(html).toContain('viewBox="0 0 64 64"');
    expect(html.match(/<path /g)).toHaveLength(MARK_SHAPES.length);
  });
});

describe("BrandLogo", () => {
  test("is one image, named by the caller, the mark and the wordmark in one drawing", () => {
    const html = renderToStaticMarkup(<BrandLogo name="Enni" />);
    expect(html).toMatch(
      /^<svg class="enni-brand-logo" viewBox="0 0 187 64" role="img" aria-label="Enni">/,
    );
    expect(html.match(/<path /g)).toHaveLength(MARK_SHAPES.length + 1);
    expect(html).not.toMatch(/fill=/);
  });
});
