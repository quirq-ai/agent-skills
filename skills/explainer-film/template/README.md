# Explainer film

A narrated explainer built as one HyperFrames composition in an engraved-plate style, from
the explainer-film skill. Read `src/ENGINE.md` before writing a scene.

```bash
npm install                     # fonts and GSAP into assets/ (run once)
./scripts/set-elevenlabs-key.sh # saves ELEVENLABS_API_KEY to .env without echoing it
node scripts/voice.mjs          # narration (only changed lines)
node scripts/stt-check.mjs      # hear it back: lists words that came out wrong
node src/film.mjs               # the frame table with real timings
node assets/plates/src/<id>.mjs # engrave a plate
node src/build.mjs --only 03    # preview one scene -> previews/03.html
node scripts/frame.mjs previews/03.html 9,11,12.8 --sheet .hyperframes/s03.png
node assets/audio/music/bed.mjs generate && node assets/audio/music/bed.mjs build
./scripts/finish.sh             # build index.html, carve the bed, lint
npm run check                   # the gate: runtime, layout, motion, contrast
npx hyperframes@0.8.111 render --quality delivery -o renders/master.mp4
node scripts/deliver.mjs renders/master.mp4 --to <page assets folder>
```

| Path | What |
| --- | --- |
| `BRIEF.md`, `STORYBOARD.md` | the brief and the frame plan |
| `FACTS.md` | the verified fact sheet every line and label is checked against |
| `src/film.mjs` | brand, palette, HUD, chapters, frames, seams, timing |
| `src/script.mjs` | the narration, the voice, and `SAY` (pronunciation fixes) |
| `src/music.mjs` | the music plan, pinned to the film's turns |
| `src/scenes/NN-name.mjs` | one module per scene (contract in `src/ENGINE.md`) |
| `src/build.mjs`, `src/runtime.js`, `src/film.css`, `src/geo.js` | the engine |
| `assets/plates/src/` | plate generators (`lib.mjs` is the engraving toolkit) |
| `assets/audio/` | narration, the music bed, sound marks |
| `scripts/` | voice, hearing check, frames, plate preview, finish, deliver |
