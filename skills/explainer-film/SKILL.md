---
name: explainer-film
description: Make a narrated explainer film (1 to 3 minutes, 1080p MP4 with captions) for a product, repo or feature from one prompt, in the engraved-plate style of the Innernet field guide and quirq infra films. Use when asked for an explainer video, a product walkthrough film, "a video like the Innernet one" or "a film like the quirq infra one".
---

# Explainer film

This skill turns one prompt ("make an explainer film for X") into a finished film: a calm
narrator, engraved diagrams that draw themselves on as the narrator names them, real product screens,
a running HUD, chapter cards, a music bed that swells on the turns, burned-in captions, and
a web copy with WebVTT captions and a poster.

It is the Innernet field guide film (quirq-ai/innernet, `film/`) made reusable. The engine
from that film is in `template/`; the craft lessons are in `references/craft.md`; the
reference film's brief, storyboard, script and scenes are in `references/examples/innernet/`.
`references/examples/quirq-infra/` is a second film made with the same engine in the quirq
brand, with its script, plates and scenes.

The template has two looks, picked by `THEME` in `src/film.mjs`: `quirq` (the default: the
quirq infra film's dark ground, pink accent and Poppins) and `paper` (the Innernet film's
warm paper and serif faces). Keep `quirq` for quirq products; for anyone else's product use
whichever sits closer to its brand and take `PALETTE` from its design tokens. For the logo,
put the product's one-colour wordmark SVG at `assets/brand/wordmark.svg` (for quirq, innernet's
`public/brand/quirq/wordmark.svg`) and inline it with `ctx.wordmark()`.

## What you need

- Node 22+, `ffmpeg` and `ffprobe`, `curl`, and a headless Chrome. Set `CHROME` for the
  capture and frame scripts. If you set `HYPERFRAMES_BROWSER_PATH`, point it at
  chrome-headless-shell (for Playwright's, `chromium_headless_shell-*/chrome-linux/headless_shell`),
  not full Chrome, which renders noticeably slower (roughly 35 to 45% slower in our runs).
  Unset, the HyperFrames CLI downloads its own browser on first render.
- HyperFrames 0.8.111, installed by `npm install` and run through the `npm run` scripts
  (`lint`, `check`, `render`), which pin it so renders repeat and set
  `HYPERFRAMES_NO_TELEMETRY=1 DO_NOT_TRACK=1` so the CLI sends no usage data. Calling it
  directly, use `npx hyperframes@0.8.111` with both variables exported. The engine emits a
  HyperFrames composition; where HyperFrames' own guidance (in the film's `AGENTS.md`)
  disagrees with this skill, this skill wins: keep the pin (ignore "bump it" notices from
  `check`), skip its usage check and intent interview, and follow `src/ENGINE.md` for scenes.
- Network: a run contacts `registry.npmjs.org` (install), `api.elevenlabs.io` (voice, music,
  sound marks, the hearing check) and the product's own URL for captures. It never publishes
  anything.
- An ElevenLabs API key for the voice, music and any new sound marks. If
  `ELEVENLABS_API_KEY` is already in the environment, the scripts use it. Otherwise the
  requester runs `./scripts/set-elevenlabs-key.sh` in the film folder; it saves the key to
  `.env` without echoing it. If ElevenLabs calls fail behind a proxy, try
  `export NODE_USE_ENV_PROXY=1` so Node's `fetch` uses the proxy (untested here: the
  2026-10-06 test run did not need it). Never print, log or commit the key.
  Without a key, build the whole film on placeholder timings (4 s a line) and stop before
  the voice, saying exactly what is missing.

## Defaults when the prompt is short

Take what the prompt says; for everything else use these and list them in the brief:
1920x1080, English, about 2 to 3 minutes, three chapters of about 40 seconds between an open
and a close, the voice Lily, the film embedded at the top of the product's docs or guide.

**Size the script before you spend voice credits.** Lily at speed 0.96 reads about 2.3
words a second. A frame adds about 1.2 s of lead-in and breath around its line, and a
chapter card is 2.6 s of silence. So a film's length is roughly
`words / 2.3 + 1.2 * frames + 2.6 * cards`.

| Length | Shape |
| --- | --- |
| about 60 s | open, one chapter card, 4 to 6 frames, close; about 110 words in all |
| about 90 s | open, two chapters, 8 to 10 frames, close |
| 2 to 3 min | open, three chapters, 12 to 16 frames, close (the reference film) |

**When the product is early** (a scaffold, a plan, few real screens), say so on screen. Film
the plan as plates and label them as the plan ("FIG. 2 · THE PLAN"). Show the real current
screen as it is, even when it is empty. Never mock a future UI. Give the HUD counter a
number that really changes, or set `HUD.counter: false`.

## The run

