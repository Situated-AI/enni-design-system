import { describe, expect, test } from "bun:test";
import { CONTROL_CSS } from "./control-styles.ts";
import { PRIMITIVES_CSS } from "./styles.ts";
import { LIGHT, TRANSLUCENT_LIGHT } from "./tokens.ts";

const rule = (selector: string): string => {
  const css = `\n${CONTROL_CSS}`;
  const at = css.indexOf(`\n${selector} {`);
  expect(at).toBeGreaterThanOrEqual(0);
  return css.slice(at + 1).split("}")[0] ?? "";
};

test("tokens only: no colour by value, and every colour it names is a token", () => {
  expect(CONTROL_CSS).not.toMatch(/#[0-9a-fA-F]{3,8}\b|\brgba?\(|(?<![-\w])(white|black)(?![-\w])/);
  const tokens = [...Object.keys(LIGHT), ...Object.keys(TRANSLUCENT_LIGHT), "angle"];
  for (const [, name] of CONTROL_CSS.matchAll(/var\(--enni-([a-z-]+)\)/g))
    if (!/^(space|radius|font|type|motion|shadow|ease|tone)-/.test(name ?? ""))
      expect(tokens).toContain(name ?? "");
});

test("it is in the primitives' stylesheet", () => {
  expect(PRIMITIVES_CSS).toContain(CONTROL_CSS);
});

describe("the button is the landing's .lp-btn (enni-v2 #637)", () => {
  test("15px semibold on a 12px radius, still a 44px target by touch", () => {
    const base = rule(".enni-button");
    expect(base).toContain("min-height: var(--enni-space-control)");
    expect(base).toContain("border-radius: var(--enni-radius-lg)");
    expect(base).toContain("font-size: var(--enni-type-md); font-weight: 600");
  });

  test("the primary is ink with the glow beneath, and a sheen crosses it under a hover", () => {
    expect(rule(".enni-button--primary")).toContain(
      "background: var(--enni-btn); color: var(--enni-btn-ink); box-shadow: var(--enni-shadow-rest), 0 8px 24px -10px var(--enni-glow)",
    );
    const sheen = rule(".enni-button--primary:not([disabled])::after");
    expect(sheen).toContain("color-mix(in oklab, var(--enni-accent) 45%, transparent)");
    expect(sheen).toContain("translate: -130% 0");
    expect(rule(".enni-button--primary:not([disabled]):hover::after")).toContain(
      "translate: 130% 0",
    );
  });

  test("ghost is outlined in the strong line; glow's edge turns in the accent", () => {
    expect(rule(".enni-button--ghost")).toContain("border-color: var(--enni-line-strong)");
    const glow = rule(".enni-button--glow");
    expect(glow).toContain("conic-gradient(from var(--enni-angle), var(--enni-accent)");
    expect(glow).toContain("animation: enni-orbit var(--enni-motion-orbit) linear infinite");
    expect(CONTROL_CSS).toContain('@property --enni-angle { syntax: "<angle>";');
  });

  test("small is the landing's: 14px on a 10px radius", () => {
    expect(rule(".enni-button--sm")).toBe(
      ".enni-button--sm { padding: 0 14px; border-radius: calc(var(--enni-radius-base) - 2px); font-size: 0.875rem; ",
    );
  });

  test("its focus ring is the accent, held off the edge", () => {
    expect(rule(".enni-button:focus-visible")).toContain(
      "outline: 2px solid var(--enni-focus); outline-offset: 3px",
    );
  });
});

describe("chips, badges, pills and tags", () => {
  test("a status badge is the landing's verdict chip: a pill in its tone, with a live dot", () => {
    const badge = rule(".enni-badge");
    expect(badge).toContain("padding: 5px 12px; border: 1px solid var(--enni-tone-edge)");
    expect(badge).toContain("border-radius: var(--enni-radius-pill)");
    expect(rule(".enni-badge__dot")).toContain("animation: enni-ring var(--enni-motion-ring)");
  });

  test("a pill is glass with a badge in the accent; a tag is mono capitals on its tone's ground", () => {
    expect(rule(".enni-pill")).toContain("background: var(--enni-glass)");
    expect(rule(".enni-pill__badge")).toContain(
      "background: var(--enni-accent-soft); color: var(--enni-accent)",
    );
    const tag = rule(".enni-tag");
    expect(tag).toContain("background: var(--enni-tone-ground); color: var(--enni-tone-ink)");
    expect(tag).toContain("text-transform: uppercase");
  });
});

describe("fields are the landing's .lp-fld and .lp-try__box", () => {
  test("outlined in the strong line, ringed in the accent's soft ground when focused", () => {
    expect(rule(".enni-field :is(input, textarea, select)")).toContain(
      "border: 1px solid var(--enni-line-strong); border-radius: var(--enni-radius-lg)",
    );
    expect(rule(".enni-field :is(input, textarea, select):focus")).toContain(
      "border-color: var(--enni-accent); box-shadow: 0 0 0 4px var(--enni-accent-soft)",
    );
  });

  test("a wrong field is the danger's ink; a right one the ready's, with its tick shown", () => {
    expect(CONTROL_CSS).toContain(
      '.enni-field[data-state="bad"] :is(input, textarea, select) { border-color: var(--enni-danger-fg); }',
    );
    expect(CONTROL_CSS).toContain(
      '.enni-field[data-state="good"] .enni-field__tick { opacity: 1; scale: 1; }',
    );
  });

  test("an action field glows as a whole when its input is focused, and shakes when refused", () => {
    expect(rule(".enni-action-field__box:focus-within")).toContain(
      "box-shadow: 0 0 0 4px var(--enni-accent-soft), var(--enni-shadow-card)",
    );
    expect(rule('.enni-action-field[data-state="bad"] .enni-action-field__box')).toContain(
      "animation: enni-shake var(--enni-motion-spring)",
    );
  });
});
