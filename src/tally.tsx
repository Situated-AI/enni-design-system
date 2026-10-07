/**
 * A tally (enni-v2 #461): how a count breaks down, drawn as one segment per thing counted.
 *
 * *1 of 5 checks passed · 4 couldn't be checked* reads the same as *5 of 5* at a glance; five
 * segments, one filled and four hollow, do not. Each part arrives with its count and its tone, in
 * the order to draw them; a part with `hollow` is an outline only, which is how *nothing was read*
 * differs from *passed* without relying on colour (D-115).
 *
 * **Decoration beside words, never instead of them.** The caller's sentence says the count, so the
 * bar is hidden from a screen reader rather than read a second time.
 */
import type { Tone } from "./status.tsx";

export type TallyPart = {
  /** What the part is, as a stable name for a test or a style hook: `passed`, `unread`. */
  readonly kind: string;
  readonly count: number;
  readonly tone: Tone;
  /** Drawn as an outline: counted, and nothing behind it. */
  readonly hollow?: boolean;
};

const segmentsOf = (part: TallyPart) =>
  Array.from({ length: Math.max(0, Math.floor(part.count)) }, (_, i) => (
    <span
      // biome-ignore lint/suspicious/noArrayIndexKey: segments of one part are identical and ordered.
      key={`${part.kind}-${i}`}
      className={`enni-tally__segment enni-tone--${part.tone}`}
      data-kind={part.kind}
      data-hollow={part.hollow === true ? "true" : undefined}
    />
  ));

export function Tally({ parts }: { readonly parts: readonly TallyPart[] }) {
  const segments = parts.flatMap(segmentsOf);
  if (segments.length === 0) return null;
  return (
    <span className="enni-tally" aria-hidden="true">
      {segments}
    </span>
  );
}
