/**
 * The guardrails, run over this repository's own source — and over fixtures, so the instrument is
 * shown to catch what it claims to before its silence on the tree is trusted (D-34).
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, test } from "bun:test";
import config from "../guardrails.toml";
import {
  type Ceilings,
  checkFileLength,
  countFileLines,
  findLongFunctions,
  formatViolation,
  isTestFile,
  siblingTestPath,
  type Violation,
} from "./guardrails.ts";

const ROOT = join(import.meta.dir, "..");
const WALKED = ["src", "scripts"];

const ceilings: Ceilings = {
  maxFunctionLines: config.guardrails.max_function_lines,
  maxFileLines: config.guardrails.max_file_lines,
  requireTests: config.guardrails.require_tests,
};

const walk = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return walk(path);
    return /\.tsx?$/.test(entry.name) && !entry.name.endsWith(".d.ts") ? [path] : [];
  });

describe("the instrument", () => {
  test("counts lines the way wc -l does", () => {
    expect(countFileLines("")).toBe(0);
    expect(countFileLines("a\nb\n")).toBe(2);
  });

  test("catches a long file and a long function", () => {
    const body = Array.from({ length: 4 }, () => "  x();").join("\n");
    const text = `function big() {\n${body}\n}\n`;
    expect(checkFileLength("f.ts", text, 3)).toHaveLength(1);
    expect(findLongFunctions("f.ts", text, 3).violations[0]?.subject).toBe("big");
  });

  test("does not measure a describe callback as a function", () => {
    const text = `describe("s", () => {\n\n\n\n});\n`;
    expect(findLongFunctions("f.test.ts", text, 1).violations).toHaveLength(0);
  });

  test("names the remedy", () => {
    const v: Violation = { path: "src/a.tsx", kind: "tests", subject: "", measured: 0, ceiling: 1 };
    expect(formatViolation(v)).toContain("add a.test.tsx");
  });
});

test("the tree holds to the ceilings", () => {
  const files = WALKED.flatMap((dir) => walk(join(ROOT, dir)));
  const violations: Violation[] = [];
  let functions = 0;
  for (const file of files) {
    const path = relative(ROOT, file);
    const text = readFileSync(file, "utf8");
    violations.push(...checkFileLength(path, text, ceilings.maxFileLines));
    const found = findLongFunctions(path, text, ceilings.maxFunctionLines);
    violations.push(...found.violations);
    functions += found.examined;
    if (ceilings.requireTests && !isTestFile(path) && !existsSync(siblingTestPath(file))) {
      violations.push({ path, kind: "tests", subject: path, measured: 0, ceiling: 1 });
    }
  }
  expect(files.length).toBeGreaterThan(20);
  expect(functions).toBeGreaterThan(50);
  expect(violations.map(formatViolation).join("\n\n")).toBe("");
});
