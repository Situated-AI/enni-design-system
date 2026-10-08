/**
 * Icons (#282) — the one set: the rail's destinations and rows, the phone's menu, the talk button,
 * a disclosure's chevron, and what a settings row is about (enni-v2 #483: a key, a device, a tool,
 * where two letters or a text glyph used to stand in for a drawing).
 *
 * Always decoration beside a word, never the word (D-115): every icon is `aria-hidden`, and the
 * control it sits in carries its name in text. Drawn in `currentColor` on a 16px grid, so an icon is
 * whatever colour its text is and needs no token of its own.
 *
 * The apps' own marks are `icon-marks.ts`: filled rather than stroked, and each on its owner's box.
 */
import { MARK_PATHS, MARKS, type MarkName } from "./icon-marks.ts";

const LINES = [
  "today",
  "conversation",
  "memory",
  "settings",
  "menu",
  "mic",
  "chevron",
  "key",
  "codes",
  "device",
  "phone",
  "tool",
  "card",
  "app",
] as const;
type LineName = (typeof LINES)[number];

export const ICONS = [...LINES, ...MARKS] as const;
export type IconName = (typeof ICONS)[number];

const PATHS: Readonly<Record<LineName, readonly string[]>> = {
  today: [
    "M8 2.5v1.5",
    "M8 12v1.5",
    "M2.5 8H4",
    "M12 8h1.5",
    "M8 5.5a2.5 2.5 0 1 0 0 5a2.5 2.5 0 1 0 0-5z",
  ],
  conversation: ["M3 4.5h10v6H7l-3 2.5v-2.5H3z"],
  memory: ["M4.5 2.5h7v11L8 11l-3.5 2.5z"],
  // Two sliders: never the sun of *today*, which it sat beside in the rail (enni-v2 #380).
  settings: ["M2.5 5h5.5", "M11.5 5h2", "M10 3.5v3", "M2.5 11h2", "M8 11h5.5", "M6.5 9.5v3"],
  menu: ["M2.5 4.5h11", "M2.5 8h11", "M2.5 11.5h11"],
  mic: [
    "M8 2a2 2 0 0 0-2 2v4a2 2 0 0 0 4 0V4a2 2 0 0 0-2-2z",
    "M4.5 7.5a3.5 3.5 0 0 0 7 0",
    "M8 11v2.5",
  ],
  // Points right while closed; the stylesheet turns it down when its disclosure opens.
  chevron: ["M6 3.5L10.5 8L6 12.5"],
  key: ["M5.5 8a2.5 2.5 0 1 0 0 5a2.5 2.5 0 1 0 0-5z", "M7.3 8.7L13 3", "M10.5 5.5l1.5 1.5"],
  // A sheet of written-down codes.
  codes: ["M4 2.5h8v11H4z", "M6 5.5h4", "M6 8h4", "M6 10.5h2.5"],
  device: ["M3.5 3.5h9v6.5h-9z", "M2 12.5h12"],
  phone: ["M5 2.5h6v11H5z", "M7.5 11.5h1"],
  // A terminal: something that asks from a command line.
  tool: ["M2.5 3.5h11v9h-11z", "M5 6.5l2 1.5l-2 1.5", "M8.5 10h2.5"],
  card: ["M2.5 4h11v8h-11z", "M2.5 6.5h11", "M4.5 10h2.5"],
  // Any app: what a source with no mark of its own is drawn as.
  app: ["M3 3h4v4H3z", "M9 3h4v4H9z", "M3 9h4v4H3z", "M9 9h4v4H9z"],
};

const isMark = (name: IconName): name is MarkName => (MARKS as readonly string[]).includes(name);

/** An app's own mark: one filled path, scaled whole from its owner's box. */
function Mark({ name }: { readonly name: MarkName }) {
  const { box, d } = MARK_PATHS[name];
  return (
    <svg
      className="enni-icon enni-icon--mark"
      width="16"
      height="16"
      viewBox={`0 0 ${box} ${box}`}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

export function Icon({ name }: { readonly name: IconName }) {
  if (isMark(name)) return <Mark name={name} />;
  return (
    <svg
      className="enni-icon"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
