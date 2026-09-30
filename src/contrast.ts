/**
 * WCAG contrast for the palette's OKLCH values (#277) — so `tokens.test.ts` can hold every ink to
 * AA on the ground it is drawn on, in both themes, without a browser.
 *
 * OKLCH → OKLab → linear sRGB (Ottosson's matrices), clipped to the gamut, then WCAG 2's relative
 * luminance. A token outside the gamut is measured as the browser paints it: clipped.
 */

const OKLCH = /^oklch\(([\d.]+) ([\d.]+) ([\d.]+)\)$/;

/** A palette value's lightness, chroma and hue, or a throw for anything that is not plain OKLCH. */
export function parseOklch(value: string): [number, number, number] {
  const match = OKLCH.exec(value);
  if (!match) throw new Error(`not an oklch(L C H) colour: ${value}`);
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

/** Linear-light sRGB, each channel clipped to [0, 1]. */
export function linearSrgb(value: string): [number, number, number] {
  const [lightness, chroma, hue] = parseOklch(value);
  const a = chroma * Math.cos((hue * Math.PI) / 180);
  const b = chroma * Math.sin((hue * Math.PI) / 180);
  const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const clip = (channel: number) => Math.min(1, Math.max(0, channel));
  return [
    clip(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    clip(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    clip(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
}

/** WCAG 2 relative luminance. */
export function luminance(value: string): number {
  const [r, g, b] = linearSrgb(value);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2 contrast ratio, 1–21, whichever of the two is lighter. */
export function contrastRatio(one: string, other: string): number {
  const [light, dark] = [luminance(one), luminance(other)].sort((x, y) => y - x) as [
    number,
    number,
  ];
  return (light + 0.05) / (dark + 0.05);
}
