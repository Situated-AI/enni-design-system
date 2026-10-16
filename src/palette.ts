/**
 * Enni's colours (enni-v2 #635, v0.6.0): the landing's palette (D-297) made the product's, so the
 * landing and the app are one design end to end. Every value is the mockup's hex, converted to
 * OKLCH — the notation `contrast.ts` reads, so `palette.test.ts` can hold every ink to AA.
 *
 * **Light is white and slate, dark is obsidian with hairlines.** One violet accent (`#5046E5`, and
 * `#A5A0FF` in the dark), used sparingly: a link, focus, what is selected. Green, amber and red are
 * for status only, and each draws as a triplet — a `-bg` ground, a `-border` edge and a `-fg` ink
 * (#277). None is ever the only thing that carries a status (#111): `status.tsx` adds a glyph and a
 * word.
 *
 * **The primary button is ink** (operator, 2026-10-16): `btn`, `btn-ink` and `btn-hover`, near-black
 * on white and near-white on obsidian. The accent stays for what should catch the eye once.
 *
 * **What the landing paints translucent** is flattened here onto the dark surface (`#111726`), so a
 * status ground is one colour the contrast test can measure: the mockup's `rgba(74,222,128,.10)`
 * green is the `ready-bg` it paints on a card. What must stay translucent — the glow, glass and
 * scrim — is `TRANSLUCENT_*`, declared beside the palette, with `shade`, a switch thumb's shadow.
 *
 * **A code block is dark in both themes** (enni-v2 #637, v0.6.1): `code-bg`, `-ink`, `-dim` and the
 * landing terminal's four inks (`code-accent`, `-ready`, `-care`, `-danger`) are dark-ground values
 * in the light as in the dark. `knob` is a switch's thumb, white in both.
 *
 * Two of the landing's values are nudged, and only where AA asked: light `ink-subtle` (`#64748B`,
 * L 0.554) is L 0.54, so it reads on the hover and disabled grounds as well as on white.
 */

/** The statuses that draw as a triplet: a ground, an edge and an ink (#277). */
export type Status = "ready" | "care" | "limited" | "danger";

/** A colour token's name, without the `--enni-` prefix. */
export type ColourToken =
  | "canvas"
  | "surface"
  | "sunken"
  | "hover"
  | "disabled"
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
  | "btn"
  | "btn-ink"
  | "btn-hover"
  | `code-${"bg" | "ink" | "dim" | "accent" | "ready" | "care" | "danger"}`
  | "knob"
  | `${Status}-${"bg" | "border" | "fg"}`
  | "focus";

export type Palette = Readonly<Record<ColourToken, string>>;

/**
 * The landing's light `:root`. Names are ours: its `bg` is our `canvas`, `bg-2` our `sunken`,
 * `surface-2` our `hover`, `dim` our `ink-subtle`, `good`/`warn`/`bad` our `ready`/`care`/`danger`
 * (and `limited`, which draws as danger does). `disabled` is slate-100, a ground of its own that is
 * neither a surface nor the primary button (enni-v2 #480). `lavender` is the violet's lighter
 * sibling, on the accent's family of hues.
 */
