import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Orb, StatusMark, TONE_TOKENS, type Tone } from "./status.tsx";
import { PRIMITIVES_CSS } from "./styles.ts";
import { LIGHT, ORB } from "./tokens.ts";

const TONES = Object.keys(TONE_TOKENS) as Tone[];

describe("StatusMark", () => {
  const html = renderToStaticMarkup(<StatusMark glyph="✕" word="not reading" tone="danger" />);

  test("renders the glyph as a shape, hidden from a screen reader that hears the word", () => {
    expect(html).toContain('<span class="enni-mark__glyph" aria-hidden="true">✕</span>');
  });

  test("renders the word as text — the channel that needs neither colour nor sight", () => {
    expect(html).toContain('<span class="enni-mark__word">not reading</span>');
  });
});

describe("Orb", () => {
  test("carries a glyph and a word, and announces changes", () => {
    const html = renderToStaticMarkup(<Orb glyph="!" word="Needs care" tone="care" />);
    expect(html).toContain('role="status"');
    expect(html).toContain(">!</span>");
    expect(html).toContain(">Needs care</span>");
  });

  test("motion is a data attribute the stylesheet animates, not the status itself", () => {
    const html = renderToStaticMarkup(
      <Orb glyph="⋯" word="Reading your apps" tone="accent" moving />,
    );
    expect(html).toContain('data-moving="true"');
    expect(html).toContain("Reading your apps");
  });

  test("the sphere is decoration: hidden, empty, and the glyph and word still beside it (D-115)", () => {
    const html = renderToStaticMarkup(<Orb glyph="✓" word="Ready" tone="ready" size="hero" />);
    expect(html).toContain('<span class="enni-orb__sphere" aria-hidden="true"></span>');
    expect(html).toContain('<span class="enni-orb__glyph" aria-hidden="true">✓</span>');
    expect(html).toContain('<span class="enni-orb__word">Ready</span>');
  });

  test("a size: inline unless asked for the hero", () => {
    const inline = renderToStaticMarkup(<Orb glyph="○" word="Waiting" tone="accent" />);
    const hero = renderToStaticMarkup(<Orb glyph="○" word="Waiting" tone="accent" size="hero" />);
    expect(inline).toContain('class="enni-orb enni-orb--inline enni-tone--accent"');
    expect(hero).toContain('class="enni-orb enni-orb--hero enni-tone--accent"');
  });

  test("listening is its own attribute, so the sphere rings rather than breathes", () => {
    const html = renderToStaticMarkup(
      <Orb glyph="◉" word="Listening" tone="accent" moving listening />,
    );
    expect(html).toContain('data-listening="true"');
    expect(renderToStaticMarkup(<Orb glyph="○" word="W" tone="accent" />)).toContain(
      'data-listening="false"',
    );
  });
});

describe("tones", () => {
  test("every tone draws in tokens that exist", () => {
    for (const tone of TONES) {
      expect(Object.keys(LIGHT)).toContain(TONE_TOKENS[tone].ink);
      expect(Object.keys(LIGHT)).toContain(TONE_TOKENS[tone].ground);
      expect(Object.keys(LIGHT)).toContain(TONE_TOKENS[tone].edge);
      expect(Object.keys(ORB)).toContain(tone);
    }
  });

  test("every tone has a rule in the stylesheet", () => {
    for (const tone of TONES) expect(PRIMITIVES_CSS).toContain(`.enni-tone--${tone}`);
  });

  test("the pulse stops for a reader who asked for less motion", () => {
    expect(PRIMITIVES_CSS).toContain('[data-moving="true"]');
    expect(PRIMITIVES_CSS).toContain('[data-listening="true"]');
    expect(PRIMITIVES_CSS).toContain("--enni-motion-calm");
  });
});
