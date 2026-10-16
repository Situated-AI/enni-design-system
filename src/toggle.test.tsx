import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { PRIMITIVES_CSS } from "./styles.ts";
import { Toggle, Toggles } from "./toggle.tsx";

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

test("enni-v2 #637: on may be the ready ink, and a few lie in a named group", () => {
  const ready = renderToStaticMarkup(
    <Toggle label="Has acceptance criteria" on tone="ready" onChange={() => {}} />,
  );
  expect(ready).toMatch(/^<label class="enni-toggle" data-tone="ready">/);
  const group = renderToStaticMarkup(
    <Toggles label="What the issue has">
      <Toggle label="A" on={false} onChange={() => {}} />
    </Toggles>,
  );
  expect(group).toMatch(
    /^<fieldset class="enni-toggles"><legend class="enni-visually-hidden">What the issue has<\/legend><label/,
  );
});

test("enni-v2 #637: the landing's switch — a 44 × 26 track and a white thumb that slides 18px", () => {
  expect(PRIMITIVES_CSS).toMatch(/\.enni-toggle__switch \{[^}]*width: 44px; height: 26px;/);
  expect(PRIMITIVES_CSS).toMatch(
    /\.enni-toggle__switch::after \{[^}]*background: var\(--enni-knob\);/,
  );
  expect(PRIMITIVES_CSS).toContain(
    ".enni-toggle__switch:checked::after { transform: translateX(18px); }",
  );
  expect(PRIMITIVES_CSS).toContain(
    '.enni-toggle[data-tone="ready"] .enni-toggle__switch:checked { background: var(--enni-ready-fg); }',
  );
});
