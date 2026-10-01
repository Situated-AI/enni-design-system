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
    /<dialog class="enni-dialog" aria-labelledby="([^"]+)"><header class="enni-dialog__header"><h2 id="\1">Invite someone<\/h2>/,
  );
  expect(html).toContain('aria-label="Close"');
  // Closed, its body isn't rendered — nothing inside is reachable.
  expect(html).not.toContain("body");
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
          monogram="PK"
          title="Passkey · Dana's MacBook"
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
    '<ul class="enni-rows" aria-label="Second steps"><li class="enni-row"><span class="enni-row__monogram" aria-hidden="true">PK</span>',
  );
});

test("Row: title alone is enough", () => {
  expect(renderToStaticMarkup(<Row title="Name" />)).toBe(
    '<li class="enni-row"><span class="enni-row__text"><span class="enni-row__title">Name</span></span></li>',
  );
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