Work in a new folder next to the product (Innernet used `film/` in the app's repo):
`cp -R <this skill>/template <film-dir> && cd <film-dir> && npm install`. If the product's
repo must stay untouched, put the film folder elsewhere and run the product from a scratch
copy (`git archive HEAD | tar -x -C <scratch>`), since installing and building it writes
into the tree.

The template ships a four-frame starter film (three scenes and a chapter card) so it builds out of the box. Before writing your
own frames, delete its scenes (`src/scenes/*.mjs`) and its plate (`assets/plates/example.svg`,
keep `assets/plates/src/example.mjs` as the pattern), because a leftover `03-the-idea.mjs`
silently attaches to whatever your frame 03 is. Then:

1. **Read the product.** Its README, docs, DESIGN.md or brand tokens, and the code paths
   behind each claim you might make. When the product has a deployed URL (the README, the
   repo's homepage or `package.json` `homepage`, or what the requester gave), capture that;
   otherwise run it if you can. Capture real screens at 2x with
   `node scripts/capture.mjs <url> <name>` (writes `assets/captures/<name>@2x.png` and a 1x
   copy). Never mock the product's UI. If no screen can be had (the URL is unreachable and the
   product will not run), say so in the brief, film real artefacts instead (its config, its
   repo list, a real file as a card) alongside the plates, and tell the requester the film
   has no product screen and why.
2. **Brief.** Fill `BRIEF.md`: the one-sentence message, audience, chapters, the
   requester's words verbatim, and the defaults you chose.
3. **Facts.** Fill `FACTS.md`: every number, name, path and claim the film could use, each
   with where you checked it (`path:line`, a command and its output). The script and every
   label are checked against this file, never against memory. A count that can drift
   (repos, users, versions): take it from the live source on the day where you can, record
   the date next to it, and keep the source's qualifiers ("most", "about"). If you cannot
   re-check it, say "as of <date>" or round it ("about thirty").
4. **Storyboard.** Write `STORYBOARD.md`, one block per frame (scene, duration, line, what
   moves on which word, what the frame must not be), and fill `src/film.mjs` (brand,
   theme and palette, HUD devices, chapters, frames). If the requester is
   around, show them the plan before building scenes; otherwise go on and say so.
5. **Script and voice.** Write `src/script.mjs`: one line per frame, short, specific, never
   reading the screen aloud. Render it (`node scripts/voice.mjs`), then hear it back
   (`node scripts/stt-check.mjs`). Every word reported wrong gets a `SAY` respelling and a
   re-take until the check is clean. Number words up to ninety-nine and digits already
   match (larger numbers, ordinals and percent may still show as diffs). A brand that
   is right as spoken but spelled differently by the transcriber ("quirq" heard as
   "quirk") goes in `ACCEPT` once the respelling is in `SAY` (an agent cannot listen, so
   trust the transcript for everything else). `node src/film.mjs` now
   prints real timings.
6. **Plates.** One generator per diagram in `assets/plates/src/` built on `lib.mjs`
   (`example.mjs` is the pattern): five layers (construction, main, detail, accent, labels),
   one labelled idea per plate, the accent on the thing the line names. Check each with
   `node scripts/plate-preview.mjs <id>`.
7. **Scenes.** One module per frame in `src/scenes/`, following `src/ENGINE.md` exactly.
   Preview each with `node src/build.mjs --only NN` and look at it with
   `node scripts/frame.mjs previews/NN.html <start+0.3>,<key word>,<end-0.4> --sheet ...`.
   Read the frames you made; fix what you see before moving on.
8. **Music and sound.** Write the plan in `src/music.mjs` (sections pinned to the cards and
   lines), then `node assets/audio/music/bed.mjs generate` once and `build` after every
   timing change. Repin every chunk's `to` to your own frame ids first: the shipped plan
   points at the starter's frames 02 to 04. Generate the eight sound marks once with
   `node assets/audio/sfx/sfx.mjs generate && node assets/audio/sfx/sfx.mjs build` (eight
   short ElevenLabs calls). An agent cannot listen: check each mark's length and level
   (`ffmpeg -i <mark>.mp3 -af volumedetect -f null -`) and regenerate any that is silent,
   clipped or far off its neighbours (the header of `sfx.mjs` says how). Add a mark only when a scene needs one.
9. **Gate.** `./scripts/finish.sh` then `npm run check` (runtime, layout, motion, contrast)
   must pass with 0 errors. Lint warnings are expected because the engine writes one
   generated composition on purpose: one `nested_structure_needs_subcomposition` per scene,
   plus a few about file size, track density, and a capture used twice
   (`duplicate_media_discovery_risk`). Errors are not. The
   common ones and their fixes are in `src/ENGINE.md` under "When the gate fails".
10. **Render and deliver.** `npm run render -- --quality delivery -o renders/master.mp4`,
    then `node scripts/deliver.mjs renders/master.mp4 --to <folder>`
    for the web copy, captions and poster. Commit the film's sources, never `renders/`,
    `previews/`, `.env` or `node_modules/`.

A delivery render is slow. Measured in 4-vCPU Linux containers with a software GPU and
HyperFrames 0.8.111: chrome-headless-shell uses BeginFrame capture, 2.3 to 2.6 frames a second
on the starter film's 630 frames, so a 60 s film takes about 12 to 13 minutes and a heavier
film longer; full Chrome falls back to screenshot capture, 1.4 to 1.7 frames a second on the
starter and 1.3 on a real 63.5 s film (25 minutes). Start the render in the background with its output going to a log, and
keep working. It is finished when the process exits 0; its closing summary names the MP4 and
the capture path it used ("beginframe capture" or the screenshot fallback). The quality
setting changes the encode, not the frame capture, so no quality is much faster; for a quick look use `frame.mjs` sheets of the built `index.html`.

## Before you call it done

- Every line and label traces to `FACTS.md`; the hearing check is clean.
- The first visible motion is within 0.2 s of every scene's start; every reveal lands on
  the word that names it (`k.word`); every scene settles before its cut.
- No em or en dashes anywhere on screen. No fake UI, decorative glow, gradient text or neon.
- `npm run check` passes, and you have looked at a contact sheet of the whole film
  (`node scripts/contact.mjs renders/master.mp4`, then read the PNG).
- Tell the requester what you assumed, what is illustrative rather than real, and where
  the render and its captions are.

See `references/craft.md` for why each of these rules exists.
