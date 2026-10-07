# Agent notes for this film

This film is built with the explainer-film skill. Its scene contract is `src/ENGINE.md`;
its facts are `FACTS.md`. Everything below is HyperFrames' own project guidance (from
`hyperframes init`), kept because the engine writes a HyperFrames composition.

**Where they disagree, the explainer-film skill wins:** do not start at `/hyperframes` or
route to its workflows, skip its usage check and intent interview, write scenes to
`src/ENGINE.md`, and keep the pinned `hyperframes@0.8.111` (do not run `upgrade`).


## Skills

HyperFrames' own skill router and workflows (`/hyperframes` and the skills it lists) do not
apply here: the explainer-film skill and `src/ENGINE.md` override them, and HyperFrames'
skills should not be installed or refreshed mid-film.

## Commands

```bash
export HYPERFRAMES_NO_TELEMETRY=1 DO_NOT_TRACK=1   # the npm scripts set these; set them for raw npx calls too
npm run dev          # human-operated foreground preview (blocks until stopped)
npx hyperframes@0.8.111 preview --background  # agent-safe persistent Studio preview
npx hyperframes@0.8.111 preview --status      # verify the persistent preview is listening
npx hyperframes@0.8.111 preview --stop        # stop it when review is finished
npm run check        # lint + runtime + layout + motion + contrast (one command)
npm run render       # render to MP4
npm run lint -- --verbose  # include info-level findings
npm run lint -- --json     # machine-readable output for CI
npx hyperframes@0.8.111 docs <topic> # reference docs in terminal
```

> **Agents must use `npx hyperframes@0.8.111 preview --background` for Studio handoff.** Do not rely
> on a shell/tool `run_in_background` wrapper around `npm run dev`: that foreground process
> remains owned by the invoking session and can disappear while the browser stays open,
> leaving refreshes at `ERR_CONNECTION_TIMED_OUT`. Verify with `preview --status`, keep it
> alive through review, and stop it explicitly with `preview --stop` afterward.

> **Pinned CLI version.** The scripts pin `hyperframes@0.8.111` so this film re-renders identically. Keep the pin; do not run `upgrade`.

## Documentation

**For quick reference**, use the local CLI docs command (no network required):

```bash
npx hyperframes@0.8.111 docs <topic>
```

Topics: `data-attributes`, `gsap`, `compositions`, `rendering`, `examples`, `troubleshooting`

**For full documentation**, discover pages via the machine-readable index — do NOT guess URLs:

```
https://hyperframes.heygen.com/llms.txt
```

## Project Structure

- `index.html` — main composition (root timeline)
- `compositions/` — sub-compositions referenced via `data-composition-src`
- `meta.json` — project metadata (id, name)
- `transcript.json` — whisper word-level transcript (if generated)

## Linting — ALWAYS RUN AFTER CHANGES

After creating or editing any `.html` composition, **always** run the full check before considering the task complete:

```bash
npm run check
```

Fix all errors before presenting the result. Warnings should be reviewed before rendering.

## Key Rules

1. Every timed element needs `data-start` and a duration. `data-start` is what marks it as timed; `data-track-index` is an optional Studio display lane the render never reads
2. Give timed visual elements `class="clip"`. The framework keys visibility off `data-start`, not the class, but the shared `.clip` CSS is what gives a scene its full-frame box, and `lint` warns without it
3. Register one paused root timeline per composition on `window.__timelines`:
   ```js
   window.__timelines = window.__timelines || {};
   window.__timelines["composition-id"] = gsap.timeline({ paused: true });
   ```
   Scene timelines manually added to this root must not be paused. A paused
   child does not advance when the root is seeked. The runtime activates
   registered composition siblings, not arbitrary nested scene timelines.
4. A video with sound keeps it on the `<video>` (`data-has-audio="true"`, no `muted`). Use a separate `<audio>` for music, voiceover, replacement audio, J/L cuts, or audio detached in Studio. Silent footage and b-roll: `muted`.
5. Sub-compositions use `data-composition-src="compositions/file.html"` to reference other HTML files
6. Only deterministic logic — no `Date.now()`, no `Math.random()`, no network fetches
