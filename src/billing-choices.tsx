/**
 * Billing's choices and records (#311, B01, B04, B07, B08) — leaf components, every word a prop.
 *
 * - **PackChooser**: credit packs as choice cards — an amount, a price, an optional tag (*Most
 *   spaces*, *Save 20%*) — built as **a radio group**, so arrows move and a screen reader hears each
 *   pack whole. **The charge is stated before the button**: `charge` is a line the caller fills, and
 *   it sits between the packs and whatever the caller puts after them (B04).
 * - **ReceiptRows**: date · description · amount · status · receipt link — a table on a desk, and
 *   stacked rows on a phone, with the column names kept for a screen reader.
 * - **HostedCardField**: the slot Stripe Elements mounts into, styled from our tokens. **No Stripe
 *   code here** — `apps/web` mounts Elements; this draws the frame, *Payments by stripe* as the only
 *   mark, and the sentence saying what Enni keeps (B07).
 */
import { type ReactNode, useId } from "react";

export type Pack = {
  readonly value: string;
  readonly amount: string;
  readonly unit: string;
  readonly price: string;
  readonly tag?: string;
};

type PackProps = {
  readonly label: string;
  readonly packs: readonly Pack[];
  readonly value: string;
  readonly onChange: (value: string) => void;
  /** *Charged now to Visa ···· 4242 · $50.00* — said before any button. */
  readonly charge: ReactNode;
};

export function PackChooser({ label, packs, value, onChange, charge }: PackProps) {
  const name = useId();
  return (
    <div className="enni-packs">
      <fieldset className="enni-packs__choices">
        <legend className="enni-visually-hidden">{label}</legend>
        {packs.map((pack) => (
          <label key={pack.value} className="enni-pack">
            <input
              className="enni-visually-hidden"
              type="radio"
              name={name}
              value={pack.value}
              checked={pack.value === value}
              onChange={() => onChange(pack.value)}
            />
            <span className="enni-pack__amount">{pack.amount}</span>
            <span className="enni-pack__unit">{pack.unit}</span>
            <span className="enni-pack__price">{pack.price}</span>
            {pack.tag === undefined ? null : <span className="enni-pack__tag">{pack.tag}</span>}
          </label>
        ))}
      </fieldset>
      <div className="enni-packs__charge">{charge}</div>
    </div>
  );
}

export type Receipt = {
  readonly date: string;
  readonly description: string;
  readonly amount: string;
  readonly status: string;
  readonly href?: string;
};

type ReceiptProps = {
  readonly label: string;
  /** The column names, for a screen reader — the rows are read as a table. */
  readonly columns: readonly [string, string, string, string, string];
  readonly rows: readonly Receipt[];
  /** The link's word — *Receipt*. */
  readonly linkLabel: string;
};

export function ReceiptRows({ label, columns, rows, linkLabel }: ReceiptProps) {
  return (
    <table className="enni-receipts" aria-label={label}>
      <thead className="enni-visually-hidden">
        <tr>
          {columns.map((column) => (
            <th key={column} scope="col">
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={`${row.date}·${row.description}`}>
            <td className="enni-receipts__date">{row.date}</td>
            <td className="enni-receipts__what">{row.description}</td>
            <td className="enni-receipts__amount">{row.amount}</td>
            <td>
              <span className="enni-receipts__status">{row.status}</span>
            </td>
            <td>{row.href === undefined ? null : <a href={row.href}>{linkLabel}</a>}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

type HostedProps = {
  /** *Payments by* — the one place the processor is named, beside its mark. */
  readonly by: string;
  readonly mark: string;
  /** *Your card details go straight to Stripe. Enni stores only the last four digits and the expiry.* */
  readonly note: string;
  /** Where Elements mounts: the caller's element, or nothing until it has loaded. */
  readonly children?: ReactNode;
  readonly actions?: ReactNode;
};

export function HostedCardField({ by, mark, note, children, actions }: HostedProps) {
  return (
    <div className="enni-hosted">
      <div className="enni-hosted__slot" data-hosted-slot="">
        {children}
      </div>
      <div className="enni-hosted__footer">
        {actions}
        <span className="enni-hosted__by">
          {by} <strong>{mark}</strong>
        </span>
      </div>
      <p className="enni-hosted__note">{note}</p>
    </div>
  );
}
