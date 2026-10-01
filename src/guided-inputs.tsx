/**
 * What a guided card asks with (#296): steps to follow, a link that leaves, a secret, an answer.
 *
 * - **Instruction list** is numbered steps: a round number, the action in the ink, and a muted
 *   *why* after it (*Enni never writes to your apps, so that's all it needs.*).
 * - **New-tab link** opens in a new tab and says so: a ↗ to the eye, the words to a screen reader.
 * - **Secret field** is a key pasted into a real field with its button inline. It is masked, and
 *   asks every browser and password manager to leave it alone. **It holds no value of its own**: the
 *   field takes no `value`, its submit hands the secret over once and clears the input, so the
 *   secret lives in the field only while it is typed — never in state, a turn or a history (§6,
 *   *"a credential is not an agent's to hand over"*).
 * - **Answer chips** look like suggestion chips, but each one answers the card's question rather
 *   than saying a sentence. They are buttons in a fieldset (a `group`) named by the question, and *Not yet*
 *   carries the same weight as the rest, because it is a real answer.
 *
 * Every word is a prop (D-114).
 */
import type { FormEvent, ReactNode } from "react";
import { describedBy } from "./field.tsx";

export type Instruction = {
  /** What to do — the caller marks its key words. */
  readonly action: ReactNode;
  /** Why, muted, after it. */
  readonly why?: ReactNode;
};

export function InstructionList({ steps }: { readonly steps: readonly Instruction[] }) {
  return (
    <ol className="enni-instructions">
      {steps.map((step, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: a step's number is its identity
        <li key={i}>
          <span className="enni-instructions__number" aria-hidden="true">
            {i + 1}
          </span>
          <span>
            {step.action}
            {step.why === undefined ? null : (
              <>
                {" "}
                <span className="enni-instructions__why">{step.why}</span>
              </>
            )}
          </span>
        </li>
      ))}
    </ol>
  );
}

type NewTabLinkProps = {
  readonly href: string;
  readonly children: ReactNode;
  /** What a screen reader hears after the link's words: *"opens in a new tab"*. */
  readonly newTab: string;
};

export function NewTabLink({ href, children, newTab }: NewTabLinkProps) {
  return (
    <a className="enni-new-tab" href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <span aria-hidden="true"> ↗</span>
      <span className="enni-visually-hidden"> ({newTab})</span>
    </a>
  );
}

/** The secret, handed over once: read from the form, and the field cleared behind it. */
export function takeSecret(form: Pick<HTMLFormElement, "reset">, data: FormData): string {
  const secret = String(data.get("secret") ?? "").trim();
  form.reset();
  return secret;
}

type SecretFieldProps = {
  readonly id: string;
  /** The field's name to a screen reader; the placeholder shows the same words. */
  readonly label: string;
  readonly submitLabel: string;
  readonly pendingLabel: string;
  readonly pending?: boolean;
  readonly hint?: string;
  readonly onSubmit: (secret: string) => void;
};

export function SecretField(props: SecretFieldProps) {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const secret = takeSecret(event.currentTarget, new FormData(event.currentTarget));
    if (secret !== "") props.onSubmit(secret);
  };
  return (
    <form className="enni-secret" method="post" onSubmit={submit} aria-label={props.label}>
      <label className="enni-visually-hidden" htmlFor={props.id}>
        {props.label}
      </label>
      <div className="enni-secret__row">
        <input
          id={props.id}
          name="secret"
          type="password"
          required
          placeholder={props.label}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          data-1p-ignore=""
          data-lpignore="true"
          data-bwignore=""
          data-form-type="other"
          aria-describedby={describedBy(props.id, props.hint)}
        />
        <button
          type="submit"
          className="enni-button enni-button--primary"
          disabled={props.pending === true}
          aria-busy={props.pending === true}
        >
          {props.pending === true ? props.pendingLabel : props.submitLabel}
        </button>
      </div>
      {props.hint === undefined ? null : (
        <span id={`${props.id}-hint`} className="enni-field__hint">
          {props.hint}
        </span>
      )}
    </form>
  );
}

export type Answer = { readonly value: string; readonly label: string };

type AnswerChipsProps = {
  /** The question the chips answer — the group's name. */
  readonly question: string;
  readonly answers: readonly Answer[];
  readonly onAnswer: (value: string) => void;
  readonly disabled?: boolean;
};

export function AnswerChips({ question, answers, onAnswer, disabled }: AnswerChipsProps) {
  return (
    <fieldset className="enni-answers" aria-label={question}>
      {answers.map((answer) => (
        <button
          key={answer.value}
          type="button"
          className="enni-chip"
          disabled={disabled}
          onClick={() => onAnswer(answer.value)}
        >
          {answer.label}
        </button>
      ))}
    </fieldset>
  );
}
