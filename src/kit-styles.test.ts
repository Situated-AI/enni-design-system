import { describe, expect, test } from "bun:test";
import { KIT_CSS } from "./kit-styles.ts";
import { PRIMITIVES_CSS } from "./styles.ts";
import { DARK, LIGHT, TRANSLUCENT_LIGHT } from "./tokens.ts";

const rule = (selector: string): string => {
  const css = `\n${KIT_CSS}`;
  const at = css.indexOf(`\n${selector} {`);
  expect(at).toBeGreaterThanOrEqual(0);
  return css.slice(at + 1).split("}")[0] ?? "";
};

test("tokens only: no colour by value, and every colour it names is a token", () => {
  expect(KIT_CSS).not.toMatch(/#[0-9a-fA-F]{3,8}\b|\brgba?\(|(?<![-\w])(white|black)(?![-\w])/);
  const tokens = [...Object.keys(LIGHT), ...Object.keys(TRANSLUCENT_LIGHT)];
  for (const [, name] of KIT_CSS.matchAll(/var\(--enni-([a-z-]+)\)/g))
    if (!/^(space|radius|font|type|motion|shadow|ease)-/.test(name ?? ""))
      expect(tokens).toContain(name ?? "");
  expect(PRIMITIVES_CSS).toContain(KIT_CSS);
});

describe("the code panel is the landing's, dark in both themes (enni-v2 #637)", () => {
  test("its ground and inks are the code tokens, which do not change with the theme", () => {
    expect(rule(".enni-term")).toContain(
      "background: var(--enni-code-bg); color: var(--enni-code-ink); font-family: var(--enni-font-mono)",
    );
    for (const tone of ["accent", "ready", "care", "danger"] as const) {
      expect(KIT_CSS).toContain(`.enni-term__${tone} { color: var(--enni-code-${tone}); }`);
      expect(DARK[`code-${tone}`]).toBe(LIGHT[`code-${tone}`]);
    }
  });

  test("a block wraps its line and keeps room for the copy button, a glass chip in its corner", () => {
    expect(rule(".enni-code .enni-term")).toContain(
      "padding-right: 96px; white-space: pre-wrap; overflow-wrap: anywhere",
    );
    const copy = rule(".enni-copy");
    expect(copy).toContain("position: absolute; top: 10px; right: 10px");
    expect(copy).toContain("background: color-mix(in oklab, var(--enni-code-ink) 6%, transparent)");
    expect(KIT_CSS).toContain("@media (pointer: coarse) { .enni-copy { min-height: 44px; } }");
  });

  test("focus on the dark is the code panel's own violet, so the ring reads on it", () => {
    expect(KIT_CSS).toContain(
      ".enni-term:focus-visible, .enni-copy:focus-visible { outline: 2px solid var(--enni-code-accent); outline-offset: 2px; }",
    );
  });
});

test("the thinking line is mono and muted, its spinner the accent turning on the spin duration", () => {
  expect(rule(".enni-thinking")).toContain(
    "color: var(--enni-ink-muted); font-family: var(--enni-font-mono)",
  );
  expect(rule(".enni-spin")).toContain(
    "border-top-color: var(--enni-accent); border-radius: var(--enni-radius-pill); animation: enni-spin var(--enni-motion-spin) linear infinite",
  );
});

test("a tab is still a 44px target by touch", () => {
  expect(rule(".enni-tab")).toContain("min-height: var(--enni-space-control)");
});
