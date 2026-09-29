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
 * colour. The status hues — ready, care, limited — are never the only thing that carries a status
 * (#111): each has a glyph and a word beside it, in `status-mark.tsx`.
 */

/** A colour token's name, without the `--enni-` prefix. */
export type ColourToken =
  | "canvas"
  | "surface"
  | "sunken"
  | "line"
  | "ink"
  | "ink-muted"
  | "accent"
  | "accent-ink"
  | "accent-soft"
  | "ready"
  | "ready-soft"
  | "care"
  | "care-soft"
  | "limited"
  | "limited-soft"
  | "danger"
  | "danger-soft"
  | "focus";

export type Palette = Readonly<Record<ColourToken, string>>;

export const LIGHT: Palette = {
  canvas: "#f8f7f4",
  surface: "#ffffff",
  sunken: "#efede8",
  line: "#dcd8d0",
  ink: "#1d1b22",
  "ink-muted": "#56515e",
  accent: "#5b3fd6",
  "accent-ink": "#ffffff",
  "accent-soft": "#ece7ff",
  ready: "#1a6b45",
  "ready-soft": "#e1f2e8",
  care: "#8a4b00",
  "care-soft": "#fbeedb",
  limited: "#565160",
  "limited-soft": "#ecebef",
  danger: "#a8231a",
  "danger-soft": "#fbe4e1",
  focus: "#5b3fd6",
};

export const DARK: Palette = {
  canvas: "#131217",
  surface: "#1b1a21",
  sunken: "#0e0d12",
  line: "#34323d",
  ink: "#f1eff5",
  "ink-muted": "#aaa5b4",
  accent: "#a995ff",
  "accent-ink": "#131217",
  "accent-soft": "#2a2345",
  ready: "#6fd3a0",
  "ready-soft": "#15301f",
  care: "#f2b766",
  "care-soft": "#35260f",
  limited: "#b7b2c0",
  "limited-soft": "#26252c",
  danger: "#ff8f84",
  "danger-soft": "#3a1916",
  focus: "#a995ff",
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

export const RADIUS = { sm: "6px", md: "10px", lg: "16px", pill: "999px" } as const;

export const FONT = {
  sans: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',
} as const;

/** Five sizes. The sentence of an answer is `lg`: it comes first and reads first (§3). */
export const TYPE = {
  sm: "0.8125rem",
  md: "0.9375rem",
  lg: "1.125rem",
  xl: "1.375rem",
  xxl: "2rem",
} as const;

/** Motion a reader can switch off: `prefers-reduced-motion` zeroes both in `TOKENS_CSS`. */
export const MOTION = { quick: "120ms", calm: "1600ms" } as const;

/** The widest a line of reading runs, and the width a sheet takes on a desktop. */
export const MEASURE = { reading: "42rem", sheet: "28rem", rail: "16rem" } as const;

const declarations = (prefix: string, table: Readonly<Record<string, string>>): string[] =>
  Object.entries(table).map(([name, value]) => `--enni-${prefix}${name}: ${value};`);

/** The custom properties for one palette. */
export function paletteCss(palette: Palette): string {
  return declarations("", palette).join(" ");
}

/** Everything that does not change with the theme. */
export function scaleCss(): string {
  return [
    ...declarations("space-", SPACE),
    ...declarations("radius-", RADIUS),
    ...declarations("font-", FONT),
    ...declarations("type-", TYPE),
    ...declarations("motion-", MOTION),
    ...declarations("measure-", MEASURE),
  ].join(" ");
}

/** The stylesheet the root layout puts on the page: light, dark by preference, and still motion. */
export const TOKENS_CSS = [
  `:root { color-scheme: light dark; ${scaleCss()} ${paletteCss(LIGHT)} }`,
  `@media (prefers-color-scheme: dark) { :root { ${paletteCss(DARK)} } }`,
  "@media (prefers-reduced-motion: reduce) { :root { --enni-motion-quick: 0ms; --enni-motion-calm: 0ms; } }",
].join("\n");

/** `var(--enni-…)` for a colour token — the only way a primitive names a colour. */
export const colour = (token: ColourToken): string => `var(--enni-${token})`;
