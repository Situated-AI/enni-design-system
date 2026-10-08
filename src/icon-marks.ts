/**
 * The marks of the apps a product connects (enni-v2 #483): each app's own logo mark, in one colour,
 * where a row or a source card used to carry two letters (`LI`, `GH`, `SL`).
 *
 * **A name here is data, not a word** (D-114): it is the key the caller's connector goes by, so a
 * page maps *source → icon* without this package knowing what any of them is for.
 *
 * **Each is the owner's published geometry, unaltered**: one filled path on its own square box,
 * scaled as a whole and never redrawn, stretched, outlined or recoloured into a brand colour. It is
 * drawn in `currentColor`, which the stylesheet sets to the ink — near-black on a light ground,
 * near-white on a dark one — the one-colour form each owner's guidelines allow for naming an
 * integration. `github` is GitHub's own 16px mark from Octicons (MIT); `linear` is the 24px mark
 * as Simple Icons publishes it (CC0). Both were compared, byte for byte, with those packages.
 * **Slack has none here**: its mark is no longer published there, so its geometry could not be
 * checked against a source, and it is the strictest of the three about one-colour use. The names and marks remain their owners'
 * trademarks. A mark that cannot be drawn this way does not get one: the caller falls back to the
 * neutral `app` icon.
 */
export const MARKS = ["linear", "github"] as const;
export type MarkName = (typeof MARKS)[number];

/** The side of the square box each path was drawn on, and the path. */
export const MARK_PATHS: Readonly<Record<MarkName, { readonly box: number; readonly d: string }>> =
  {
    linear: {
      box: 24,
      d: "M2.886 4.18A11.982 11.982 0 0 1 11.99 0C18.624 0 24 5.376 24 12.009c0 3.64-1.62 6.903-4.18 9.105L2.887 4.18ZM1.817 5.626l16.556 16.556c-.524.33-1.075.62-1.65.866L.951 7.277c.247-.575.537-1.126.866-1.65ZM.322 9.163l14.515 14.515c-.71.172-1.443.282-2.195.322L0 11.358a12 12 0 0 1 .322-2.195Zm-.17 4.862 9.823 9.824a12.02 12.02 0 0 1-9.824-9.824Z",
    },
    github: {
      box: 16,
      d: "M6.766 11.328c-2.063-.25-3.516-1.734-3.516-3.656 0-.781.281-1.625.75-2.188-.203-.515-.172-1.609.063-2.062.625-.078 1.468.25 1.968.703.594-.187 1.219-.281 1.985-.281.765 0 1.39.094 1.953.265.484-.437 1.344-.765 1.969-.687.218.422.25 1.515.046 2.047.5.593.766 1.39.766 2.203 0 1.922-1.453 3.375-3.547 3.64.531.344.89 1.094.89 1.954v1.625c0 .468.391.734.86.547C13.781 14.359 16 11.53 16 8.03 16 3.61 12.406 0 7.984 0 3.563 0 0 3.61 0 8.031a7.88 7.88 0 0 0 5.172 7.422c.422.156.828-.125.828-.547v-1.25c-.219.094-.5.156-.75.156-1.031 0-1.64-.562-2.078-1.609-.172-.422-.36-.672-.719-.719-.187-.015-.25-.093-.25-.187 0-.188.313-.328.625-.328.453 0 .844.281 1.25.86.313.452.64.655 1.031.655s.641-.14 1-.5c.266-.265.47-.5.657-.656",
    },
  };
