import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { ICONS, Icon } from "./icon.tsx";

describe("Icon", () => {
  test.each([...ICONS])("%s is drawn, hidden, and in its text's colour", (name) => {
    const html = renderToStaticMarkup(<Icon name={name} />);
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('stroke="currentColor"');
    expect(html).toMatch(/<path d="[^"]+"/);
  });

  test("names no colour — an icon is whatever colour its text is", () => {
    for (const name of ICONS) {
      expect(renderToStaticMarkup(<Icon name={name} />)).not.toMatch(/#[0-9a-f]{3,6}\b|oklch|rgb/i);
    }
  });
});
