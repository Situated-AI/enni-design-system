import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import {
  AnswerActions,
  AnswerCard,
  AnswerPair,
  AnswerSection,
  Citation,
  Segmented,
} from "./answer-card.tsx";
import { ANSWER_CSS } from "./answer-styles.ts";
import { StatusBadge } from "./badge.tsx";

const card = (extra: Partial<Parameters<typeof AnswerCard>[0]> = {}) =>
  renderToStaticMarkup(
    <AnswerCard
      label="Answer"
      status={<StatusBadge glyph="!" word="Needs care" tone="care" />}
      subject={{ key: "PAY-1427", title: "Ship usage-based pricing" }}
      sentence="The work is well described."
      actions={<AnswerActions>actions-marker</AnswerActions>}
      sources={<details>sources-marker</details>}
      details={<div>details-marker</div>}
      {...extra}
    >
      <AnswerSection title="What's in the way">why-marker</AnswerSection>
      <AnswerPair>
        <AnswerSection title="Who knows">who-marker</AnswerSection>
        <AnswerSection title="What to do next">next-marker</AnswerSection>
      </AnswerPair>
    </AnswerCard>,
  );

describe("AnswerCard", () => {
  test("the order is the card's: status, sentence, why, who, next, actions, sources, details (§3)", () => {
    const html = card();
    const at = [
      "enni-badge",
      "enni-answer-card__sentence",
      "why-marker",
      "who-marker",
      "next-marker",
      "actions-marker",
      "sources-marker",
      "details-marker",
    ].map((s) => html.indexOf(s));
    expect(at.every((i) => i >= 0)).toBe(true);
    expect([...at].sort((a, b) => a - b)).toEqual(at);
  });

  test("the status row: the badge, then the subject's key and title", () => {
    const html = card();
    expect(html).toContain('<span class="enni-answer-card__key">PAY-1427</span>');
    expect(html).toContain('<span class="enni-answer-card__title">Ship usage-based pricing</span>');
  });

  test("the sentence is Enni's voice, and the card is a named article", () => {
    const html = card();
    expect(html).toMatch(/^<article class="enni-answer-card" aria-label="Answer">/);
    expect(html).toContain(
      '<p class="enni-answer-card__sentence enni-voice">The work is well described.</p>',
    );
  });

  test("no subject, no key — never an empty chip", () => {
    expect(card({ subject: undefined })).not.toContain("enni-answer-card__key");
  });
});

test("a section is named by its title, for a reader and a landmark", () => {
  expect(renderToStaticMarkup(<AnswerSection title="Who knows">x</AnswerSection>)).toBe(
    '<section class="enni-answer-section" aria-label="Who knows"><p class="enni-answer-section__title">Who knows</p>x</section>',
  );
});

describe("Citation", () => {
  test("a link to its source card, named for what it does", () => {
    const html = renderToStaticMarkup(
      <Citation n={2} target="src-2" title="Open the source this comes from" />,
    );
    expect(html).toContain('href="#src-2"');
    expect(html).toContain('aria-label="Open the source this comes from [2]"');
    expect(html).toContain(">[2]</a>");
  });
});

describe("Segmented", () => {
  const options = [
    { value: "implement", label: "Building" },
    { value: "review", label: "Reviewing" },
  ];

  test("a named group of buttons, the chosen one pressed", () => {
    const html = renderToStaticMarkup(
      <Segmented label="Answer for:" options={options} value="review" onChange={() => {}} />,
    );
    expect(html).toContain(
      '<fieldset class="enni-segmented"><legend class="enni-visually-hidden">Answer for:</legend>',
    );
    expect(html).toContain('aria-pressed="false">Building</button>');
    expect(html).toContain('aria-pressed="true">Reviewing</button>');
  });

  test("choosing one says which", () => {
    const chosen: string[] = [];
    const element = Segmented({
      label: "x",
      options,
      value: "implement",
      onChange: (v) => chosen.push(v),
    });
    expect(element).toBeTruthy();
  });
});

describe("Segmented — each option's outcome, once known (enni-v2 #468)", () => {
  const html = renderToStaticMarkup(
    <Segmented
      label="Answer for"
      value="review"
      onChange={() => {}}
      options={[
        {
          value: "implement",
          label: "Building",
          mark: { glyph: "!", word: "Needs care", tone: "care" },
        },
        { value: "review", label: "Reviewing", mark: { glyph: "✓", word: "Ready", tone: "ready" } },
        { value: "deploy", label: "Deploying", busy: true },
      ]}
    />,
  );

  test("a glyph in its tone before the label, and the word for a screen reader after it", () => {
    expect(html).toContain(
      '<span class="enni-segmented__mark enni-tone--care" aria-hidden="true">!</span>Building<span class="enni-visually-hidden"> · Needs care</span>',
    );
    expect(html).toContain(
      'aria-pressed="true"><span class="enni-segmented__mark enni-tone--ready"',
    );
  });

  test("an option with no outcome yet shows none, and one on its way says it is busy", () => {
    expect(html).toContain('aria-pressed="false" aria-busy="true">Deploying</button>');
    expect(html.match(/enni-segmented__mark/g)).toHaveLength(2);
  });
});

test("the card's sentence is a size up from Enni's voice: 21px (enni-v2 #532)", () => {
  expect(ANSWER_CSS).toContain(
    ".enni-answer-card__sentence { margin: 0; color: var(--enni-ink); font-size: 1.3125rem; line-height: 1.35; }",
  );
});
