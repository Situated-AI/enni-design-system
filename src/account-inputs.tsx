"use client";
/**
 * What an account screen asks for (#289): **choice cards**, the **code input**, the **code list**,
 * the **copy field**, the **QR block** and the **device-prompt preview**.
 *
 * - **Choice cards** are radios in a named fieldset, one card each with a label and a hint. The
 *   chosen card is `border-strong` on `sunken` (A02, S05).
 * - **Code input** is one field, `inputmode="numeric"` and `autocomplete="one-time-code"`, so iOS
 *   and Android offer the code they received. It accepts a pasted *123 456* or *123-456* and keeps
 *   the digits (`codeDigits`), and shows them grouped (`groupCode`).
 * - **Code list** is the recovery codes in a mono two-column grid, with *Download as a file* and
 *   *Copy all* (A05).
 * - **Copy field** is a mono value with a Copy button and a live word for what happened.
 * - **QR block** is the code, the instruction, and the typed key in a copy field under *Can't scan?*
 *   The QR is drawn by the caller and passed in.
 * - **Device prompt** is a drawing of the OS passkey sheet, shown before the real one appears. It is
 *   decorative (`aria-hidden`), and the sentence beside it carries the meaning.
 */
import { type ReactNode, useId, useState } from "react";
import { Button } from "./button.tsx";
import { COPY_WORDS, type CopyState, copyValue } from "./copy-button.tsx";
import { describedBy } from "./field.tsx";

type Choice = { readonly value: string; readonly label: string; readonly hint?: string };

type ChoiceProps = {
  readonly legend: string;
  /** Shows the legend as a field label (S05 *Role*); otherwise it is for a screen reader only. */
  readonly showLegend?: boolean;
  readonly name: string;
  readonly choices: readonly Choice[];
  readonly value: string;
  readonly onChange: (value: string) => void;
};

export function ChoiceList({ legend, showLegend, name, choices, value, onChange }: ChoiceProps) {
  return (
    <fieldset className="enni-choices">
      <legend className={showLegend ? "enni-choices__legend" : "enni-visually-hidden"}>
        {legend}
      </legend>
      {choices.map((choice) => (
        <label key={choice.value} className="enni-choice" data-selected={choice.value === value}>
          <input
            type="radio"
            name={name}
            value={choice.value}
            checked={choice.value === value}
            onChange={() => onChange(choice.value)}
          />
          <span className="enni-choice__text">
            <span className="enni-choice__label">{choice.label}</span>
            {choice.hint === undefined ? null : (
              <span className="enni-choice__hint">{choice.hint}</span>
            )}
          </span>
        </label>
      ))}
    </fieldset>
  );
}

/** The digits of what was typed or pasted, at most `length` of them. */
export function codeDigits(raw: string, length = 6): string {
  return raw.replace(/\D/g, "").slice(0, length);
}

/** Digits shown in threes: `123456` → `123 456`. */
export function groupCode(digits: string): string {
  return digits.replace(/(\d{3})(?=\d)/g, "$1 ");
}

type CodeProps = {
  readonly id: string;
  readonly label: string;
  readonly hint?: string;
  readonly error?: string;
  readonly placeholder?: string;
  /** The digits so far. */
  readonly value: string;
  readonly onChange: (digits: string) => void;
  readonly length?: number;
};

