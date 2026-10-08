import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { DetailsBlock, SourceCard, SourceList } from "./sources.tsx";

describe("SourceCard", () => {
  const html = renderToStaticMarkup(
    <SourceCard
      id="src-1"
      n={1}
      icon="linear"
      app="Linear"
      title="PAY-1427"
      url="https://linear.app/x/PAY-1427"
    />,
  );

  test("the target of its citation — focusable, by id", () => {
    expect(html).toMatch(/^<li class="enni-source" id="src-1" tabindex="-1">/);
  });

  test("the app's mark (decoration), app, title linked, its [n], and the URL in mono", () => {
    expect(html).toMatch(
      /<span class="enni-source__mark" aria-hidden="true"><svg class="enni-icon enni-icon--mark"/,
    );
    // enni-v2 #483: a drawing, never two letters standing in for one.
    expect(html).not.toMatch(/enni-source__mark"[^>]*>[A-Z]{1,4}</);
    expect(html).toContain('<a href="https://linear.app/x/PAY-1427">PAY-1427</a>');
    expect(html).toContain(">[1]</span>");
    expect(html).toContain('<p class="enni-source__url">linear.app/x/PAY-1427</p>');
  });

  test("no excerpt unless one is given — never invented (#299)", () => {
    expect(html).not.toContain("enni-source__excerpt");
    const with_ = renderToStaticMarkup(
      <SourceCard id="s" n={1} icon="github" app="GitHub" title="t" excerpt="Reverted." />,
    );
    expect(with_).toContain('<p class="enni-source__excerpt">Reverted.</p>');
  });
});

test("SourceList is a disclosure with its count, open when asked", () => {
  const closed = renderToStaticMarkup(
    <SourceList summary="Where this comes from · 2 sources">x</SourceList>,
  );
  expect(closed).toMatch(
    /^<details class="enni-sources"><summary><svg class="enni-icon"[^>]*>.*<\/svg>Where this comes from · 2 sources<\/summary><ul>x<\/ul><\/details>$/,
  );
  expect(
    renderToStaticMarkup(
      <SourceList summary="s" open>
        x
      </SourceList>,
    ),
  ).toContain('<details class="enni-sources" open="">');
});

test("DetailsBlock is the formal record, a line each, named", () => {
  const html = renderToStaticMarkup(
    <DetailsBlock
      label="Details"
      lines={["Formal verdict: ready", "Advice, not authorisation."]}
    />,
  );
  expect(html).toBe(
    '<div class="enni-details-block" role="note" aria-label="Details"><p>Formal verdict: ready</p><p>Advice, not authorisation.</p></div>',
  );
});
