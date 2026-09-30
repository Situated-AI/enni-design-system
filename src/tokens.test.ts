import { describe, expect, test } from "bun:test";
import { contrastRatio } from "./contrast.ts";
import {
  type ColourToken,
  colour,
  DARK,
  FONT,
  LEADING,
  LIGHT,
  MOTION,
  ORB,
  type Palette,
  paletteCss,
  RADIUS,
  SHADOW_DARK,
  SHADOW_LIGHT,
  SPACE,
  scaleCss,
  TOKENS_CSS,
  TRACKING,
  TYPE,
} from "./tokens.ts";

describe("the two themes", () => {
  test("name the same tokens, so a primitive never finds one missing in the dark", () => {
    expect(Object.keys(DARK).sort()).toEqual(Object.keys(LIGHT).sort());
    expect(Object.keys(SHADOW_DARK).sort()).toEqual(Object.keys(SHADOW_LIGHT).sort());
  });

  test("every value is oklch(L C H) — one notation, the designs' own, so a diff reads as a colour change", () => {
    for (const value of [...Object.values(LIGHT), ...Object.values(DARK)]) {
      expect(value).toMatch(/^oklch\(0?\.\d+ 0?\.\d+ \d+\)$/);
    }
  });

  test("the themes differ where it matters: canvas and ink swap ends", () => {
    expect(LIGHT.canvas).not.toBe(DARK.canvas);
    expect(LIGHT.ink).not.toBe(DARK.ink);
  });
});

/** WCAG AA for body text (#277). */
const AA = 4.5;
const STATUSES = ["ready", "care", "limited", "danger"] as const;
const READING: ColourToken[] = ["ink", "ink-muted", "ink-subtle"];

describe.each([
  ["light", LIGHT],
  ["dark", DARK],
] as [string, Palette][])("AA contrast in the %s theme", (_, palette) => {
  test.each([...STATUSES])("%s: its ink reads on its ground", (status) => {
    expect(contrastRatio(palette[`${status}-fg`], palette[`${status}-bg`])).toBeGreaterThanOrEqual(
      AA,
    );
  });

  test.each(READING)("%s reads on the canvas and on a surface", (ink) => {
    expect(contrastRatio(palette[ink], palette.canvas)).toBeGreaterThanOrEqual(AA);
    expect(contrastRatio(palette[ink], palette.surface)).toBeGreaterThanOrEqual(AA);
  });

  test("a primary button's label reads on the accent, and the said bubble's ink on its ground", () => {
    expect(contrastRatio(palette["accent-ink"], palette.accent)).toBeGreaterThanOrEqual(AA);
    expect(contrastRatio(palette.ink, palette["accent-soft"])).toBeGreaterThanOrEqual(AA);
  });
});

describe("the stylesheet is generated from the tables", () => {
  test("every palette token is declared as a custom property", () => {
    for (const [name, value] of Object.entries(LIGHT)) {
      expect(paletteCss(LIGHT)).toContain(`--enni-${name}: ${value};`);
    }
  });

  test("every step of the spacing and radius scales is declared", () => {
    for (const step of Object.keys(SPACE)) expect(scaleCss()).toContain(`--enni-space-${step}:`);
    for (const step of Object.keys(RADIUS)) expect(scaleCss()).toContain(`--enni-radius-${step}:`);
  });

  test("the radius scale derives from one base", () => {
    expect(RADIUS.lg).toBe("var(--enni-radius-base)");
    for (const step of ["sm", "md", "xl"] as const)
      expect(RADIUS[step]).toContain("--enni-radius-base");
  });

  test("dark applies by preference, with its own elevation, and reduced motion stills every animation", () => {
    expect(TOKENS_CSS).toContain("@media (prefers-color-scheme: dark)");
    expect(TOKENS_CSS).toContain(paletteCss(DARK));
    expect(TOKENS_CSS).toContain(`--enni-shadow-card: ${SHADOW_LIGHT.card};`);
    expect(TOKENS_CSS).toContain(`--enni-shadow-lift: ${SHADOW_DARK.lift};`);
    expect(TOKENS_CSS).toContain("prefers-reduced-motion: reduce");
  });

  test("reduced motion zeroes every MOTION duration, not a list typed beside it (#279)", () => {
    const still =
      TOKENS_CSS.split("\n").find((line) => line.includes("prefers-reduced-motion")) ?? "";
    for (const name of Object.keys(MOTION)) expect(still).toContain(`--enni-motion-${name}: 0ms;`);
  });

  test("the orb's stops are declared per tone, in OKLCH", () => {
    for (const [tone, { glow, deep }] of Object.entries(ORB)) {
      expect(scaleCss()).toContain(`--enni-orb-${tone}-glow: ${glow};`);
      expect(scaleCss()).toContain(`--enni-orb-${tone}-deep: ${deep};`);
      for (const stop of [glow, deep]) expect(stop).toMatch(/^oklch\(0?\.\d+ 0?\.\d+ \d+\)$/);
    }
  });
});

test("a colour is named through its variable, never as a value", () => {
  expect(colour("accent")).toBe("var(--enni-accent)");
});

describe("typography (#278)", () => {
  test("each family leads with its face, and keeps a system stack behind it", () => {
    expect(FONT.sans).toStartWith('"DM Sans", ');
    expect(FONT.serif).toStartWith("Newsreader, ");
    expect(FONT.mono).toStartWith('"JetBrains Mono", ');
    expect(FONT.sans).toEndWith("sans-serif");
    expect(FONT.serif).toEndWith("serif");
    expect(FONT.mono).toEndWith("monospace");
  });

  test("the display runs 2rem on a phone to 3rem on a desktop", () => {
    expect(TYPE.display).toMatch(/^clamp\(2rem, .+, 3rem\)$/);
  });

  test("every size has a line-height, and every one is declared", () => {
    expect(Object.keys(LEADING).sort()).toEqual(Object.keys(TYPE).sort());
    for (const step of Object.keys(LEADING))
      expect(scaleCss()).toContain(`--enni-leading-${step}:`);
  });

  test("the eyebrow's tracking is declared", () => {
    expect(scaleCss()).toContain(`--enni-tracking-eyebrow: ${TRACKING.eyebrow};`);
  });
});
