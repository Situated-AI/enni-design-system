"use client";
/**
 * Copy one value to the clipboard, and say that it happened (#61) — an invite link copied by hand
 * (§9), the one line a tool needs (§8).
 *
 * **The confirmation is words in a live region**, not a colour flash or an icon swap, so a
 * screen-reader user hears *"Copied"* and a sighted one reads it. When the clipboard refuses — an
 * insecure origin, a denied permission — it says that instead of pretending, and the value stays on
 * screen to select by hand.
 */
import { useState } from "react";
import { Button } from "./button.tsx";

export type CopyState = "idle" | "copied" | "refused";

export const COPY_WORDS: Readonly<Record<CopyState, string>> = {
  idle: "",
  copied: "Copied",
  refused: "Couldn't copy — select it and copy by hand",
};

type Clipboard = { writeText(text: string): Promise<void> };

/** Copies `value`, answering what happened rather than throwing. */
export async function copyValue(
  value: string,
  clipboard: Clipboard | undefined,
): Promise<CopyState> {
  if (clipboard === undefined) return "refused";
  try {
    await clipboard.writeText(value);
    return "copied";
  } catch {
    return "refused";
  }
}

type Props = {
  readonly value: string;
  /** What is being copied, for the button: *"Copy invite link"*. */
  readonly label: string;
};

export function CopyButton({ value, label }: Props) {
  const [state, setState] = useState<CopyState>("idle");
  const copy = async () => setState(await copyValue(value, globalThis.navigator?.clipboard));
  return (
    <span>
      <Button onClick={copy}>{label}</Button>
      <span role="status" aria-live="polite">
        {COPY_WORDS[state]}
      </span>
    </span>
  );
}
