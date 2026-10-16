/**
 * The landing's motion, on the primitives (enni-v2 #637, v0.6.1): what moves, moves on its spring
 * (`EASE.spring`, on `motion-spring` or `motion-spring-long`); what changes colour eases on
 * `motion-quick`. Part of `MOTION_CSS`, so it comes last and extends the rules before it.
 *
 * - **A button grows a little under a pointer and gives under a press**, its arrow steps forward,
 *   and the primary's sheen crosses it. A pill and the code panel's copy button do the same, less.
 * - **An interactive card lifts and grows** on the long spring, and gives under a press.
 * - **The brand's tile turns**, a disclosure's chevron and a question's `+` turn, a switch's thumb
 *   slides, a field's tick grows in, a meter's bar fills — each on the spring.
 * - **A chosen tab's panel, the reading line and an arriving answer's parts** rise in.
 *
 * **Where less motion is asked for, all of it is still.** Every duration is a `MOTION` token, which
 * `TOKENS_CSS` zeroes; and here, past that, nothing is scaled, lifted, turned or looped, so a reader
 * who asked for stillness sees each state as it ends, never on its way.
 */

const quick = (properties: readonly string[]): string =>
  properties
    .map((property) => `${property} var(--enni-motion-quick) var(--enni-ease-standard)`)
    .join(", ");
const sprung = (property: string, long = false): string =>
  `${property} var(--enni-motion-spring${long ? "-long" : ""}) var(--enni-ease-spring)`;

const SPRUNG = `
.enni-button:not([disabled]):hover { transform: scale(1.03); }
.enni-button__arrow { transition: ${sprung("translate")}; }
.enni-button:not([disabled]):hover .enni-button__arrow { translate: 4px 0; }
.enni-button--primary::after { transition: translate var(--enni-motion-spring-long) var(--enni-ease-out); }
.enni-pill, .enni-copy, .enni-tab { transition: ${quick(["background", "border-color", "color", "box-shadow"])}, ${sprung("transform")}; }
a.enni-pill:hover { transform: scale(1.02); }
.enni-copy:hover { transform: scale(1.05); }
.enni-segmented button:active { transform: scale(0.94); }
.enni-toggle:active { transform: scale(0.985); }
.enni-toggle__switch { transition: ${quick(["background"])}; }
.enni-toggle__switch::after { transition: ${sprung("transform")}; }
.enni-card--interactive { cursor: pointer; transition: ${quick(["border-color", "box-shadow"])}, ${sprung("transform", true)}; }
.enni-card--interactive:hover { border-color: var(--enni-line-strong); box-shadow: var(--enni-shadow-card); transform: translateY(-4px) scale(1.012); }
.enni-card--interactive:active { transform: scale(0.975); transition-duration: var(--enni-motion-quick); }
.enni-brand__tile { transition: ${sprung("rotate", true)}; }
a.enni-brand:hover > .enni-brand__tile { rotate: -8deg; }
.enni-details > summary .enni-icon, .enni-sources > summary .enni-icon { transition: ${sprung("transform")}; }
.enni-faq summary { transition: ${quick(["color"])}; }
.enni-faq summary::after { transition: ${sprung("rotate")}; }
.enni-field :is(input, textarea, select), .enni-action-field__box { transition: ${quick(["border-color", "box-shadow"])}; }
.enni-field__tick { transition: ${quick(["opacity"])}, ${sprung("scale")}; }
.enni-meter__fill { transition: ${sprung("width", true)}; }
`;

const OPENING = `
@supports (interpolate-size: allow-keywords) {
  .enni-faq details { interpolate-size: allow-keywords; }
  .enni-faq details::details-content { block-size: 0; overflow: clip; transition: block-size var(--enni-motion-spring) var(--enni-ease-out), content-visibility var(--enni-motion-spring) allow-discrete; }
  .enni-faq details[open]::details-content { block-size: auto; }
}
`;

/** How many of an arriving answer's parts rise one after another; the rest come with the last. */
const PARTS = 6;

const arriving = (): string =>
  Array.from({ length: PARTS }, (_, index) => {
    const nth = index === PARTS - 1 ? `n + ${index + 1}` : `${index + 1}`;
    return `.enni-answer-card--arriving .enni-answer-card__body > :nth-child(${nth}) { animation-delay: calc(var(--enni-motion-stagger) * ${index * 3}); }`;
  }).join("\n");

const ARRIVING = `
@keyframes enni-fade { from { opacity: 0; translate: 0 6px; } to { opacity: 1; translate: 0 0; } }
.enni-tab-panel:not([hidden]), .enni-thinking { animation: enni-fade var(--enni-motion-enter) var(--enni-ease-out) both; }
.enni-answer-card--arriving .enni-answer-card__body > * { animation: enni-rise var(--enni-motion-spring) var(--enni-ease-out) both; }
${arriving()}
`;

const STILL = `
@media (prefers-reduced-motion: reduce) {
  .enni-button:not([disabled]):hover, .enni-button:not([disabled]):active, .enni-chip:active, a.enni-pill:hover, .enni-copy:hover, .enni-segmented button:active, .enni-toggle:active, .enni-talk:not([disabled]):active, .enni-composer__send:not([disabled]):active, .enni-card--interactive:hover, .enni-card--interactive:active { transform: none; }
  .enni-button:not([disabled]):hover .enni-button__arrow { translate: none; }
  a.enni-brand:hover > .enni-brand__tile { rotate: none; }
  .enni-button--primary::after { display: none; }
  .enni-badge__dot, .enni-button--glow, .enni-spin, .enni-tab-panel:not([hidden]), .enni-thinking, .enni-rise, .enni-stagger > *, .enni-answer-card--arriving .enni-answer-card__body > *, .enni-action-field[data-state="bad"] .enni-action-field__box { animation: none; }
}
`;

/** The springs, the openings, the arrivals and the stillness, in one string `MOTION_CSS` ends with. */
export const SPRING_CSS = [SPRUNG, OPENING, ARRIVING, STILL].join("\n").trim();