export const LIGHT: Palette = {
  canvas: "oklch(1 0 0)",
  surface: "oklch(1 0 0)",
  sunken: "oklch(0.984 0.003 248)",
  hover: "oklch(0.967 0.001 286)",
  disabled: "oklch(0.968 0.007 248)",
  line: "oklch(0.929 0.013 256)",
  "line-strong": "oklch(0.869 0.02 253)",
  ink: "oklch(0.208 0.04 266)",
  "ink-muted": "oklch(0.446 0.037 257)",
  "ink-subtle": "oklch(0.54 0.041 257)",
  accent: "oklch(0.511 0.23 277)",
  "accent-hover": "oklch(0.457 0.215 277)",
  "accent-ink": "oklch(1 0 0)",
  "accent-soft": "oklch(0.958 0.02 280)",
  lavender: "oklch(0.52 0.15 288)",
  btn: "oklch(0.208 0.04 266)",
  "btn-ink": "oklch(1 0 0)",
  "btn-hover": "oklch(0.279 0.037 260)",
  "code-bg": "oklch(0.17 0.022 267)",
  "code-ink": "oklch(0.929 0.013 256)",
  "code-dim": "oklch(0.632 0.044 264)",
  "code-accent": "oklch(0.786 0.114 287)",
  "code-ready": "oklch(0.8 0.182 152)",
  "code-care": "oklch(0.854 0.109 77)",
  "code-danger": "oklch(0.711 0.166 22)",
  knob: "oklch(1 0 0)",
  "ready-bg": "oklch(0.963 0.02 160)",
  "ready-border": "oklch(0.835 0.08 157)",
  "ready-fg": "oklch(0.527 0.137 150)",
  "care-bg": "oklch(0.97 0.029 83)",
  "care-border": "oklch(0.872 0.093 80)",
  "care-fg": "oklch(0.479 0.11 58)",
  "limited-bg": "oklch(0.957 0.018 17)",
  "limited-border": "oklch(0.822 0.077 19)",
  "limited-fg": "oklch(0.505 0.19 28)",
  "danger-bg": "oklch(0.957 0.018 17)",
  "danger-border": "oklch(0.822 0.077 19)",
  "danger-fg": "oklch(0.505 0.19 28)",
  focus: "oklch(0.511 0.23 277)",
};

/** The landing's dark `:root`: obsidian `#0B0F19`, surfaces `#111726`, hairline `#1E293B`. */
export const DARK: Palette = {
  canvas: "oklch(0.17 0.022 267)",
  surface: "oklch(0.207 0.031 267)",
  sunken: "oklch(0.19 0.032 269)",
  hover: "oklch(0.233 0.036 267)",
  disabled: "oklch(0.253 0.036 266)",
  line: "oklch(0.279 0.037 260)",
  "line-strong": "oklch(0.34 0.046 262)",
  ink: "oklch(0.984 0.003 248)",
  "ink-muted": "oklch(0.711 0.035 257)",
  "ink-subtle": "oklch(0.632 0.044 264)",
  accent: "oklch(0.748 0.135 285)",
  "accent-hover": "oklch(0.833 0.088 287)",
  "accent-ink": "oklch(0.17 0.022 267)",
  "accent-soft": "oklch(0.271 0.053 276)",
  lavender: "oklch(0.79 0.1 288)",
  btn: "oklch(0.984 0.003 248)",
  "btn-ink": "oklch(0.17 0.022 267)",
  "btn-hover": "oklch(1 0 0)",
  "code-bg": "oklch(0.146 0.018 267)",
  "code-ink": "oklch(0.929 0.013 256)",
  "code-dim": "oklch(0.578 0.047 263)",
  "code-accent": "oklch(0.786 0.114 287)",
  "code-ready": "oklch(0.8 0.182 152)",
  "code-care": "oklch(0.854 0.109 77)",
  "code-danger": "oklch(0.711 0.166 22)",
  knob: "oklch(1 0 0)",
  "ready-bg": "oklch(0.273 0.027 212)",
  "ready-border": "oklch(0.433 0.071 163)",
  "ready-fg": "oklch(0.8 0.182 152)",
  "care-bg": "oklch(0.283 0.005 17)",
  "care-border": "oklch(0.427 0.053 73)",
  "care-fg": "oklch(0.854 0.109 77)",
  "limited-bg": "oklch(0.259 0.027 312)",
  "limited-border": "oklch(0.392 0.063 6)",
  "limited-fg": "oklch(0.711 0.166 22)",
  "danger-bg": "oklch(0.259 0.027 312)",
  "danger-border": "oklch(0.392 0.063 6)",
  "danger-fg": "oklch(0.711 0.166 22)",
  focus: "oklch(0.748 0.135 285)",
};

/**
 * What stays translucent, per theme: `glow` the violet haze under a primary action, `glass` a bar
 * the page scrolls beneath, `scrim` what a sheet or a dialog lays over the page behind it, `shade`
 * the shadow under a switch's thumb.
 */
export type Translucent = Readonly<Record<"glow" | "glass" | "scrim" | "shade", string>>;

export const TRANSLUCENT_LIGHT: Translucent = {
  glow: "oklch(0.578 0.235 278 / 0.22)",
  glass: "oklch(1 0 0 / 0.72)",
  scrim: "oklch(0.208 0.04 266 / 0.38)",
  shade: "oklch(0 0 0 / 0.25)",
};

