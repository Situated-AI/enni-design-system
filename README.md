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
"dependencies": { "@enni/ui": "github:situated-ai/enni-design-system#v0.6.3" }
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

## Colour

Since 0.6.0 the palette is the landing's (enni-v2 D-297, #635), in `palette.ts`: white and slate in
the light, obsidian with hairline lines in the dark, and one violet accent kept for links, focus
and what is selected. The primary button is ink (`--enni-btn`, `--enni-btn-ink`,
`--enni-btn-hover`). `--enni-glow`, `--enni-glass` and `--enni-scrim` stay translucent; a code
block has `--enni-code-bg`, `-ink` and `-dim`. Every ink is held to WCAG AA on the grounds it is
drawn on, in both themes, by `palette.test.ts`.

## Brand

Since 0.6.3 the brand is the operator's new logo, redrawn by hand as SVG in `brand-mark.ts`: the
mark is three isometric layers (lavender, violet, indigo, each overlap a tone of its own) with a
chain of three dots in white rings down the middle, and the wordmark is the four letters as paths,
not a font. Its tones are `BRAND` (`--enni-brand-*`), the same in both themes; the wordmark is
`currentColor`. `BrandMark` (mark and wordmark, the `name` its accessible name), `BrandTile` (the
mark alone) and `BrandLogo` (the lockup as one image) draw it from tokens; `BRAND_MARK_SVG` (the
favicon), `BRAND_ICON_SVG` (the mark on a white rounded tile, for an app icon),
`BRAND_LOGO_SVG` and `BRAND_LOGO_DARK_SVG` are the same geometry as standalone SVG with hex fills
(`srgbHex`), for favicons and OG images.

## Components

Since 0.6.2 the landing's 44px call to action is `lg`, `Faq` takes `defaultOpen` and a `StatusBadge`
may omit its glyph (enni-v2 #640). Since 0.6.1 the landing's components are the primitives (enni-v2 #637), so the landing and the app
share one set: the button (`primary` ink with a sheen, `ghost`, `glow`, `sm`, `arrow`), the card
(`interactive`), the verdict chip (`StatusBadge dot`), `Pill`, `Tag`, the fields (`Field valid`,
`TextareaField`, `SelectField`, `ActionField`), `Faq`, the dark code panel (`CopyField`,
`CodeBlock`, `Terminal`), `Tabs`, `Meter` (`title`, `figure`), `Toggle` (`tone`) and `Toggles`,
`Thinking`, `BrandMark`, and the landing window's answer (`AnswerReasons`, `AnswerWho`,
`AnswerSection boxed`, `AnswerCard arriving`). A code block is dark in both themes (`code-*`).

## Motion

`EASE.spring` is the landing's spring, a `linear()` curve, run on `--enni-motion-spring` (500ms) or
`--enni-motion-spring-long` (800ms); like every duration, reduced motion zeroes both. `spring-styles.ts` puts the landing's springs on
the primitives, and under reduced motion nothing scales, lifts, turns or loops.

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
| `answer-card` | `AnswerActions`, `AnswerCard`, `AnswerPair`, `AnswerReasons`, `AnswerSection`, `AnswerWho`, `Citation`, `Segmented` |
| `account-flow` | `AuthCard`, `Notice`, `Steps` |
| `account-inputs` | `ChoiceList`, `CodeInput`, `CodeList`, `CopyField`, `codeDigits`, `DevicePrompt`, `groupCode`, `groupKey`, `QrBlock` |
| `account-settings` | `ActionMenu`, `Dialog`, `orderMenu`, `Row`, `Rows`, `SettingsCard`, `wrapTab` |
| `badge` | `CountBadge`, `Pill`, `StatusBadge`, `Tag` |
| `brand` | `BrandLogo`, `BrandMark`, `BrandTile` |
| `brand-mark` | `BRAND_ICON_SVG`, `BRAND_LOGO_DARK_SVG`, `BRAND_LOGO_SVG`, `BRAND_MARK_SVG` |
| `check-groups` | `CheckGroups` |
| `button` | `Button`, `ButtonLink`, `buttonClass`, `Chip`, `SubmitButton`, `SuggestionChip` |
| `close-button` | `CloseButton` |
| `code-block` | `CodeBlock`, `Terminal` |
| `confirm` | `ConfirmByTyping`, `ConfirmStep`, `confirmationMatches` |
| `composer` | `Composer`, `TalkButton` |
| `copy-button` | `COPY_WORDS`, `CopyButton`, `copyValue` |
| `disclosure` | `Details`, `Faq`, `Sheet`, `syncDialog` |
| `field` | `ActionField`, `describedBy`, `Field`, `SelectField`, `TextareaField` |
| `billing-cards` | `Meter`, `PlanCard`, `SummaryCard`, `SummaryGrid` |
| `billing-choices` | `HostedCardField`, `PackChooser`, `ReceiptRows` |
| `filter` | `Filter` |
| `guided-card` | `Confirmation`, `GuidedCard`, `SegmentedProgress` |
| `guided-inputs` | `AnswerChips`, `InstructionList`, `NewTabLink`, `SecretField`, `takeSecret` |
| `help-card` | `HelpCard` |
| `icon` | `ICONS`, `Icon` |
| `icon-marks` | `MARKS` |
| `skeleton` | `Skeleton`, `skeletonClass` |
| `status` | `Orb`, `StatusMark`, `TONE_TOKENS` |
| `progress` | `HeardBubble`, `ReadingSteps`, `RefusalCard`, `Thinking` |
| `sources` | `DetailsBlock`, `SourceCard`, `SourceList` |
| `styles` | `PRIMITIVES_CSS` |
| `surface` | `Card`, `CheckList`, `Eyebrow` |
| `tabs` | `moveTab`, `Tabs` |
| `tally` | `Tally` |
| `time` | `relativeTime`, `ScrollHere`, `Timestamp` |
| `toggle` | `Toggle`, `Toggles` |
| `turn` | `ChipRow`, `Hint`, `Turn` |
| `tokens` | `BRAND`, `colour`, `CONTROL`, `DARK`, `EASE`, `FONT`, `LEADING`, `LIGHT`, `MEASURE`, `MOTION`, `ORB`, `RADIUS`, `SHADOW_DARK`, `SHADOW_LIGHT`, `SPACE`, `TOKENS_CSS`, `TRACKING`, `TRANSLUCENT_DARK`, `TRANSLUCENT_LIGHT`, `TYPE` |

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
