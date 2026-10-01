/**
 * The moments around an answer (#298) — reading your apps, a refusal, and what was heard.
 *
 * **Reading steps** are each source settling on its own: `·` while it is read, `✓` when it was, `!`
 * when it could not be. Not a spinner (§3): a list that grows as the pipeline hears back, in one
 * polite live region. The glyph is a shape beside the words; the words say which.
 *
 * A **refusal card** is *Not enough to go on*, its sentence and a way forward — with **no badge**,
 * because a refusal has no verdict (D-77).
 *
 * The **heard bubble** is the person's bubble while the mic is open, the words still arriving, muted.
 * Not a live region: a screen reader is not read the transcript a character at a time (#301).
 */
import type { ReactNode } from "react";

export type StepState = "pending" | "read" | "failed";

const GLYPH: Readonly<Record<StepState, string>> = { pending: "·", read: "✓", failed: "!" };

type Step = { readonly id: string; readonly state: StepState; readonly text: string };

export function ReadingSteps({
  steps,
  label,
}: {
  readonly steps: readonly Step[];
  readonly label: string;
}) {
  return (
    <ul className="enni-steps" aria-live="polite" aria-label={label}>
      {steps.map((step) => (
        <li
          key={step.id}
          className="enni-steps__step"
          data-state={step.state}
          data-source={step.id}
        >
          <span className="enni-steps__glyph" aria-hidden="true">
            {GLYPH[step.state]}
          </span>
          {step.text}
        </li>
      ))}
    </ul>
  );
}

type RefusalProps = {
  readonly title: string;
  readonly sentence: ReactNode;
  /** The way forward — a `ChipRow`. */
  readonly children?: ReactNode;
  /** #311, B12/B13: the conversation notice's two buttons — *Raise the tool limit*, *Add credits*. */
  readonly actions?: ReactNode;
  /** And the small line under them — *Nothing was charged for refused questions.* */
  readonly footnote?: ReactNode;
};

export function RefusalCard({ title, sentence, children, actions, footnote }: RefusalProps) {
  return (
    <div className="enni-refusal">
      <p className="enni-refusal__title">{title}</p>
      <p className="enni-refusal__sentence">{sentence}</p>
      {children}
      {actions === undefined ? null : <div className="enni-refusal__actions">{actions}</div>}
      {footnote === undefined ? null : <p className="enni-refusal__footnote">{footnote}</p>}
    </div>
  );
}

export function HeardBubble({ text }: { readonly text: string }) {
  return <p className="enni-heard">{text}</p>;
}
