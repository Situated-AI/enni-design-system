import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { ConfirmByTyping, ConfirmStep, confirmationMatches } from "./confirm.tsx";

const noop = () => {};

describe("confirmationMatches", () => {
  test("the exact phrase matches, ends trimmed", () => {
    expect(confirmationMatches("  Dana Okafor ", "Dana Okafor")).toBe(true);
  });

  test("case matters — the point is that the reader looked", () => {
    expect(confirmationMatches("dana okafor", "Dana Okafor")).toBe(false);
  });

  test("an empty phrase never matches, so a missing name cannot arm the button", () => {
    expect(confirmationMatches("", "")).toBe(false);
  });
});

describe("ConfirmStep", () => {
  test("closed, it is one button naming the action", () => {
    const html = renderToStaticMarkup(
      <ConfirmStep action="Disconnect Linear" question="?" confirm="Disconnect" onConfirm={noop} />,
    );
    expect(html).toContain(">Disconnect Linear<");
    expect(html).not.toContain("Keep");
  });

  test("open, Keep comes first and the other button says what it does", () => {
    const html = renderToStaticMarkup(
      <ConfirmStep
        open
        action="Disconnect Linear"
        question="Nothing from Linear will be read again."
        confirm="Disconnect Linear"
        onConfirm={noop}
      />,
    );
    expect(html.indexOf("Keep")).toBeLessThan(html.indexOf("enni-button--danger"));
    expect(html).toContain("Nothing from Linear will be read again.");
  });
});

describe("ConfirmByTyping", () => {
  const html = renderToStaticMarkup(
    <ConfirmByTyping
      phrase="Dana Okafor"
      question="Dana loses access to this space."
      confirm="Remove Dana Okafor"
      onConfirm={noop}
      onKeep={noop}
    />,
  );

  test("asks for the phrase by name, with a label tied to the field", () => {
    expect(html).toContain("<strong>Dana Okafor</strong>");
    expect(html).toMatch(/<label for="([^"]+)">[\s\S]*<input id="\1"/);
  });

  test("starts disarmed, and the button says what it destroys", () => {
    expect(html).toMatch(/<button[^>]*disabled=""[^>]*>Remove Dana Okafor<\/button>/);
  });
});
