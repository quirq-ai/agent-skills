#!/usr/bin/env bash
# Rebuild the film and lint it. The music bed needs no carve here: bed.mjs bakes its own duck
# under the voice. HyperFrames telemetry stays off.
set -euo pipefail
export HYPERFRAMES_NO_TELEMETRY=1 DO_NOT_TRACK=1
cd "$(dirname "$0")/.."
node src/build.mjs
npm run --silent lint
