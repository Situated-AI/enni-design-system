import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { CountBadge, Pill, StatusBadge, Tag } from "./badge.tsx";
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

describe("the landing's chip, pill and tag (enni-v2 #637)", () => {
  test("a status badge may lead with a live dot, hidden from a screen reader; the glyph and word stay", () => {
    const html = renderToStaticMarkup(<StatusBadge glyph="✓" word="Ready" tone="ready" dot />);
    expect(html).toBe(
      '<span class="enni-badge enni-tone--ready"><span class="enni-badge__dot" aria-hidden="true"></span><span class="enni-badge__glyph" aria-hidden="true">✓</span><span>Ready</span></span>',
    );
  });

  test("a pill is glass words with an optional badge; with an href it is a link", () => {
    expect(renderToStaticMarkup(<Pill badge="New">Ask from your editor</Pill>)).toBe(
      '<span class="enni-pill"><b class="enni-pill__badge">New</b><span>Ask from your editor</span></span>',
    );
    expect(renderToStaticMarkup(<Pill href="/changelog">What changed</Pill>)).toBe(
      '<a class="enni-pill" href="/changelog"><span>What changed</span></a>',
    );
  });

  test("a tag is its tone's word, ready unless asked", () => {
    expect(renderToStaticMarkup(<Tag>Shipped</Tag>)).toBe(
      '<span class="enni-tag enni-tone--ready">Shipped</span>',
    );
    expect(renderToStaticMarkup(<Tag tone="accent">Live</Tag>)).toContain("enni-tone--accent");
  });
});

describe("0.6.2: a chip without its glyph", () => {
  test("the dot and the word only, as the landing draws a verdict", () => {
    const html = renderToStaticMarkup(<StatusBadge word="Needs care" tone="care" dot />);
    expect(html).not.toContain("enni-badge__glyph");
    expect(html).toContain("enni-badge__dot");
    expect(html).toContain("Needs care");
  });
});
