---
name: explainer-film
description: Make a narrated explainer film (2 to 3 minutes, 1080p MP4 with captions) for a product, repo or feature from one prompt, in the engraved-plate style of the Innernet field guide film. Use when asked for an explainer video, a product walkthrough film, or "a video like the Innernet one".
---

# Explainer film

This skill turns one prompt ("make an explainer film for X") into a finished film: a calm
narrator, engraved diagrams that draw themselves on as the narrator names them, real product screens,
a running HUD, chapter cards, a music bed that swells on the turns, burned-in captions, and
a web copy with WebVTT captions and a poster.

It is the Innernet field guide film (quirq-ai/innernet, `film/`) made reusable. The engine
from that film is in `template/`; the craft lessons are in `references/craft.md`; the
reference film's brief, storyboard, script and scenes are in `references/examples/innernet/`.

## What you need

- Node 22+, `ffmpeg` and `ffprobe`, and a headless Chrome (Playwright's, or set `CHROME`).
- HyperFrames, run through `npx hyperframes@0.8.111` (pinned so renders repeat). Install its
  agent skills once with `npx hyperframes skills update`, then read `/hyperframes` and
  `/general-video` before writing scenes: the engine emits a HyperFrames composition.
- An ElevenLabs API key for the voice, music and any new sound marks. The requester runs
  `./scripts/set-elevenlabs-key.sh` in the film folder; it saves the key to `.env` without
  echoing it. Never print, log or commit the key. Without a key, build the whole film on
  placeholder timings (4 s a line) and stop before the voice, saying exactly what is missing.

## Defaults when the prompt is short

Take what the prompt says; for everything else use these and list them in the brief:
1920x1080, English, about 2 to 3 minutes, three chapters of about 40 seconds between an open
and a close, the voice Lily, the film embedded at the top of the product's docs or guide.

## The run

Work in a new folder next to the product (Innernet used `film/` in the app's repo):
`cp -R <this skill>/template <film-dir> && cd <film-dir> && npm install`. Then:

1. **Read the product.** Its README, docs, DESIGN.md or brand tokens, and the code paths
   behind each claim you might make. Run it if you can, and capture real screens at 2x into
   `assets/captures/`. Never mock the product's UI.
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
   re-take until the check is clean. `node src/film.mjs` now prints real timings.
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
   timing change. The eight sound marks ship ready; add a mark only when a scene needs one.
9. **Gate.** `./scripts/finish.sh` then `npm run check` (runtime, layout, motion, contrast)
   must pass with 0 errors. The six lint warnings about sub-compositions are expected: the
   engine writes one generated composition on purpose.
10. **Render and deliver.** `npx hyperframes@0.8.111 render --quality delivery -o
    renders/master.mp4`, then `node scripts/deliver.mjs renders/master.mp4 --to <folder>`
    for the web copy, captions and poster. Commit the film's sources, never `renders/`,
    `previews/`, `.env` or `node_modules/`.

A delivery render is slow (the 21-second starter takes several minutes on software GPU);
start it in the background and keep working.

## Before you call it done

- Every line and label traces to `FACTS.md`; the hearing check is clean.
- The first visible motion is within 0.2 s of every scene's start; every reveal lands on
  the word that names it (`k.word`); every scene settles before its cut.
- No em or en dashes anywhere on screen. No fake UI, decorative glow, gradient text or neon.
- `npm run check` passes, and you have looked at a contact sheet of the whole film.
- Tell the requester what you assumed, what is illustrative rather than real, and where
  the render and its captions are.

See `references/craft.md` for why each of these rules exists.
