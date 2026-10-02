/**
 * enni-v2's three guardrails (D-35), as pure functions over text.
 *
 * The ceilings come from `guardrails.toml` and are passed in, never typed here (D-38). Every
 * filesystem read lives in `guardrails.test.ts`, so these can be tested on fixtures.
 */
import ts from "typescript";

export type Ceilings = {
  readonly maxFunctionLines: number;
  readonly maxFileLines: number;
  readonly requireTests: boolean;
};

export type Violation = {
  readonly path: string;
  readonly kind: "file" | "function" | "tests";
  readonly subject: string;
  readonly measured: number;
  readonly ceiling: number;
};

/** Physical lines, counted the way `wc -l` and an editor do: a trailing newline adds none. */
export function countFileLines(text: string): number {
  if (text === "") return 0;
  const lines = text.split("\n");
  if (lines[lines.length - 1] === "") lines.pop();
  return lines.length;
}

export function checkFileLength(path: string, text: string, ceiling: number): Violation[] {
  const measured = countFileLines(text);
  return measured <= ceiling ? [] : [{ path, kind: "file", subject: path, measured, ceiling }];
}

const isFunctionLike = (node: ts.Node): boolean =>
  ts.isFunctionDeclaration(node) ||
  ts.isFunctionExpression(node) ||
  ts.isArrowFunction(node) ||
  ts.isMethodDeclaration(node) ||
  ts.isConstructorDeclaration(node) ||
  ts.isGetAccessorDeclaration(node) ||
  ts.isSetAccessorDeclaration(node);

function rootCallee(expr: ts.Expression): string {
  if (ts.isIdentifier(expr)) return expr.text;
  if (ts.isPropertyAccessExpression(expr) || ts.isCallExpression(expr)) {
    return rootCallee(expr.expression);
  }
  return "";
}

/** A `describe` callback is a list of tests, not a function; each test inside is measured alone. */
function isSuiteGrouping(node: ts.Node): boolean {
  const parent = node.parent;
  if (!parent || !ts.isCallExpression(parent)) return false;
  return rootCallee(parent.expression) === "describe";
}

function nameOf(node: ts.Node, line: number): string {
  const declared = ts.getNameOfDeclaration(node as ts.Declaration);
  if (declared && ts.isIdentifier(declared)) return declared.text;
  const parent = node.parent;
  if (parent && ts.isVariableDeclaration(parent) && ts.isIdentifier(parent.name)) {
    return parent.name.text;
  }
  return `<anonymous> at line ${line + 1}`;
}

/** Last line minus first, so a one-line arrow measures 0. Nested functions are measured too. */
export function findLongFunctions(path: string, text: string, ceiling: number) {
  const source = ts.createSourceFile(path, text, ts.ScriptTarget.ES2022, true);
  const violations: Violation[] = [];
  let examined = 0;
  const visit = (node: ts.Node): void => {
    if (isFunctionLike(node)) {
      examined += 1;
      const first = source.getLineAndCharacterOfPosition(node.getStart(source)).line;
      const measured = source.getLineAndCharacterOfPosition(node.getEnd()).line - first;
      if (measured > ceiling && !isSuiteGrouping(node)) {
        violations.push({
          path,
          kind: "function",
          subject: nameOf(node, first),
          measured,
          ceiling,
        });
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return { violations, examined };
}

/** `button.tsx` → `button.test.tsx`; `index.ts` → `index.test.ts`. */
export const siblingTestPath = (path: string): string => path.replace(/\.(tsx?)$/, ".test.$1");

export const isTestFile = (path: string): boolean => /\.test\.tsx?$/.test(path);

export function formatViolation(v: Violation): string {
  const measured =
    v.kind === "tests"
      ? "no sibling test"
      : `${v.kind === "function" ? `function \`${v.subject}\` is ` : ""}${v.measured} lines · ceiling ${v.ceiling}`;
  const remedy =
    v.kind === "tests"
      ? `add ${siblingTestPath(v.path).split("/").pop()}`
      : v.kind === "function"
        ? "extract part of it"
        : "split the file";
  return `✗ ${v.path}\n  ${measured} (D-35, guardrails.toml)\n  → ${remedy}`;
}
