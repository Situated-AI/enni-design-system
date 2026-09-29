import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Details, Sheet, syncDialog } from "./disclosure.tsx";

test("Details is a native disclosure, closed until asked", () => {
  const html = renderToStaticMarkup(<Details summary="Details">formal verdict</Details>);
  expect(html).toContain("<details");
  expect(html).not.toContain("open");
  expect(html).toContain("<summary>Details</summary>");
});

describe("Sheet", () => {
  const html = (open: boolean) =>
    renderToStaticMarkup(
      <Sheet title="Connected apps" open={open} onClose={() => {}}>
        <p>Linear</p>
      </Sheet>,
    );

  test("is a dialog labelled by its own heading", () => {
    expect(html(true)).toMatch(
      /<dialog class="enni-sheet" aria-labelledby="([^"]+)">[\s\S]*<h2 id="\1">Connected apps<\/h2>/,
    );
  });

  test("its close button names what it closes", () => {
    expect(html(true)).toContain('aria-label="Close Connected apps"');
  });

  test("closed, it holds no content — nothing behind it is read or focused", () => {
    expect(html(false)).not.toContain("Linear");
    expect(html(true)).toContain("Linear");
  });
});

describe("syncDialog", () => {
  const dialog = (open: boolean) => {
    const calls: string[] = [];
    return {
      calls,
      el: { open, showModal: () => calls.push("showModal"), close: () => calls.push("close") },
    };
  };

  test("opening shows it modally — the platform's focus trap and Esc", () => {
    const d = dialog(false);
    syncDialog(d.el, true);
    expect(d.calls).toEqual(["showModal"]);
  });

  test("closing closes it, and nothing is done twice", () => {
    const d = dialog(true);
    syncDialog(d.el, false);
    syncDialog(dialog(true).el, true);
    expect(d.calls).toEqual(["close"]);
  });

  test("before it mounts, nothing happens", () => {
    expect(() => syncDialog(null, true)).not.toThrow();
  });
});
