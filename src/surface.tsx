/**
 * Surfaces and small type (#280): a `Card`, an `Eyebrow` and a `CheckList`.
 *
 * A **card** is a surface lifted off the canvas — `shadow-card`, `radius-xl`, a line around it —
 * the landing's sample answer and its guarantees, the help card. It is only a box: the element it
 * renders as is the caller's, so a list of cards is still a list.
 *
 * An **eyebrow** is the mono, spaced, capitalised line above a headline. The capitals are CSS, so a
 * screen reader hears the sentence as written, not spelled out.
 *
 * A **check list** is a ✓ and a sentence per row — the promises under the hero orb. The ✓ is a
 * shape, hidden from a screen reader; the sentence carries the meaning.
 */
import type { ReactNode } from "react";

type CardProps = {
  readonly as?: "div" | "section" | "article" | "li";
  readonly label?: string;
  readonly children: ReactNode;
};

export function Card({ as: Element = "div", label, children }: CardProps) {
  return (
    <Element className="enni-card" aria-label={label}>
      {children}
    </Element>
  );
}

export function Eyebrow({ children }: { readonly children: ReactNode }) {
  return <p className="enni-eyebrow">{children}</p>;
}

type CheckListProps = {
  readonly items: readonly string[];
  readonly label?: string;
};

export function CheckList({ items, label }: CheckListProps) {
  return (
    <ul className="enni-checklist" aria-label={label}>
      {items.map((item) => (
        <li key={item}>
          <span className="enni-checklist__mark" aria-hidden="true">
            ✓
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}
