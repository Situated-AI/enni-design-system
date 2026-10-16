import { describe, expect, test } from "bun:test";
import { contrastRatio, parseOklch } from "./contrast.ts";
import {
  BRAND,
  type ColourToken,
  DARK,
  LIGHT,
  ORB,
  type Palette,
  SHADOW_DARK,
  SHADOW_LIGHT,
  TRANSLUCENT_DARK,
  TRANSLUCENT_LIGHT,
} from "./palette.ts";

/** Plain OKLCH, L from 0 to 1: the designs' notation, so a diff reads as a colour change. */
const PLAIN = /^oklch\((?:0?\.\d+|1|0) (?:0?\.\d+|0) \d+\)$/;

describe("the two themes", () => {
  test("name the same tokens, so a primitive never finds one missing in the dark", () => {
    expect(Object.keys(DARK).sort()).toEqual(Object.keys(LIGHT).sort());
    expect(Object.keys(SHADOW_DARK).sort()).toEqual(Object.keys(SHADOW_LIGHT).sort());
    expect(Object.keys(TRANSLUCENT_DARK).sort()).toEqual(Object.keys(TRANSLUCENT_LIGHT).sort());
  });

  test("every value is oklch(L C H) — one notation, the designs' own, so a diff reads as a colour change", () => {
    for (const value of [...Object.values(LIGHT), ...Object.values(DARK)]) {
      expect(value).toMatch(PLAIN);
      expect(parseOklch(value)[0]).toBeLessThanOrEqual(1);
    }
  });

  test("what stays translucent is OKLCH with an alpha, and nothing else is", () => {
    for (const value of [...Object.values(TRANSLUCENT_LIGHT), ...Object.values(TRANSLUCENT_DARK)])
      expect(value).toMatch(/^oklch\([\d.]+ [\d.]+ \d+ \/ 0?\.\d+\)$/);
  });

  test("the themes differ where it matters: canvas and ink swap ends, and so does the primary button", () => {
    expect(LIGHT.canvas).not.toBe(DARK.canvas);
    expect(LIGHT.ink).not.toBe(DARK.ink);
    expect(LIGHT.btn).toBe(LIGHT.ink);
    expect(DARK.btn).toBe(DARK.ink);
  });

  test("the accent is the landing's one violet (#5046E5, #A5A0FF), and focus is the accent", () => {
    expect(LIGHT.accent).toBe("oklch(0.511 0.23 277)");
    expect(DARK.accent).toBe("oklch(0.748 0.135 285)");
    for (const palette of [LIGHT, DARK]) expect(palette.focus).toBe(palette.accent);
  });

  test("nothing is left on the old warm neutral: every grey is slate, hue 240–290 (enni-v2 #635)", () => {
    const greys: ColourToken[] = [
      ...(["sunken", "hover", "disabled", "line", "line-strong"] as const),
      ...(["ink", "ink-muted", "ink-subtle", "btn", "btn-hover", "code-bg", "code-dim"] as const),
    ];
    for (const palette of [LIGHT, DARK])
      for (const token of greys) {
        const [, chroma, hue] = parseOklch(palette[token]);
        if (chroma > 0) expect(hue).toBeWithin(240, 291);
      }
    const [, , neutralHue] = parseOklch(ORB.neutral.deep);
    expect(neutralHue).toBeWithin(240, 291);
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

  test.each(READING)("%s reads on the sunken and hover grounds as well (enni-v2 #635)", (ink) => {
    expect(contrastRatio(palette[ink], palette.sunken)).toBeGreaterThanOrEqual(AA);
    expect(contrastRatio(palette[ink], palette.hover)).toBeGreaterThanOrEqual(AA);
  });

  test("a primary button's label reads on the ink fill, at rest and under a hover (enni-v2 #635)", () => {
    expect(contrastRatio(palette["btn-ink"], palette.btn)).toBeGreaterThanOrEqual(AA);
    expect(contrastRatio(palette["btn-ink"], palette["btn-hover"])).toBeGreaterThanOrEqual(AA);
  });

  test("a label reads on the accent, and the said bubble's ink on its ground", () => {
    expect(contrastRatio(palette["accent-ink"], palette.accent)).toBeGreaterThanOrEqual(AA);
    expect(contrastRatio(palette.ink, palette["accent-soft"])).toBeGreaterThanOrEqual(AA);
    // #280: the count badge — the accent on its soft ground.
    expect(contrastRatio(palette.accent, palette["accent-soft"])).toBeGreaterThanOrEqual(AA);
  });

  test("a code block's ink and its dimmed ink both read on its ground", () => {
    expect(contrastRatio(palette["code-ink"], palette["code-bg"])).toBeGreaterThanOrEqual(AA);
    expect(contrastRatio(palette["code-dim"], palette["code-bg"])).toBeGreaterThanOrEqual(AA);
  });

  test.each(["code-accent", "code-ready", "code-care", "code-danger"] as const)(
    "a terminal's %s reads on the code ground (enni-v2 #637)",
    (ink) => expect(contrastRatio(palette[ink], palette["code-bg"])).toBeGreaterThanOrEqual(AA),
  );

  test("a disabled control's label still reads, and its ground is neither a button nor a surface (enni-v2 #480)", () => {
    expect(contrastRatio(palette["ink-subtle"], palette.disabled)).toBeGreaterThanOrEqual(AA);
    // Told from a primary button at a glance, and from a secondary one by more than its label.
    expect(contrastRatio(palette.disabled, palette.btn)).toBeGreaterThanOrEqual(3);
    expect(contrastRatio(palette.disabled, palette.accent)).toBeGreaterThanOrEqual(3);
    expect(palette.disabled).not.toBe(palette.surface);
    expect(palette.disabled).not.toBe(palette.canvas);
  });
});

test("a code block and a switch's thumb are the same in both themes: dark code, a white thumb (enni-v2 #637)", () => {
  const fixed: ColourToken[] = ["code-ink", "code-accent", "code-ready", "code-care", "knob"];
  for (const token of fixed) expect(DARK[token]).toBe(LIGHT[token]);
  expect(LIGHT.knob).toBe("oklch(1 0 0)");
});

test("the orb's stops are OKLCH, one pair per tone", () => {
  for (const { glow, deep } of Object.values(ORB))
    for (const stop of [glow, deep]) expect(stop).toMatch(PLAIN);
});

test("the brand's tones are plain OKLCH, its layers step down in lightness, its ink is the slate ink", () => {
  for (const tone of Object.values(BRAND)) expect(tone).toMatch(PLAIN);
  const layers = (["lavender", "lilac", "violet", "iris", "indigo"] as const).map(
    (tone) => parseOklch(BRAND[tone])[0],
  );
  expect([...layers].sort((a, b) => b - a)).toEqual(layers);
  expect(BRAND.ink).toBe(LIGHT.ink);
  expect(BRAND.ring).toBe("oklch(1 0 0)");
});

test("the brand's ink dot holds apart from its white ring, and the ring from every layer it sits on", () => {
  expect(contrastRatio(BRAND.ink, BRAND.ring)).toBeGreaterThanOrEqual(AA);
  for (const tone of ["violet", "plum", "indigo", "iris"] as const)
    expect(contrastRatio(BRAND[tone], BRAND.ring)).toBeGreaterThanOrEqual(3);
});
