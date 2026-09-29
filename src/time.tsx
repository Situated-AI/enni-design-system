"use client";
/**
 * Two of v1's seven neutral primitives, retyped (D-55, D-16): `Timestamp` and `ScrollHere`.
 *
 * **`Timestamp`** says when in words a person uses — *"3 minutes ago"*, *"yesterday"* — and keeps
 * the exact instant in `dateTime` and the tooltip. `relativeTime` takes `now` as an argument, so
 * the words are a pure function and a render on the server and one in the browser agree.
 *
 * **`ScrollHere`** brings a new message into view as it arrives — the conversation's newest answer —
 * and respects reduced motion by jumping rather than gliding.
 */
import { useEffect, useRef } from "react";

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const plural = (n: number, unit: string) => `${n} ${unit}${n === 1 ? "" : "s"} ago`;

/** How long ago `then` was, as a person says it. A future instant is *"just now"*, never negative. */
export function relativeTime(then: Date, now: Date): string {
  const elapsed = Math.max(0, now.getTime() - then.getTime());
  if (elapsed < MINUTE) return "just now";
  if (elapsed < HOUR) return plural(Math.floor(elapsed / MINUTE), "minute");
  if (elapsed < DAY) return plural(Math.floor(elapsed / HOUR), "hour");
  if (elapsed < 2 * DAY) return "yesterday";
  return plural(Math.floor(elapsed / DAY), "day");
}

export function Timestamp({ at, now }: { at: Date; now: Date }) {
  return (
    <time dateTime={at.toISOString()} title={at.toUTCString()}>
      {relativeTime(at, now)}
    </time>
  );
}

/** Scrolls itself into view when it mounts. Put it after the newest message. */
export function ScrollHere() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const still = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
    ref.current?.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "end" });
  }, []);
  return <div ref={ref} aria-hidden="true" />;
}
