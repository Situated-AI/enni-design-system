/**
 * A labelled form field (#61): the label, the input, a hint and an error, tied together.
 *
 * The hint and the error are read with the field (`aria-describedby`), and an error marks it
 * invalid — so *"It's stored encrypted and never shown again"* (§6) is heard by the person typing
 * the key, not only seen. The credential field in #65 is this primitive with `type="password"`:
 * a real form field, never a chat message.
 *
 * **Since 0.6.1 it is the landing's `.lp-fld`** (enni-v2 #637): outlined in the strong line, ringed
 * in the accent's soft ground when focused, its error in the danger's ink under it. `valid` is the
 * landing's *good* state: the border turns the ready ink and a tick shows inside the field (the
 * tick is a shape; the field's own value is what was right). `TextareaField` and `SelectField` are
 * the same frame around a `<textarea>` and a `<select>`.
 *
 * **`ActionField`** is the landing's public check (`.lp-try__box`): the input and its action in one
 * outlined box, which rings as a whole while the input is focused and shakes once when refused.
 */
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

type Words = {
  readonly id: string;
  readonly label: string;
  readonly hint?: string;
  readonly error?: string;
};

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "className"> &
  Words & {
    /** Right, and shown so: the ready border and a tick inside the field (enni-v2 #637). */
    readonly valid?: boolean;
  };

/** The ids a field's description points at, in reading order: the hint, then the error. */
export function describedBy(id: string, hint?: string, error?: string): string | undefined {
  const ids = [hint === undefined ? "" : `${id}-hint`, error === undefined ? "" : `${id}-error`];
  const joined = ids.filter((x) => x !== "").join(" ");
  return joined === "" ? undefined : joined;
}

/** What a control in a field is told about its words: who describes it, and whether it is wrong. */
const described = ({ id, hint, error }: Words) => ({
  id,
  "aria-describedby": describedBy(id, hint, error),
  "aria-invalid": error === undefined ? undefined : true,
});

const stateOf = (error?: string, valid?: boolean) =>
  error !== undefined ? "bad" : valid === true ? "good" : undefined;

function Messages({ id, hint, error }: Words) {
  return (
    <>
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
    </>
  );
}

const Tick = () => (
  <svg className="enni-field__tick" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

export function Field({ id, label, hint, error, valid, ...input }: Props) {
  const control = <input {...input} {...described({ id, label, hint, error })} />;
  return (
    <div className="enni-field" data-state={stateOf(error, valid)}>
      <label htmlFor={id}>{label}</label>
      {valid === undefined ? (
        control
      ) : (
        <span className="enni-field__in">
          {control}
          <Tick />
        </span>
      )}
      <Messages id={id} label={label} hint={hint} error={error} />
    </div>
  );
}

type TextareaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id" | "className"> & Words;

export function TextareaField({ id, label, hint, error, ...area }: TextareaProps) {
  return (
    <div className="enni-field" data-state={stateOf(error)}>
      <label htmlFor={id}>{label}</label>
      <textarea {...area} {...described({ id, label, hint, error })} />
      <Messages id={id} label={label} hint={hint} error={error} />
    </div>
  );
}

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "id" | "className"> &
  Words & {
    readonly options: readonly { readonly value: string; readonly label: string }[];
  };

export function SelectField({ id, label, hint, error, options, ...select }: SelectProps) {
  return (
    <div className="enni-field" data-state={stateOf(error)}>
      <label htmlFor={id}>{label}</label>
      <select {...select} {...described({ id, label, hint, error })}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <Messages id={id} label={label} hint={hint} error={error} />
    </div>
  );
}

type ActionProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "className"> &
  Words & {
    /** The action inside the box, after the input: a `Button` or a `SubmitButton`. */
    readonly action: ReactNode;
    /** The input in mono, as the landing sets an address. */
    readonly mono?: boolean;
  };

export function ActionField({ id, label, hint, error, action, mono, ...input }: ActionProps) {
  const className =
    mono === true ? "enni-action-field enni-action-field--mono" : "enni-action-field";
  return (
    <div className={className} data-state={stateOf(error)}>
      <label htmlFor={id}>{label}</label>
      <div className="enni-action-field__box">
        <input {...input} {...described({ id, label, hint, error })} />
        {action}
      </div>
      <Messages id={id} label={label} hint={hint} error={error} />
    </div>
  );
}
