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

test("each option's name carries its count, and the chosen one is checked", () => {
  expect(html).toContain('checked="" value="PAY"/>PAY · 3</label>');
  expect(html).not.toContain('checked="" value=""');
});
