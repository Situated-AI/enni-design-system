import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { CodeBlock, selectContents, Terminal } from "./code-block.tsx";

describe("CodeBlock (enni-v2 #637)", () => {
  const html = renderToStaticMarkup(
    <CodeBlock
      code="claude mcp add enni https://enni.dev/mcp"
      label="Claude Code setup"
      copyLabel="Copy"
    />,
  );

  test("is a named figure: the code in the dark panel, the copy button, and a quiet live region", () => {
    expect(html).toBe(
      '<figure class="enni-code" aria-label="Claude Code setup"><pre class="enni-term"><code>claude mcp add enni https://enni.dev/mcp</code></pre><button type="button" class="enni-copy">Copy</button><span class="enni-visually-hidden" role="status" aria-live="polite"></span></figure>',
    );
  });
});

describe("selectContents", () => {
  test("does nothing where there is no page to select on, or nothing to select", () => {
    expect(() => selectContents(null)).not.toThrow();
    expect(() => selectContents(null, { getSelection: () => null })).not.toThrow();
  });
});

describe("Terminal", () => {
  const html = renderToStaticMarkup(
    <Terminal
      label="Agent output"
      lines={[
        [{ text: "$ ", tone: "dim" }, { text: "enni check acme/billing#1427" }],
        [{ text: "✓ ", tone: "ready" }, { text: "6 of 10 checks passed" }],
        "done",
      ]}
    />,
  );

  test("is a focusable, named region that scrolls sideways, one row per line", () => {
    expect(html).toStartWith(
      '<section class="enni-term enni-term--output" aria-label="Agent output" tabindex="0"><pre class="enni-term__pre">',
    );
    expect(html.match(/class="enni-term__line"/g)).toHaveLength(3);
  });

  test("each part is in its ink, and the words carry the meaning", () => {
    expect(html).toContain(
      '<span class="enni-term__line"><span class="enni-term__dim">$ </span>enni check acme/billing#1427</span>',
    );
    expect(html).toContain('<span class="enni-term__ready">✓ </span>6 of 10 checks passed');
    expect(html).toContain('<span class="enni-term__line">done</span>');
  });
});
