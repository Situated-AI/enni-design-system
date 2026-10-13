import { expect, test } from "bun:test";
import { closingHandlers } from "./dialog-closing.ts";

const told = () => {
  const calls: number[] = [];
  const heard = { current: false };
  return { calls, heard, handlers: closingHandlers(heard, () => calls.push(calls.length)) };
};

test("Esc is said as it happens, and the close that follows is not said again", () => {
  const { calls, handlers } = told();
  handlers.onCancel();
  expect(calls).toHaveLength(1);
  handlers.onClose({ open: false });
  expect(calls).toHaveLength(1);
});

test("a close with no cancel before it (the close button's own, a script's) is said once", () => {
  const { calls, handlers } = told();
  handlers.onClose({ open: false });
  expect(calls).toHaveLength(1);
});

test("a close that arrives after the dialog was opened again is not believed (enni-v2 #562)", () => {
  const { calls, handlers } = told();
  handlers.onCancel();
  // The owner reopened it before the browser's notice of the first closing arrived.
  handlers.onClose({ open: true });
  expect(calls).toHaveLength(1);
});

test("a stale close is ignored even with no cancel heard", () => {
  const { calls, handlers } = told();
  handlers.onClose({ open: true });
  expect(calls).toHaveLength(0);
});

test("the next closing is heard afresh: cancel, close, then cancel, close", () => {
  const { calls, heard, handlers } = told();
  handlers.onCancel();
  handlers.onClose({ open: false });
  expect(heard.current).toBe(false);
  handlers.onCancel();
  handlers.onClose({ open: false });
  expect(calls).toHaveLength(2);
});

test("after a cancel whose close was swallowed, a later plain close is said", () => {
  const { calls, handlers } = told();
  handlers.onCancel();
  handlers.onClose({ open: false });
  handlers.onClose({ open: false });
  expect(calls).toHaveLength(2);
});
