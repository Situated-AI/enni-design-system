import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Card, CheckList, Eyebrow } from "./surface.tsx";

describe("Card", () => {
  test("is a div by default, and the caller's element when asked", () => {
    expect(renderToStaticMarkup(<Card>x</Card>)).toBe('<div class="enni-card">x</div>');
    expect(renderToStaticMarkup(<Card as="li">x</Card>)).toBe('<li class="enni-card">x</li>');
  });

  test("a labelled card names its region", () => {
    const html = renderToStaticMarkup(
      <Card as="section" label="A real answer">
        x
      </Card>,
    );
    expect(html).toBe('<section class="enni-card" aria-label="A real answer">x</section>');
  });
});

test("an Eyebrow is a paragraph, written as the sentence it is — the capitals are CSS", () => {
  expect(renderToStaticMarkup(<Eyebrow>For people, and the AI tools they use</Eyebrow>)).toBe(
    '<p class="enni-eyebrow">For people, and the AI tools they use</p>',
  );
});

describe("CheckList", () => {
  const html = renderToStaticMarkup(
    <CheckList items={["Only reads", "Every answer shows its sources"]} label="Promises" />,
  );

  test("one row per item, in order", () => {
    expect(html.match(/<li>/g)).toHaveLength(2);
    expect(html.indexOf("Only reads")).toBeLessThan(html.indexOf("Every answer"));
  });

  test("the ✓ is a shape a screen reader skips; the sentence is the meaning", () => {
    expect(html).toContain(
      '<span class="enni-checklist__mark" aria-hidden="true">✓</span>Only reads',
    );
    expect(html).toContain('aria-label="Promises"');
  });
});
