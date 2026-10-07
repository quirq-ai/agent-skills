// Delivers a rendered film for the web:
//   node scripts/deliver.mjs <render.mp4> [--poster seconds] [--to folder]
// From the delivery-quality master it makes the web copy (H.264 CRF 24, loudness
// normalised to -16 LUFS / -1.5 dBTP), WebVTT captions (from the narration word timings,
// the same phrasing the film shows) and a poster JPEG, all named after BRAND.slug in
// src/film.mjs, in renders/. With --to, all three are also copied into that folder (the
// page that will embed the film).

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BRAND, timing } from "../src/film.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const opt = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args.splice(i, 2)[1] : undefined;
};
const posterArg = opt("--poster");
const to = opt("--to");
const [mp4Arg] = args;
if (!mp4Arg) {
  console.error("usage: node scripts/deliver.mjs <render.mp4> [--poster seconds] [--to folder]");
  process.exit(1);
}
const slug = BRAND.slug;
const renders = path.join(root, "renders");
fs.mkdirSync(renders, { recursive: true });
const master = path.resolve(mp4Arg);
const mp4 = path.join(renders, `${slug}-1080p.mp4`);
execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", master, "-c:v", "libx264", "-preset", "slow", "-crf", "24", "-tune", "film", "-pix_fmt", "yuv420p", "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "48000", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", mp4]);
const { segs, total } = timing();

// Same phrase rules as the runtime's captions.
const phrases = [];
for (const seg of segs) {
  if (!seg.vo) continue;
  let cur = [];
  const flush = () => {
    if (!cur.length) return;
    phrases.push({ start: seg.voStart + cur[0].start - 0.08, end: seg.voStart + cur.at(-1).end + 0.35, text: cur.map((w) => w.text).join(" ") });
    cur = [];
  };
  for (const w of seg.vo.words) {
    cur.push(w);
    if (/[.,:;?!]$/.test(w.text) && cur.length >= 3) flush();
    else if (cur.length >= 8) flush();
  }
  flush();
}
for (let i = 0; i < phrases.length - 1; i++) phrases[i].end = Math.min(phrases[i].end, phrases[i + 1].start);
const ts = (t) => {
  const h = Math.floor(t / 3600), m = Math.floor((t % 3600) / 60), s = t % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${s.toFixed(3).padStart(6, "0")}`;
};
const vtt = "WEBVTT\n\n" + phrases.map((p, i) => `${i + 1}\n${ts(Math.max(0, p.start))} --> ${ts(p.end)}\n${p.text}\n`).join("\n");
const vttFile = path.join(renders, `${slug}.vtt`);
fs.writeFileSync(vttFile, vtt);

// Default poster: most of the way into the first plate scene, else a third of the way in.
const firstPlate = segs.find((s) => s.plate);
const posterAt = Number(posterArg ?? (firstPlate ? firstPlate.start + firstPlate.dur * 0.6 : total / 3).toFixed(2));
const poster = path.join(renders, `${slug}-poster.jpg`);
execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-ss", String(posterAt), "-i", mp4, "-frames:v", "1", "-q:v", "2", poster]);

const mb = (f) => (fs.statSync(f).size / 1048576).toFixed(1) + " MB";
console.log(`web copy: ${path.relative(root, mp4)} (${mb(mp4)})`);
console.log(`captions: ${phrases.length} cues -> ${path.relative(root, vttFile)}`);
console.log(`poster at ${posterAt}s -> ${path.relative(root, poster)}`);
if (to) {
  const dir = path.resolve(to);
  fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(mp4, path.join(dir, `${slug}.mp4`));
  fs.copyFileSync(vttFile, path.join(dir, `${slug}.vtt`));
  fs.copyFileSync(poster, path.join(dir, `${slug}-poster.jpg`));
  console.log(`copied ${slug}.mp4, ${slug}.vtt, ${slug}-poster.jpg -> ${dir}`);
}
