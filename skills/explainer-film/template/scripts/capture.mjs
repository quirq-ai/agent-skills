// Captures a real product screen for assets/captures/ with the same headless Chrome the
// frame scripts use. Run the product first (from a scratch copy if its repo must stay
// untouched: git archive HEAD | tar -x -C <dir>).
//
//   node scripts/capture.mjs <url> <name> [--size 1600x1000] [--scale 2] [--wait 4000]
//
// Writes assets/captures/<name>@2x.png at the given scale (3200 px wide by default) and a
// 1x copy, <name>.png. For a dark or light theme, open the URL the product uses for it (a
// query string or a route); the browser starts with no cookies.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chrome, chromeFlags } from "./chrome.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const opt = (name, dflt) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args.splice(i, 2)[1] : dflt;
};
const [w, h] = opt("size", "1600x1000").split("x").map(Number);
const scale = Number(opt("scale", "2"));
const wait = Number(opt("wait", "4000"));
const [url, name] = args;
if (!url || !name || !(w > 0 && h > 0 && scale > 0)) {
  console.error("usage: node scripts/capture.mjs <url> <name> [--size 1600x1000] [--scale 2] [--wait 4000]");
  process.exit(1);
}
const dir = path.join(root, "assets/captures");
fs.mkdirSync(dir, { recursive: true });
const big = path.join(dir, `${name}@${scale}x.png`);
const bin = chrome();
execFileSync(bin, [...chromeFlags(bin), "--disable-gpu", "--hide-scrollbars", `--window-size=${w},${h}`, `--force-device-scale-factor=${scale}`, `--virtual-time-budget=${wait}`, `--user-data-dir=${fs.mkdtempSync(path.join(os.tmpdir(), "cap-"))}`, `--screenshot=${big}`, url], { stdio: "ignore", timeout: 120000 });
if (!fs.existsSync(big)) {
  console.error(`no screenshot written; is ${url} up?`);
  process.exit(1);
}
const small = path.join(dir, `${name}.png`);
execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", big, "-vf", `scale=${w}:-1:flags=lanczos`, small]);
console.log(big);
console.log(small);
