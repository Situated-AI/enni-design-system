import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Composer, TalkButton } from "./composer.tsx";

const ignore = () => {};
const BASE = {
  id: "c",
  formLabel: "Say something",
  fieldLabel: "Message",
  value: "",
  placeholder: "Ask anything",
  hint: "Enter to send",
  hintNarrow: "Return sends",
  sendLabel: "Send",
  onChange: ignore,
  onSubmit: ignore,
};

describe("Composer", () => {
  const html = renderToStaticMarkup(
    <Composer {...BASE} talk={<TalkButton label="Talk" listening={false} onClick={ignore} />} />,
  );

  test("a labelled textarea in a real form, the words all the caller's", () => {
    expect(html).toContain('<form class="enni-composer" aria-label="Say something">');
    expect(html).toMatch(/<label class="enni-visually-hidden" for="c">Message<\/label>/);
    expect(html).toContain('placeholder="Ask anything"');
  });

  test("field, then the talk button, then Send — in one row", () => {
    const row = html.slice(html.indexOf("enni-composer__row"));
    expect(row.indexOf("<textarea")).toBeLessThan(row.indexOf("enni-talk"));
    expect(row.indexOf("enni-talk")).toBeLessThan(row.indexOf("enni-composer__send"));
  });

  test("the hint in both readings, the width choosing which shows", () => {
    expect(html).toContain('<span class="enni-composer__hint--wide">Enter to send</span>');
    expect(html).toContain('<span class="enni-composer__hint--narrow">Return sends</span>');
  });

  test("pending is busy, never locked; disabled locks both field and Send", () => {
    const busy = renderToStaticMarkup(<Composer {...BASE} pending />);
    expect(busy).toContain('<button aria-busy="true" type="submit"');
    expect(busy).not.toMatch(/<textarea[^>]*disabled/);
    const off = renderToStaticMarkup(<Composer {...BASE} disabled />);
    expect(off).toMatch(/<textarea[^>]*disabled=""/);
    expect(off).toMatch(/<button[^>]*type="submit"[^>]*disabled=""/);
  });
});

describe("TalkButton", () => {
  test("idle: named Talk in text, the mic beside the word, not pressed", () => {
    const html = renderToStaticMarkup(
      <TalkButton label="Talk" listening={false} onClick={ignore} />,
    );
    expect(html).toMatch(/^<button type="button" class="enni-talk" aria-pressed="false"/);
    expect(html).toContain('aria-hidden="true"');
    expect(html).toMatch(/>Talk<\/button>$/);
  });

  test("listening: pressed, and its name changes with its state", () => {
    const html = renderToStaticMarkup(<TalkButton label="Stop" listening onClick={ignore} />);
    expect(html).toContain('aria-pressed="true"');
    expect(html).toContain('data-listening="true"');
    expect(html).toMatch(/>Stop<\/button>$/);
  });

  test("sendDisabled holds Send alone: the field stays open for the next question (enni-v2 #463)", () => {
    const held = renderToStaticMarkup(<Composer {...BASE} pending sendDisabled />);
    expect(held).toMatch(/<button[^>]*type="submit"[^>]*disabled=""/);
    expect(held).not.toMatch(/<textarea[^>]*disabled/);
    expect(renderToStaticMarkup(<Composer {...BASE} />)).not.toMatch(
      /<button[^>]*type="submit"[^>]*disabled/,
    );
  });

  test("disabled: cannot open", () => {
    expect(
      renderToStaticMarkup(<TalkButton label="Talk" listening={false} disabled onClick={ignore} />),
    ).toMatch(/aria-pressed="false" disabled=""/);
  });
});
