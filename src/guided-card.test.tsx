import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Confirmation, GuidedCard, SegmentedProgress } from "./guided-card.tsx";

test("SegmentedProgress: one bar per step, on up to the current one, and silent", () => {
  const html = renderToStaticMarkup(<SegmentedProgress current={2} total={3} />);
  expect(html).toContain('aria-hidden="true"');
  expect(html.match(/data-on="true"/g)?.length).toBe(2);
  expect(html.match(/data-on="false"/g)?.length).toBe(1);
});

test("GuidedCard: named by its title, the step in words, bars, body and footer, entering", () => {
  const html = renderToStaticMarkup(
    <GuidedCard
      title="Connect Linear"
      current={1}
      total={3}
      stepLabel="Step 1 of 3"
      footer="Stuck? Say it."
    >
      <p>body</p>
    </GuidedCard>,
  );
  expect(html).toMatch(
    /<section class="enni-guided enni-enter" aria-labelledby="([^"]+)" data-step="1"><header class="enni-guided__header"><h2 id="\1">Connect Linear<\/h2><span class="enni-guided__step">Step 1 of 3<\/span>/,
  );
  expect(html).toContain('class="enni-segments"');
  expect(html).toContain("<p>body</p>");
  expect(html).toContain('<p class="enni-guided__footer">Stuck? Say it.</p>');
});

test("GuidedCard: no footer, no empty line", () => {
  const html = renderToStaticMarkup(
    <GuidedCard title="Connect Linear" current={3} total={3} stepLabel="Step 3 of 3">
      <p>body</p>
    </GuidedCard>,
  );
  expect(html).not.toContain("enni-guided__footer");
});

test("Confirmation: a status, the ✓ a drawing, the sentence bold, then the follow-on", () => {
  const html = renderToStaticMarkup(
    <Confirmation title="Reading PAY.">
      Change this any time from <a href="/apps">Connected apps</a>.
    </Confirmation>,
  );
  expect(html).toContain('role="status"');
  expect(html).toContain(
    '<p class="enni-confirmation__title"><span aria-hidden="true">✓ </span>Reading PAY.</p>',
  );
  expect(html).toContain('<a href="/apps">Connected apps</a>');
  expect(renderToStaticMarkup(<Confirmation title="Done." />)).not.toContain("__more");
});
