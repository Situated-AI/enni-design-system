import { describe, expect, test } from "bun:test";
import { MOTION_CSS } from "./motion-styles.ts";
import { SPRING_CSS } from "./spring-styles.ts";
import { EASE, MOTION } from "./tokens.ts";

describe("the landing's springs (enni-v2 #637)", () => {
  test("every duration and easing is a token: no time is typed here", () => {
    expect([...SPRING_CSS.matchAll(/(\d+m?s)\b/g)]).toEqual([]);
    for (const [, name] of SPRING_CSS.matchAll(/var\(--enni-motion-([a-z-]+)\)/g))
      expect(Object.keys(MOTION)).toContain(name ?? "");
    for (const [, name] of SPRING_CSS.matchAll(/var\(--enni-ease-([a-z]+)\)/g))
      expect(Object.keys(EASE)).toContain(name ?? "");
    expect(MOTION_CSS.endsWith(SPRING_CSS)).toBe(true);
  });

  test("a button grows under a pointer, never when it cannot be pressed", () => {
    expect(SPRING_CSS).toContain(".enni-button:not([disabled]):hover { transform: scale(1.03); }");
    expect(SPRING_CSS).not.toMatch(/\.enni-button:hover/);
  });

  test("an interactive card lifts on the long spring and gives under a press", () => {
    expect(SPRING_CSS).toContain(
      "transform var(--enni-motion-spring-long) var(--enni-ease-spring)",
    );
    expect(SPRING_CSS).toContain(
      ".enni-card--interactive:hover { border-color: var(--enni-line-strong); box-shadow: var(--enni-shadow-card); transform: translateY(-4px) scale(1.012); }",
    );
    expect(SPRING_CSS).toMatch(/\.enni-card--interactive:active \{ transform: scale\(0\.975\);/);
  });

  test("a question opens over its height where the browser can interpolate to auto", () => {
    expect(SPRING_CSS).toContain(".enni-faq details[open]::details-content { block-size: auto; }");
  });

  test("an arriving answer's parts rise one after another, the rest with the last", () => {
    expect(SPRING_CSS).toContain(
      ".enni-answer-card--arriving .enni-answer-card__body > :nth-child(2) { animation-delay: calc(var(--enni-motion-stagger) * 3); }",
    );
    expect(SPRING_CSS).toContain(
      ".enni-answer-card--arriving .enni-answer-card__body > :nth-child(n + 6)",
    );
  });
});

describe("where less motion is asked for, nothing moves", () => {
  const still = SPRING_CSS.slice(SPRING_CSS.indexOf("@media (prefers-reduced-motion: reduce)"));

  test("nothing is scaled, lifted or turned", () => {
    for (const moved of [
      ".enni-button:not([disabled]):hover",
      ".enni-card--interactive:hover",
      "a.enni-pill:hover",
    ])
      expect(still).toMatch(
        new RegExp(`${moved.replace(/[.()[\]:]/g, "\\$&")}[^{]*\\{ transform: none; \\}`),
      );
    expect(still).toContain("a.enni-brand:hover > .enni-brand__tile { rotate: none; }");
    expect(still).toContain(".enni-button--primary::after { display: none; }");
  });

  test("nothing loops: the live dot, the glow's edge, the spinner", () => {
    const loops = still.slice(still.indexOf(".enni-badge__dot"));
    for (const looped of [".enni-badge__dot", ".enni-button--glow", ".enni-spin"])
      expect(loops.split("{")[0]).toContain(looped);
    expect(loops).toContain("{ animation: none; }");
  });
});
