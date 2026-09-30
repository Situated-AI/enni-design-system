/**
 * The package's surface, and the claim that it imports nothing of ours (#61).
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "bun:test";
import * as ui from "./index.ts";

test("the surface is pinned — a new export is a decision, not a side effect", () => {
  expect(Object.keys(ui).sort()).toEqual([
    "BrandMark",
    "Button",
    "ButtonLink",
    "COPY_WORDS",
    "Card",
    "CheckList",
    "Chip",
    "ConfirmByTyping",
    "ConfirmStep",
    "CopyButton",
    "CountBadge",
    "DARK",
    "Details",
    "EASE",
    "Eyebrow",
    "FONT",
    "Field",
    "LEADING",
    "LIGHT",
    "MEASURE",
    "MOTION",
    "ORB",
    "Orb",
    "PRIMITIVES_CSS",
    "RADIUS",
    "SHADOW_DARK",
    "SHADOW_LIGHT",
    "SPACE",
    "ScrollHere",
    "Sheet",
    "StatusBadge",
    "StatusMark",
    "SubmitButton",
    "SuggestionChip",
    "TOKENS_CSS",
    "TONE_TOKENS",
    "TRACKING",
    "TYPE",
    "Timestamp",
    "buttonClass",
    "colour",
    "confirmationMatches",
    "copyValue",
    "describedBy",
    "relativeTime",
    "syncDialog",
  ]);
});

test("no source file imports a workspace package — ui sits beside the chain", () => {
  const files = readdirSync(import.meta.dir).filter((f) => /\.tsx?$/.test(f));
  expect(files.length).toBeGreaterThan(10);
  for (const file of files) {
    expect(readFileSync(join(import.meta.dir, file), "utf8")).not.toMatch(/from\s+["']@enni\//);
  }
});
