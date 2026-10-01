/**
 * The brand mark (#280): the indigo tile with its three bars — an *E* — and the wordmark beside it.
 *
 * The tile is drawn, not an image file, so it follows the theme: its fill is `--enni-accent` and
 * its bars `--enni-accent-ink`, through classes in `styles.ts`, never a colour here. The name is a
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
    <svg className="enni-brand__tile" width="22" height="22" viewBox="0 0 32 32" aria-hidden="true">
      <rect className="enni-brand__ground" width="32" height="32" rx="7" />
      <rect className="enni-brand__bar" x="9" y="8.5" width="14" height="3.2" rx="1.6" />
      <rect className="enni-brand__bar" x="9" y="14.4" width="9.5" height="3.2" rx="1.6" />
      <rect className="enni-brand__bar" x="9" y="20.3" width="14" height="3.2" rx="1.6" />
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
