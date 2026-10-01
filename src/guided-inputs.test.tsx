import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import {
  AnswerChips,
  InstructionList,
  NewTabLink,
  SecretField,
  takeSecret,
} from "./guided-inputs.tsx";

const ignore = () => {};

test("InstructionList: numbered steps, the number a drawing, the why muted after the action", () => {
  const html = renderToStaticMarkup(
    <InstructionList
      steps={[
        { action: <strong>Open Linear.</strong> },
        { action: "Create a read-only key.", why: "Enni never writes." },
      ]}
    />,
  );
  expect(html).toMatch(/^<ol class="enni-instructions">/);
  expect(html).toContain('<span class="enni-instructions__number" aria-hidden="true">2</span>');
  expect(html).toContain(
    'Create a read-only key. <span class="enni-instructions__why">Enni never writes.</span>',
  );
  expect(html.match(/enni-instructions__why/g)?.length).toBe(1);
});

test("NewTabLink: a new tab, without the opener, and it says so in words", () => {
  const html = renderToStaticMarkup(
    <NewTabLink href="https://linear.app/settings/api" newTab="opens in a new tab">
      Open it in a new tab
    </NewTabLink>,
  );
  expect(html).toContain('target="_blank" rel="noopener noreferrer"');
  expect(html).toContain('<span aria-hidden="true"> ↗</span>');
  expect(html).toContain('<span class="enni-visually-hidden"> (opens in a new tab)');
});

const secret = (over: Partial<Parameters<typeof SecretField>[0]> = {}) =>
  renderToStaticMarkup(
    <SecretField
      id="key-linear"
      label="Paste your Linear key"
      submitLabel="Connect"
      pendingLabel="Checking…"
      hint="It's stored encrypted and never shown again."
      onSubmit={ignore}
      {...over}
    />,
  );

test("SecretField: a labelled, masked field every autofill is asked to leave alone", () => {
  const html = secret();
  const input = html.match(/<input[^>]*>/)?.[0] ?? "";
  expect(html).toContain('<label class="enni-visually-hidden" for="key-linear">');
  for (const attribute of [
    'type="password"',
    'autoComplete="off"',
    'spellCheck="false"',
    'autoCapitalize="off"',
    'data-1p-ignore=""',
    'data-lpignore="true"',
    'aria-describedby="key-linear-hint"',
  ])
    expect(input).toContain(attribute);
});

test("SecretField: it never holds a value — the markup has none to leak", () => {
  expect(secret().match(/<input[^>]*>/)?.[0]).not.toContain("value=");
});

test("SecretField: the button sits inline, and says it is working while it is", () => {
  expect(secret()).toMatch(/<div class="enni-secret__row"><input[^>]*><button type="submit"/);
  const pending = secret({ pending: true });
  expect(pending).toContain('disabled="" aria-busy="true">Checking…</button>');
});

test("takeSecret: hands the secret over trimmed, once, and clears the field behind it", () => {
  let cleared = 0;
  const data = new FormData();
  data.set("secret", "  lin_api_abc  ");
  expect(takeSecret({ reset: () => cleared++ }, data)).toBe("lin_api_abc");
  expect(cleared).toBe(1);
});

test("AnswerChips: buttons in a group named by the question, Not yet among equals", () => {
  const html = renderToStaticMarkup(
    <AnswerChips
      question="Which should I read?"
      answers={[
        { value: "PAY", label: "Read PAY" },
        { value: "all", label: "All of them" },
        { value: "none", label: "Not yet" },
      ]}
      onAnswer={ignore}
    />,
  );
  expect(html).toMatch(/^<fieldset class="enni-answers" aria-label="Which should I read\?">/);
  expect(html.match(/<button type="button" class="enni-chip">/g)?.length).toBe(3);
  expect(html).toContain('class="enni-chip">Not yet</button>');
});
