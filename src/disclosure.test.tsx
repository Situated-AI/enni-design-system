import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import {
  Details,
  EXIT_MS,
  heldWhile,
  lingerMs,
  prefersStill,
  Sheet,
  syncDialog,
} from "./disclosure.tsx";
import { MOTION } from "./tokens.ts";

test("#300: Details can be opened from outside", () => {
  const html = renderToStaticMarkup(
    <Details summary="Details" open>
      formal verdict
    </Details>,
  );
  expect(html).toContain('<details class="enni-details" open=""');
});

test("Details is a native disclosure, closed until asked", () => {
  const html = renderToStaticMarkup(<Details summary="Details">formal verdict</Details>);
  expect(html).toContain("<details");
  expect(html).not.toContain("open");
  expect(html).toContain("<summary>Details</summary>");
});

describe("Sheet", () => {
  const html = (open: boolean) =>
    renderToStaticMarkup(
      <Sheet title="Connected apps" closeLabel="Shut" open={open} onClose={() => {}}>
        <p>Linear</p>
      </Sheet>,
    );

  test("it closes with the one close control, named by the word it is given (enni-v2 #473)", () => {
    expect(html(true)).toContain(
      '<button type="button" class="enni-close" aria-label="Shut"><span aria-hidden="true">×</span></button>',
    );
    // No word of its own: the design system carries no vocabulary (D-114).
    expect(html(true)).not.toContain("Close");
  });

  test("is a dialog labelled by its own heading", () => {
    expect(html(true)).toMatch(
      /<dialog class="enni-sheet" aria-labelledby="([^"]+)" data-open="(true|false)">[\s\S]*<h2 id="\1">Connected apps<\/h2>/,
    );
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

test("a sheet's content lingers for exactly as long as the sheet takes to leave (enni-v2 #428)", () => {
  expect(`${EXIT_MS}ms`).toBe(MOTION.exit);
  expect(lingerMs(false)).toBe(EXIT_MS);
});

describe("what an overlay shows while it leaves (enni-v2 #473)", () => {
  test("open, it shows what it is given; closing, what it last showed", () => {
    const store = { current: "" };
    expect(heldWhile(store, true, "Today")).toBe("Today");
    // The caller cleared its state to close: the sheet still says Today on its way out.
    expect(heldWhile(store, false, "")).toBe("Today");
    expect(heldWhile(store, true, "Connected apps")).toBe("Connected apps");
  });

  test("a reader who switched motion off waits for nothing", () => {
    expect(lingerMs(true)).toBe(0);
    const asked: string[] = [];
    const page = (matches: boolean) => ({
      matchMedia: (query: string) => {
        asked.push(query);
        return { matches };
      },
    });
    expect(prefersStill(page(true))).toBe(true);
    expect(prefersStill(page(false))).toBe(false);
    expect(asked[0]).toBe("(prefers-reduced-motion: reduce)");
  });

  test("where nothing can be asked — a server — motion is assumed", () => {
    expect(prefersStill({})).toBe(false);
  });
});
