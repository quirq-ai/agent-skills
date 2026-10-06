# Third-party material

The skill's own code and text are Apache-2.0 (the repository's `LICENSE`). It ships no
generated audio or images: everything a film needs from elsewhere is fetched or made at run
time.

| What | Where it comes from | Licence |
| --- | --- | --- |
| HyperFrames' project guidance in `template/AGENTS.md` (below its first section) | written by `hyperframes init` 0.8.111 (HeyGen) | Apache-2.0 |
| HyperFrames CLI | npm, `hyperframes@0.8.111`, installed by `npm install` | Apache-2.0 |
| GSAP | npm, `gsap@3.14.2`, copied into `assets/vendor/` by `scripts/setup.mjs` | GSAP Standard "no charge" licence (https://gsap.com/standard-license) |
| Fonts: Inter, JetBrains Mono, Newsreader, Instrument Serif, Poppins | npm `@fontsource` packages, copied into `assets/fonts/` by `scripts/setup.mjs` | SIL Open Font License 1.1 (each package's `LICENSE`) |
| Film grain `assets/tex/grain.png` | drawn from random noise by `scripts/setup.mjs` with ffmpeg | none (generated) |
| Narration, music bed and sound marks | generated per film with the user's own ElevenLabs key (`scripts/voice.mjs`, `assets/audio/music/bed.mjs`, `assets/audio/sfx/sfx.mjs`) | the user's ElevenLabs terms |
| `references/examples/innernet/` and `references/examples/quirq-infra/` | copies from quirq-ai films (`film/` in quirq-ai/innernet, and the quirq infra film) | Apache-2.0, as this repository |

Product screens a film captures belong to that product; capture only what the requester may
publish. The quirq wordmark is copied from quirq-ai/innernet `public/brand/quirq/` only for
quirq films.
