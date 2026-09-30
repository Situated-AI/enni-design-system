/**
 * Icons (#282) — the few the frame draws: the rail's destinations and rows, the phone's menu, the
 * talk button.
 *
 * Always decoration beside a word, never the word (D-115): every icon is `aria-hidden`, and the
 * control it sits in carries its name in text. Drawn in `currentColor` on a 16px grid, so an icon is
 * whatever colour its text is and needs no token of its own.
 */

export const ICONS = ["today", "conversation", "memory", "settings", "menu", "mic"] as const;
export type IconName = (typeof ICONS)[number];

const PATHS: Readonly<Record<IconName, readonly string[]>> = {
  today: [
    "M8 2.5v1.5",
    "M8 12v1.5",
    "M2.5 8H4",
    "M12 8h1.5",
    "M8 5.5a2.5 2.5 0 1 0 0 5a2.5 2.5 0 1 0 0-5z",
  ],
  conversation: ["M3 4.5h10v6H7l-3 2.5v-2.5H3z"],
  memory: ["M4.5 2.5h7v11L8 11l-3.5 2.5z"],
  settings: ["M8 6a2 2 0 1 0 0 4a2 2 0 1 0 0-4z", "M8 1.5v2", "M8 12.5v2", "M1.5 8h2", "M12.5 8h2"],
  menu: ["M2.5 4.5h11", "M2.5 8h11", "M2.5 11.5h11"],
  mic: [
    "M8 2a2 2 0 0 0-2 2v4a2 2 0 0 0 4 0V4a2 2 0 0 0-2-2z",
    "M4.5 7.5a3.5 3.5 0 0 0 7 0",
    "M8 11v2.5",
  ],
};

export function Icon({ name }: { readonly name: IconName }) {
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
