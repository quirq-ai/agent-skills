#!/usr/bin/env bash
# Rebuild the film, carve the music bed under the narration, and lint.
# The carve writes onto the bed <audio> in index.html, so it runs after every build. It comes
# from the HyperFrames audio skill (npx hyperframes skills update hyperframes-audio); without
# it the bed plays at its flat mix level, which is fine because bed.mjs bakes its own duck.
set -euo pipefail
cd "$(dirname "$0")/.."
node src/build.mjs
carve="${HYPERFRAMES_SKILLS:-$HOME/.claude/skills}/hyperframes-audio/scripts/carve.mjs"
if [ -f assets/audio/music/bed.mp3 ] && [ -f "$carve" ]; then
  node "$carve" --comp index.html
fi
npx --yes hyperframes@0.8.111 lint
