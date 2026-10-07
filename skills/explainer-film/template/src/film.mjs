// Film data and timing: the one file that says what this film is. Scene length comes from
// the real narration (assets/audio/vo/meta.json): a short lead-in, the line, a breath.
// Chapter cards are silent. Before the voice exists every line counts as 4 seconds.
//
//   node src/film.mjs        print the frame table with absolute times

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { THEMES } from "./themes/index.mjs";

export const W = 1920;
export const H = 1080;

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const voFile = path.join(root, "assets/audio/vo/meta.json");
const VO = fs.existsSync(voFile) ? JSON.parse(fs.readFileSync(voFile, "utf8")) : {};

// Who the film is about. `hud` is the top-left HUD line; `slug` names the delivered files.
export const BRAND = {
  hud: "PRODUCT · FIELD GUIDE",
  slug: "product-explainer",
};

// The look: "quirq" (dark ground, pink accent, Poppins) or "paper" (the Innernet field
// guide). See src/themes/index.mjs. PALETTE holds the day and night colours (RGB) the runtime
// blends between; the night chapter falls at dusk and the close returns at dawn. To match a
// product's own design tokens, replace PALETTE with them (`link` is the one saturated accent).
export const THEME = "quirq";
export const PALETTE = THEMES[THEME].palette;

// The HUD's top-right devices. `counter: true` shows a running index (each frame's
// `counter: [LABEL, value]`). `badge` is an optional pill under it that carries the film's
// through-line for its whole length (Innernet's was LOCAL · 0 B SENT with a padlock);
// `null` hides it.
export const HUD = {
  counter: true,
  badge: null, // e.g. { parts: ["LOCAL", "0 B", "SENT"], lock: true }
};

// Chapter 0 is the open and the last chapter is the close. `word` labels the ruler station
// and the card; `theme: "night"` on one chapter makes the dusk and dawn turns.
export const CHAPTERS = [
  { n: 0, roman: "", word: "~/start", theme: "paper" },
  { n: 1, roman: "I", word: "How it works", gloss: "one line on what this chapter shows", theme: "paper" },
  { n: 2, roman: "", word: "fin", theme: "paper" },
];

// One entry per frame, in order. card: a silent chapter card (built by the engine).
// plate: the engraved plate the scene draws on (assets/plates/<id>.svg). fig: plate number.
// counter: the HUD running index. lead / tail / hold tune the pauses around the line.
// pencil: false drops the pencil mark the engine plays at the start of a plate scene.
export const FRAMES = [
  { id: "01", name: "Open", ch: 0, counter: ["THINGS", 1200], lead: 0.7 },
  { id: "02", name: "Chapter I", ch: 1, card: true },
  { id: "03", name: "The idea", ch: 1, plate: "example", fig: 1, counter: ["THINGS", 1200], lead: 0.6 },
  { id: "04", name: "Close", ch: 2, counter: ["THINGS", 1201], lead: 1.0, hold: 2.0 },
];

// The cut into a frame, by frame id. Default is "chroma" (a chromatic spike). Others:
// "whip" (a stronger spike), "pan" (a camera move across one sheet), "cross" (a soft
// flicker), "dusk" / "dawn" (the night turns). Cards that stay on paper enter on a light leak.
export const SEAMS = {};

export const CARD_DUR = 2.6;
const LEAD = 0.45; // silence before the line starts
const TAIL = 0.7; // breath after it ends

export function timing() {
  let t = 0;
  const segs = FRAMES.map((f) => {
    const vo = VO[f.id] ?? null;
    const lead = f.card ? 0 : f.lead ?? LEAD;
    const dur = f.card ? CARD_DUR : +(lead + (vo?.duration ?? 4) + (f.tail ?? TAIL) + (f.hold ?? 0)).toFixed(3);
    const seg = {
      ...f,
      theme: CHAPTERS[f.ch].theme,
      start: +t.toFixed(3),
      dur,
      voStart: vo ? +(t + lead).toFixed(3) : null,
      vo: vo ? { text: vo.text, file: vo.file, duration: vo.duration, words: vo.words } : null,
    };
    t += dur;
    return seg;
  });
  return { segs, total: +t.toFixed(3) };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const { segs, total } = timing();
  const fmt = (s) => `${Math.floor(s / 60)}:${(s % 60).toFixed(1).padStart(4, "0")}`;
  for (const s of segs) console.log(`${s.id}  ${fmt(s.start)}  ${s.dur.toFixed(2).padStart(6)}s  ${s.name}${s.vo || s.card ? "" : "  (no voice yet)"}`);
  console.log(`total ${fmt(total)} (${total}s)`);
}
