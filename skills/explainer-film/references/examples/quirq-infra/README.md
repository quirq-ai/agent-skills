# Second reference: the quirq infra field guide

A 3:02 explainer for quirq infra (qq), the org's CI/CD system, made with this engine on
2026-10-05 and narrated by Lily over an ElevenLabs bed. It is the film the quirq team asked
to be made reusable. Where the Innernet film is a paper field guide, this one wears the quirq
brand: plum-black ground, a pink accent that turns amber in chapter III ("where we are,
version zero, honestly"), Poppins, Inter and JetBrains Mono, and the quirq wordmark.

| File | Read it for |
| --- | --- |
| `script.mjs` | 15 lines, and the `SAY` respellings for qq, quirq, innernet and xo-space |
| `film.mjs` | 18 frames in three chapters, HUD counters that change with the story |
| `plates.mjs` | six plates for a system diagram film (presubmit, queue, lkgr, channels, gardener, map), drawn at 1700x730 to sit 1:1 in the scene area rather than the template's 1600x1000 |
| `film.css` | the film's stylesheet: the dark-ground versions of the aurora, vignette, grain, mounts and chapter cards |
| `scenes/02-thirteen-repos.mjs` | a wordmark arriving, then a grid of 13 chips popping in on the word |
| `scenes/04-the-manifest.mjs` | a real config file as a card, a value underlined on its word, generated files appearing |
| `scenes/05-presubmit.mjs` | a plate whose accent arrows run station by station on the words (`_plate.mjs` is its helper) |
| `scenes/16-the-edges.mjs` | an honest ledger of limits, one row per word: how to state what is not done yet |
| `scenes/18-close.mjs` | the close: wordmark, three promises on words, the address, the maker's credit |

These files predate the template's data split, so names differ slightly (its `film.mjs` has
no `BRAND`, `PALETTE` or `HUD`; those lived in `build.mjs` and `runtime.js`). Read them for
their choices, then write the same thing through the template's `src/film.mjs`.

## The quirq brand in the template

To give a new film this look, set these in `src/film.mjs` (taken from the film's runtime and
xo-space's quirq theme):

```js
export const PALETTE = {
  day: { bg: [16, 15, 20], ink: [243, 236, 228], ink2: [208, 195, 204], muted: [177, 162, 180], link: [242, 162, 213], surface: [25, 22, 30] },
  night: { bg: [11, 10, 14], ink: [243, 236, 228], ink2: [208, 195, 204], muted: [177, 162, 180], link: [234, 193, 122], surface: [23, 20, 27] },
};
```

Both palettes are dark, so the night chapter changes only the accent (pink to amber) and
deepens the ground. The palette alone is not enough: the template's `film.css` is tuned for a
paper ground (warm aurora tints, light shadows, grain multiplied in). Take the dark-ground
rules from this folder's `film.css`: the aurora colours and opacity, `#vig`, `#grain` (screen
blend), `.mount` shadows, `.card-ghost`, and the `html, body` background. Then the fonts. The template's `film.css` uses Instrument Serif, Newsreader and Inter;
the quirq film swapped the display and serif faces for Poppins (300 to 600, plus 300
italic), which needs the `@fontsource/poppins` package, its files added to
`scripts/setup.mjs`, and the font names changed in `src/film.css`, `src/build.mjs`,
`scripts/plate-preview.mjs` and the inline `font-family` names in
`assets/plates/src/lib.mjs`. The
wordmark is `public/brand/quirq/wordmark.svg` in quirq-ai/innernet; copy it unchanged.
Check contrast after any palette change (`npm run check`).
