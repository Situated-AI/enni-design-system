/**
 * Enni's design tokens (#61, D-55): colour, space, type, radius and motion — written fresh from
 * `product-spec.md`, not lifted from v1's bundle or the design exports.
 *
 * **Every value is a CSS custom property**, so a primitive names `var(--enni-ink)` and never a hex.
 * One derivation (D-38): `TOKENS_CSS` is generated from these tables, and nothing else in the tree
 * types a colour. The web app puts it on the page once, in its root layout.
 *
 * **Two themes, one set of names.** Dark follows the reader's system preference; a token that
 * exists in one theme exists in the other, and `palette.test.ts` holds them equal.
 *
 * **The colours are the landing's** (enni-v2 #635, v0.6.0) and live in `palette.ts`; this module
 * holds the scales, the motion and the stylesheet they make.
 */
import {
  type ColourToken,
  type Elevation,
  ORB,
  type Palette,
  type Translucent,
  DARK,
  LIGHT,
  SHADOW_DARK,
  SHADOW_LIGHT,
  TRANSLUCENT_DARK,
  TRANSLUCENT_LIGHT,
} from "./palette.ts";

export {
  type ColourToken,
  DARK,
  type Elevation,
  LIGHT,
  ORB,
  type Palette,
  SHADOW_DARK,
  SHADOW_LIGHT,
  type Translucent,
  TRANSLUCENT_DARK,
  TRANSLUCENT_LIGHT,
} from "./palette.ts";

/** A 4px grid. Named by step, so a gap is chosen from the scale rather than invented. */
export const SPACE = {
  "0": "0",
  "1": "4px",
  "2": "8px",
  "3": "12px",
  "4": "16px",
  "5": "24px",
  "6": "32px",
  "7": "48px",
  "8": "64px",
} as const;

/** One base, the rest derived from it as the designs do (#277): sm 6px, md 8px, lg 12px, xl 16px. */
export const RADIUS = {
  base: "0.75rem",
  sm: "calc(var(--enni-radius-base) - 6px)",
  md: "calc(var(--enni-radius-base) - 4px)",
  lg: "var(--enni-radius-base)",
  xl: "calc(var(--enni-radius-base) + 4px)",
  "2xl": "1rem",
  pill: "999px",
} as const;

/**
 * Three families, each with one job (#278, D-135): **DM Sans** for everything the interface says,
 * **Newsreader** for what Enni says (`.enni-voice`), **JetBrains Mono** for eyebrows, ticket keys
 * and source paths. Each leads a stack whose system fonts stay as the fallback, so a page whose
 * fonts have not arrived — or never will — still reads. The faces themselves are the web app's
 * (`font-faces.ts`): this package names families and serves no files.
 */
export const FONT = {
  sans: '"DM Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  serif: 'Newsreader, ui-serif, Georgia, Cambria, "Times New Roman", serif',
  mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',
} as const;

/**
 * Five sizes and a display. The sentence of an answer is `lg`: it comes first and reads first (§3).
 * `display` is the landing's headline: 2rem on a phone, growing to 3rem on a desktop.
 */
export const TYPE = {
  sm: "0.8125rem",
  md: "0.9375rem",
  lg: "1.125rem",
  xl: "1.375rem",
  xxl: "2rem",
  display: "clamp(2rem, 1.25rem + 3.2vw, 3rem)",
} as const;

/** A line-height per step of `TYPE` — looser for reading, tighter as the size grows. */
export const LEADING: Readonly<Record<keyof typeof TYPE, string>> = {
  sm: "1.45",
  md: "1.55",
  lg: "1.6",
  xl: "1.35",
  xxl: "1.2",
  display: "1.05",
};

/** Letter-spacing: mono eyebrows open up, the display headline closes in (the designs' values). */
export const TRACKING = { eyebrow: "0.12em", display: "-0.025em" } as const;

/**
 * Motion a reader can switch off: `prefers-reduced-motion` zeroes every one in `TOKENS_CSS`.
 * `quick` is a control changing state, `exit` a sheet leaving, `enter` a turn or a sheet arriving,
 * `stagger` the step between items of a list arriving, `calm` the listening pulse, `breath` the
 * reading orb's (#279, the designs' `--duration-slow` and `presence-breath`; enni-v2 #428).
 * `spring` and `spring-long` are the landing's durations for what moves on `EASE.spring`: a press
 * or a hover's lift, and a larger move such as a card or a panel (enni-v2 #635).
 */
