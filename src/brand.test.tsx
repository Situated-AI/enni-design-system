import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { BrandMark } from "./brand.tsx";

describe("BrandMark", () => {
  const html = renderToStaticMarkup(<BrandMark name="Enni" />);

  test("the tile is drawn and hidden; the wordmark is the name, from the caller", () => {
    expect(html).toContain('<svg class="enni-brand__tile"');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('<span class="enni-brand__name">Enni</span>');
  });

  test("no colour is typed in the mark — the tile's fills are classes over tokens", () => {
    expect(html).not.toMatch(/fill=|oklch|#[0-9a-f]{3,6}\b/i);
    expect(html.match(/class="enni-brand__bar"/g)).toHaveLength(3);
  });

  test("with an href it is a link home, named by its wordmark", () => {
    const link = renderToStaticMarkup(<BrandMark name="Enni" href="/" />);
    expect(link).toMatch(/^<a class="enni-brand" href="\/">/);
  });
});
