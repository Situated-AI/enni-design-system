import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { describedBy, Field } from "./field.tsx";

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
