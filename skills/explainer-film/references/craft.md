# Craft: what made the Innernet film work

Each rule here comes from the Innernet field guide film (quirq-ai/innernet, `film/`), its
brief, storyboard and commits. Copies of the brief, storyboard, script, timing and four
scenes are in `examples/innernet/`.

## The idea of the film

- **One message, said by beat 2.** Innernet's: "Your folders are a web of their own."
  The open shows the real thing (the actual folder tree), the second frame lands the value
  claim, and the chapters only deepen it.
- **Three chapters of about 40 seconds**, each opened by a silent 2.6 s card (ghost numeral,
  word, one-line gloss). How it works, how to use it, how to contribute is a shape that fits
  most products.
- **A through-line the viewer can see.** Innernet's promise was privacy, so the HUD carried a
  LOCAL · 0 B SENT badge for the whole film, a padlock clicked shut on the privacy beat, and
  the close repeated it. Use `HUD.badge`, `k.pulseMeter` and `k.lockHud` for the same device.
- **A running index.** The HUD counter (FOLDERS 5,484, then ARTICLES 958) ticked to 959
  when chapter II's demo folder joined the index: a small payoff that proves the demo is real.
- **The close calls back the open.** The tree from frame 1 draws again, lit, under the
  wordmark.

## Truth

- `FACTS.md` is the only source for lines and labels. Innernet's had every number checked
  against the code and the live index on a stated date, with file names for each claim.
- Say what is illustrative. Innernet's demo folder ("tide-pool") was invented; the command
  and its output format were real, and the storyboard said so.
- Real screens only, captured from the running app at 2x and mounted as plates. No fake UI.

## Look

- **Engraved plates in one surveyor frame.** Every diagram is a 1600x1000 line drawing in
  five layers drawn in order: construction, main, detail, accent, labels. Many short paths
  beat one long path, so a layer draws with a visible stagger.
- **One labelled idea per plate.** The two failures the storyboard named: the slideshow
  (every beat a fresh card) and the screensaver (line work that draws but says nothing).
- **One accent colour**, the product's link colour, used for the accent layer, callouts,
  the counter and the ruler head. Everything else is ink on paper.
- **Paper by day, ink at night.** The third chapter falls at dusk and the close returns at
  dawn; the runtime blends every token so no line of type sits on a background of its own
  tone during the turn.
- **Film texture is light:** grain, a faint flicker, a slow aurora, chromatic spikes on cuts.
  Glow is never decoration.
- **No em or en dashes on screen.** No gradient text, no neon, no cyan.
- **Hold one frame.** Innernet's namesakes plate settles and nothing moves for a full second
  while the line lands.

## Motion

- First visible motion within 0.2 s of a scene's start; the hook within 2 seconds of the film.
- Reveals land on the word that names them (`k.word(seg, "secrets")`), so the picture and the
  narration agree to the syllable.
- Every scene settles before it ends; the last 0.3 s is still or a slow drift, because the
  engine cuts with a chromatic spike.
- Only deterministic motion: `fromTo` at absolute times, no `Math.random`, no clocks, no
  infinite repeats. The film must seek to any frame and look the same.

## Voice

- **Pick by ear.** Innernet's brief asked for "soothing pleasing aesthetic appealing voices";
  four samples (River, Lily, George, Brian) were rendered and Lily was chosen.
- **Narration complements the picture.** It says what the screen cannot, and is never a
  reading of the labels.
- **Hear it back.** A reviewer that cannot listen can still read a transcript.
  `stt-check.mjs` transcribes each line and lists the words that came back wrong. Innernet
  needed three respellings ("read me", "Inner-net", "Innerr-pedia": plain "Innerpedia" came
  back as "Inopedia") and one rewrite ("root folder", so it could not be heard as "route").
  Captions keep the written words; only the text sent to the voice changes.
- Scene length follows the real voice: lead-in, line, breath. Retune pauses (`lead`, `tail`,
  `hold`) rather than squeezing the line.

## Sound

- The bed is one composition whose sections are pinned to the film: a swell rises through
  each chapter card and settles as the voice comes in. When the narration changes, `bed.mjs
  build` time-stretches each section so the swells stay on the turns, without a new render.
- The bed is carved for speech (a dip at 1.2 and 2.8 kHz, a 3 dB duck under each line) and
  played at one constant level. Do not add a second duck.
- Sound marks are quiet and few: pencil on plate draws, a bell on cards (tuned to A to sit in
  the bed's key), whoosh on cuts, keys when typing, a tick on the counter, a seal and a lock
  on the promise.

## Delivery

- The gate is `npm run check` (runtime, layout, motion, contrast). Then render at
  delivery quality and make the web copy: H.264 CRF 24, loudness at -16 LUFS, WebVTT
  captions in the film's own phrasing, a poster from a plate frame.
- Sign the film at the close (Innernet ended on "Made by QuirqAI" with the quirq mark).
