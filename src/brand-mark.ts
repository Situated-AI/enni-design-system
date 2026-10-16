/**
 * The brand's drawing (v0.6.3), hand-authored from the operator's artwork: the geometry once, and
 * the standalone SVG strings made from it — the one source a favicon, an app icon or an OG image is
 * derived from, as `brand.tsx`'s components are.
 *
 * **The mark** sits on a 64-unit square: three rounded rhombi seen in isometric view (a slope of
 * about 0.55), lavender over violet over indigo, each overlap painted as a tone of its own, and down
 * the middle a chain of three dots — violet, plum, ink — each in a white ring, joined by short white
 * bars. Every shape is a filled path; a dot's ring is the white disc beneath it.
 *
 * **The wordmark** is the four letters as paths, not a font: a heavy, blocky uppercase with softened
 * corners, 35 units to the cap, set to the right of the mark at about 0.58 of its height.
 *
 * The strings carry hex fills converted from `BRAND` (`srgbHex`), since an icon or an image
 * renderer reads neither OKLCH nor a custom property. No colour is typed in this file.
 */
import { srgbHex } from "./contrast.ts";
import { BRAND, type BrandTone, DARK, LIGHT } from "./palette.ts";

type Point = readonly [number, number];

/** One filled path of the mark, in its tone. */
export type MarkShape = { readonly tone: BrandTone; readonly d: string };

const fmt = (n: number): string => String(Math.round(n * 100) / 100);

/** One corner of `roundedPath`: a line to where the arc starts, and the arc to where it ends. */
function corner(prev: Point, p: Point, next: Point, radius: number): string {
  if (radius === 0) return `L${fmt(p[0])} ${fmt(p[1])}`;
  const unit = (q: Point): Point => {
    const length = Math.hypot(q[0] - p[0], q[1] - p[1]);
    return [(q[0] - p[0]) / length, (q[1] - p[1]) / length];
  };
  const [u, v] = [unit(prev), unit(next)];
  const half = Math.acos(Math.max(-1, Math.min(1, u[0] * v[0] + u[1] * v[1]))) / 2;
  const cut = radius / Math.tan(half);
  // A clockwise turn on screen (y down) is a convex corner here: sweep 1; a reflex one sweeps 0.
  const sweep = (p[0] - prev[0]) * (next[1] - p[1]) - (p[1] - prev[1]) * (next[0] - p[0]) > 0;
  const from = `${fmt(p[0] + u[0] * cut)} ${fmt(p[1] + u[1] * cut)}`;
  const to = `${fmt(p[0] + v[0] * cut)} ${fmt(p[1] + v[1] * cut)}`;
  return `L${from}A${fmt(radius)} ${fmt(radius)} 0 0 ${sweep ? 1 : 0} ${to}`;
}

/** A closed polygon, listed clockwise, whose corners are rounded with circular arcs of `radii[i]`. */
export function roundedPath(points: readonly Point[], radii: readonly number[]): string {
  const n = points.length;
  const at = (i: number): Point => points[(i + n) % n] as Point;
  const segments = points.map((p, i) => corner(at(i - 1), p, at(i + 1), radii[i] ?? 0));
  return `M${segments.join("").slice(1)}Z`;
}

const circle = (cx: number, cy: number, r: number): string =>
  `M${fmt(cx - r)} ${fmt(cy)}a${fmt(r)} ${fmt(r)} 0 1 0 ${fmt(2 * r)} 0a${fmt(r)} ${fmt(r)} 0 1 0 ${fmt(-2 * r)} 0Z`;

/** The layers' half-width and half-height, and the radii of their side and top corners. */
const LAYER = { w: 31.6, h: 16.25, side: 3.6, top: 6.4 } as const;
const LAYERS = [17.5, 32.25, 47] as const;
const DOTS = [16.3, 33.4, 48.9] as const;
const RING = 6.77;
const DOT = 4.54;
const BAR = 1.7;

/** A rhombus about (32, cy); an overlap keeps its sharp side corners, where two edges cross. */
const rhombus = (cy: number, w: number, h: number, side: number): string =>
  roundedPath(
    [
      [32, cy - h],
      [32 + w, cy],
      [32, cy + h],
      [32 - w, cy],
    ],
    [LAYER.top, side, LAYER.top, side],
  );

/** Where two layers overlap: the rhombus between their centres, shorter by half their spacing. */
const overlap = (upper: number, lower: number): string => {
  const h = LAYER.h - (lower - upper) / 2;
  return rhombus((upper + lower) / 2, (LAYER.w * h) / LAYER.h, h, 0);
};