export const MOTION = {
  quick: "120ms",
  exit: "160ms",
  enter: "220ms",
  stagger: "40ms",
  calm: "1600ms",
  breath: "4500ms",
  spring: "500ms",
  "spring-long": "800ms",
} as const;

/**
 * `standard` for a change of state; `out` for what arrives and should settle gently; `spring` the
 * landing's spring (damping 15, stiffness 150) as its mockup wrote it, a `linear()` curve that
 * overshoots a little and settles — for a press and a hover, on `motion-spring`.
 */
export const EASE = {
  standard: "cubic-bezier(0.2, 0, 0, 1)",
  out: "cubic-bezier(0.16, 1, 0.3, 1)",
  spring:
    "linear(0, 0.0074, 0.0294 2.2%, 0.1172 4.6%, 0.5104 11.6%, 0.6843 15.2%, 0.8129 18.8%, 0.9112 22.6%, 0.9765 26.4%, 1.0167 30.2%, 1.0378 34.4%, 1.0419 38.2%, 1.0379 42.6%, 1.0129 53.4%, 1.0005 64.4%, 0.9967 74.8%, 1)",
} as const;

const orbStops = (): Record<string, string> =>
  Object.fromEntries(
    Object.entries(ORB).flatMap(([tone, { glow, deep }]) => [
      [`${tone}-glow`, glow],
      [`${tone}-deep`, deep],
    ]),
  );

/** The widest a line of reading runs, and the width a sheet takes on a desktop. */
export const MEASURE = { reading: "42rem", sheet: "28rem", rail: "16.5rem" } as const;

/**
 * How tall a control is (enni-v2 #472): 44px where a finger presses it, which is the right touch
 * target, and 36px under a fine pointer, where 44px made every action on a card as heavy as the
 * answer above it. One custom property, `--enni-space-control`, that a button, a chip and a segment read;
 * a field, the mic and a menu's rows keep 44px at every pointer.
 */
export const CONTROL = { touch: "44px", fine: "36px" } as const;

const declarations = (prefix: string, table: Readonly<Record<string, string>>): string[] =>
  Object.entries(table).map(([name, value]) => `--enni-${prefix}${name}: ${value};`);

/** The custom properties for one palette. */
export function paletteCss(palette: Palette): string {
  return declarations("", palette).join(" ");
}

/**
 * One theme's properties: its palette, what stays translucent (`--enni-glow`, `-glass`, `-scrim`)
 * and its elevation (`--enni-shadow-card`, `-lift`).
 */
export function themeCss(palette: Palette, shadow: Elevation, translucent: Translucent): string {
  return [
    paletteCss(palette),
    ...declarations("", translucent),
    ...declarations("shadow-", shadow),
  ].join(" ");
}

const LIGHT_THEME = themeCss(LIGHT, SHADOW_LIGHT, TRANSLUCENT_LIGHT);
const DARK_THEME = themeCss(DARK, SHADOW_DARK, TRANSLUCENT_DARK);

/** Everything that does not change with the theme. */
export function scaleCss(): string {
  return [
    ...declarations("space-", SPACE),
    ...declarations("radius-", RADIUS),
    ...declarations("font-", FONT),
    ...declarations("type-", TYPE),
    ...declarations("leading-", LEADING),
    ...declarations("tracking-", TRACKING),
    ...declarations("motion-", MOTION),
    ...declarations("ease-", EASE),
    ...declarations("orb-", orbStops()),
    ...declarations("measure-", MEASURE),
    `--enni-space-control: ${CONTROL.touch};`,
  ].join(" ");
}

/**
 * The stylesheet the root layout puts on the page: light, dark by preference, and still motion.
 *
 * A person may also choose (enni-v2 #433): `data-theme="dark"` or `"light"` on the root element
 * overrides the system preference, and no attribute follows it.
 */
export const TOKENS_CSS = [
  `:root { color-scheme: light dark; ${scaleCss()} ${LIGHT_THEME} }`,
  `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { ${DARK_THEME} } }`,
  `:root[data-theme="dark"] { color-scheme: dark; ${DARK_THEME} }`,
  `:root[data-theme="light"] { color-scheme: light; }`,
  `@media (pointer: fine) { :root { --enni-space-control: ${CONTROL.fine}; } }`,
  `@media (prefers-reduced-motion: reduce) { :root { ${Object.keys(MOTION)
    .map((name) => `--enni-motion-${name}: 0ms;`)
    .join(" ")} } }`,
].join("\n");

/** `var(--enni-…)` for a colour token — the only way a primitive names a colour. */
export const colour = (token: ColourToken): string => `var(--enni-${token})`;