export function CodeInput({
  id,
  label,
  hint,
  error,
  placeholder,
  value,
  onChange,
  length = 6,
}: CodeProps) {
  return (
    <div className="enni-field enni-code-input">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={id}
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9 ]*"
        maxLength={length + Math.floor((length - 1) / 3)}
        placeholder={placeholder}
        value={groupCode(value)}
        onChange={(event) => onChange(codeDigits(event.currentTarget.value, length))}
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

/** A copy that says what happened, in a live region beside the button. */
function useCopy(value: string): [CopyState, () => Promise<void>] {
  const [state, setState] = useState<CopyState>("idle");
  return [state, async () => setState(await copyValue(value, globalThis.navigator?.clipboard))];
}

type CodeListProps = {
  readonly codes: readonly string[];
  readonly label: string;
  readonly downloadLabel: string;
  readonly copyLabel: string;
  /** The downloaded file's name: *enni-recovery-codes.txt*. */
  readonly filename: string;
};

/** Saves `text` as a file, from the page. */
function download(text: string, filename: string): void {
  const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
  const link = Object.assign(document.createElement("a"), { href: url, download: filename });
  link.click();
  URL.revokeObjectURL(url);
}

export function CodeList({ codes, label, downloadLabel, copyLabel, filename }: CodeListProps) {
  const text = `${codes.join("\n")}\n`;
  const [state, copy] = useCopy(text);
  return (
    <div className="enni-code-list">
      <ul aria-label={label}>
        {codes.map((code) => (
          <li key={code}>{code}</li>
        ))}
      </ul>
      <div className="enni-code-list__actions">
        <Button variant="secondary" onClick={() => download(text, filename)}>
          {downloadLabel}
        </Button>
        <Button variant="secondary" onClick={copy}>
          {copyLabel}
        </Button>
        <span role="status" aria-live="polite">
          {COPY_WORDS[state]}
        </span>
      </div>
    </div>
  );
}

type CopyFieldProps = {
  readonly value: string;
  /** What the value is, for a screen reader: *"Invite link"*. */
  readonly label: string;
  readonly copyLabel: string;
};

export function CopyField({ value, label, copyLabel }: CopyFieldProps) {
  const [state, copy] = useCopy(value);
  const id = useId();
  return (
    <div className="enni-copy-field">
      <span className="enni-visually-hidden">{label}: </span>
      <code id={id}>{value}</code>
      <Button aria-describedby={id} onClick={copy}>
        {copyLabel}
      </Button>
      <span className="enni-copy-field__status" role="status" aria-live="polite">
        {COPY_WORDS[state]}
      </span>
    </div>
  );
}

type QrProps = {
  /** The QR, drawn by the caller (an SVG), with its own accessible name. */
  readonly qr: ReactNode;
  readonly instruction: string;
  /** *Can't scan? Type this key instead:* */
  readonly keyIntro: string;
  readonly secret: string;
  readonly keyLabel: string;
  readonly copyLabel: string;
  readonly note?: string;
};

export function QrBlock({ qr, instruction, keyIntro, secret, keyLabel, copyLabel, note }: QrProps) {
  return (
    <div className="enni-qr">
      <div className="enni-qr__code">{qr}</div>
      <div className="enni-qr__text">
        <p className="enni-qr__instruction">{instruction}</p>
        <p className="enni-qr__intro">{keyIntro}</p>
        <CopyField value={groupKey(secret)} label={keyLabel} copyLabel={copyLabel} />
        {note === undefined ? null : <p className="enni-qr__note">{note}</p>}
      </div>
    </div>
  );
}

/** A typed key in fours, so it can be read and typed: `JBSWY3DP` → `JBSW Y3DP`. */
export function groupKey(secret: string): string {
  return secret.replace(/\s/g, "").replace(/(.{4})(?=.)/g, "$1 ");
}

type PromptProps = {
  readonly title: string;
  readonly detail: string;
  readonly cancel: string;
  readonly confirm: string;
};

export function DevicePrompt({ title, detail, cancel, confirm }: PromptProps) {
  return (
    <div className="enni-device-prompt" aria-hidden="true">
      <span className="enni-device-prompt__glyph">⌘</span>
      <span className="enni-device-prompt__text">
        <span className="enni-device-prompt__title">{title}</span>
        <span className="enni-device-prompt__detail">{detail}</span>
      </span>
      <span className="enni-device-prompt__actions">
        <span className="enni-device-prompt__cancel">{cancel}</span>
        <span className="enni-device-prompt__confirm">{confirm}</span>
      </span>
    </div>
  );
}
