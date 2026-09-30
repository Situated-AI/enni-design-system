/**
 * The package's surface, and the claim that it imports nothing of ours (#61).
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "bun:test";
import * as ui from "./index.ts";

/** Every export, sorted — a new one is added here on purpose, in the commit that makes it. */
const PINNED = [
  "AnswerActions",
  "AnswerCard",
  "AnswerPair",
  "AnswerSection",
  "BrandMark",
  "Button",
  "ButtonLink",
  "COPY_WORDS",
  "Card",
  "CheckList",
  "Chip",
  "ChipRow",
  "Citation",
  "Composer",
  "ConfirmByTyping",
  "ConfirmStep",
  "CopyButton",
  "CountBadge",
  "DARK",
  "Details",
  "DetailsBlock",
  "EASE",
  "Eyebrow",
  "FONT",
  "Field",
  "HeardBubble",
  "HelpCard",
  "Hint",
  "ICONS",
  "Icon",
  "LEADING",
  "LIGHT",
  "MEASURE",
  "MOTION",
  "ORB",
  "Orb",
  "PRIMITIVES_CSS",
  "RADIUS",
  "ReadingSteps",
  "RefusalCard",
  "SHADOW_DARK",
  "SHADOW_LIGHT",
  "SPACE",
  "ScrollHere",
  "Segmented",
  "Sheet",
  "SourceCard",
  "SourceList",
  "StatusBadge",
  "StatusMark",
  "SubmitButton",
  "SuggestionChip",
  "TOKENS_CSS",
  "TONE_TOKENS",
  "TRACKING",
  "TYPE",
  "TalkButton",
  "Timestamp",
  "Turn",
  "buttonClass",
  "colour",
  "confirmationMatches",
  "copyValue",
  "describedBy",
  "relativeTime",
  "syncDialog",
];

test("the surface is pinned — a new export is a decision, not a side effect", () => {
  expect(Object.keys(ui).sort()).toEqual(PINNED);
});

test("no source file imports a workspace package — ui sits beside the chain", () => {
  const files = readdirSync(import.meta.dir).filter((f) => /\.tsx?$/.test(f));
  expect(files.length).toBeGreaterThan(10);
  for (const file of files) {
    expect(readFileSync(join(import.meta.dir, file), "utf8")).not.toMatch(/from\s+["']@enni\//);
  }
});
