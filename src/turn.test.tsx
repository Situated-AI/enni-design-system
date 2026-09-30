import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { ChipRow, Hint, Turn } from "./turn.tsx";

describe("Turn", () => {
  test("the person's words: their bubble, and a screen reader hears who said them", () => {
    const html = renderToStaticMarkup(
      <Turn who="person" speaker="You said">
        Is PAY-1427 ready?
      </Turn>,
    );
    expect(html).toBe(
      '<div class="enni-say enni-say--person"><span class="enni-visually-hidden">You said: </span>Is PAY-1427 ready?</div>',
    );
  });

  test("Enni's words: the serif voice, no bubble, and it arrives with enter", () => {
    const html = renderToStaticMarkup(
      <Turn who="enni" speaker="Enni said">
        Almost.
      </Turn>,
    );
    expect(html).toContain('class="enni-say enni-say--enni enni-voice enni-enter"');
    expect(html).toContain('<span class="enni-visually-hidden">Enni said: </span>');
  });
});

describe("ChipRow", () => {
  test("a named list of chips, each a button that says its label", () => {
    const said: string[] = [];
    const html = renderToStaticMarkup(
      <ChipRow
        chips={["Connect Linear", "What can you do?"]}
        onSay={(s) => said.push(s)}
        label="Suggestions"
      />,
    );
    expect(html).toMatch(/^<ul class="enni-chip-row" aria-label="Suggestions">/);
    expect(html.match(/<button type="button" class="enni-chip">/g)).toHaveLength(2);
  });

  test("no chips, no row — never an empty list", () => {
    expect(renderToStaticMarkup(<ChipRow chips={[]} onSay={() => {}} label="Suggestions" />)).toBe(
      "",
    );
  });
});

test("a Hint is the small line under the chips", () => {
  expect(renderToStaticMarkup(<Hint>Tip: you can just type it.</Hint>)).toBe(
    '<p class="enni-hint">Tip: you can just type it.</p>',
  );
});
