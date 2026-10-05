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

test("no two icons draw the same thing: settings is not today's sun (enni-v2 #380)", () => {
  const drawn = ICONS.map((name) => renderToStaticMarkup(<Icon name={name} />));
  expect(new Set(drawn).size).toBe(ICONS.length);
  const paths = (name: (typeof ICONS)[number]) =>
    [...renderToStaticMarkup(<Icon name={name} />).matchAll(/d="([^"]+)"/g)].map((m) => m[1]);
  expect(paths("settings").some((d) => paths("today").includes(d))).toBe(false);
});
