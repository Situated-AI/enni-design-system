# Enni Design System

`@enni/ui`: Enni v2's design tokens and primitives, in their own repository so the product depends
on them by version and the design system grows on its own cadence.

This is [`Situated-AI/enni-v2`](https://github.com/Situated-AI/enni-v2)'s `packages/ui`, moved here
**with its history** — every commit is one that built it there. It holds to the same decisions:

- **Built fresh from `product-spec.md`.** Nothing is imported or copied from Enni v1.
- **A leaf.** It imports no Enni package and carries no product vocabulary, copy or data: the words a
  component shows arrive as props.
- **Plain CSS on custom properties**, no utility framework. Every colour is `var(--enni-…)`, and
  `tokens.ts` is the only file that holds a value.
- **Status is never colour alone.** A mark always renders a glyph and a word.

## Using it

```json
"dependencies": { "@enni/ui": "github:situated-ai/enni-design-system#v0.2.0" }
```

Put the two stylesheets on the page once, in the root layout, then use the components:

```tsx
import { Button, PRIMITIVES_CSS, TOKENS_CSS } from "@enni/ui";

<style>{TOKENS_CSS}</style>
<style>{PRIMITIVES_CSS}</style>
<Button variant="primary">Connect Slack</Button>
```

The package ships TypeScript source (`exports: ./src/index.ts`). A Next app lists it in
`transpilePackages`. Dark mode follows the reader's system preference unless the root element
carries `data-theme="light"` or `"dark"`, and `prefers-reduced-motion` zeroes every duration.

## Motion

`motion-styles.ts` is the last part of `PRIMITIVES_CSS`. Every control eases between its states and
gives under a press; a sheet and a dialog fade out as well as in; a disclosure opens over its own
height where the browser can interpolate to `auto`. Three classes are for screens to use:

| Class | What it does |
|---|---|
| `enni-rise` | The element arrives: a short rise and fade, on `motion-enter`. |
| `enni-stagger` | Its children arrive one after another, `motion-stagger` apart. |
| `enni-card--interactive` | A card that is a target: it lifts on hover and settles on press. |

`<Skeleton label="Loading" />` holds the space of content that is still being fetched.

## What's in it

Every component takes its words as props. Generated from `src/index.ts`, by module:

| Module | Exports |
|---|---|
| `answer-card` | `AnswerActions`, `AnswerCard`, `AnswerPair`, `AnswerSection`, `Citation`, `Segmented` |
| `account-flow` | `AuthCard`, `Notice`, `Steps` |
| `account-inputs` | `ChoiceList`, `CodeInput`, `CodeList`, `CopyField`, `codeDigits`, `DevicePrompt`, `groupCode`, `groupKey`, `QrBlock` |
| `account-settings` | `ActionMenu`, `Dialog`, `orderMenu`, `Row`, `Rows`, `SettingsCard`, `wrapTab` |
| `badge` | `CountBadge`, `StatusBadge` |
| `brand` | `BrandMark`, `BrandTile` |
| `button` | `Button`, `ButtonLink`, `buttonClass`, `Chip`, `SubmitButton`, `SuggestionChip` |
| `confirm` | `ConfirmByTyping`, `ConfirmStep`, `confirmationMatches` |
| `composer` | `Composer`, `TalkButton` |
| `copy-button` | `COPY_WORDS`, `CopyButton`, `copyValue` |
| `disclosure` | `Details`, `Sheet`, `syncDialog` |
| `field` | `describedBy`, `Field` |
| `billing-cards` | `Meter`, `PlanCard`, `SummaryCard`, `SummaryGrid` |
| `billing-choices` | `HostedCardField`, `PackChooser`, `ReceiptRows` |
| `filter` | `Filter` |
| `guided-card` | `Confirmation`, `GuidedCard`, `SegmentedProgress` |
| `guided-inputs` | `AnswerChips`, `InstructionList`, `NewTabLink`, `SecretField`, `takeSecret` |
| `help-card` | `HelpCard` |
| `icon` | `ICONS`, `Icon` |
| `skeleton` | `Skeleton`, `skeletonClass` |
| `status` | `Orb`, `StatusMark`, `TONE_TOKENS` |
| `progress` | `HeardBubble`, `ReadingSteps`, `RefusalCard` |
| `sources` | `DetailsBlock`, `SourceCard`, `SourceList` |
| `styles` | `PRIMITIVES_CSS` |
| `surface` | `Card`, `CheckList`, `Eyebrow` |
| `tally` | `Tally` |
| `time` | `relativeTime`, `ScrollHere`, `Timestamp` |
| `toggle` | `Toggle` |
| `turn` | `ChipRow`, `Hint`, `Turn` |
| `tokens` | `colour`, `DARK`, `EASE`, `FONT`, `LEADING`, `LIGHT`, `MEASURE`, `MOTION`, `ORB`, `RADIUS`, `SHADOW_DARK`, `SHADOW_LIGHT`, `SPACE`, `TOKENS_CSS`, `TRACKING`, `TYPE` |

## Guardrails

The same ceilings as enni-v2, read from `guardrails.toml` and enforced by `bun run guardrails` as
part of `bun test`:

- a file is at most 300 lines, and a function at most 50;
- every module under `src/` and `scripts/` has a sibling `*.test.ts(x)`;
- `src/index.test.ts` pins the exported surface, so a new export is a decision, not a side effect.

## Releasing

A release is a tag (`v0.2.0`). enni-v2 pins one in its `package.json`; moving it is a reviewed PR
there, whose screenshot tests show what the new version changed.

## Development

Uses Bun 1.3.13, pinned in `.tool-versions` (`mise install`).

```bash
bun install
bun test
bun run typecheck
bun run lint
```
