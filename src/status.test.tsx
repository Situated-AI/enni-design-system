import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Orb, StatusMark, TONE_TOKENS, type Tone } from "./status.tsx";
import { PRIMITIVES_CSS } from "./styles.ts";
import { LIGHT } from "./tokens.ts";

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
});

describe("tones", () => {
  test("every tone draws in tokens that exist", () => {
    for (const tone of TONES) {
      expect(Object.keys(LIGHT)).toContain(TONE_TOKENS[tone].ink);
      expect(Object.keys(LIGHT)).toContain(TONE_TOKENS[tone].ground);
      expect(Object.keys(LIGHT)).toContain(TONE_TOKENS[tone].edge);
    }
  });

  test("every tone has a rule in the stylesheet", () => {
    for (const tone of TONES) expect(PRIMITIVES_CSS).toContain(`.enni-tone--${tone}`);
  });

  test("the pulse stops for a reader who asked for less motion", () => {
    expect(PRIMITIVES_CSS).toContain('[data-moving="true"]');
    expect(PRIMITIVES_CSS).toContain("--enni-motion-calm");
  });
});
