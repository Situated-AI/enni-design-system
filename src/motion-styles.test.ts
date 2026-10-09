import { describe, expect, test } from "bun:test";
import { MOTION_CSS, STAGGER_STEPS } from "./motion-styles.ts";
import { PRIMITIVES_CSS } from "./styles.ts";
import { EASE, MOTION } from "./tokens.ts";

describe("how the primitives move (enni-v2 #428)", () => {
  test("every duration and easing is a token, so reduced motion stills all of it", () => {
    const timed = [...MOTION_CSS.matchAll(/(\d+m?s)\b/g)].map((m) => m[1]);
    expect(timed).toEqual([]);
    for (const [, name] of MOTION_CSS.matchAll(/var\(--enni-motion-([a-z]+)\)/g))
      expect(Object.keys(MOTION)).toContain(name ?? "");
    for (const [, name] of MOTION_CSS.matchAll(/var\(--enni-ease-([a-z]+)\)/g))
      expect(Object.keys(EASE)).toContain(name ?? "");
  });

  test("every control eases between its states and gives under a press", () => {
    for (const control of [".enni-button", ".enni-chip", ".enni-talk", ".enni-toggle"])
      expect(MOTION_CSS).toMatch(new RegExp(`${control.replace(".", "\\.")}[^{]*\\{ transition:`));
    expect(MOTION_CSS).toMatch(/\.enni-button:not\(\[disabled\]\):active[^{]*\{ transform: scale/);
  });

  test("a disabled control never moves under a press", () => {
    expect(MOTION_CSS).not.toMatch(/\.enni-button:active/);
    expect(MOTION_CSS).not.toMatch(/\.enni-talk:active/);
  });

  test("a sheet and a dialog leave over motion-exit, and stay painted until they have", () => {
    expect(MOTION_CSS).toMatch(
      /\.enni-sheet, \.enni-dialog \{ opacity: 0; transition: opacity var\(--enni-motion-exit\)/,
    );
    expect(MOTION_CSS).toContain("display var(--enni-motion-exit) allow-discrete");
  });

  test("they arrive over motion-enter, from a starting style and never from a keyframe", () => {
    expect(MOTION_CSS).toMatch(
      /\.enni-sheet\[open\], \.enni-dialog\[open\] \{ opacity: 1; transform: none; transition: opacity var\(--enni-motion-enter\)/,
    );
    expect(MOTION_CSS).toMatch(/@starting-style \{\s+\.enni-sheet\[open\] \{ opacity: 0;/);
    expect(PRIMITIVES_CSS).not.toMatch(/\.enni-(sheet|dialog)\[open\] \{ animation:/);
  });

  test("a disclosure animates its height only where the browser can", () => {
    expect(MOTION_CSS).toContain("@supports (interpolate-size: allow-keywords)");
    expect(MOTION_CSS).toContain(".enni-details[open]::details-content");
  });

  test("a staggered list delays its first items one step each, and the rest with the last", () => {
    for (let n = 1; n < STAGGER_STEPS; n += 1)
      expect(MOTION_CSS).toContain(`.enni-stagger > :nth-child(${n}) {`);
    expect(MOTION_CSS).toContain(`.enni-stagger > :nth-child(n + ${STAGGER_STEPS}) {`);
  });

  test("the skeleton pulses on the calm duration", () => {
    expect(MOTION_CSS).toContain("@keyframes enni-pulse {");
    expect(MOTION_CSS).toMatch(
      /\.enni-skeleton__line \{[^}]*animation: enni-pulse var\(--enni-motion-calm\)/,
    );
  });

  test("it is the last thing in the primitives' stylesheet, so it extends without restating", () => {
    expect(PRIMITIVES_CSS.endsWith(MOTION_CSS)).toBe(true);
  });
});

test("what is behind a sheet or a dialog is softened, unless less transparency was asked for (enni-v2 #532)", () => {
  expect(MOTION_CSS).toContain(
    "@media (prefers-reduced-transparency: no-preference) {\n  .enni-sheet::backdrop, .enni-dialog::backdrop { -webkit-backdrop-filter: blur(3px); backdrop-filter: blur(3px); }\n}",
  );
});
