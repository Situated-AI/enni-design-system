import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { type CheckGroup, CheckGroups } from "./check-groups.tsx";
import { PRIMITIVES_CSS } from "./styles.ts";

const ignore = () => {};

const GROUPS: readonly CheckGroup[] = [
  {
    kind: "care",
    title: "Needs care",
    rows: [
      {
        id: "owner",
        name: "Someone owns it",
        mark: { glyph: "!", word: "a caveat", tone: "care" },
        reason: "Nobody is named.",
      },
    ],
  },
  {
    kind: "unread",
    title: "Couldn't check",
    id: "a-unread",
    rows: [
      {
        id: "rules",
        name: "Written rules are met",
        mark: { glyph: "○", word: "couldn't be checked", tone: "neutral" },
        reason: "No written rule is remembered.",
        action: { label: "Connect Slack", onAct: ignore },
      },
      {
        id: "done",
        name: "Done is defined",
        mark: { glyph: "○", word: "couldn't be checked", tone: "neutral" },
      },
    ],
  },
  { kind: "passed", title: "Passed", rows: [] },
];

const html = renderToStaticMarkup(<CheckGroups label="Checks" groups={GROUPS} />);

describe("CheckGroups (enni-v2 #471)", () => {
  test("a group per kind with rows, titled and counted, in the order given", () => {
    expect(html).toContain('aria-label="Checks"');
    const kinds = [...html.matchAll(/data-kind="([a-z]+)"/g)].map((m) => m[1]);
    expect(kinds).toEqual(["care", "unread"]);
    expect(html).toMatch(/Couldn(&#x27;|')t check<span class="enni-checks__count">2<\/span>/);
  });

  test("a group with no rows is not drawn, and no groups draw nothing", () => {
    expect(html).not.toContain("Passed");
    const empty = GROUPS.filter((group) => group.rows.length === 0);
    expect(renderToStaticMarkup(<CheckGroups label="Checks" groups={empty} />)).toBe("");
  });

  test("every row carries a glyph, a word and a tone: never colour alone (D-115)", () => {
    expect(html.match(/class="enni-checks__row enni-tone--/g)).toHaveLength(3);
    expect(html.match(/class="enni-checks__glyph" aria-hidden="true"/g)).toHaveLength(3);
    expect(html.match(/class="enni-checks__word"/g)).toHaveLength(3);
    expect(html).toContain('data-check-id="owner" data-kind-of="care"');
  });

  test("a row says its reason when it has one, and offers its action as a button", () => {
    expect(html).toContain('<span class="enni-checks__reason">Nobody is named.</span>');
    expect(html.match(/class="enni-checks__reason"/g)).toHaveLength(2);
    expect(html.match(/<button/g)).toHaveLength(1);
    expect(html).toContain("Connect Slack</button>");
  });

  test("a group can be linked to: its title has the id and takes focus", () => {
    expect(html).toContain('id="a-unread" tabindex="-1"');
    expect(html.match(/tabindex="-1"/g)).toHaveLength(1);
    expect(PRIMITIVES_CSS).toContain(
      ".enni-checks__title:focus { outline: 2px solid var(--enni-focus); outline-offset: 2px; }",
    );
  });
});

describe("its rules", () => {
  test("a mark is drawn in its tone's ink, as StatusMark's is", () => {
    expect(PRIMITIVES_CSS).toMatch(/\.enni-checks__glyph \{ color: var\(--enni-tone-ink\);/);
  });

  test("at phone width a row is two columns, so the word drops under the name", () => {
    expect(PRIMITIVES_CSS).toMatch(
      /@media \(max-width: 40rem\) \{\s+\.enni-checks__row \{ grid-template-columns: [^;]+minmax\(0, 1fr\); \}/,
    );
  });
});
