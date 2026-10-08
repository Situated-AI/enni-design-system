/**
 * A grouped check list (enni-v2 #471): what was checked, as rows a person reads, under the group
 * each belongs to — *needs care*, *couldn't check*, *passed*.
 *
 * Each row is a mark and a name, and may carry a reason (why it came out this way) and one action
 * (what would change it). The mark is a glyph and a word in its tone, as `StatusMark` draws one, so
 * an outcome is never told by colour alone (D-115). A group with no rows is not drawn; a group
 * given an `id` can be linked to, and its title takes focus when it is.
 *
 * Nothing here is worded: every title, name, word, reason and label arrives as a prop (D-114). How
 * many groups there are, what they are called and which row goes where is the caller's.
 */
import type { Mark } from "./status.tsx";

export type CheckRowAction = { readonly label: string; readonly onAct: () => void };

export type CheckRow = {
  readonly id: string;
  readonly name: string;
  readonly mark: Mark;
  /** Why it came out this way, in a sentence. */
  readonly reason?: string;
  /** The one thing to press that would change it. */
  readonly action?: CheckRowAction;
};

export type CheckGroup = {
  /** A stable name for a style or a test: `care`, `unread`, `passed`. */
  readonly kind: string;
  readonly title: string;
  /** The group's anchor: a link to it lands on its title. */
  readonly id?: string;
  readonly rows: readonly CheckRow[];
};

function Row({ row, kind }: { readonly row: CheckRow; readonly kind: string }) {
  const { mark, reason, action } = row;
  return (
    <li
      className={`enni-checks__row enni-tone--${mark.tone}`}
      data-check-id={row.id}
      data-kind-of={kind}
    >
      <span className="enni-checks__glyph" aria-hidden="true">
        {mark.glyph}
      </span>
      <span className="enni-checks__name">{row.name}</span>
      <span className="enni-checks__word">{mark.word}</span>
      {reason === undefined ? null : <span className="enni-checks__reason">{reason}</span>}
      {action === undefined ? null : (
        <button type="button" className="enni-chip enni-checks__action" onClick={action.onAct}>
          {action.label}
        </button>
      )}
    </li>
  );
}

function Group({ group }: { readonly group: CheckGroup }) {
  return (
    <section className="enni-checks__group" data-kind={group.kind} aria-label={group.title}>
      <p
        className="enni-checks__title"
        id={group.id}
        tabIndex={group.id === undefined ? undefined : -1}
      >
        {group.title}
        <span className="enni-checks__count">{group.rows.length}</span>
      </p>
      <ul>
        {group.rows.map((row) => (
          <Row key={row.id} row={row} kind={group.kind} />
        ))}
      </ul>
    </section>
  );
}

type Props = { readonly label: string; readonly groups: readonly CheckGroup[] };

export function CheckGroups({ label, groups }: Props) {
  const drawn = groups.filter((group) => group.rows.length > 0);
  if (drawn.length === 0) return null;
  return (
    // biome-ignore lint/a11y/useSemanticElements: a labelled group of lists, not a form's fieldset.
    <div className="enni-checks" role="group" aria-label={label}>
      {drawn.map((group) => (
        <Group key={group.kind} group={group} />
      ))}
    </div>
  );
}
