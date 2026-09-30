/**
 * Enni's design tokens (#61, D-55): colour, space, type, radius and motion — written fresh from
 * `product-spec.md`, not lifted from v1's bundle or the design exports.
 *
 * **Every value is a CSS custom property**, so a primitive names `var(--enni-ink)` and never a hex.
 * One derivation (D-38): `TOKENS_CSS` is generated from these tables, and nothing else in the tree
 * types a colour. The web app puts it on the page once, in its root layout.
 *
 * **Two themes, one set of names.** Dark follows the reader's system preference; a token that
 * exists in one theme exists in the other, and `tokens.test.ts` holds them equal.
 *
 * **Purple is Enni.** The spec's orb is *"Purple: ready"*, so the accent is the product's own
 * colour. Each status — ready, care, limited, danger — draws as a triplet: a `-bg` ground, a
 * `-border` edge and a `-fg` ink (#277). None is ever the only thing that carries a status (#111):
 * each has a glyph and a word beside it, in `status.tsx`.
 *
 * **The redesign's values (#277, D-134)** — OKLCH, read from the final designs' `:root` and `.dark`
 * blocks; the artifact is a reference, not a source, so nothing here is Tailwind.
 */

/** The statuses that draw as a triplet: a ground, an edge and an ink (#277). */
type Status = "ready" | "care" | "limited" | "danger";

/** A colour token's name, without the `--enni-` prefix. */
export type ColourToken =
  | "canvas"
  | "surface"
  | "sunken"
  | "hover"
  | "line"
  | "line-strong"
  | "ink"
  | "ink-muted"
  | "ink-subtle"
  | "accent"
  | "accent-hover"
  | "accent-ink"
  | "accent-soft"
  | "lavender"
  | `${Status}-${"bg" | "border" | "fg"}`
  | "focus";

export type Palette = Readonly<Record<ColourToken, string>>;

/**
 * The redesign's palette (#277), in OKLCH as the designs draw it: a warm neutral canvas (hue ~86,
 * ink at ~62) and a deeper indigo accent (276). Names are ours, not the artifact's: its `caveat` is
 * our `care`, its `conditions` our `limited`, `border` our `line`, `fg` our `ink`. `accent-soft`
 * is not in the designs — it is the said-bubble's ground, kept so no v0.6 screen loses a token.
 */
export const LIGHT: Palette = {
  canvas: "oklch(0.974 0.008 86)",
  surface: "oklch(0.992 0.005 88)",
  sunken: "oklch(0.955 0.01 86)",
  hover: "oklch(0.94 0.012 86)",
  line: "oklch(0.898 0.01 84)",
  "line-strong": "oklch(0.76 0.016 84)",
  ink: "oklch(0.245 0.012 62)",
  "ink-muted": "oklch(0.44 0.014 62)",
  "ink-subtle": "oklch(0.51 0.014 62)",
  accent: "oklch(0.4 0.095 276)",
  "accent-hover": "oklch(0.34 0.095 276)",
  "accent-ink": "oklch(0.992 0.005 88)",
  "accent-soft": "oklch(0.94 0.03 276)",
  lavender: "oklch(0.5 0.075 298)",
  "ready-bg": "oklch(0.945 0.022 152)",
  "ready-border": "oklch(0.82 0.07 152)",
  "ready-fg": "oklch(0.44 0.07 152)",
  "care-bg": "oklch(0.955 0.035 72)",
  "care-border": "oklch(0.84 0.09 72)",
  "care-fg": "oklch(0.45 0.09 72)",
  "limited-bg": "oklch(0.945 0.03 30)",
  "limited-border": "oklch(0.81 0.09 30)",
  "limited-fg": "oklch(0.46 0.13 30)",
  "danger-bg": "oklch(0.945 0.03 30)",
  "danger-border": "oklch(0.81 0.09 30)",
  "danger-fg": "oklch(0.46 0.13 30)",
  focus: "oklch(0.4 0.095 276)",
};

export const DARK: Palette = {
  canvas: "oklch(0.19 0.008 62)",
  surface: "oklch(0.225 0.009 62)",
  sunken: "oklch(0.165 0.008 62)",
  hover: "oklch(0.275 0.011 62)",
  line: "oklch(0.33 0.012 62)",
  "line-strong": "oklch(0.48 0.016 62)",
  ink: "oklch(0.955 0.006 88)",
  "ink-muted": "oklch(0.79 0.01 80)",
  "ink-subtle": "oklch(0.73 0.011 76)",
  accent: "oklch(0.72 0.11 276)",
  "accent-hover": "oklch(0.79 0.11 276)",
  "accent-ink": "oklch(0.19 0.008 62)",
  "accent-soft": "oklch(0.3 0.05 276)",
  lavender: "oklch(0.76 0.08 298)",
  "ready-bg": "oklch(0.27 0.03 152)",
  "ready-border": "oklch(0.44 0.06 152)",
  "ready-fg": "oklch(0.86 0.08 152)",
  "care-bg": "oklch(0.28 0.035 72)",
  "care-border": "oklch(0.46 0.07 72)",
  "care-fg": "oklch(0.88 0.09 72)",
  "limited-bg": "oklch(0.27 0.035 30)",
  "limited-border": "oklch(0.45 0.08 30)",
  "limited-fg": "oklch(0.83 0.09 30)",
  "danger-bg": "oklch(0.27 0.035 30)",
  "danger-border": "oklch(0.45 0.08 30)",
  "danger-fg": "oklch(0.83 0.09 30)",
  focus: "oklch(0.72 0.11 276)",
};

