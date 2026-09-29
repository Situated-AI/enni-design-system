import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { COPY_WORDS, CopyButton, copyValue } from "./copy-button.tsx";

describe("copyValue", () => {
  test("copies, and says so", async () => {
    let written = "";
    const state = await copyValue("https://enni/join/abc", {
      writeText: async (text) => {
        written = text;
      },
    });
    expect(state).toBe("copied");
    expect(written).toBe("https://enni/join/abc");
  });

  test("a clipboard that refuses is reported, not thrown", async () => {
    const state = await copyValue("x", {
      writeText: () => Promise.reject(new Error("NotAllowedError")),
    });
    expect(state).toBe("refused");
  });

  test("no clipboard at all is a refusal", async () => {
    expect(await copyValue("x", undefined)).toBe("refused");
  });
});

test("every state that says something says it in words", () => {
  expect(COPY_WORDS.copied).toBe("Copied");
  expect(COPY_WORDS.refused).toContain("by hand");
});

test("the button names what it copies, beside a polite live region", () => {
  const html = renderToStaticMarkup(<CopyButton value="v" label="Copy invite link" />);
  expect(html).toContain(">Copy invite link<");
  expect(html).toContain('role="status" aria-live="polite"');
});
