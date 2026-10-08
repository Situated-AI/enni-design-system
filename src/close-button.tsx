/**
 * The one way out of an overlay (enni-v2 #473): the sheet and the dialog close with the same
 * control. Before this a sheet had a bordered button that said a word and a dialog had a bare `×`,
 * and the bordered one drew the focus ring around its own border — two rings — each time a sheet
 * opened, because a modal dialog gives its first control the focus.
 *
 * It is a glyph in a 44px target with no border, so the ring on it is the page's one
 * `:focus-visible` ring. The glyph is decoration; the name is the word it is given (D-114).
 */
type Props = {
  /** The button's name: *"Close"*. */
  readonly label: string;
  readonly onClick: () => void;
};

export function CloseButton({ label, onClick }: Props) {
  return (
    <button type="button" className="enni-close" aria-label={label} onClick={onClick}>
      <span aria-hidden="true">×</span>
    </button>
  );
}