/** Elevation, per theme: `card` for a resting surface, `lift` for a sheet above the page. */
export type Elevation = Readonly<Record<"card" | "lift", string>>;

export const SHADOW_LIGHT: Elevation = {
  card: "0 1px 2px oklch(0.3 0.02 62 / 0.05), 0 14px 34px -22px oklch(0.3 0.02 62 / 0.35)",
  lift: "0 26px 64px -34px oklch(0.32 0.06 276 / 0.4)",
};

export const SHADOW_DARK: Elevation = {
  card: "0 1px 2px oklch(0 0 0 / 0.3), 0 14px 34px -22px oklch(0 0 0 / 0.7)",
  lift: "0 26px 64px -34px oklch(0 0 0 / 0.8)",
};

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
 * The orb's sphere (#279): a radial gradient per tone, lit from 35% 30% — a `glow` highlight, the
 * tone's ink through the middle, a `deep` shade at the edge. The designs draw the accent, care and
 * ready spheres; limited and danger take the same stops on their hue (30). The stops are the same in
 * both themes, as the designs have them — the middle is the themed ink.
 */
export const ORB: Readonly<Record<"accent" | Status, { glow: string; deep: string }>> = {
  accent: { glow: "oklch(0.92 0.04 276)", deep: "oklch(0.3 0.09 276)" },
  ready: { glow: "oklch(0.95 0.03 152)", deep: "oklch(0.3 0.06 152)" },
  care: { glow: "oklch(0.96 0.04 72)", deep: "oklch(0.32 0.08 72)" },
  limited: { glow: "oklch(0.95 0.03 30)", deep: "oklch(0.3 0.08 30)" },
  danger: { glow: "oklch(0.95 0.03 30)", deep: "oklch(0.3 0.08 30)" },
};

/**
 * Motion a reader can switch off: `prefers-reduced-motion` zeroes every one in `TOKENS_CSS`.
 * `enter` is a turn or a sheet arriving, `calm` the listening pulse, `breath` the reading orb's
 * (#279, the designs' `--duration-slow` and `presence-breath`).
 */
export const MOTION = { quick: "120ms", enter: "220ms", calm: "1600ms", breath: "4500ms" } as const;

/** The designs' one easing, for everything that arrives. */
export const EASE = { standard: "cubic-bezier(0.2, 0, 0, 1)" } as const;

const orbStops = (): Record<string, string> =>
  Object.fromEntries(
    Object.entries(ORB).flatMap(([tone, { glow, deep }]) => [
      [`${tone}-glow`, glow],
      [`${tone}-deep`, deep],
    ]),
  );

/** The widest a line of reading runs, and the width a sheet takes on a desktop. */
export const MEASURE = { reading: "42rem", sheet: "28rem", rail: "16.5rem" } as const;

const declarations = (prefix: string, table: Readonly<Record<string, string>>): string[] =>
  Object.entries(table).map(([name, value]) => `--enni-${prefix}${name}: ${value};`);

/** The custom properties for one palette. */
export function paletteCss(palette: Palette): string {
  return declarations("", palette).join(" ");
}

/** One theme's properties: its palette and its elevation (`--enni-shadow-card`, `-lift`). */
export function themeCss(palette: Palette, shadow: Elevation): string {
  return [paletteCss(palette), ...declarations("shadow-", shadow)].join(" ");
}

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
  ].join(" ");
}

/** The stylesheet the root layout puts on the page: light, dark by preference, and still motion. */
export const TOKENS_CSS = [
  `:root { color-scheme: light dark; ${scaleCss()} ${themeCss(LIGHT, SHADOW_LIGHT)} }`,
  `@media (prefers-color-scheme: dark) { :root { ${themeCss(DARK, SHADOW_DARK)} } }`,
  `@media (prefers-reduced-motion: reduce) { :root { ${Object.keys(MOTION)
    .map((name) => `--enni-motion-${name}: 0ms;`)
    .join(" ")} } }`,
].join("\n");

/** `var(--enni-…)` for a colour token — the only way a primitive names a colour. */
export const colour = (token: ColourToken): string => `var(--enni-${token})`;
