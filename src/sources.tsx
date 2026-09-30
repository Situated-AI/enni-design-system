/**
 * Where an answer comes from (#298) — the source cards behind its citations, and its details.
 *
 * A **source card** is the app's monogram (`LI`, `GH`), the app and the item's title with its `[n]`,
 * an excerpt *only when the API returns one* (never invented on the page, #299), and the URL in mono.
 * Its `id` is what a citation links to. The **source list** is a disclosure — *Where this comes from ·
 * 4 sources* — that a citation, or the Details switch (#300), opens.
 *
 * The **details block** is the formal record in mono: the facts summary, the formal verdict and
 * rubric, and the decision-support qualifier. Every word is a prop (D-114).
 */
import type { ReactNode } from "react";

type SourceProps = {
  readonly id: string;
  readonly n: number;
  readonly monogram: string;
  readonly app: string;
  readonly title: string;
  readonly url?: string;
  readonly excerpt?: string;
};

export function SourceCard({ id, n, monogram, app, title, url, excerpt }: SourceProps) {
  return (
    <li className="enni-source" id={id} tabIndex={-1}>
      <span className="enni-source__head">
        <span className="enni-source__mark" aria-hidden="true">
          {monogram}
        </span>
        <span className="enni-source__names">
          <span className="enni-source__app">{app}</span>
          <span className="enni-source__title">
            {url === undefined ? title : <a href={url}>{title}</a>}
          </span>
        </span>
        <span className="enni-source__n">[{n}]</span>
      </span>
      {excerpt === undefined ? null : <p className="enni-source__excerpt">{excerpt}</p>}
      {url === undefined ? null : (
        <p className="enni-source__url">{url.replace(/^https?:\/\//, "")}</p>
      )}
    </li>
  );
}

type ListProps = {
  /** *Where this comes from · 4 sources*. */
  readonly summary: string;
  readonly open?: boolean;
  readonly children: ReactNode;
};

export function SourceList({ summary, open, children }: ListProps) {
  return (
    <details className="enni-sources" open={open}>
      <summary>{summary}</summary>
      <ul>{children}</ul>
    </details>
  );
}

/** The formal record, one line each, in mono: facts, verdict and rubric, the qualifier. */
export function DetailsBlock({
  lines,
  label,
}: {
  readonly lines: readonly ReactNode[];
  readonly label: string;
}) {
  return (
    <div className="enni-details-block" role="note" aria-label={label}>
      {lines.map((line, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: the lines are fixed and in order
        <p key={i}>{line}</p>
      ))}
    </div>
  );
}
