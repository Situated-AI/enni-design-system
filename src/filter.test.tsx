import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Filter } from "./filter.tsx";

const html = renderToStaticMarkup(
  <Filter
    label="Project"
    options={[
      { value: "", label: "All · 4" },
      { value: "PAY", label: "PAY · 3" },
    ]}
    value="PAY"
    onChange={() => {}}
  />,
);

test("#309: a named radio group — the arrow keys and a screen reader both know what it is", () => {
  expect(html).toContain('<legend class="enni-visually-hidden">Project</legend>');
  expect(html.match(/type="radio"/g)).toHaveLength(2);
});

test("#307: chips are the same radio group, drawn as pills", () => {
  const chips = renderToStaticMarkup(
    <Filter
      label="Pick the tool"
      options={[{ value: "a", label: "Cursor" }]}
      value="a"
      onChange={() => {}}
      look="chips"
    />,
  );
  expect(chips).toContain('class="enni-segmented enni-filter enni-filter--chips"');
  expect(chips).toContain('type="radio"');
});

test("each option's name carries its count, and the chosen one is checked", () => {
  expect(html).toContain('checked="" value="PAY"/>PAY · 3</label>');
  expect(html).not.toContain('checked="" value=""');
});
