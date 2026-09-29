"use client";
/**
 * The two confirmations (#61, `product-spec.md` §9) — retyped from v1's neutral set (D-55, D-16).
 *
 * - **`ConfirmStep`** — a destructive press asks once more, in place. *Keep* is the safe way out
 *   and sits first, so the reflexive second click lands on the harmless button.
 * - **`ConfirmByTyping`** — for what cannot be undone (removing a person): the button stays
 *   disabled until the phrase is typed exactly, and **it says what it destroys** rather than
 *   *"Confirm"*.
 *
 * Matching is `confirmationMatches`, pure, so the rule is testable without a DOM: exact after
 * trimming the ends, case included — *"remove Dana"* is not *"Remove Dana"*, because the point is
 * that the reader looked at the name.
 */
import { type ReactNode, useId, useState } from "react";
import { Button } from "./button.tsx";

export const confirmationMatches = (typed: string, phrase: string): boolean =>
  typed.trim() === phrase.trim() && phrase.trim() !== "";

type StepProps = {
  /** What the first press says: *"Disconnect Linear"*. */
  readonly action: string;
  /** The sentence the second step asks: what will happen. */
  readonly question: ReactNode;
  /** What the confirming button says — what it does, never *"Confirm"*. */
  readonly confirm: string;
  readonly onConfirm: () => void;
  /** Starts at the question, for a surface that has already asked once (the conversation). */
  readonly open?: boolean;
};

export function ConfirmStep({ action, question, confirm, onConfirm, open = false }: StepProps) {
  const [asking, setAsking] = useState(open);
  if (!asking) return <Button onClick={() => setAsking(true)}>{action}</Button>;
  return (
    <fieldset className="enni-confirm">
      <legend className="enni-visually-hidden">{action}</legend>
      <p>{question}</p>
      <div className="enni-confirm__actions">
        <Button variant="primary" onClick={() => setAsking(false)}>
          Keep
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          {confirm}
        </Button>
      </div>
    </fieldset>
  );
}

type TypingProps = {
  /** What the reader types, exactly: usually the thing's own name. */
  readonly phrase: string;
  readonly question: ReactNode;
  /** The button: *"Remove Dana Okafor"* — what it destroys. */
  readonly confirm: string;
  readonly onConfirm: () => void;
  readonly onKeep: () => void;
};

export function ConfirmByTyping({ phrase, question, confirm, onConfirm, onKeep }: TypingProps) {
  const [typed, setTyped] = useState("");
  const id = useId();
  const matches = confirmationMatches(typed, phrase);
  return (
    <fieldset className="enni-confirm">
      <legend className="enni-visually-hidden">{confirm}</legend>
      <p>{question}</p>
      <div className="enni-field">
        <label htmlFor={id}>
          Type <strong>{phrase}</strong> to confirm
        </label>
        <input
          id={id}
          value={typed}
          autoComplete="off"
          onChange={(event) => setTyped(event.currentTarget.value)}
        />
      </div>
      <div className="enni-confirm__actions">
        <Button variant="primary" onClick={onKeep}>
          Keep
        </Button>
        <Button variant="danger" disabled={!matches} onClick={onConfirm}>
          {confirm}
        </Button>
      </div>
    </fieldset>
  );
}
