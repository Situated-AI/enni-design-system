/**
 * A labelled form field (#61): the label, the input, a hint and an error, tied together.
 *
 * The hint and the error are read with the field (`aria-describedby`), and an error marks it
 * invalid — so *"It's stored encrypted and never shown again"* (§6) is heard by the person typing
 * the key, not only seen. The credential field in #65 is this primitive with `type="password"`:
 * a real form field, never a chat message.
 */
import type { InputHTMLAttributes } from "react";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "className"> & {
  readonly id: string;
  readonly label: string;
  readonly hint?: string;
  readonly error?: string;
};

/** The ids a field's description points at, in reading order: the hint, then the error. */
export function describedBy(id: string, hint?: string, error?: string): string | undefined {
  const ids = [hint === undefined ? "" : `${id}-hint`, error === undefined ? "" : `${id}-error`];
  const joined = ids.filter((x) => x !== "").join(" ");
  return joined === "" ? undefined : joined;
}

export function Field({ id, label, hint, error, ...input }: Props) {
  return (
    <div className="enni-field">
      <label htmlFor={id}>{label}</label>
      <input
        {...input}
        id={id}
        aria-describedby={describedBy(id, hint, error)}
        aria-invalid={error === undefined ? undefined : true}
      />
      {hint === undefined ? null : (
        <span id={`${id}-hint`} className="enni-field__hint">
          {hint}
        </span>
      )}
      {error === undefined ? null : (
        <span id={`${id}-error`} className="enni-field__error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
