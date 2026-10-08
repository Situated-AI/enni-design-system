/**
 * `@enni/ui` — design tokens and primitives (#61, D-55, D-114).
 *
 * `architecture-plan.md`: *"`ui` sits beside the chain and imports nothing of ours."* That is what
 * lets `apps/web` depend on it under D-20: it carries no vocabulary, no copy and no data — only how
 * things look and behave — so it cannot become a second path to `@enni/core`. The dependency gate
 * holds it to that (`checkLeafAllowance`), and `index.test.ts` pins this surface.
 */
export {
  AnswerActions,
  AnswerCard,
  AnswerPair,
  AnswerSection,
  Citation,
  Segmented,
  type SegmentedOption,
} from "./answer-card.tsx";
export { AuthCard, Notice, Steps } from "./account-flow.tsx";
export {
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
export {
  ActionMenu,
  Dialog,
  type MenuItem,
  orderMenu,
  Row,
  Rows,
  SettingsCard,
  wrapTab,
} from "./account-settings.tsx";
export { CountBadge, StatusBadge } from "./badge.tsx";
export { Tally, type TallyPart } from "./tally.tsx";
export {
  type CheckGroup,
  CheckGroups,
  type CheckRow,
  type CheckRowAction,
} from "./check-groups.tsx";
export { BrandMark, BrandTile } from "./brand.tsx";
export {
  Button,
  ButtonLink,
  type ButtonSize,
  type ButtonVariant,
  buttonClass,
  Chip,
  SubmitButton,
  SuggestionChip,
} from "./button.tsx";
export { CloseButton } from "./close-button.tsx";
export { ConfirmByTyping, ConfirmStep, confirmationMatches } from "./confirm.tsx";
export { Composer, TalkButton } from "./composer.tsx";
export { COPY_WORDS, CopyButton, type CopyState, copyValue } from "./copy-button.tsx";
export { Details, Sheet, syncDialog } from "./disclosure.tsx";
export { describedBy, Field } from "./field.tsx";
export { Meter, PlanCard, SummaryCard, SummaryGrid } from "./billing-cards.tsx";
export {
  HostedCardField,
  type Pack,
  PackChooser,
  type Receipt,
  ReceiptRows,
} from "./billing-choices.tsx";
export { Filter } from "./filter.tsx";
export { Confirmation, GuidedCard, SegmentedProgress } from "./guided-card.tsx";
export {
  type Answer,
  AnswerChips,
  type Instruction,
  InstructionList,
  NewTabLink,
  SecretField,
  takeSecret,
} from "./guided-inputs.tsx";
export { HelpCard, type HelpRow } from "./help-card.tsx";
export { ICONS, Icon, type IconName } from "./icon.tsx";
export { MARKS, type MarkName } from "./icon-marks.ts";
export { Skeleton, skeletonClass } from "./skeleton.tsx";
export { type Mark, Orb, type OrbSize, StatusMark, TONE_TOKENS, type Tone } from "./status.tsx";
export { HeardBubble, ReadingSteps, RefusalCard, type StepState } from "./progress.tsx";
export { DetailsBlock, SourceCard, SourceList } from "./sources.tsx";
export { PRIMITIVES_CSS } from "./styles.ts";
export { Card, CheckList, Eyebrow } from "./surface.tsx";
export { relativeTime, ScrollHere, Timestamp } from "./time.tsx";
export { Toggle } from "./toggle.tsx";
export { ChipRow, Hint, Turn } from "./turn.tsx";
export {
  type ColourToken,
  colour,
  DARK,
  EASE,
  type Elevation,
  FONT,
  LEADING,
  LIGHT,
  CONTROL,
  MEASURE,
  MOTION,
  ORB,
  type Palette,
  RADIUS,
  SHADOW_DARK,
  SHADOW_LIGHT,
  SPACE,
  TOKENS_CSS,
  TRACKING,
  TYPE,
} from "./tokens.ts";
