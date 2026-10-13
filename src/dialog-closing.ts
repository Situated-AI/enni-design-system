/**
 * What a native `<dialog>` tells the component that owns it, and when (enni-v2 #562).
 *
 * `Esc` closes a modal dialog at once and the browser says so twice: `cancel`, as it happens, and
 * `close`, as a task of its own a moment later. A component that heard only `close` had a moment in
 * which the dialog was gone and its owner still believed it open. A key that landed in that moment
 * was read against the wrong state: ⌘K, meaning *open the menu*, toggled a menu already closed, and
 * what was typed next went nowhere. Measured in enni-v2 on 13 Oct 2026, one time in one at a
 * machine's speed.
 *
 * So the owner is told on `cancel`, and the `close` that follows is not told again. A `close` that
 * arrives after the dialog has been opened once more is about the opening before it, and is
 * ignored: acting on it shut the dialog a person had just reopened.
 */
import { useRef } from "react";

type Heard = { current: boolean };

/** The two handlers, over one flag. Pure, so the order of events is tested without a browser. */
export function closingHandlers(heard: Heard, onClose: () => void) {
  return {
    /** `Esc`, or anything else the browser cancels a modal for: said now. */
    onCancel: () => {
      heard.current = true;
      onClose();
    },
    /**
     * The browser's notice that the dialog closed. Not repeated after a `cancel` that already said
     * it; not believed when the dialog is open again.
     */
    onClose: (dialog: { readonly open: boolean }) => {
      const already = heard.current;
      heard.current = false;
      if (already || dialog.open) return;
      onClose();
    },
  };
}

/** `closingHandlers` for a component: `<dialog {...useClosing(onClose)}>`. */
export function useClosing(onClose: () => void) {
  const handlers = closingHandlers(useRef(false), onClose);
  return {
    onCancel: handlers.onCancel,
    onClose: (event: { readonly currentTarget: { readonly open: boolean } }) =>
      handlers.onClose(event.currentTarget),
  };
}
