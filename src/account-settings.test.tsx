import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { ActionMenu, Dialog, orderMenu, Row, Rows, SettingsCard } from "./account-settings.tsx";

const ignore = () => {};

test("Dialog: a native dialog named by its title, with a named close button", () => {
  const html = renderToStaticMarkup(
    <Dialog
      title="Invite someone"
      lede="They'll set a password."
      open={false}
      onClose={ignore}
      closeLabel="Close"
    >
      <p>body</p>
    </Dialog>,
  );
  expect(html).toMatch(
    /<dialog class="enni-dialog" aria-labelledby="([^"]+)" data-open="false"><header class="enni-dialog__header"><h2 id="\1">Invite someone<\/h2>/,
  );
  expect(html).toContain('aria-label="Close"');
  // Closed, its body isn't rendered — nothing inside is reachable.
  expect(html).not.toContain("body");
});

const committing = (open: boolean) =>
  renderToStaticMarkup(
    <Dialog
      title="Your name"
      open={open}
      onClose={ignore}
      closeLabel="Close"
      cancelLabel="Cancel"
      commit={
        <button type="submit" form="name-form">
          Save
        </button>
      }
    >
      <form id="name-form">fields</form>
    </Dialog>,
  );

test("Dialog: it closes with the one close control a sheet has (enni-v2 #473)", () => {
  expect(committing(true)).toContain(
    '<button type="button" class="enni-close" aria-label="Close"><span aria-hidden="true">×</span></button>',
  );
});

test("Dialog: a commit sits in a footer outside the scrolling body, Cancel before it (enni-v2 #473)", () => {
  expect(committing(true)).toContain(
    '<div class="enni-dialog__body"><form id="name-form">fields</form></div>' +
      '<footer class="enni-dialog__footer"><button type="button" class="enni-button enni-button--quiet">Cancel</button>' +
      '<button type="submit" form="name-form">Save</button></footer></dialog>',
  );
  // Closed, the footer is no more reachable than the body.
  expect(committing(false)).not.toContain("enni-dialog__footer");
});

test("Dialog: with nothing to commit there is no footer, and no Cancel", () => {
  const html = renderToStaticMarkup(
    <Dialog title="Search" open onClose={ignore} closeLabel="Close">
      <p>results</p>
    </Dialog>,
  );
  expect(html).not.toContain("enni-dialog__footer");
  expect(html).toContain('<div class="enni-dialog__body"><p>results</p></div></dialog>');
});

test("SettingsCard: a section named by its title, the action beside it, the why under it", () => {
  const html = renderToStaticMarkup(
    <SettingsCard
      title="Your second steps"
      why="Keep at least two."
      action={<button type="button">Add a passkey</button>}
    >
      <Rows label="Second steps">
        <Row
          monogram="D"
          title="Dana Okafor"
          detail="Added 12 Aug"
          trailing={<button type="button">Remove</button>}
        />
      </Rows>
    </SettingsCard>,
  );
  expect(html).toMatch(
    /<section class="enni-settings-card" aria-labelledby="([^"]+)"><header class="enni-settings-card__header"><h2 id="\1">Your second steps<\/h2><button/,
  );
  expect(html).toContain('<p class="enni-settings-card__why">Keep at least two.</p>');
  expect(html).toContain(
    '<ul class="enni-rows" aria-label="Second steps"><li class="enni-row"><span class="enni-row__monogram" aria-hidden="true">D</span>',
  );
});

test("enni-v2 #483: SettingsCard without a title names nothing twice — its why leads the header", () => {
  const html = renderToStaticMarkup(
    <SettingsCard why="3 people." action={<button type="button">Invite</button>}>
      <p>rows</p>
    </SettingsCard>,
  );
  expect(html).toBe(
    '<section class="enni-settings-card"><header class="enni-settings-card__header"><p class="enni-settings-card__why">3 people.</p><button type="button">Invite</button></header><p>rows</p></section>',
  );
  expect(html).not.toMatch(/<h\d|aria-labelledby/);
});

test("enni-v2 #483: Row draws what it is about as an icon from the set, never as letters", () => {
  const html = renderToStaticMarkup(<Row icon="key" monogram="PK" title="Passkey" />);
  expect(html).toMatch(
    /^<li class="enni-row"><span class="enni-row__icon" aria-hidden="true"><svg class="enni-icon"/,
  );
  expect(html).not.toContain("enni-row__monogram");
  expect(html).not.toContain(">PK<");
  const mark = renderToStaticMarkup(<Row icon="github" title="GitHub" />);
  expect(mark).toContain('<svg class="enni-icon enni-icon--mark"');
});

test("Row: title alone is enough", () => {
  expect(renderToStaticMarkup(<Row title="Name" />)).toBe(
    '<li class="enni-row"><span class="enni-row__text"><span class="enni-row__title">Name</span></span></li>',
  );
});

test("Row: what its action opened sits below it, across the row (#308)", () => {
  const html = renderToStaticMarkup(<Row title="Linear" below={<p>card</p>} />);
  expect(html).toContain('<div class="enni-row__below"><p>card</p></div></li>');
});

test("ActionMenu: a named button that says it opens a menu, closed until pressed", () => {
  const html = renderToStaticMarkup(
    <ActionMenu
      label="Actions for Sam Reyes"
      items={[{ label: "Make an admin", onSelect: ignore }]}
    />,
  );
  expect(html).toContain(
    'aria-label="Actions for Sam Reyes" aria-haspopup="menu" aria-expanded="false"',
  );
  expect(html).not.toContain('role="menu"');
});

test("ActionMenu: a trigger is what the button shows, and its name is still the label (enni-v2 #481)", () => {
  const html = renderToStaticMarkup(
    <ActionMenu
      label="Meridian Payments · Switch space"
      trigger={<span>Meridian Payments</span>}
      items={[{ label: "Home", onSelect: ignore }]}
    />,
  );
  expect(html).toContain('aria-label="Meridian Payments · Switch space" aria-haspopup="menu"');
  expect(html).toContain("<span>Meridian Payments</span></button>");
  expect(html).not.toContain("···");
});

test("the destructive items go last, whatever order they were given in", () => {
  const items = [
    { label: "Remove Sam", onSelect: ignore, danger: true },
    { label: "Make an admin", onSelect: ignore },
    { label: "Sign them out everywhere", onSelect: ignore },
  ];
  expect(orderMenu(items).map((i) => i.label)).toEqual([
    "Make an admin",
    "Sign them out everywhere",
    "Remove Sam",
  ]);
});
