import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import {
  ChoiceList,
  CodeInput,
  CodeList,
  CopyField,
  codeDigits,
  DevicePrompt,
  groupCode,
  groupKey,
  QrBlock,
} from "./account-inputs.tsx";

const ignore = () => {};

test("ChoiceList: radios in a named fieldset, the chosen card marked", () => {
  const html = renderToStaticMarkup(
    <ChoiceList
      legend="Role"
      showLegend
      name="role"
      value="member"
      onChange={ignore}
      choices={[
        { value: "member", label: "Member", hint: "Asks questions." },
        { value: "admin", label: "Admin" },
      ]}
    />,
  );
  expect(html).toContain('<legend class="enni-choices__legend">Role</legend>');
  expect(html).toContain(
    'data-selected="true"><input type="radio" name="role" checked="" value="member"',
  );
  expect(html).toContain('<span class="enni-choice__hint">Asks questions.</span>');
  expect(html.match(/type="radio"/g)).toHaveLength(2);
});

describe("CodeInput", () => {
  test("a pasted code keeps its digits, at most six", () => {
    expect(codeDigits("123 456")).toBe("123456");
    expect(codeDigits("123-4567")).toBe("123456");
    expect(codeDigits("12a3")).toBe("123");
  });

  test("shown in threes", () => {
    expect(groupCode("123456")).toBe("123 456");
    expect(groupCode("1234")).toBe("123 4");
    expect(groupCode("12")).toBe("12");
  });

  test("numeric, and offered the code the phone received", () => {
    const html = renderToStaticMarkup(
      <CodeInput
        id="code"
        label="Enter the code"
        hint="This proves it."
        value="123456"
        onChange={ignore}
      />,
    );
    expect(html).toContain('inputMode="numeric" autoComplete="one-time-code"');
    expect(html).toContain('value="123 456"');
    expect(html).toContain('aria-describedby="code-hint"');
  });
});

test("CodeList: the codes as a named list, then Download and Copy all", () => {
  const html = renderToStaticMarkup(
    <CodeList
      codes={["k7pq-3m2x", "a9zd-h4lw"]}
      label="Recovery codes"
      downloadLabel="Download as a file"
      copyLabel="Copy all"
      filename="codes.txt"
    />,
  );
  expect(html).toContain(
    '<ul aria-label="Recovery codes"><li>k7pq-3m2x</li><li>a9zd-h4lw</li></ul>',
  );
  expect(html).toContain(">Download as a file</button>");
  expect(html).toContain(">Copy all</button>");
  expect(html).toContain('role="status" aria-live="polite"');
});

test("CopyField: the value, named, and a Copy button described by it", () => {
  const html = renderToStaticMarkup(
    <CopyField value="https://x/join" label="Invite link" copyLabel="Copy" />,
  );
  expect(html).toMatch(
    /Invite link: <\/span><code id="([^"]+)">https:\/\/x\/join<\/code><button aria-describedby="\1"/,
  );
});

test("QrBlock: the drawn code, the instruction, and the key in fours to copy", () => {
  expect(groupKey("JBSWY3DPEHPK3PXP")).toBe("JBSW Y3DP EHPK 3PXP");
  const html = renderToStaticMarkup(
    <QrBlock
      qr={<svg aria-label="QR" />}
      instruction="Scan this."
      keyIntro="Can't scan?"
      secret="JBSWY3DP"
      keyLabel="Key"
      copyLabel="Copy"
      note="Any app works."
    />,
  );
  expect(html).toContain('<svg aria-label="QR">');
  expect(html).toContain(">JBSW Y3DP</code>");
  expect(html).toContain('<p class="enni-qr__note">Any app works.</p>');
});

test("DevicePrompt is a drawing: hidden from a screen reader", () => {
  const html = renderToStaticMarkup(
    <DevicePrompt title="Save a passkey?" detail="you@x" cancel="Cancel" confirm="Continue" />,
  );
  expect(html.startsWith('<div class="enni-device-prompt" aria-hidden="true">')).toBe(true);
  expect(html).not.toContain("<button");
});
