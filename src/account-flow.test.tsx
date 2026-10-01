import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { AuthCard, Notice, Steps } from "./account-flow.tsx";

const STEPS = ["Account", "Second step", "Recovery codes", "Done"];

describe("Steps", () => {
  const html = renderToStaticMarkup(
    <Steps steps={STEPS} current={1} label="Setting up" doneWord="done" />,
  );

  test("a named ordered list: done steps carry ✓ and say so, the current one is aria-current", () => {
    expect(html).toContain('<ol class="enni-steps" aria-label="Setting up">');
    expect(html).toContain(
      '<li data-state="done"><span class="enni-steps__mark" aria-hidden="true">✓</span>',
    );
    expect(html).toContain('<span class="enni-visually-hidden"> · done</span>');
    expect(html).toContain('data-state="current" aria-current="step"');
    expect(html.match(/data-state="later"/g)).toHaveLength(2);
  });

  test("the later steps are numbered from 1", () => {
    expect(html).toContain('aria-hidden="true">3</span>');
  });
});

describe("AuthCard", () => {
  test("the title is the page's heading, with the brand tile; lede, notice, form and footer follow", () => {
    const html = renderToStaticMarkup(
      <AuthCard
        title="You're invited"
        lede="Set a password."
        notice={<Notice>That link can't be used.</Notice>}
        footer={<a href="/sign-in">Sign in</a>}
      >
        <form>fields</form>
      </AuthCard>,
    );
    expect(html).toMatch(
      /<h1 id="enni-auth-title" class="enni-auth__title"><svg class="enni-brand__tile"[\s\S]*You&#x27;re invited<\/h1>/,
    );
    const order = ["enni-auth__lede", "enni-notice", "enni-auth__content", "enni-auth__footer"];
    const at = order.map((c) => html.indexOf(c));
    expect([...at].sort((a, b) => a - b)).toEqual(at);
  });
});

test("a notice is one alert region", () => {
  expect(renderToStaticMarkup(<Notice>No.</Notice>)).toBe(
    '<p class="enni-notice" role="alert">No.</p>',
  );
});
