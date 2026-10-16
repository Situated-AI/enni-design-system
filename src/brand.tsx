/**
 * The brand (#280; redrawn in v0.6.3 from the operator's artwork): the mark — three isometric layers
 * and a chain of three dots — and the wordmark beside it, both drawn as paths in `brand-mark.ts`,
 * which also makes the standalone SVG strings a favicon or an OG image is built from.
 *
 * Every fill here is a class over a `--enni-brand-*` token (`styles.ts`), never a colour: the mark
 * is the same in both themes, since it carries its own ground, and the wordmark is `currentColor`,
 * the theme's ink. The name is a prop (D-114): it is the accessible name, and the drawn letters are
 * hidden from assistive technology. With `href` the mark is the way home — a link named by it.
 */
import { LOCKUP, MARK_SHAPES, WORDMARK, wordmarkPath } from "./brand-mark.ts";

type BrandProps = {
  readonly name: string;
  readonly href?: string;
};

const markPaths = () =>
  MARK_SHAPES.map(({ tone, d }, i) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: the shapes are a fixed drawing, never reordered
    <path key={i} className={`enni-brand__${tone}`} d={d} />
  ));

/** The mark alone — the auth card's title mark (#289), and the square app icon's drawing. */
export function BrandTile() {
  return (
    <svg className="enni-brand__tile" width="22" height="22" viewBox="0 0 64 64" aria-hidden="true">
      {markPaths()}
    </svg>
  );
}

/** The four letters, in the ink around them. */
function Wordmark() {
  return (
    <svg
      className="enni-brand__word"
      viewBox={`0 0 ${WORDMARK.width} ${WORDMARK.height}`}
      aria-hidden="true"
    >
      <path d={wordmarkPath()} />
    </svg>
  );
}

/** Mark and wordmark as one drawing, for where the lockup is shown large: a hero, a sign-in page. */
export function BrandLogo({ name }: { readonly name: string }) {
  return (
    <svg
      className="enni-brand-logo"
      viewBox={`0 0 ${LOCKUP.width} ${LOCKUP.height}`}
      role="img"
      aria-label={name}
    >
      {markPaths()}
      <path className="enni-brand__word" d={wordmarkPath(LOCKUP.x, LOCKUP.y)} />
    </svg>
  );
}

/**
 * The header's brand: the mark, which turns a little under a pointer when it is a link, then the
 * wordmark.
 */
export function BrandMark({ name, href }: BrandProps) {
  const inner = (
    <>
      <BrandTile />
      <Wordmark />
      <span className="enni-visually-hidden">{name}</span>
    </>
  );
  return href === undefined ? (
    <span className="enni-brand">{inner}</span>
  ) : (
    <a className="enni-brand" href={href}>
      {inner}
    </a>
  );
}
