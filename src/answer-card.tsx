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
 *
 * **Since 0.6.1 it is the landing window's answer** (`landing-window-answer.tsx`, enni-v2 #637): the
 * verdict chip, the key and the title; the sentence in the serif at the landing's size; the meter
 * and *What's in the way* in one sunken box (`AnswerSection boxed`), the reasons numbered with their
 * sources (`AnswerReasons`); *Who knows* in its own box (`AnswerWho`); *Answer for* and *Copy
 * answer* in a row; the sources and the details folded under. `arriving` lets its parts rise in one
 * after another, as the landing's play does, and is still where less motion is asked for.
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
  /** Its parts rise in one after another (enni-v2 #637): for an answer that has just come. */
  readonly arriving?: boolean;
};

export function AnswerCard(props: CardProps) {
  const { subject } = props;
  const className =
    props.arriving === true ? "enni-answer-card enni-answer-card--arriving" : "enni-answer-card";
  return (
    <article className={className} aria-label={props.label} data-state={props.state}>
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
  boxed,
  children,
}: {
  readonly title: string;
  /** In the landing's sunken box, with what goes with it (the meter above it): enni-v2 #637. */
  readonly boxed?: boolean;
  readonly children: ReactNode;
}) {
  const className =
    boxed === true ? "enni-answer-section enni-answer-section--boxed" : "enni-answer-section";
  return (
    <section className={className} aria-label={title}>
      <p className="enni-answer-section__title">{title}</p>
      {children}
    </section>
  );
}

export type Reason = {
  readonly text: ReactNode;
  /** Its source, after the words: a `Citation`. */
  readonly cite?: ReactNode;
};

/** What's in the way, numbered in mono as the landing's are, each followed by its source. */
export function AnswerReasons({ reasons }: { readonly reasons: readonly Reason[] }) {
  return (
    <ol className="enni-reasons">
      {reasons.map((reason, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: reasons are ordered, and their text may be a node.
        <li key={i}>
          <span className="enni-reasons__n" aria-hidden="true">
            {i + 1}.
          </span>
          <div>
            {reason.text}
            {reason.cite === undefined ? null : <> {reason.cite}</>}
          </div>
        </li>
      ))}
    </ol>
  );
}

/** *Who knows*: the person's name, and why them, in the landing's box. */
export function AnswerWho({
  title,
  name,
  why,
}: {
  readonly title: string;
  readonly name: ReactNode;
  readonly why?: ReactNode;
}) {
  return (
    <section className="enni-answer-who" aria-label={title}>
      <p className="enni-answer-section__title">{title}</p>
      <b>{name}</b>
      {why === undefined ? null : <span>{why}</span>}
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
