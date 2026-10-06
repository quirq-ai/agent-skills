// Screenshot a built page at given times, in parallel, without HyperFrames:
//   node scripts/frame.mjs <page.html> <t1,t2,...> [outDir] [--sheet sheet.png]
// The page's runtime seeks to ?t= once fonts are ready. Prints the PNG paths.
// With --sheet, also tiles the frames into one contact sheet (needs ffmpeg).

import { execFile, execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chrome, chromeFlags } from "./chrome.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const sheetIdx = args.indexOf("--sheet");
const sheet = sheetIdx >= 0 ? path.resolve(args.splice(sheetIdx, 2)[1]) : null;
const [page, timesArg, outDirArg] = args;
if (!page || !timesArg) {
  console.error("usage: node scripts/frame.mjs <page.html> <t1,t2,...> [outDir] [--sheet sheet.png]");
  process.exit(1);
}
const outDir = path.resolve(outDirArg ?? path.join(root, ".hyperframes/frames"));
fs.mkdirSync(outDir, { recursive: true });
const bin = chrome();
const abs = path.resolve(page);
const name = path.basename(abs, ".html");
const times = timesArg.split(",").map(Number);
const shot = (t) => new Promise((res) => {
  const out = path.join(outDir, `${name}@${t.toFixed(2)}.png`);
  execFile(bin, [...chromeFlags(bin), "--disable-gpu", "--hide-scrollbars", "--allow-file-access-from-files", "--window-size=1920,1080", "--virtual-time-budget=6000", "--run-all-compositor-stages-before-draw", `--user-data-dir=${fs.mkdtempSync(path.join(os.tmpdir(), "fr-"))}`, `--screenshot=${out}`, `file://${abs}?t=${t}`], { timeout: 60000 }, (err, _o, stderr) => {
    if (!fs.existsSync(out)) console.error(`no frame at ${t}s: ${(err?.message ?? "") + stderr.slice(-300)}`);
    res(out);
  });
});
const outs = [];
for (let i = 0; i < times.length; i += 6) outs.push(...(await Promise.all(times.slice(i, i + 6).map(shot))));
const made = outs.filter((o) => fs.existsSync(o));
made.forEach((o) => console.log(o));
if (made.length < outs.length) process.exit(1);
if (sheet && outs.length) {
  const cols = Math.min(3, outs.length), rows = Math.ceil(outs.length / cols);
  const inputs = outs.flatMap((o) => ["-i", o]);
  const scaled = outs.map((_, i) => `[${i}:v]scale=640:-1[v${i}]`).join(";");
  const pad = Array.from({ length: cols * rows - outs.length }, (_, i) => `color=c=#e9e6df:s=640x360:d=1[p${i}]`).join(";");
  const all = [...outs.map((_, i) => `[v${i}]`), ...Array.from({ length: cols * rows - outs.length }, (_, i) => `[p${i}]`)].join("");
  const layout = Array.from({ length: cols * rows }, (_, i) => `${(i % cols) * 640}_${Math.floor(i / cols) * 360}`).join("|");
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...inputs, "-filter_complex", `${scaled}${pad ? ";" + pad : ""};${all}xstack=inputs=${cols * rows}:layout=${layout}`, "-frames:v", "1", sheet]);
  console.log(sheet);
}
