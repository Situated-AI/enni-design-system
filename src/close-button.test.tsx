import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { CloseButton } from "./close-button.tsx";
import { PRIMITIVES_CSS } from "./styles.ts";

test("CloseButton: a button named by the word it is given, drawing a glyph nobody is read", () => {
  expect(renderToStaticMarkup(<CloseButton label="Close" onClick={() => {}} />)).toBe(
    '<button type="button" class="enni-close" aria-label="Close"><span aria-hidden="true">×</span></button>',
  );
});

test("it is a 44px target with no border, so the ring on it is the one standard ring", () => {
  expect(PRIMITIVES_CSS).toMatch(/\.enni-close \{ [^}]*min-width: 44px; min-height: 44px;/);
  expect(PRIMITIVES_CSS).toMatch(/\.enni-close \{ [^}]*border: 0;/);
  // Nothing draws a second ring: no focus rule of its own, only the page's `:focus-visible`.
  expect(PRIMITIVES_CSS).not.toMatch(/\.enni-close:focus/);
  expect(PRIMITIVES_CSS).not.toMatch(/\.enni-close \{ [^}]*(outline|box-shadow)/);
  expect(PRIMITIVES_CSS).toContain(
    ":focus-visible { outline: 2px solid var(--enni-focus); outline-offset: 2px; }",
  );
});

test("the dialog's own close class is gone: there is one close control", () => {
  expect(PRIMITIVES_CSS).not.toContain("enni-dialog__close");
});
