import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Toggle } from "./toggle.tsx";

test("#306: a labelled switch, its hint read with it, on or off", () => {
  const html = renderToStaticMarkup(
    <Toggle
      label="Email me this every morning"
      hint="Only on days something changed."
      on
      onChange={() => {}}
    />,
  );
  expect(html).toMatch(/^<label class="enni-toggle">/);
  expect(html).toContain('role="switch"');
  expect(html).toContain('checked=""');
  expect(html).toContain('aria-checked="true"');
  expect(html).toMatch(/aria-describedby="([^"]+)"/);
  const id = html.match(/aria-describedby="([^"]+)"/)?.[1];
  expect(html).toContain(`id="${id}" class="enni-toggle__hint">Only on days something changed.`);
});

test("off, and with no hint, nothing points at one", () => {
  const html = renderToStaticMarkup(<Toggle label="Email me" on={false} onChange={() => {}} />);
  expect(html).not.toContain('checked=""');
  expect(html).not.toContain("aria-describedby");
});
