import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { ActionField, describedBy, Field, SelectField, TextareaField } from "./field.tsx";

describe("describedBy", () => {
  test("nothing to describe is no attribute at all", () => {
    expect(describedBy("key")).toBeUndefined();
  });

  test("hint, then error, in reading order", () => {
    expect(describedBy("key", "h", "e")).toBe("key-hint key-error");
  });
});

describe("Field", () => {
  test("the label names the input", () => {
    const html = renderToStaticMarkup(<Field id="key" label="Linear API key" type="password" />);
    expect(html).toContain('<label for="key">Linear API key</label>');
    expect(html).toContain('type="password"');
  });

  test("the hint is read with the field", () => {
    const html = renderToStaticMarkup(
      <Field id="key" label="Key" hint="It's stored encrypted and never shown again." />,
    );
    expect(html).toContain('aria-describedby="key-hint"');
    expect(html).toContain('id="key-hint"');
  });

  test("an error marks the field invalid and is announced", () => {
    const html = renderToStaticMarkup(<Field id="key" label="Key" error="Linear refused it." />);
    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain('role="alert"');
  });
});

describe("the landing's fields (enni-v2 #637)", () => {
  test("a plain field's markup is unchanged: no state, no wrapper", () => {
    expect(renderToStaticMarkup(<Field id="e" label="Email" />)).toBe(
      '<div class="enni-field"><label for="e">Email</label><input id="e"/></div>',
    );
  });

  test("an error is the bad state; a valid field the good one, with its tick hidden from a reader", () => {
    expect(renderToStaticMarkup(<Field id="e" label="Email" error="No." />)).toContain(
      '<div class="enni-field" data-state="bad">',
    );
    const good = renderToStaticMarkup(<Field id="e" label="Email" valid />);
    expect(good).toContain('<div class="enni-field" data-state="good">');
    expect(good).toContain(
      '<span class="enni-field__in"><input id="e"/><svg class="enni-field__tick"',
    );
    expect(good).toContain('aria-hidden="true"');
    expect(renderToStaticMarkup(<Field id="e" label="Email" valid={false} />)).not.toContain(
      "data-state",
    );
  });

  test("a textarea and a select are the same frame, described and invalid the same way", () => {
    const area = renderToStaticMarkup(<TextareaField id="n" label="Note" hint="Optional" />);
    expect(area).toContain('<textarea id="n" aria-describedby="n-hint"></textarea>');
    const select = renderToStaticMarkup(
      <SelectField
        id="r"
        label="Role"
        error="Choose one."
        options={[
          { value: "a", label: "Angel" },
          { value: "b", label: "Backer" },
        ]}
      />,
    );
    expect(select).toContain('<select id="r" aria-describedby="r-error" aria-invalid="true">');
    expect(select).toContain('<option value="b">Backer</option>');
  });

  test("an action field holds the input and its action in one box", () => {
    const html = renderToStaticMarkup(
      <ActionField id="u" label="Issue" mono action={<button type="submit">Check</button>} />,
    );
    expect(html).toBe(
      '<div class="enni-action-field enni-action-field--mono"><label for="u">Issue</label><div class="enni-action-field__box"><input id="u"/><button type="submit">Check</button></div></div>',
    );
  });
});