export const TRANSLUCENT_DARK: Translucent = {
  glow: "oklch(0.663 0.188 285 / 0.3)",
  glass: "oklch(0.207 0.031 267 / 0.66)",
  scrim: "oklch(0 0 0 / 0.6)",
  shade: "oklch(0 0 0 / 0.25)",
};

/**
 * Elevation, per theme: `rest` for a card at rest (the landing's `--card-shadow`, a hairline), `card`
 * for a raised surface or a card under a hover (its `--shadow`), `lift` for a sheet above the page.
 */
export type Elevation = Readonly<Record<"rest" | "card" | "lift", string>>;

/** The landing's `--shadow`, on its slate ink; `lift` is the same shadow, deeper. */
export const SHADOW_LIGHT: Elevation = {
  rest: "0 1px 2px oklch(0.208 0.04 266 / 0.03)",
  card: "0 1px 2px oklch(0.208 0.04 266 / 0.04), 0 12px 40px -16px oklch(0.208 0.04 266 / 0.18)",
  lift: "0 1px 2px oklch(0.208 0.04 266 / 0.05), 0 26px 64px -30px oklch(0.208 0.04 266 / 0.32)",
};

/** The landing's dark `--shadow`: a hairline of light on top, and black beneath. */
export const SHADOW_DARK: Elevation = {
  rest: "0 1px 2px oklch(0.208 0.04 266 / 0.03)",
  card: "inset 0 1px 0 oklch(1 0 0 / 0.03), 0 20px 50px -20px oklch(0 0 0 / 0.7)",
  lift: "inset 0 1px 0 oklch(1 0 0 / 0.04), 0 26px 64px -30px oklch(0 0 0 / 0.8)",
};

/**
 * The orb's sphere (#279): a radial gradient per tone, lit from 35% 30% — a `glow` highlight, the
 * tone's ink through the middle, a `deep` shade at the edge. Each sits on its ink's hue: the violet
 * (277), the landing's green (150), amber (70) and red (25); neutral is the slate's (257). The
 * stops are the same in both themes — the middle is the themed ink.
 */
export const ORB: Readonly<Record<"accent" | "neutral" | Status, { glow: string; deep: string }>> =
  {
    accent: { glow: "oklch(0.93 0.045 280)", deep: "oklch(0.33 0.16 277)" },
    ready: { glow: "oklch(0.95 0.04 155)", deep: "oklch(0.32 0.08 150)" },
    care: { glow: "oklch(0.96 0.045 80)", deep: "oklch(0.34 0.08 60)" },
    limited: { glow: "oklch(0.95 0.03 20)", deep: "oklch(0.32 0.11 25)" },
    danger: { glow: "oklch(0.95 0.03 20)", deep: "oklch(0.32 0.11 25)" },
    // enni-v2 #464: unknown or off has no hue of its own; its stops sit on the slate.
    neutral: { glow: "oklch(0.96 0.006 257)", deep: "oklch(0.3 0.03 262)" },
  };

/** The tones the brand's mark is painted in (`brand.tsx`), from its layers down to its rings. */
export type BrandTone =
  | "lavender"
  | "lilac"
  | "violet"
  | "iris"
  | "indigo"
  | "plum"
  | "ink"
  | "ring";

/**
 * The brand's mark (v0.6.3): three isometric layers, lavender, violet and indigo, where each
 * overlap is a tone of its own (`lilac` the lavender over the violet, `iris` the violet over the
 * indigo) rather than a translucency, so the mark reads the same on any ground. Down its middle a
 * chain of three dots in white `ring`s: violet, `plum` and `ink`, the light theme's slate ink. Taken
 * from the operator's artwork; the same in both themes, since the mark carries its own ground.
 */
export const BRAND: Readonly<Record<BrandTone, string>> = {
  lavender: "oklch(0.808 0.094 285)",
  lilac: "oklch(0.623 0.201 280)",
  violet: "oklch(0.516 0.266 273)",
  iris: "oklch(0.401 0.213 274)",
  indigo: "oklch(0.313 0.171 274)",
  plum: "oklch(0.335 0.183 274)",
  ink: "oklch(0.208 0.04 266)",
  ring: "oklch(1 0 0)",
};
