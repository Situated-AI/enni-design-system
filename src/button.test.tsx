import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Button, ButtonLink, buttonClass, Chip, SubmitButton, SuggestionChip } from "./button.tsx";

describe("Button", () => {
  test("is a button, not a submit, unless asked", () => {
    expect(renderToStaticMarkup(<Button>Keep</Button>)).toContain('type="button"');
  });

  test("carries its variant as a class", () => {
    expect(renderToStaticMarkup(<Button variant="danger">Remove</Button>)).toContain(
      buttonClass("danger"),
    );
  });

  test("#280: a size and a full width, as classes beside the variant", () => {
    expect(buttonClass("primary")).toBe("enni-button enni-button--primary");
    expect(buttonClass("secondary", { size: "lg", block: true })).toBe(
      "enni-button enni-button--secondary enni-button--lg enni-button--block",
    );
    const html = renderToStaticMarkup(
      <Button variant="primary" size="lg" block>
        Go
      </Button>,
    );
    expect(html).toContain(
      'class="enni-button enni-button--primary enni-button--lg enni-button--block"',
    );
  });
});

describe("ButtonLink", () => {
  test("is a link — a call to action that goes somewhere — with a button's look", () => {
    const html = renderToStaticMarkup(
      <ButtonLink href="/sign-up" variant="primary" size="lg">
        Create an account
      </ButtonLink>,
    );
    expect(html).toBe(
      '<a href="/sign-up" class="enni-button enni-button--primary enni-button--lg">Create an account</a>',
    );
  });

  test("is secondary unless asked", () => {
    expect(renderToStaticMarkup(<ButtonLink href="/sample">Try</ButtonLink>)).toContain(
      "enni-button--secondary",
    );
  });
});

describe("SubmitButton", () => {
  test("idle, it says what it does and can be pressed", () => {
    const html = renderToStaticMarkup(
      <SubmitButton pending={false} pendingLabel="Checking…">
        Check
      </SubmitButton>,
    );
    expect(html).toContain(">Check<");
    expect(html).not.toContain("disabled");
    expect(html).toContain('aria-busy="false"');
  });

  test("pending, it says so in words and refuses a second press", () => {
    const html = renderToStaticMarkup(
      <SubmitButton pending pendingLabel="Checking…">
        Check
      </SubmitButton>,
    );
    expect(html).toContain("Checking…");
    expect(html).toContain("disabled");
    expect(html).toContain('aria-busy="true"');
  });
});

test("a Chip is a button", () => {
  const html = renderToStaticMarkup(<Chip>Connect Slack</Chip>);
  expect(html).toMatch(/^<button type="button" class="enni-chip">Connect Slack<\/button>$/);
});

describe("SuggestionChip (#280)", () => {
  test("is a chip showing its sentence", () => {
    const html = renderToStaticMarkup(<SuggestionChip label="Connect Linear" onSay={() => {}} />);
    expect(html).toBe('<button type="button" class="enni-chip">Connect Linear</button>');
  });

  test("tapped, it says exactly its label — the same path as typing it", () => {
    const said: string[] = [];
    const element = SuggestionChip({ label: "What can you do?", onSay: (s) => said.push(s) });
    (element.props as { onClick: () => void }).onClick();
    expect(said).toEqual(["What can you do?"]);
  });
});
