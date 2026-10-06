// A contact sheet of a rendered film: one frame every few seconds, tiled three across, so
// you (or a reviewer that cannot watch video) can look at the whole film at once.
//
//   node scripts/contact.mjs <film.mp4> [out.png] [--every 5]
//
// Writes .hyperframes/contact.png by default and prints its path. Read it before calling
// the film done.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const ei = args.indexOf("--every");
const every = ei >= 0 ? Number(args.splice(ei, 2)[1]) : 5;
const [mp4, outArg] = args;
if (!mp4 || !(every > 0)) {
  console.error("usage: node scripts/contact.mjs <film.mp4> [out.png] [--every 5]");
  process.exit(1);
}
const dur = Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mp4], { encoding: "utf8" }).trim());
const n = Math.max(1, Math.floor(dur / every));
const rows = Math.ceil(n / 3);
const out = path.resolve(outArg ?? path.join(root, ".hyperframes/contact.png"));
fs.mkdirSync(path.dirname(out), { recursive: true });
// One frame from the middle of each interval, so no tile lands on a cut.
execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-ss", String(every / 2), "-i", mp4, "-vf", `fps=1/${every},scale=640:-1,tile=3x${rows}:padding=4:color=black`, "-frames:v", "1", out]);
console.log(`${out}  (${n} frames, one every ${every}s of ${dur.toFixed(1)}s)`);
