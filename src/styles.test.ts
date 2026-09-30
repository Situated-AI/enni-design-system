import { describe, expect, test } from "bun:test";
import { PRIMITIVES_CSS } from "./styles.ts";
import { LIGHT } from "./tokens.ts";

describe("the primitives' stylesheet", () => {
  test("names no colour by value — the palette lives in tokens.ts alone", () => {
    expect(PRIMITIVES_CSS).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(PRIMITIVES_CSS).not.toMatch(/\brgba?\(/);
  });

  test("every colour variable it names is a token that exists", () => {
    const named = [...PRIMITIVES_CSS.matchAll(/var\(--enni-([a-z-]+)\)/g)].map((m) => m[1] ?? "");
    const colours = named.filter(
      (n) =>
        !/^(space|radius|font|type|motion|measure|tone|shadow|leading|tracking|ease|orb)-/.test(n),
    );
    expect(colours.length).toBeGreaterThan(10);
    for (const name of colours) expect(Object.keys(LIGHT)).toContain(name);
  });

  test("Enni's voice is the serif, and a control inside it stays the sans (#278)", () => {
    expect(PRIMITIVES_CSS).toContain(".enni-voice { font-family: var(--enni-font-serif);");
    expect(PRIMITIVES_CSS).toMatch(
      /\.enni-voice :is\(button[^)]*\) \{ font-family: var\(--enni-font-sans\)/,
    );
  });

  test("the eyebrow is mono and tracked; the display is the display size", () => {
    expect(PRIMITIVES_CSS).toMatch(
      /\.enni-eyebrow \{[^}]*--enni-font-mono[^}]*--enni-tracking-eyebrow/,
    );
    expect(PRIMITIVES_CSS).toMatch(
      /\.enni-display \{[^}]*--enni-type-display[^}]*--enni-leading-display/,
    );
  });

  test("#279: the four motions are keyframes here, each run on a MOTION duration and the one easing", () => {
    const uses: Record<string, string> = {
      "enni-breath": "breath",
      "enni-listen": "calm",
      "enni-enter": "enter",
      "enni-sheet-in": "enter",
    };
    for (const [name, duration] of Object.entries(uses)) {
      expect(PRIMITIVES_CSS).toContain(`@keyframes ${name} {`);
      expect(PRIMITIVES_CSS).toContain(
        `animation: ${name} var(--enni-motion-${duration}) var(--enni-ease-standard)`,
      );
    }
    const animations = [...PRIMITIVES_CSS.matchAll(/animation: [\w-]+ ([^ ;]+)/g)].map((m) => m[1]);
    expect(animations.length).toBeGreaterThanOrEqual(4);
    for (const duration of animations) expect(duration).toMatch(/^var\(--enni-motion-[a-z]+\)$/);
  });

  test("a sheet arrives with sheet-in; the sphere is its tone's gradient", () => {
    expect(PRIMITIVES_CSS).toMatch(/\.enni-sheet\[open\] \{ animation: enni-sheet-in/);
    expect(PRIMITIVES_CSS).toContain(
      "radial-gradient(circle at 35% 30%, var(--enni-tone-glow) 0%, var(--enni-tone-ink) 55%, var(--enni-tone-deep) 100%)",
    );
  });

  test("focus is always visible", () => {
    expect(PRIMITIVES_CSS).toContain(":focus-visible");
  });

  test("controls are at least 44px tall", () => {
    expect(PRIMITIVES_CSS.match(/min-height: 44px/g)?.length).toBeGreaterThanOrEqual(3);
  });
});
