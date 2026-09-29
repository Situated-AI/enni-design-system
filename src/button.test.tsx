import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Button, buttonClass, Chip, SubmitButton } from "./button.tsx";

describe("Button", () => {
  test("is a button, not a submit, unless asked", () => {
    expect(renderToStaticMarkup(<Button>Keep</Button>)).toContain('type="button"');
  });

  test("carries its variant as a class", () => {
    expect(renderToStaticMarkup(<Button variant="danger">Remove</Button>)).toContain(
      buttonClass("danger"),
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
