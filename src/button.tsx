/**
 * Buttons and chips (#61, #280).
 *
 * `SubmitButton` retypes one of v1's seven neutral primitives (D-55, D-16): while a submission is
 * in flight it stays in the tab order, says so to a screen reader with `aria-busy`, and refuses a
 * second press — so *"I pressed it twice"* is never two requests.
 *
 * **Variants and sizes (#280).** `primary` is filled accent; `secondary` is outlined on a surface
 * (the landing's *Try it on a sample space*); `quiet` is outlined on nothing; `danger` is the
 * destructive one. `lg` is the landing's call to action, and `block` fills the width, as the
 * phone's calls to action do. A call to action that goes somewhere is a `ButtonLink` — an `<a>`,
 * so it opens in a new tab and a screen reader hears a link.
 *
 * **Disabled is one look (enni-v2 #480).** Whatever the variant, a button that cannot be pressed
 * is the `disabled` ground with subtle ink and a line: fading the variant's own colour made a
 * disabled primary read as a secondary button in the dark and as a pale primary in the light.
 *
 * A `Chip` is a suggestion a person can take: the refusal's way forward (§3.14) and the connected
 * step's next moves (§6) are chips. It is a button, never a link that looks like one.
 * `SuggestionChip` is the one that *says* its label into the conversation when tapped.
 */
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode, Ref } from "react";

export type ButtonVariant = "primary" | "secondary" | "quiet" | "danger";
export type ButtonSize = "md" | "lg";

type Look = { readonly size?: ButtonSize; readonly block?: boolean };

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> &
  Look & {
    readonly variant?: ButtonVariant;
    /** React 19 passes it through as a prop: the action menu returns focus to its button. */
    readonly ref?: Ref<HTMLButtonElement>;
    readonly children: ReactNode;
  };

export const buttonClass = (variant: ButtonVariant, { size = "md", block = false }: Look = {}) =>
  [
    "enni-button",
    `enni-button--${variant}`,
    size === "lg" ? "enni-button--lg" : null,
    block ? "enni-button--block" : null,
  ]
    .filter(Boolean)
    .join(" ");

export function Button({
  variant = "quiet",
  size,
  block,
  type = "button",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button {...rest} type={type} className={buttonClass(variant, { size, block })}>
      {children}
    </button>
  );
}

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className"> &
  Look & {
    readonly href: string;
    readonly variant?: ButtonVariant;
    readonly children: ReactNode;
  };

/** A call to action that navigates: a link with a button's look. */
export function ButtonLink({ variant = "secondary", size, block, children, ...rest }: LinkProps) {
  return (
    <a {...rest} className={buttonClass(variant, { size, block })}>
      {children}
    </a>
  );
}

type SubmitProps = Omit<ButtonProps, "type" | "variant"> & {
  /** True while the form's request is in flight. */
  readonly pending: boolean;
  /** What the button says while pending — *"Checking…"*, not a spinner with no words. */
  readonly pendingLabel: string;
};

export function SubmitButton({
  pending,
  pendingLabel,
  children,
  disabled,
  size,
  block,
  ...rest
}: SubmitProps) {
  return (
    <button
      {...rest}
      type="submit"
      className={buttonClass("primary", { size, block })}
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

type SuggestionProps = {
  /** The sentence the chip shows — and says, word for word, when tapped. */
  readonly label: string;
  /** The conversation's own path: tapping a chip is typing its label and pressing Enter. */
  readonly onSay: (sentence: string) => void;
  readonly disabled?: boolean;
};

export function SuggestionChip({ label, onSay, disabled }: SuggestionProps) {
  return (
    <Chip onClick={() => onSay(label)} disabled={disabled}>
      {label}
    </Chip>
  );
}
