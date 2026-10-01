import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Meter, PlanCard, SummaryCard, SummaryGrid } from "./billing-cards.tsx";

test("SummaryCard: a title, one large figure, a muted line, one action", () => {
  const html = renderToStaticMarkup(
    <SummaryCard
      title="Credits"
      action={<a href="#buy">Buy more</a>}
      figure="1,240"
      detail="1 credit = 1 extra question"
    />,
  );
  expect(html).toContain('aria-label="Credits"');
  expect(html).toContain('<p class="enni-summary__figure">1,240</p>');
  expect(html).toContain('<a href="#buy">Buy more</a>');
});

test("SummaryCard: a figure with its unit, and a quiet note where an action would be", () => {
  const html = renderToStaticMarkup(
    <SummaryCard title="This month" aside="1–9 Sep" figure="318" unit="of 500 questions" />,
  );
  expect(html).toContain('<span class="enni-summary__aside">1–9 Sep</span>');
  expect(html).toContain('318<span class="enni-summary__unit"> of 500 questions</span>');
});

test("SummaryGrid holds the cards", () => {
  expect(renderToStaticMarkup(<SummaryGrid>x</SummaryGrid>)).toBe(
    '<div class="enni-summary-grid">x</div>',
  );
});

test("Meter: a real meter for a screen reader, its share as the bar's width", () => {
  const html = renderToStaticMarkup(
    <Meter label="Questions this month" value={318} max={500} caption="On track, 21 days left." />,
  );
  expect(html).toContain(
    '<meter class="enni-visually-hidden" aria-label="Questions this month" min="0" max="500" value="318"></meter>',
  );
  expect(html).toContain('class="enni-meter__track" aria-hidden="true"');
  expect(html).toContain("width:63.6%");
  expect(html).toContain("enni-meter--accent");
});

test("Meter, running low (B11): care, and the caption says it in words — never colour alone", () => {
  const html = renderToStaticMarkup(
    <Meter
      label="Questions"
      value={487}
      max={500}
      caption="13 questions left this month"
      tone="care"
    />,
  );
  expect(html).toContain("enni-meter--care");
  expect(html).toContain("13 questions left this month");
});

test("Meter never draws past full or below empty", () => {
  expect(renderToStaticMarkup(<Meter label="q" value={900} max={500} caption="" />)).toContain(
    "width:100.0%",
  );
  expect(renderToStaticMarkup(<Meter label="q" value={1} max={0} caption="" />)).toContain(
    "width:0.0%",
  );
});

test("PlanCard: the current plan is marked by a tag, and the action is the caller's", () => {
  const plan = (current?: string) =>
    renderToStaticMarkup(
      <PlanCard
        name="Team"
        price="$40"
        per="per person a month"
        features={["500 questions a month"]}
        current={current}
        action={<button type="button">Your plan</button>}
      />,
    );
  expect(plan("Current")).toContain('data-current="true"');
  expect(plan("Current")).toContain('<span class="enni-plan__tag">Current</span>');
  expect(plan()).toContain('data-current="false"');
  expect(plan()).toContain('<span aria-hidden="true">✓</span> 500 questions a month');
});

test("SummaryCard: no figure where the answer is a sentence — the card on file", () => {
  const html = renderToStaticMarkup(<SummaryCard title="Payment" detail="Visa ending 4242" />);
  expect(html).not.toContain("enni-summary__figure");
});
