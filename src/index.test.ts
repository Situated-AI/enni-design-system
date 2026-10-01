/**
 * The package's surface, and the claim that it imports nothing of ours (#61).
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "bun:test";
import * as ui from "./index.ts";

/** Every export, sorted — a new one is added here on purpose, in the commit that makes it. */
const PINNED = [
  "ActionMenu",
  "AnswerActions",
  "AnswerCard",
  "AnswerPair",
  "AnswerSection",
  "AuthCard",
  "BrandMark",
  "BrandTile",
  "Button",
  "ButtonLink",
  "COPY_WORDS",
  "Card",
  "CheckList",
  "Chip",
  "ChipRow",
  "ChoiceList",
  "Citation",
  "CodeInput",
  "CodeList",
  "Composer",
  "ConfirmByTyping",
  "ConfirmStep",
  "CopyButton",
  "CopyField",
  "CountBadge",
  "DARK",
  "Details",
  "DetailsBlock",
  "DevicePrompt",
  "Dialog",
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
  "Notice",
  "ORB",
  "Orb",
  "PRIMITIVES_CSS",
  "QrBlock",
  "RADIUS",
  "ReadingSteps",
  "RefusalCard",
  "Row",
  "Rows",
  "SHADOW_DARK",
  "SHADOW_LIGHT",
  "SPACE",
  "ScrollHere",
  "Segmented",
  "SettingsCard",
  "Sheet",
  "SourceCard",
  "SourceList",
  "StatusBadge",
  "StatusMark",
  "Steps",
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
  "codeDigits",
  "colour",
  "confirmationMatches",
  "copyValue",
  "describedBy",
  "groupCode",
  "groupKey",
  "orderMenu",
  "relativeTime",
  "syncDialog",
  "wrapTab",
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
