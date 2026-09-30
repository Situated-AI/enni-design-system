/**
 * The composer and its talk button (#283) — a rounded field, a round mic, and a hint under them.
 *
 * Only the look and the shape: what `Enter` does, what the mic hears and every word are the caller's
 * (D-114). The field is a real `<textarea>` in a real `<form>` with a visible-to-readers label, so
 * typing reaches everything (#116 F10) and voice only ever fills this same field.
 *
 * The **talk button** is round, 44px, and named in text — *Talk*, then *Stop* while it listens —
 * with the mic drawn beside the name and the name hidden only visually (the button's own font size is
 * zero), so its accessible name is the word and changes with its state. It is never the only way in:
 * the field and **Send** are always there.
 *
 * The hint has two readings, the desktop's keys and the phone's, switched by width in CSS.
 */
import type { KeyboardEvent, ReactNode, Ref } from "react";
import { Icon } from "./icon.tsx";

type TalkProps = {
  /** *Talk*, or *Stop* while listening — the accessible name, and it changes with the state. */
  readonly label: string;
  readonly listening: boolean;
  readonly disabled?: boolean;
  readonly onClick: () => void;
};

export function TalkButton({ label, listening, disabled, onClick }: TalkProps) {
  return (
    <button
      type="button"
      className="enni-talk"
      aria-pressed={listening}
      disabled={disabled}
      data-listening={listening}
      onClick={onClick}
    >
      <Icon name="mic" />
      {label}
    </button>
  );
}

type ComposerProps = {
  readonly id: string;
  /** The form's name for a screen reader: *Say something to Enni*. */
  readonly formLabel: string;
  /** The field's label, read but not shown: *Message*. */
  readonly fieldLabel: string;
  readonly value: string;
  readonly placeholder: string;
  /** The keys on a desktop; `hintNarrow` is the phone's, when it differs. */
  readonly hint: string;
  readonly hintNarrow?: string;
  readonly sendLabel: string;
  readonly disabled?: boolean;
  /** A sentence is in flight: *busy*, never locked — the next one is still taken. */
  readonly pending?: boolean;
  readonly fieldRef?: Ref<HTMLTextAreaElement>;
  readonly onChange: (value: string) => void;
  readonly onKeyDown?: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  readonly onSubmit: () => void;
  /** The talk button, when voice is offered. */
  readonly talk?: ReactNode;
  /** What the mic says, when it has something to say. */
  readonly status?: ReactNode;
};

export function Composer(props: ComposerProps) {
  const { id, disabled = false, pending = false } = props;
  return (
    <form
      className="enni-composer"
      aria-label={props.formLabel}
      onSubmit={(event) => {
        event.preventDefault();
        props.onSubmit();
      }}
    >
      <label className="enni-visually-hidden" htmlFor={id}>
        {props.fieldLabel}
      </label>
      <div className="enni-composer__row">
        <textarea
          id={id}
          ref={props.fieldRef}
          rows={1}
          value={props.value}
          disabled={disabled}
          placeholder={props.placeholder}
          onChange={(event) => props.onChange(event.currentTarget.value)}
          onKeyDown={props.onKeyDown}
        />
        {props.talk}
        <button
          aria-busy={pending}
          type="submit"
          className="enni-composer__send"
          disabled={disabled}
        >
          {props.sendLabel}
        </button>
      </div>
      {props.status}
      <p className="enni-composer__hint">
        <span className="enni-composer__hint--wide">{props.hint}</span>
        <span className="enni-composer__hint--narrow">{props.hintNarrow ?? props.hint}</span>
      </p>
    </form>
  );
}
