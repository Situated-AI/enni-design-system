import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { HelpCard } from "./help-card.tsx";

const ROWS = [
  { glyph: "?", lead: "Ask if something is ready.", text: "Name a ticket." },
  { glyph: "+", lead: "Connect an app.", text: "Say which one." },
];

describe("HelpCard", () => {
  const html = renderToStaticMarkup(<HelpCard rows={ROWS} label="What I can do" />);

  test("a card that is a list, one row per thing", () => {
    expect(html).toMatch(/^<ul class="enni-card enni-help" aria-label="What I can do">/);
    expect(html.match(/<li>/g)).toHaveLength(2);
  });

  test("the glyph is a shape a screen reader skips; the row reads as lead, then sentence", () => {
    expect(html).toContain(
      '<span class="enni-help__glyph" aria-hidden="true">?</span><span><strong>Ask if something is ready.</strong> <span class="enni-help__text">Name a ticket.</span></span>',
    );
  });
});
