---
name: explainer-film
description: Make a narrated explainer film (1 to 3 minutes, 1080p MP4 with captions) for a product, repo or feature from one prompt, in the engraved-plate style of the Innernet field guide film. Use when asked for an explainer video, a product walkthrough film, or "a video like the Innernet one".
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
brand (dark ground, pink accent, Poppins), with its fact sheet and the palette to reuse.

## What you need

- Node 22+, `ffmpeg` and `ffprobe`, and a headless Chrome (Playwright's, or set `CHROME`).
- HyperFrames, run through `npx hyperframes@0.8.111` (pinned so renders repeat). The engine
  emits a HyperFrames composition. Its agent skills (`npx hyperframes skills update`, which
  installs `/hyperframes`, `/hyperframes-core` and others) are useful reference for the
  composition contract, but this skill wins where they disagree: keep the 0.8.111 pin
  (ignore "bump it" notices from `check`), skip their usage check and intent interview, and
  follow `src/ENGINE.md` for scenes.
- An ElevenLabs API key for the voice, music and any new sound marks. If
  `ELEVENLABS_API_KEY` is already in the environment, the scripts use it. Otherwise the
  requester runs `./scripts/set-elevenlabs-key.sh` in the film folder; it saves the key to
  `.env` without echoing it. In a sandbox whose Node `fetch` gets 403s from ElevenLabs,
  `export NODE_USE_ENV_PROXY=1` so Node uses the proxy. Never print, log or commit the key. Without a key, build the whole film on
  placeholder timings (4 s a line) and stop before the voice, saying exactly what is missing.

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

The template ships a four-frame starter film so it builds out of the box. Before writing your
own frames, delete its scenes (`src/scenes/*.mjs`) and its plate (`assets/plates/example.svg`,
keep `src/example.mjs` as the pattern), because a leftover `03-the-idea.mjs` silently attaches
to whatever your frame 03 is. Then:

1. **Read the product.** Its README, docs, DESIGN.md or brand tokens, and the code paths
   behind each claim you might make. Run it if you can, and capture real screens at 2x with
   `node scripts/capture.mjs <url> <name>` (writes `assets/captures/<name>@2x.png` and a 1x
   copy). Never mock the product's UI.
2. **Brief.** Fill `BRIEF.md`: the one-sentence message, audience, chapters, the
   requester's words verbatim, and the defaults you chose.
3. **Facts.** Fill `FACTS.md`: every number, name, path and claim the film could use, each
   with where you checked it (`path:line`, a command and its output). The script and every
   label are checked against this file, never against memory.
4. **Storyboard.** Write `STORYBOARD.md`, one block per frame (scene, duration, line, what
   moves on which word, what the frame must not be), and fill `src/film.mjs` (brand,
   palette from the product's tokens, HUD devices, chapters, frames). If the requester is
   around, show them the plan before building scenes; otherwise go on and say so.
5. **Script and voice.** Write `src/script.mjs`: one line per frame, short, specific, never
   reading the screen aloud. Render it (`node scripts/voice.mjs`), then hear it back
   (`node scripts/stt-check.mjs`). Every word reported wrong gets a `SAY` respelling and a
   re-take until the check is clean. Number words and digits already match. A brand that
   is right as spoken but spelled differently by the transcriber ("quirq" heard as
   "quirk") goes in `ACCEPT` after you have listened to it once. `node src/film.mjs` now prints real timings.
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
   points at the starter's frames 02 to 04. The eight sound marks ship ready; add a mark only
   when a scene needs one.
9. **Gate.** `./scripts/finish.sh` then `npm run check` (runtime, layout, motion, contrast)
   must pass with 0 errors. Lint warnings are expected because the engine writes one
   generated composition on purpose: one `nested_structure_needs_subcomposition` per scene,
   plus a few about file size, track density and the audio carve. Errors are not. The
   common ones and their fixes are in `src/ENGINE.md` under "When the gate fails".
10. **Render and deliver.** `npx hyperframes@0.8.111 render --quality delivery -o
    renders/master.mp4`, then `node scripts/deliver.mjs renders/master.mp4 --to <folder>`
    for the web copy, captions and poster. Commit the film's sources, never `renders/`,
    `previews/`, `.env` or `node_modules/`.

A delivery render is slow: about 2 frames a second on a software GPU, so a 60 s film
(1,800 frames) takes about 15 minutes. Start it in the background with its output going to a
log, and keep working. It is finished when the process exits 0 and the log's last line names
the MP4. Use `--quality standard` for a quick review cut.

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
