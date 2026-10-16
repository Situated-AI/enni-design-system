import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { PRIMITIVES_CSS } from "./styles.ts";
import { moveTab, Tabs } from "./tabs.tsx";

const TOOLS = [
  { value: "claude", label: "Claude Code", panel: <p>One line.</p> },
  { value: "cursor", label: "Cursor", panel: <p>Two lines.</p> },
  { value: "action", label: "GitHub Action", panel: <p>A workflow.</p> },
];

describe("moveTab: the arrows wrap, Home and End go to the ends", () => {
  test.each([
    [0, "ArrowRight", 1],
    [2, "ArrowRight", 0],
    [0, "ArrowLeft", 2],
    [1, "Home", 0],
    [0, "End", 2],
    [1, "Enter", 1],
  ])("from %i, %s goes to %i", (at, key, to) => {
    expect(moveTab(at, key, 3)).toBe(to);
  });

  test("with no tabs, nothing moves", () => {
    expect(moveTab(0, "ArrowRight", 0)).toBe(0);
  });
});

describe("Tabs", () => {
  const html = renderToStaticMarkup(<Tabs label="Tools" tabs={TOOLS} defaultValue="cursor" />);

  test("is a named tablist of tab buttons, the chosen one selected and alone in the tab order", () => {
    expect(html).toContain('<div class="enni-tabs__list" role="tablist" aria-label="Tools">');
    expect(html.match(/role="tab"/g)).toHaveLength(3);
    expect(html.match(/aria-selected="true"/g)).toHaveLength(1);
    expect(html.match(/tabindex="0"/g)).toHaveLength(1);
    expect(html.match(/tabindex="-1"/g)).toHaveLength(2);
    expect(html).toMatch(/aria-selected="true" tabindex="0">Cursor<\/button>/);
  });

  test("each tab names its panel and each panel is named by its tab; only the chosen is shown", () => {
    const tab = html.match(/id="([^"]+-tab-cursor)" aria-controls="([^"]+-panel-cursor)"/);
    expect(tab).not.toBeNull();
    expect(html).toContain(
      `<div class="enni-tab-panel" role="tabpanel" id="${tab?.[2]}" aria-labelledby="${tab?.[1]}"><p>Two lines.</p></div>`,
    );
    expect(html.match(/role="tabpanel"[^>]*hidden=""/g)).toHaveLength(2);
  });

  test("without a value, the first tab is chosen; a value given wins", () => {
    const first = renderToStaticMarkup(<Tabs label="Tools" tabs={TOOLS} />);
    expect(first).toMatch(/aria-selected="true" tabindex="0">Claude Code</);
    const given = renderToStaticMarkup(<Tabs label="Tools" tabs={TOOLS} value="action" />);
    expect(given).toMatch(/aria-selected="true" tabindex="0">GitHub Action</);
  });

  test("is drawn as the landing's: a sunken row, the chosen tab a raised surface", () => {
    expect(PRIMITIVES_CSS).toMatch(
      /\.enni-tabs__list \{[^}]*border: 1px solid var\(--enni-line\);[^}]*background: var\(--enni-sunken\);/,
    );
    expect(PRIMITIVES_CSS).toContain(
      '.enni-tab[aria-selected="true"] { background: var(--enni-surface); color: var(--enni-ink); box-shadow: 0 0 0 1px var(--enni-line), var(--enni-shadow-rest); }',
    );
    expect(PRIMITIVES_CSS).toContain(".enni-tab-panel[hidden] { display: none; }");
  });
});
