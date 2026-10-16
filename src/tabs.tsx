"use client";
/**
 * Tabs (enni-v2 #637): a few panels, one shown, chosen from a row — the landing's *Set up in one
 * command* (`.lp-tabs`), and the settings screen's sections where it had a row of its own
 * (`.enni-settings__tabs`).
 *
 * **A WAI-ARIA tablist.** Each tab is a `role="tab"` button that names its panel (`aria-controls`)
 * and says whether it is chosen (`aria-selected`); each panel is a `role="tabpanel"` named by its
 * tab. Only the chosen tab is in the tab order (a roving `tabIndex`), so Tab moves into the row and
 * out to the panel; the arrow keys move between tabs and choose as they go, wrapping at either end,
 * and Home and End go to the first and the last. Every panel stays in the page, `hidden` when it is
 * not chosen, so what it holds keeps its state.
 *
 * Controlled (`value` and `onChange`) or not (`defaultValue`, else the first tab). Every word is
 * the caller's (D-114).
 */
import { type KeyboardEvent, type ReactNode, useId, useRef, useState } from "react";

export type TabItem = {
  readonly value: string;
  readonly label: string;
  readonly panel: ReactNode;
};

type TabsProps = {
  /** What the row chooses between, for a screen reader: *Tools*. */
  readonly label: string;
  readonly tabs: readonly TabItem[];
  readonly value?: string;
  readonly defaultValue?: string;
  readonly onChange?: (value: string) => void;
};

/** The tab a key moves to from `at`, among `count`: the arrows wrap, Home and End go to the ends. */
export function moveTab(at: number, key: string, count: number): number {
  if (count <= 0) return at;
  if (key === "ArrowRight") return (at + 1) % count;
  if (key === "ArrowLeft") return (at + count - 1) % count;
  if (key === "Home") return 0;
  if (key === "End") return count - 1;
  return at;
}

const slug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-");

type Ids = (tab: TabItem) => { readonly tab: string; readonly panel: string };

type RowProps = {
  readonly label: string;
  readonly tabs: readonly TabItem[];
  readonly at: number;
  readonly ids: Ids;
  readonly choose: (value: string) => void;
};

function TabRow({ label, tabs, at, ids, choose }: RowProps) {
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    const next = moveTab(at, event.key, tabs.length);
    const tab = tabs[next];
    if (next === at || tab === undefined) return;
    event.preventDefault();
    choose(tab.value);
    buttons.current[next]?.focus();
  };
  return (
    <div className="enni-tabs__list" role="tablist" aria-label={label}>
      {tabs.map((tab, i) => (
        <button
          key={tab.value}
          ref={(element) => {
            buttons.current[i] = element;
          }}
          className="enni-tab"
          type="button"
          role="tab"
          id={ids(tab).tab}
          aria-controls={ids(tab).panel}
          aria-selected={i === at}
          tabIndex={i === at ? 0 : -1}
          onClick={() => choose(tab.value)}
          onKeyDown={onKey}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export function Tabs({ label, tabs, value, defaultValue, onChange }: TabsProps) {
  const [own, setOwn] = useState(defaultValue ?? tabs[0]?.value ?? "");
  const base = useId();
  const chosen = value ?? own;
  const at = Math.max(
    0,
    tabs.findIndex((tab) => tab.value === chosen),
  );
  const choose = (next: string) => {
    setOwn(next);
    onChange?.(next);
  };
  const ids: Ids = (tab) => ({
    tab: `${base}-tab-${slug(tab.value)}`,
    panel: `${base}-panel-${slug(tab.value)}`,
  });
  return (
    <div className="enni-tabs">
      <TabRow label={label} tabs={tabs} at={at} ids={ids} choose={choose} />
      {tabs.map((tab, i) => (
        <div
          key={tab.value}
          className="enni-tab-panel"
          role="tabpanel"
          id={ids(tab).panel}
          aria-labelledby={ids(tab).tab}
          hidden={i !== at}
        >
          {tab.panel}
        </div>
      ))}
    </div>
  );
}
