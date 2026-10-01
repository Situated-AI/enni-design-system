import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { HostedCardField, PackChooser, ReceiptRows } from "./billing-choices.tsx";

const PACKS = [
  { value: "1000", amount: "1,000", unit: "credits", price: "$20" },
  { value: "2500", amount: "2,500", unit: "credits", price: "$50", tag: "Most spaces" },
];

test("PackChooser: a named radio group of packs, the chosen one checked, its tag shown", () => {
  const html = renderToStaticMarkup(
    <PackChooser
      label="Credit packs"
      packs={PACKS}
      value="2500"
      onChange={() => {}}
      charge="Charged now · $50.00"
    />,
  );
  expect(html).toContain('<legend class="enni-visually-hidden">Credit packs</legend>');
  expect(html.match(/type="radio"/g)).toHaveLength(2);
  expect(html).toContain('checked="" value="2500"');
  expect(html).toContain('<span class="enni-pack__tag">Most spaces</span>');
});

test("PackChooser: the charge is stated after the packs — before any button the caller adds (B04)", () => {
  const html = renderToStaticMarkup(
    <PackChooser
      label="p"
      packs={PACKS}
      value="1000"
      onChange={() => {}}
      charge="Charged now · $20.00"
    />,
  );
  expect(html.indexOf("Charged now")).toBeGreaterThan(html.lastIndexOf("enni-pack__price"));
});

test("ReceiptRows: a table with named columns, each row's link, and a row without a receipt has none", () => {
  const html = renderToStaticMarkup(
    <ReceiptRows
      label="Receipts"
      columns={["Date", "What", "Amount", "Status", "Receipt"]}
      linkLabel="Receipt"
      rows={[
        {
          date: "1 Sep 2026",
          description: "Team plan · 3 people",
          amount: "$120.00",
          status: "Paid",
          href: "/r/1",
        },
        { date: "22 Aug 2026", description: "1,000 credits", amount: "$20.00", status: "Paid" },
      ]}
    />,
  );
  expect(html).toContain('<th scope="col">Amount</th>');
  expect(html).toContain('<a href="/r/1">Receipt</a>');
  expect(html.match(/<a /g)).toHaveLength(1);
});

test("HostedCardField: a slot for the processor's fields, its mark, and what Enni keeps — no processor code", () => {
  const html = renderToStaticMarkup(
    <HostedCardField
      by="Payments by"
      mark="stripe"
      note="Enni stores only the last four digits and the expiry."
    >
      <div id="card-element" />
    </HostedCardField>,
  );
  expect(html).toContain('data-hosted-slot=""><div id="card-element"></div>');
  expect(html).toContain("Payments by <strong>stripe</strong>");
  expect(html).toContain("only the last four digits");
});
