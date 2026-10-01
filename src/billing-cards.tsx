/**
 * Billing's cards (#311, B01, B02, B11) — built now so v1.1 assembles screens rather than designing
 * them (#90). Leaf components: every word, figure and amount is a prop, **already formatted** —
 * currency and locale are the caller's (D-114), and nothing here knows what a plan costs.
 *
 * - **SummaryCard** answers one question: a title, one large figure, a muted line, one action.
 *   B01's four — *Your plan*, *This month*, *Credits*, *Payment* — sit in a **SummaryGrid**.
 * - **Meter** is a count against an allowance — a native `<meter>` for a screen reader, beside the drawn bar. At B11 it turns *care* and **says so in words**
 *   (*13 questions left this month*): colour is never the only signal (D-115).
 * - **PlanCard** is a plan in plain words. The current one is marked by a tag and drawn on `sunken`
 *   with `line-strong`; the action is the caller's, so only the upgrade is ever the accent (B02).
 */
import type { ReactNode } from "react";

type SummaryProps = {
  readonly title: string;
  /** One action, top right — *Change*, *Buy more*, *Update*. */
  readonly action?: ReactNode;
  /** A quiet note beside the title instead of an action — *1–9 Sep*. */
  readonly aside?: string;
  /** The one large figure — none where the answer is a sentence (*Visa ending 4242*). */
  readonly figure?: ReactNode;
  /** After the figure, smaller — *of 500 questions*. */
  readonly unit?: string;
  readonly detail?: ReactNode;
  readonly children?: ReactNode;
};

export function SummaryCard({
  title,
  action,
  aside,
  figure,
  unit,
  detail,
  children,
}: SummaryProps) {
  return (
    <section className="enni-summary" aria-label={title}>
      <header className="enni-summary__header">
        <h3>{title}</h3>
        {action ??
          (aside === undefined ? null : <span className="enni-summary__aside">{aside}</span>)}
      </header>
      {figure === undefined ? null : (
        <p className="enni-summary__figure">
          {figure}
          {unit === undefined ? null : <span className="enni-summary__unit"> {unit}</span>}
        </p>
      )}
      {detail === undefined ? null : <div className="enni-summary__detail">{detail}</div>}
      {children}
    </section>
  );
}

export function SummaryGrid({ children }: { readonly children: ReactNode }) {
  return <div className="enni-summary-grid">{children}</div>;
}

type MeterProps = {
  /** What is counted, for a screen reader — *Questions this month*. */
  readonly label: string;
  readonly value: number;
  readonly max: number;
  /** The line under the bar — *On track, 21 days left.* or, low, *13 questions left this month*. */
  readonly caption: ReactNode;
  /** `care` when it is running low: the bar's colour, and the caption already says it in words. */
  readonly tone?: "accent" | "care";
};

export function Meter({ label, value, max, caption, tone = "accent" }: MeterProps) {
  const share = max <= 0 ? 0 : Math.min(1, Math.max(0, value / max));
  return (
    <div className={`enni-meter enni-meter--${tone}`}>
      <meter className="enni-visually-hidden" aria-label={label} min={0} max={max} value={value} />
      <div className="enni-meter__track" aria-hidden="true">
        <span className="enni-meter__fill" style={{ width: `${(share * 100).toFixed(1)}%` }} />
      </div>
      <p className="enni-meter__caption">{caption}</p>
    </div>
  );
}

type PlanProps = {
  readonly name: string;
  readonly price: string;
  /** *per person a month · for a company or group*. */
  readonly per: string;
  readonly features: readonly string[];
  /** The current plan's tag — *Current* — and its marked look. */
  readonly current?: string;
  readonly action: ReactNode;
};

export function PlanCard({ name, price, per, features, current, action }: PlanProps) {
  return (
    <section className="enni-plan" aria-label={name} data-current={current !== undefined}>
      <header className="enni-plan__header">
        <h3>{name}</h3>
        {current === undefined ? null : <span className="enni-plan__tag">{current}</span>}
      </header>
      <p className="enni-plan__price">{price}</p>
      <p className="enni-plan__per">{per}</p>
      <ul className="enni-plan__features">
        {features.map((feature) => (
          <li key={feature}>
            <span aria-hidden="true">✓</span> {feature}
          </li>
        ))}
      </ul>
      <div className="enni-plan__action">{action}</div>
    </section>
  );
}
