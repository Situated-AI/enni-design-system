import { describe, expect, test } from "bun:test";
import { PRIMITIVES_CSS } from "./styles.ts";
import { CONTROL, LIGHT } from "./tokens.ts";

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

  test("#279: the motions are keyframes here, each run on a MOTION duration and the one easing", () => {
    // `enni-sheet-in` stays for a screen's own use (enni-v2's phone rail); sheets and dialogs
    // themselves arrive by transition now (motion-styles.ts).
    expect(PRIMITIVES_CSS).toContain("@keyframes enni-sheet-in {");
    const uses: Record<string, string> = {
      "enni-breath": "breath",
      "enni-listen": "calm",
      "enni-enter": "enter",
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

  test("the sphere is its tone's gradient", () => {
    expect(PRIMITIVES_CSS).toContain(
      "radial-gradient(circle at 35% 30%, var(--enni-tone-glow) 0%, var(--enni-tone-ink) 55%, var(--enni-tone-deep) 100%)",
    );
  });

  test("#280: a status badge draws in the tone triplet StatusMark's tones set", () => {
    expect(PRIMITIVES_CSS).toMatch(
      /\.enni-badge \{[^}]*--enni-tone-edge[^}]*--enni-tone-ground[^}]*--enni-tone-ink/,
    );
  });

  test("#280: every tappable primitive is at least 44px", () => {
    // enni-v2 #472: a button and a chip read the control token, which is 44px by touch.
    for (const rule of [".enni-button {", ".enni-chip {"]) {
      const body = PRIMITIVES_CSS.slice(PRIMITIVES_CSS.indexOf(rule)).split("}")[0] ?? "";
      expect(body).toContain("min-height: var(--enni-space-control)");
    }
    const brand = PRIMITIVES_CSS.slice(PRIMITIVES_CSS.indexOf("a.enni-brand {")).split("}")[0];
    expect(brand).toMatch(/min-height: 4[4-9]px/);
    expect(CONTROL.touch).toBe("44px");
  });

  test("focus is always visible", () => {
    expect(PRIMITIVES_CSS).toContain(":focus-visible");
  });

  test("controls are at least 44px tall", () => {
    expect(PRIMITIVES_CSS.match(/min-height: 44px/g)?.length).toBeGreaterThanOrEqual(3);
  });
});

test("the composer's main action is Send, solid at every width; the mic never takes its place (enni-v2 #486)", () => {
  expect(PRIMITIVES_CSS).toMatch(
    /\.enni-composer__send \{[^}]*background: var\(--enni-accent\); color: var\(--enni-accent-ink\);/,
  );
  // No width at which the talk button is filled: it was the solid one on a phone only.
  expect(PRIMITIVES_CSS).not.toMatch(
    /\.enni-talk:not\(\[data-listening="true"\]\) \{[^}]*background/,
  );
});

test("no link falls to the browser's default colour: a bare link takes the ink around it (enni-v2 #486)", () => {
  expect(PRIMITIVES_CSS).toContain("\na { color: inherit; }\n");
  // An element selector, so every class that colours a link still wins.
  expect(PRIMITIVES_CSS.indexOf("\na { color: inherit; }")).toBeLessThan(
    PRIMITIVES_CSS.indexOf(".enni-button"),
  );
});
