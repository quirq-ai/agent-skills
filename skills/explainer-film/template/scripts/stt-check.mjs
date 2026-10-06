// Hears the narration back: transcribes every line with ElevenLabs speech-to-text and
// lists the words the transcript disagrees with, which is where the voice mispronounced or
// slurred something. A reviewer that cannot listen can still read this.
//
//   node scripts/stt-check.mjs            all lines
//   node scripts/stt-check.mjs 05 13      only these

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as script from "../src/script.mjs";

const { LINES } = script;
// Known-good differences: [written, heard] pairs that are right as spoken (a brand name the
// transcriber spells its own way, "quirq" heard as "quirk"). Listen once before adding one.
const ACCEPT = (script.ACCEPT ?? []).map(([w, h]) => [w.toLowerCase(), h.toLowerCase()]);

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const envFile = path.join(root, ".env");
const env = fs.existsSync(envFile) ? fs.readFileSync(envFile, "utf8") : "";
const KEY = process.env.ELEVENLABS_API_KEY || env.match(/^ELEVENLABS_API_KEY=(.+)$/m)?.[1]?.trim();
if (!KEY) {
  console.error("No ELEVENLABS_API_KEY in .env (run scripts/set-elevenlabs-key.sh)");
  process.exit(1);
}
const only = process.argv.slice(2);
const ids = Object.keys(LINES).filter((id) => !only.length || only.includes(id));
// Number words become digits on both sides ("thirty" and "30" match): the transcriber
// writes digits.
const UNITS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
function numbers(words) {
  const out = [];
  for (let i = 0; i < words.length; i++) {
    const w = words[i], u = UNITS.indexOf(w), t = TENS.indexOf(w);
    if (t > 1) {
      const next = UNITS.indexOf(words[i + 1] ?? "");
      if (next > 0 && next < 10) { out.push(String(t * 10 + next)); i++; } else out.push(String(t * 10));
    } else if (u >= 0) out.push(String(u));
    else out.push(w);
  }
  return out;
}
const norm = (s) => numbers(s.toLowerCase().replace(/(\d),(\d)/g, "$1$2").replace(/-/g, " ").replace(/[^a-z0-9' ]+/g, " ").split(/\s+/).filter(Boolean));
const accepted = (d) => ACCEPT.some(([w, h]) => w === d.said && h === d.heard);

async function transcribe(file) {
  const form = new FormData();
  form.append("model_id", "scribe_v1");
  form.append("language_code", "en");
  form.append("tag_audio_events", "false");
  form.append("file", new Blob([fs.readFileSync(file)], { type: "audio/mpeg" }), path.basename(file));
  const res = await fetch("https://api.elevenlabs.io/v1/speech-to-text", { method: "POST", headers: { "xi-api-key": KEY }, body: form });
  if (!res.ok) throw new Error(`${res.status} ${(await res.text()).slice(0, 200)}`);
  return (await res.json()).text;
}

// Word-level diff (LCS) between what was written and what was heard.
function diff(a, b) {
  const m = a.length, n = b.length, L = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) for (let j = n - 1; j >= 0; j--) L[i][j] = a[i] === b[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  const out = [];
  let i = 0, j = 0, said = [], heard = [];
  const flush = () => {
    if (said.length || heard.length) out.push({ said: said.join(" "), heard: heard.join(" ") });
    said = [];
    heard = [];
  };
  while (i < m && j < n) {
    if (a[i] === b[j]) { flush(); i++; j++; }
    else if (L[i + 1][j] >= L[i][j + 1]) said.push(a[i++]);
    else heard.push(b[j++]);
  }
  while (i < m) said.push(a[i++]);
  while (j < n) heard.push(b[j++]);
  flush();
  return out;
}

const report = {};
await Promise.all(ids.map(async (id) => {
  const heard = await transcribe(path.join(root, "assets/audio/vo", `${id}.mp3`));
  report[id] = { heard, diffs: diff(norm(LINES[id]), norm(heard)).filter((d) => !accepted(d)) };
}));
for (const id of ids) {
  const r = report[id];
  console.log(`${id}  ${r.diffs.length ? r.diffs.map((d) => `"${d.said}" heard as "${d.heard}"`).join("; ") : "clean"}`);
}
const dirty = ids.filter((id) => report[id].diffs.length);
console.log(dirty.length ? `${dirty.length} line(s) to fix: respell in SAY and re-take, or listen and add a known-good pair to ACCEPT` : "all clean");
fs.mkdirSync(path.join(root, ".hyperframes"), { recursive: true });
fs.writeFileSync(path.join(root, ".hyperframes/stt-report.json"), JSON.stringify(report, null, 2));
