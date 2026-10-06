import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Skeleton, skeletonClass } from "./skeleton.tsx";

test("a skeleton is a busy status region that speaks its label and hides its bars", () => {
  const html = renderToStaticMarkup(<Skeleton label="Loading the conversation" />);
  expect(html).toContain('role="status"');
  expect(html).toContain('aria-busy="true"');
  expect(html).toContain('<span class="enni-visually-hidden">Loading the conversation</span>');
  expect(html.match(/enni-skeleton__line/g)).toHaveLength(3);
  expect(html.match(/aria-hidden="true"/g)).toHaveLength(3);
});

test("it draws as many bars as asked, and never fewer than one", () => {
  const bars = (lines: number) =>
    renderToStaticMarkup(<Skeleton label="x" lines={lines} />).match(/enni-skeleton__line/g);
  expect(bars(5)).toHaveLength(5);
  expect(bars(0)).toHaveLength(1);
  expect(bars(2.9)).toHaveLength(2);
});

test("a block skeleton carries the block class", () => {
  expect(skeletonClass("text")).toBe("enni-skeleton");
  expect(skeletonClass("block")).toBe("enni-skeleton enni-skeleton--block");
  expect(renderToStaticMarkup(<Skeleton label="x" shape="block" />)).toContain(
    "enni-skeleton--block",
  );
});
