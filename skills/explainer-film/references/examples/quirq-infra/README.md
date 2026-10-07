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

The template's default theme is this film's look: `THEME = "quirq"` in `src/film.mjs` takes
the film's palette (plum-black ground, pink accent, amber in the night chapter) from
`src/themes/index.mjs`, and `src/themes/quirq.css` carries the dark-ground aurora, vignette,
screen-blended grain, mount shadows, chapter-card ghost and Poppins faces. So a new quirq film
needs no CSS work; this folder's `film.css` is the original the theme was taken from. For the
wordmark, copy `public/brand/quirq/wordmark.svg` from quirq-ai/innernet unchanged to
`assets/brand/wordmark.svg`; `ctx.wordmark()` (used by scenes 02 and 18 here) inlines it in the
theme's ink. Check contrast after any palette change (`npm run check`).

## Corrections after the render

The script, film table and plates here were corrected after the film was rendered, so the
rendered film predates them. Canary is described as built and tested for agents and test
environments (people still install from main), the HUD counter reads CANARIES BUILT, the
channels plate says the trial deploy runs on the CI runner, the installer is labelled "main
today, channels later", and agents propose reverts rather than make them.

Some lines still describe v0 goals as if they worked, as of 2026-10-07. The gardener only
reports: its GitHub App does not exist yet, so it proposes no reverts (`script.mjs` frames 10, 12
and 16, and the gardener plate). Release's lkgr and daily canary jobs run on GitHub schedules,
which GitHub delays and sometimes skips. So lkgr does not reliably move every ten minutes (frame 07
and its "EVERY 10 MINUTES" plate), and the canary runs late or not at all on its own; a backstop
routine starts missed canary runs (frame 08). Perf has recorded nothing since 2026-10-05, so it
does not record every commit (frame 11 and its PERF RECORDS counter). Treat this film as an
example of craft, not as a source of facts, and check any claim against the qq guide at
https://docs.quirq.dev/docs/qq before reusing it.
