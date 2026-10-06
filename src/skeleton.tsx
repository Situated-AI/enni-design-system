/**
 * What stands in for content that is still being fetched (enni-v2 #428).
 *
 * A page that renders empty and then fills is a layout jump and reads as broken. A skeleton holds the
 * space in the shape of what is coming: a few lines of text, or blocks the height of a card.
 *
 * It is a `status` region with a spoken label and `aria-busy`, so a screen reader hears that
 * something is loading and never reads the grey bars. The label arrives as a prop, like every word.
 */

type SkeletonProps = {
  /** What a screen reader hears while this is shown, e.g. the product's own "Loading". */
  readonly label: string;
  /** How many bars to draw. */
  readonly lines?: number;
  /** `text` draws lines of reading; `block` draws card-height blocks. */
  readonly shape?: "text" | "block";
};

/** The class a skeleton of this shape carries. */
export const skeletonClass = (shape: "text" | "block"): string =>
  shape === "block" ? "enni-skeleton enni-skeleton--block" : "enni-skeleton";

export function Skeleton({ label, lines = 3, shape = "text" }: SkeletonProps) {
  const count = Math.max(1, Math.floor(lines));
  return (
    <div className={skeletonClass(shape)} role="status" aria-busy="true">
      <span className="enni-visually-hidden">{label}</span>
      {Array.from({ length: count }, (_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: the bars are identical and never reorder.
        <span key={index} className="enni-skeleton__line" aria-hidden="true" />
      ))}
    </div>
  );
}
