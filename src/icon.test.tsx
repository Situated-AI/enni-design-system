import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { ICONS, Icon } from "./icon.tsx";
import { MARKS } from "./icon-marks.ts";

const isMark = (name: string) => (MARKS as readonly string[]).includes(name);

describe("Icon", () => {
  test.each([...ICONS])("%s is drawn, hidden, and in its text's colour", (name) => {
    const html = renderToStaticMarkup(<Icon name={name} />);
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain(isMark(name) ? 'fill="currentColor"' : 'stroke="currentColor"');
    expect(html).toMatch(/<path d="[^"]+"/);
  });

  test("names no colour — an icon is whatever colour its text is", () => {
    for (const name of ICONS) {
      expect(renderToStaticMarkup(<Icon name={name} />)).not.toMatch(/#[0-9a-f]{3,6}\b|oklch|rgb/i);
    }
  });

  test("one set: every icon is 16px, and the names are distinct", () => {
    expect(new Set(ICONS).size).toBe(ICONS.length);
    for (const name of ICONS)
      expect(renderToStaticMarkup(<Icon name={name} />)).toContain('width="16" height="16"');
  });
});

test("no two icons draw the same thing: settings is not today's sun (enni-v2 #380)", () => {
  const drawn = ICONS.map((name) => renderToStaticMarkup(<Icon name={name} />));
  expect(new Set(drawn).size).toBe(ICONS.length);
  const paths = (name: (typeof ICONS)[number]) =>
    [...renderToStaticMarkup(<Icon name={name} />).matchAll(/d="([^"]+)"/g)].map((m) => m[1]);
  expect(paths("settings").some((d) => paths("today").includes(d))).toBe(false);
});

test("a disclosure's chevron and a row's subjects are in the set (enni-v2 #483)", () => {
  for (const name of ["chevron", "key", "codes", "device", "phone", "tool", "card", "app"])
    expect(ICONS as readonly string[]).toContain(name);
});
