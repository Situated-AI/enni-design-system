import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { HeardBubble, ReadingSteps, RefusalCard } from "./progress.tsx";

describe("ReadingSteps", () => {
  const html = renderToStaticMarkup(
    <ReadingSteps
      label="Reading your apps"
      steps={[
        { id: "linear", state: "read", text: "Read Linear · PAY-1427" },
        { id: "slack", state: "failed", text: "Couldn't read Slack · timed out" },
        { id: "memory", state: "pending", text: "Checking what I remember…" },
      ]}
    />,
  );

  test("one polite live region — progress is announced, once per step", () => {
    expect(html).toMatch(
      /^<ul class="enni-steps" aria-live="polite" aria-label="Reading your apps">/,
    );
    expect(html.match(/aria-live/g)).toHaveLength(1);
  });

  test("each step a shape and words — read ✓, failed !, pending · — never a spinner", () => {
    expect(html).toContain(
      'data-state="read" data-source="linear"><span class="enni-steps__glyph" aria-hidden="true">✓</span>Read Linear',
    );
    expect(html).toContain(
      '<span class="enni-steps__glyph" aria-hidden="true">!</span>Couldn&#x27;t read Slack',
    );
    expect(html).toContain('<span class="enni-steps__glyph" aria-hidden="true">·</span>Checking');
  });
});

test("a RefusalCard has its title, its sentence and a way forward — and no badge (D-77)", () => {
  const html = renderToStaticMarkup(
    <RefusalCard title="Not enough to go on" sentence="Name the ticket.">
      <p>chips</p>
    </RefusalCard>,
  );
  expect(html).toContain('<p class="enni-refusal__title">Not enough to go on</p>');
  expect(html).toContain("<p>chips</p>");
  expect(html).not.toContain("enni-badge");
});

test("the heard bubble is the words so far, and not a live region (#301)", () => {
  const html = renderToStaticMarkup(<HeardBubble text="Is PAY-1427 ready for an agent to…" />);
  expect(html).toBe('<p class="enni-heard">Is PAY-1427 ready for an agent to…</p>');
});

test("#311: a RefusalCard can carry two actions and a footnote — the conversation notice (B12, B13)", () => {
  const html = renderToStaticMarkup(
    <RefusalCard
      title="Tools resume at 3:40 pm"
      sentence="This limit keeps a tool stuck in a loop from using the month."
      actions={<button type="button">Raise the tool limit</button>}
      footnote="Nothing was charged for refused questions."
    />,
  );
  expect(html).toContain(
    '<div class="enni-refusal__actions"><button type="button">Raise the tool limit</button></div>',
  );
  expect(html).toContain(
    '<p class="enni-refusal__footnote">Nothing was charged for refused questions.</p>',
  );
  expect(renderToStaticMarkup(<RefusalCard title="t" sentence="s" />)).not.toContain(
    "enni-refusal__actions",
  );
});
