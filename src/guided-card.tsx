/**
 * The guided card (#296, workflow 3): a flow that runs inside the conversation, one card, step by
 * step. Connecting an app is the first (06–08); *Let a tool ask Enni* and the plan flows reuse it.
 *
 * - **Guided card** is a full-width card with its title, *Step 1 of 3* on the right, the progress
 *   bars under them, a body and a footer line. It arrives with the `enter` motion (#279).
 * - **Segmented progress** is three short bars: `accent` up to and including the current step,
 *   `line` after it. It is a drawing, `aria-hidden`; the *Step n of 3* beside it says the same.
 * - **Confirmation** is a ✓ and a bold sentence in the ready tone (*Linear is connected.*), then a
 *   muted follow-on, which may carry a link (*Change this any time from Connected apps*).
 *
 * Every word is a prop (D-114).
 */
import { type ReactNode, useId } from "react";

type ProgressProps = {
  /** The current step, counted from 1. */
  readonly current: number;
  readonly total: number;
};

export function SegmentedProgress({ current, total }: ProgressProps) {
  return (
    <div className="enni-segments" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: the bars are positions, and never reorder
        <span key={i} className="enni-segments__bar" data-on={i < current} />
      ))}
    </div>
  );
}

type GuidedCardProps = {
  readonly title: string;
  readonly current: number;
  readonly total: number;
  /** *"Step 1 of 3"* — the words the bars draw. */
  readonly stepLabel: string;
  /** The line under the body: *Stuck? Say "I can't find the key"…* */
  readonly footer?: ReactNode;
  readonly children: ReactNode;
};

export function GuidedCard({
  title,
  current,
  total,
  stepLabel,
  footer,
  children,
}: GuidedCardProps) {
  const heading = useId();
  return (
    <section className="enni-guided enni-enter" aria-labelledby={heading} data-step={current}>
      <header className="enni-guided__header">
        <h2 id={heading}>{title}</h2>
        <span className="enni-guided__step">{stepLabel}</span>
      </header>
      <SegmentedProgress current={current} total={total} />
      <div className="enni-guided__body">{children}</div>
      {footer === undefined ? null : <div className="enni-guided__footer">{footer}</div>}
    </section>
  );
}

type ConfirmationProps = {
  /** The bold sentence after the ✓: *Linear is connected.* */
  readonly title: string;
  /** The muted follow-on. */
  readonly children?: ReactNode;
};

export function Confirmation({ title, children }: ConfirmationProps) {
  return (
    <div className="enni-confirmation" role="status">
      <p className="enni-confirmation__title">
        <span aria-hidden="true">✓ </span>
        {title}
      </p>
      {children === undefined ? null : <p className="enni-confirmation__more">{children}</p>}
    </div>
  );
}
