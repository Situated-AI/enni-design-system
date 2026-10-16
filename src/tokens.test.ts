import { describe, expect, test } from "bun:test";
import {
  colour,
  DARK,
  EASE,
  FONT,
  LEADING,
  LIGHT,
  MOTION,
  ORB,
  paletteCss,
  RADIUS,
  SHADOW_DARK,
  SHADOW_LIGHT,
  SPACE,
  scaleCss,
  CONTROL,
  TOKENS_CSS,
  TRACKING,
  TRANSLUCENT_DARK,
  TRANSLUCENT_LIGHT,
  TYPE,
} from "./tokens.ts";

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

  test("a chosen theme overrides the system's, and no choice follows it (enni-v2 #433)", () => {
    expect(TOKENS_CSS).toContain(
      `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { ${paletteCss(DARK)}`,
    );
    expect(TOKENS_CSS).toContain(
      `:root[data-theme="dark"] { color-scheme: dark; ${paletteCss(DARK)}`,
    );
    expect(TOKENS_CSS).toContain(`:root[data-theme="light"] { color-scheme: light; }`);
  });

  test("reduced motion zeroes every MOTION duration, not a list typed beside it (#279)", () => {
    const still =
      TOKENS_CSS.split("\n").find((line) => line.includes("prefers-reduced-motion")) ?? "";
    for (const name of Object.keys(MOTION)) expect(still).toContain(`--enni-motion-${name}: 0ms;`);
  });

  test("the orb's stops are declared per tone", () => {
    for (const [tone, { glow, deep }] of Object.entries(ORB)) {
      expect(scaleCss()).toContain(`--enni-orb-${tone}-glow: ${glow};`);
      expect(scaleCss()).toContain(`--enni-orb-${tone}-deep: ${deep};`);
    }
  });

  test("the glow, glass and scrim are declared per theme (enni-v2 #635)", () => {
    const [root, preferred, chosen] = TOKENS_CSS.split("\n");
    for (const [name, value] of Object.entries(TRANSLUCENT_LIGHT))
      expect(root).toContain(`--enni-${name}: ${value};`);
    for (const [name, value] of Object.entries(TRANSLUCENT_DARK)) {
      expect(preferred).toContain(`--enni-${name}: ${value};`);
      expect(chosen).toContain(`--enni-${name}: ${value};`);
    }
  });
});

describe("the spring (enni-v2 #635)", () => {
  test("is the landing's linear() curve, overshooting a little and ending at rest", () => {
    expect(EASE.spring).toStartWith("linear(0, ");
    expect(EASE.spring).toEndWith(", 1)");
    const stops = EASE.spring.slice("linear(".length, -1).split(", ");
    const peaks = stops.map((stop) => Number(stop.split(" ")[0]));
    expect(Math.max(...peaks)).toBeWithin(1.01, 1.1);
    expect(scaleCss()).toContain(`--enni-ease-spring: ${EASE.spring};`);
  });

  test("has its two durations, which reduced motion zeroes with the rest", () => {
    expect(MOTION.spring).toBe("500ms");
    expect(MOTION["spring-long"]).toBe("800ms");
    const still = TOKENS_CSS.split("\n").find((line) => line.includes("reduced-motion")) ?? "";
    expect(still).toContain("--enni-motion-spring: 0ms;");
    expect(still).toContain("--enni-motion-spring-long: 0ms;");
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

describe("the control height (enni-v2 #472)", () => {
  test("44px by default, so touch keeps its target; 36px only under a fine pointer", () => {
    const [root] = TOKENS_CSS.split("\n");
    expect(root).toContain("--enni-space-control: 44px;");
    expect(TOKENS_CSS).toContain(
      "@media (pointer: fine) { :root { --enni-space-control: 36px; } }",
    );
    expect(TOKENS_CSS.match(/--enni-space-control:/g)).toHaveLength(2);
  });

  test("the two sizes are the table's, and the dense one is still a comfortable pointer target", () => {
    expect(CONTROL).toEqual({ touch: "44px", fine: "36px" });
    expect(Number.parseInt(CONTROL.fine, 10)).toBeGreaterThanOrEqual(32);
  });
});
