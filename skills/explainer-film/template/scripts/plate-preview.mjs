// Preview a plate the way the film colours it: the theme's day and night palettes, its fonts
// and its accent.
//
//   node scripts/plate-preview.mjs <id> [out.png]
// Writes a 1600x2000 PNG (day palette on top, night below) and prints its path.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chrome, chromeFlags } from "./chrome.mjs";
import { PALETTE, THEME } from "../src/film.mjs";
import { fontFaces } from "../src/themes/index.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const id = process.argv[2];
if (!id) {
  console.error("usage: node scripts/plate-preview.mjs <id> [out.png]");
  process.exit(1);
}
const svg = fs.readFileSync(path.join(root, "assets/plates", `${id}.svg`), "utf8");
const out = path.resolve(process.argv[3] ?? path.join(root, ".hyperframes/plates", `${id}.png`));
fs.mkdirSync(path.dirname(out), { recursive: true });
const fonts = path.join(root, "assets/fonts");
// The theme's font variables only (its other rules style the film's page, not this sheet).
const theme = [fs.readFileSync(path.join(root, "src/film.css"), "utf8"), fs.readFileSync(path.join(root, `src/themes/${THEME}.css`), "utf8")]
  .flatMap((css) => css.match(/:root\s*\{[^}]*\}/g) ?? [])
  .join("\n");
const c = (k, n) => `rgb(${PALETTE[n][k].join(",")})`;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
${fontFaces(`file://${fonts}`)}
${theme}
.p .serif-i{font-family:var(--serif);font-weight:var(--serif-w)}.p .display{font-family:var(--display);font-weight:var(--display-w)}
body{margin:0;width:1600px}
.p{width:1600px;height:1000px;position:relative}
.paper{background:${c("bg","day")};color:${c("ink","day")}}.night{background:${c("bg","night")};color:${c("ink","night")}}
.p svg{width:1600px;height:1000px;display:block}
.p .L-con{opacity:.42}.p .L-det{opacity:.8}
.paper .L-acc{color:${c("link","day")}}.night .L-acc{color:${c("link","night")}}
.paper .L-lbl{color:${c("ink2","day")}}.night .L-lbl{color:${c("ink2","night")}}
</style></head><body><div class="p paper">${svg}</div><div class="p night">${svg}</div></body></html>`;

const tmp = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "plate-")), "p.html");
fs.writeFileSync(tmp, html);
const bin = chrome();
execFileSync(bin, [...chromeFlags(bin), "--disable-gpu", "--hide-scrollbars", "--allow-file-access-from-files", "--window-size=1600,2000", "--virtual-time-budget=2500", `--screenshot=${out}`, `file://${tmp}`], { stdio: "ignore" });
console.log(out);
