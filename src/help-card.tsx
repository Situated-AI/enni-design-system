/**
 * The help card (#287) — a few things a person can do, each with a way in: a round glyph, a bold lead,
 * and an example sentence. Two columns on a desktop, one on a phone.
 *
 * The glyph is decoration (`aria-hidden`): each row reads as its lead and its sentence, and a screen
 * reader hears exactly that. Every word is a prop (D-114).
 */

export type HelpRow = {
  readonly glyph: string;
  readonly lead: string;
  readonly text: string;
};

export function HelpCard({
  rows,
  label,
}: {
  readonly rows: readonly HelpRow[];
  readonly label?: string;
}) {
  return (
    <ul className="enni-card enni-help" aria-label={label}>
      {rows.map((row) => (
        <li key={row.lead}>
          <span className="enni-help__glyph" aria-hidden="true">
            {row.glyph}
          </span>
          <span>
            <strong>{row.lead}</strong> <span className="enni-help__text">{row.text}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
