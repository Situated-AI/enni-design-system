/**
 * Buttons and chips (#61).
 *
 * `SubmitButton` retypes one of v1's seven neutral primitives (D-55, D-16): while a submission is
 * in flight it stays in the tab order, says so to a screen reader with `aria-busy`, and refuses a
 * second press — so *"I pressed it twice"* is never two requests.
 *
 * A `Chip` is a suggestion a person can take: the refusal's way forward (§3.14) and the connected
 * step's next moves (§6) are chips. It is a button, never a link that looks like one.
 */
import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "quiet" | "danger";

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
  readonly variant?: ButtonVariant;
  readonly children: ReactNode;
};

export const buttonClass = (variant: ButtonVariant): string =>
  `enni-button enni-button--${variant}`;

export function Button({ variant = "quiet", type = "button", children, ...rest }: ButtonProps) {
  return (
    <button {...rest} type={type} className={buttonClass(variant)}>
      {children}
    </button>
  );
}

type SubmitProps = Omit<ButtonProps, "type" | "variant"> & {
  /** True while the form's request is in flight. */
  readonly pending: boolean;
  /** What the button says while pending — *"Checking…"*, not a spinner with no words. */
  readonly pendingLabel: string;
};

export function SubmitButton({ pending, pendingLabel, children, disabled, ...rest }: SubmitProps) {
  return (
    <button
      {...rest}
      type="submit"
      className={buttonClass("primary")}
      disabled={disabled === true || pending}
      aria-busy={pending}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}

type ChipProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "type"> & {
  readonly children: ReactNode;
};

export function Chip({ children, ...rest }: ChipProps) {
  return (
    <button {...rest} type="button" className="enni-chip">
      {children}
    </button>
  );
}