const bar = (top: number, bottom: number): string =>
  `M${fmt(32 - BAR)} ${fmt(top)}H${fmt(32 + BAR)}V${fmt(bottom)}H${fmt(32 - BAR)}Z`;

const [upper, middle, lower] = LAYERS;
const [first, second, third] = DOTS;

/** The mark, back to front, on `0 0 64 64`. */
export const MARK_SHAPES: readonly MarkShape[] = [
  { tone: "indigo", d: rhombus(lower, LAYER.w, LAYER.h, LAYER.side) },
  { tone: "violet", d: rhombus(middle, LAYER.w, LAYER.h, LAYER.side) },
  { tone: "iris", d: overlap(middle, lower) },
  { tone: "lavender", d: rhombus(upper, LAYER.w, LAYER.h, LAYER.side) },
  { tone: "lilac", d: overlap(upper, middle) },
  { tone: "ring", d: `${bar(first, second)}${bar(second, third)}` },
  { tone: "ring", d: DOTS.map((cy) => circle(32, cy, RING)).join("") },
  { tone: "violet", d: circle(32, first, DOT) },
  { tone: "plum", d: circle(32, second, DOT) },
  { tone: "ink", d: circle(32, third, DOT) },
];

/** The wordmark's box: 35 units to the cap, and the four letters' width. */
export const WORDMARK = { width: 115.9, height: 35 } as const;

const E_LETTER: Point[] = [
  [0, 0],
  [27.9, 0],
  [27.9, 7.4],
  [9, 7.4],
  [9, 13.25],
  [24.1, 13.25],
  [24.1, 20.65],
  [9, 20.65],
  [9, 27.45],
  [28.5, 27.45],
  [28.5, 35],
  [0, 35],
];

const N_LETTER: Point[] = [
  [0, 0],
  [8.85, 0],
  [25.05, 21.1],
  [25.05, 0],
  [34.05, 0],
  [34.05, 35],
  [24.6, 35],
  [9, 14.5],
  [9, 35],
  [0, 35],
];

const shift = (letter: Point[], dx: number, dy: number): Point[] =>
  letter.map(([x, y]) => [x + dx, y + dy] as const);

/** The four letters as one path, its cap's top-left corner at (x, y). */
export function wordmarkPath(x = 0, y = 0): string {
  const soft = (count: number) => Array.from({ length: count }, () => 0.9);
  const eRadii = [...soft(11), 3.4];
  const nRadii = soft(10);
  const stem: Point[] = [
    [0, 0],
    [9, 0],
    [9, 35],
    [0, 35],
  ];
  return [
    roundedPath(shift(E_LETTER, x, y), eRadii),
    roundedPath(shift(N_LETTER, x + 31.35, y), nRadii),
    roundedPath(shift(N_LETTER, x + 69.05, y), nRadii),
    roundedPath(shift(stem, x + 106.9, y), soft(4)),
  ].join("");
}

/** The lockup's box: the mark, then the wordmark at x 67, its cap centred on the mark. */
export const LOCKUP = { width: 187, height: 64, x: 67, y: 14.5 } as const;

const hex = (tone: BrandTone): string => srgbHex(BRAND[tone]);

const paint = (shapes: readonly MarkShape[]): string =>
  shapes.map(({ tone, d }) => `<path fill="${hex(tone)}" d="${d}"/>`).join("");

const svg = (width: number, height: number, body: string): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">${body}</svg>`;

/** The mark alone on a transparent ground: the favicon. */
export const BRAND_MARK_SVG = svg(64, 64, paint(MARK_SHAPES));

/** The app icon: the mark at 80% on a white tile with a 14-unit radius (apple-touch, PWA). */
export const BRAND_ICON_SVG = svg(
  64,
  64,
  `<rect width="64" height="64" rx="14" fill="${hex("ring")}"/><g transform="translate(6.4 6.4) scale(0.8)">${paint(MARK_SHAPES)}</g>`,
);

const lockup = (ink: string): string =>
  svg(
    LOCKUP.width,
    LOCKUP.height,
    `${paint(MARK_SHAPES)}<path fill="${srgbHex(ink)}" d="${wordmarkPath(LOCKUP.x, LOCKUP.y)}"/>`,
  );

/** Mark and wordmark, the wordmark in the light theme's ink: for a light ground. */
export const BRAND_LOGO_SVG = lockup(LIGHT.ink);

/** Mark and wordmark, the wordmark in the dark theme's ink: for the obsidian ground. */
export const BRAND_LOGO_DARK_SVG = lockup(DARK.ink);
