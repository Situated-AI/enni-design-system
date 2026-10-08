/**
 * The answer card (#298, `product-spec.md` §3) — the product's one act, as a component.
 *
 * **The order is fixed, and is the component's, not the caller's:** status → sentence → the parts
 * (why, who, next) → actions → sources → details. That order is thesis §8's mitigation — the verdict
 * and one sentence are read before anything argues for them — so it is pinned by a test rather than
 * left to each screen. The status row is the badge, then the subject's key in mono and its title.
 * The sentence is Enni's serif at \`lg\`, so it reads first.
 *
 * Leaf component (D-114): every label, glyph and word arrives as a prop, from \`SURFACE\`. The card
 * decides layout only. Status is never colour alone (D-115): the badge carries its glyph and word.
 *
 * Also here: a **citation** (\`[1]\`, a link to its source card), a **section** with its mono label,
 * a **pair** of boxed sections (Who knows · What to do next), the **actions** row, and a **segmented**
 * control (*Answer for: Building · Reviewing · Deploying*).
 */
import type { ReactNode } from "react";
import type { Mark } from "./status.tsx";

type Subject = { readonly key: string; readonly title?: string };

type CardProps = {
  readonly label: string;
  /** The status badge — a `StatusBadge`, glyph and word. */
  readonly status: ReactNode;
  /** A marker beside the badge: *Partial*, a word (F2). */
  readonly marker?: ReactNode;
  readonly subject?: Subject;
  readonly sentence: ReactNode;
  /** What's in the way, then the pair (Who knows · What to do next) — in that order. */
  readonly children?: ReactNode;
  readonly actions?: ReactNode;
  readonly sources?: ReactNode;
  readonly details?: ReactNode;
  readonly state?: string;
};

export function AnswerCard(props: CardProps) {
  const { subject } = props;
  return (
    <article className="enni-answer-card" aria-label={props.label} data-state={props.state}>
      <div className="enni-answer-card__body">
        <p className="enni-answer-card__status">
          {props.status}
          {props.marker}
          {subject === undefined ? null : (
            <>
              <span className="enni-answer-card__key">{subject.key}</span>
              {subject.title === undefined ? null : (
                <span className="enni-answer-card__title">{subject.title}</span>
              )}
            </>
          )}
        </p>
        <p className="enni-answer-card__sentence enni-voice">{props.sentence}</p>
        {props.children}
        {props.actions}
      </div>
      {props.sources}
      {props.details}
    </article>
  );
}

export function AnswerSection({
  title,
  children,
}: {
  readonly title: string;
  readonly children: ReactNode;
}) {
  return (
    <section className="enni-answer-section" aria-label={title}>
      <p className="enni-answer-section__title">{title}</p>
      {children}
    </section>
  );
}

/** Who knows · What to do next — two boxes side by side, stacked on a phone. */
export function AnswerPair({ children }: { readonly children: ReactNode }) {
  return <div className="enni-answer-pair">{children}</div>;
}

type CitationProps = {
  readonly n: number;
  /** The id of the source card it opens. */
  readonly target: string;
  /** *Open the source this comes from*. */
  readonly title: string;
  readonly onFollow?: (target: string) => void;
};

/** `[n]` — a focusable link to its source card; `onFollow` opens the sources first if closed. */
export function Citation({ n, target, title, onFollow }: CitationProps) {
  return (
    <a
      className="enni-cite"
      href={`#${target}`}
      title={title}
      aria-label={`${title} [${n}]`}
      onClick={onFollow === undefined ? undefined : () => onFollow(target)}
    >
      [{n}]
    </a>
  );
}

export function AnswerActions({ children }: { readonly children: ReactNode }) {
  return <div className="enni-answer-actions">{children}</div>;
}

type SegmentedProps = {
  readonly label: string;
  readonly options: readonly SegmentedOption[];
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly hint?: string;
};

export type SegmentedOption = {
  readonly value: string;
  readonly label: string;
  /**
   * What choosing it came to, once that is known (enni-v2 #468): a glyph in its tone before the
   * label, and the word after it for a screen reader, so every option's outcome shows at once.
   */
  readonly mark?: Omit<Mark, "moving">;
  /** It was chosen and its answer is on the way. */
  readonly busy?: boolean;
};

/** One of a few, each a pressed-or-not button in a named fieldset — *Answer for: Building …*. */
export function Segmented({ label, options, value, onChange, hint }: SegmentedProps) {
  return (
    <fieldset className="enni-segmented" title={hint}>
      <legend className="enni-visually-hidden">{label}</legend>
      <span className="enni-segmented__label" aria-hidden="true">
        {label}
      </span>
      <span className="enni-segmented__options">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={option.value === value}
            aria-busy={option.busy === true ? true : undefined}
            onClick={() => onChange(option.value)}
          >
            {option.mark === undefined ? null : (
              <span
                className={`enni-segmented__mark enni-tone--${option.mark.tone}`}
                aria-hidden="true"
              >
                {option.mark.glyph}
              </span>
            )}
            {option.label}
            {option.mark === undefined ? null : (
              <span className="enni-visually-hidden"> · {option.mark.word}</span>
            )}
          </button>
        ))}
      </span>
    </fieldset>
  );
}
