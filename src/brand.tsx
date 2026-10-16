/**
 * The brand mark (#280): the tile with its three bars — an *E* — and the wordmark beside it.
 *
 * Since 0.6.1 it is the landing's (`.lp-brand`, enni-v2 #637): an ink tile on a 28px grid, its outer
 * bars the canvas and the middle one the violet, the wordmark 19px bold, and the tile turns a little
 * on the spring when the mark is a link under a pointer. It is drawn, not an image file, so it
 * follows the theme: every fill is a class over a token in `styles.ts`, never a colour here. The name is a
 * prop (D-114): this package carries no product words, not even its own name. With `href` the mark
 * is the way home — a link whose accessible name is the wordmark.
 */

type BrandProps = {
  readonly name: string;
  readonly href?: string;
};

/** The tile alone — the auth card's title mark (#289). */
export function BrandTile() {
  return (
    <svg className="enni-brand__tile" width="22" height="22" viewBox="0 0 28 28" aria-hidden="true">
      <rect className="enni-brand__ground" width="28" height="28" rx="8" />
      <rect className="enni-brand__bar" x="8" y="8" width="12" height="2.6" rx="1.3" />
      <rect
        className="enni-brand__bar enni-brand__bar--accent"
        x="8"
        y="12.7"
        width="8"
        height="2.6"
        rx="1.3"
      />
      <rect className="enni-brand__bar" x="8" y="17.4" width="12" height="2.6" rx="1.3" />
    </svg>
  );
}

export function BrandMark({ name, href }: BrandProps) {
  const inner = (
    <>
      <BrandTile />
      <span className="enni-brand__name">{name}</span>
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
