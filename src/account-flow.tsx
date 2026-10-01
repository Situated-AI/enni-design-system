/**
 * Getting in (#289, A01–A12): the **Steps** strip, the **Auth card** every A-screen sits in, and
 * the **Notice** a failure is said in.
 *
 * - **Steps** is the invite's progress: done steps carry a ✓, the current one a ringed number and
 *   `aria-current="step"`, later ones are muted. On a phone only the current step's label shows; the
 *   others stay for a screen reader.
 * - **Auth card** is one layout for every account screen: a centred card on the canvas with the
 *   brand tile, a title, a lede, an optional notice, the form, and footer links. On a phone it fills
 *   the screen.
 * - **Notice** is one `role="alert"` region. A10 and A12 say a single sentence in it whatever went
 *   wrong, so the page can't be used to probe which addresses exist.
 *
 * Every word is a prop (D-114).
 */
import type { ReactNode } from "react";
import { BrandTile } from "./brand.tsx";

type StepsProps = {
  readonly steps: readonly string[];
  /** The current step, counted from 0. */
  readonly current: number;
  /** The list's name: *"Setting up your account"*. */
  readonly label: string;
  /** What a done step is called to a screen reader: *"done"*. */
  readonly doneWord: string;
};

export function Steps({ steps, current, label, doneWord }: StepsProps) {
  return (
    <ol className="enni-steps" aria-label={label}>
      {steps.map((step, i) => {
        const state = i < current ? "done" : i === current ? "current" : "later";
        return (
          <li key={step} data-state={state} aria-current={state === "current" ? "step" : undefined}>
            <span className="enni-steps__mark" aria-hidden="true">
              {state === "done" ? "✓" : i + 1}
            </span>
            <span className="enni-steps__label">
              {step}
              {state === "done" ? (
                <span className="enni-visually-hidden"> · {doneWord}</span>
              ) : null}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export function Notice({ children }: { readonly children: ReactNode }) {
  return (
    <p className="enni-notice" role="alert">
      {children}
    </p>
  );
}

type AuthCardProps = {
  readonly title: string;
  readonly lede?: ReactNode;
  /** The progress strip, above everything, when the screen is one step of several. */
  readonly steps?: ReactNode;
  /** A failure sentence: a `Notice`. */
  readonly notice?: ReactNode;
  /** Links under the form: *Already have an account? Sign in.* */
  readonly footer?: ReactNode;
  readonly children: ReactNode;
};

export function AuthCard({ title, lede, steps, notice, footer, children }: AuthCardProps) {
  return (
    <section className="enni-auth" aria-labelledby="enni-auth-title">
      {steps}
      <div className="enni-auth__body">
        <h1 id="enni-auth-title" className="enni-auth__title">
          <BrandTile />
          {title}
        </h1>
        {lede === undefined ? null : <div className="enni-auth__lede">{lede}</div>}
        {notice}
        <div className="enni-auth__content">{children}</div>
        {footer === undefined ? null : <div className="enni-auth__footer">{footer}</div>}
      </div>
    </section>
  );
}
