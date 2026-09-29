/**
 * `@enni/ui` — design tokens and primitives (#61, D-55, D-114).
 *
 * `architecture-plan.md`: *"`ui` sits beside the chain and imports nothing of ours."* That is what
 * lets `apps/web` depend on it under D-20: it carries no vocabulary, no copy and no data — only how
 * things look and behave — so it cannot become a second path to `@enni/core`. The dependency gate
 * holds it to that (`checkLeafAllowance`), and `index.test.ts` pins this surface.
 */
export { Button, type ButtonVariant, buttonClass, Chip, SubmitButton } from "./button.tsx";
export { ConfirmByTyping, ConfirmStep, confirmationMatches } from "./confirm.tsx";
export { COPY_WORDS, CopyButton, type CopyState, copyValue } from "./copy-button.tsx";
export { Details, Sheet, syncDialog } from "./disclosure.tsx";
export { describedBy, Field } from "./field.tsx";
export { type Mark, Orb, StatusMark, TONE_TOKENS, type Tone } from "./status.tsx";
export { PRIMITIVES_CSS } from "./styles.ts";
export { relativeTime, ScrollHere, Timestamp } from "./time.tsx";
export {
  type ColourToken,
  colour,
  DARK,
  FONT,
  LIGHT,
  MEASURE,
  MOTION,
  type Palette,
  RADIUS,
  SPACE,
  TOKENS_CSS,
  TYPE,
} from "./tokens.ts";
