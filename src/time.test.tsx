import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { relativeTime, ScrollHere, Timestamp } from "./time.tsx";

const NOW = new Date("2026-09-29T12:00:00Z");
const ago = (ms: number) => new Date(NOW.getTime() - ms);

describe("relativeTime", () => {
  test.each([
    [10_000, "just now"],
    [60_000, "1 minute ago"],
    [3 * 60_000, "3 minutes ago"],
    [60 * 60_000, "1 hour ago"],
    [5 * 60 * 60_000, "5 hours ago"],
    [30 * 60 * 60_000, "yesterday"],
    [3 * 24 * 60 * 60_000, "3 days ago"],
  ])("%p ms ago is %p", (ms, words) => {
    expect(relativeTime(ago(ms), NOW)).toBe(words);
  });

  test("a clock that runs ahead reads as just now, never as a negative age", () => {
    expect(relativeTime(ago(-60_000), NOW)).toBe("just now");
  });
});

test("Timestamp keeps the exact instant beside the words", () => {
  const html = renderToStaticMarkup(<Timestamp at={ago(3 * 60_000)} now={NOW} />);
  expect(html).toContain('dateTime="2026-09-29T11:57:00.000Z"');
  expect(html).toContain(">3 minutes ago</time>");
});

test("ScrollHere renders nothing a reader sees or hears", () => {
  expect(renderToStaticMarkup(<ScrollHere />)).toBe('<div aria-hidden="true"></div>');
});
