"use client";
/**
 * Code a person copies, and a terminal's output (enni-v2 #637): the landing's `.lp-code` and
 * `.lp-term`, dark in both themes (`code-bg`, `code-ink`).
 *
 * **`CodeBlock`** is one line or a few a tool needs — *Set up in one command* — in the dark panel,
 * wrapping so a long line never pushes the page wide, with the landing's copy button in its corner
 * (`.lp-copy`). The button says *Copied* for a moment; where the clipboard refuses, the code is
 * selected so it can be copied by hand, and a live region says so either way. Every word is the
 * caller's; the defaults are `COPY_WORDS`.
 *
 * **`Terminal`** is a run of output: one line per row, each made of parts in the terminal's inks
 * (`dim` for a prompt, `accent`, `ready`, `care`, `danger`), never colour alone — the text says it.
 * It scrolls sideways rather than wrapping, as a terminal does, so it is a focusable, named region.
 */
import { type ReactNode, useEffect, useRef, useState } from "react";
import { COPY_WORDS, type CopyState, copyValue } from "./copy-button.tsx";

/** How long *Copied* stays on the button before it says *Copy* again. */
const HELD_MS = 1600;

/** Selects what is inside `node`, so a refused copy leaves the code ready to copy by hand. */
export function selectContents(node: Node | null, page: Pick<Window, "getSelection"> = globalThis) {
  const selection = page.getSelection?.();
  if (node === null || selection == null || typeof document === "undefined") return;
  const range = document.createRange();
  range.selectNodeContents(node);
  selection.removeAllRanges();
  selection.addRange(range);
}

type CodeBlockProps = {
  readonly code: string;
  /** What the block is, for a screen reader: *Claude Code setup*. */
  readonly label: string;
  readonly copyLabel: string;
  readonly copiedLabel?: string;
  readonly refusedLabel?: string;
};

export function CodeBlock({ code, label, copyLabel, ...words }: CodeBlockProps) {
  const { copiedLabel = COPY_WORDS.copied, refusedLabel = COPY_WORDS.refused } = words;
  const [state, setState] = useState<CopyState>("idle");
  const held = useRef<HTMLElement>(null);
  useEffect(() => {
    if (state === "idle") return;
    const timer = setTimeout(() => setState("idle"), HELD_MS);
    return () => clearTimeout(timer);
  }, [state]);
  const copy = async () => {
    const next = await copyValue(code, globalThis.navigator?.clipboard);
    if (next === "refused") selectContents(held.current);
    setState(next);
  };
  const said = { idle: "", copied: copiedLabel, refused: refusedLabel }[state];
  return (
    <figure className="enni-code" aria-label={label}>
      <pre className="enni-term">
        <code ref={held}>{code}</code>
      </pre>
      <button type="button" className="enni-copy" onClick={copy}>
        {state === "copied" ? copiedLabel : copyLabel}
      </button>
      <span className="enni-visually-hidden" role="status" aria-live="polite">
        {said}
      </span>
    </figure>
  );
}

export type TermTone = "dim" | "accent" | "ready" | "care" | "danger";
export type TermPart = { readonly text: string; readonly tone?: TermTone };
/** One row of output: plain words, or parts each in its ink. */
export type TermLine = string | readonly TermPart[];

const partsOf = (line: TermLine): readonly TermPart[] =>
  typeof line === "string" ? [{ text: line }] : line;

function Part({ part }: { readonly part: TermPart }): ReactNode {
  if (part.tone === undefined) return part.text;
  return <span className={`enni-term__${part.tone}`}>{part.text}</span>;
}

export function Terminal({
  label,
  lines,
}: {
  readonly label: string;
  readonly lines: readonly TermLine[];
}) {
  return (
    // biome-ignore lint/a11y/noNoninteractiveTabindex: a region that scrolls sideways is reached by keyboard.
    <section className="enni-term enni-term--output" aria-label={label} tabIndex={0}>
      <pre className="enni-term__pre">
        {lines.map((line, row) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: a terminal's rows are ordered and may repeat.
          <span key={row} className="enni-term__line">
            {partsOf(line).map((part, at) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: a row's parts are ordered and may repeat.
              <Part key={at} part={part} />
            ))}
          </span>
        ))}
      </pre>
    </section>
  );
}
