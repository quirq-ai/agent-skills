// Copies what the film loads from disk out of node_modules: the fonts (Latin subset, from
// the @fontsource packages, under the names src/build.mjs uses) into assets/fonts, and GSAP
// into assets/vendor, so renders never depend on a CDN. It also draws the film grain texture
// (assets/tex/grain.png, random noise) with ffmpeg. Runs on npm install. The fonts are SIL Open
// Font License; each package's LICENSE travels with it in node_modules.
//
//   node scripts/setup.mjs

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { POPPINS_WEIGHTS } from "../src/themes/index.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const nm = path.join(root, "node_modules");
const out = path.join(root, "assets/fonts");
const FONTS = {
  "instrument-serif-normal-400.woff2": "@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2",
  "instrument-serif-italic-400.woff2": "@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2",
  "newsreader-normal-var.woff2": "@fontsource-variable/newsreader/files/newsreader-latin-wght-normal.woff2",
  "newsreader-italic-var.woff2": "@fontsource-variable/newsreader/files/newsreader-latin-wght-italic.woff2",
  "inter-normal-var.woff2": "@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  "jetbrains-mono-normal-var.woff2": "@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2",
};
for (const w of POPPINS_WEIGHTS)
  for (const st of ["normal", "italic"]) FONTS[`poppins-${st}-${w}.woff2`] = `@fontsource/poppins/files/poppins-latin-${w}-${st}.woff2`;
fs.mkdirSync(out, { recursive: true });
for (const [name, src] of Object.entries(FONTS)) {
  const from = path.join(nm, src);
  if (!fs.existsSync(from)) {
    console.error(`missing ${src}; run npm install`);
    process.exit(1);
  }
  fs.copyFileSync(from, path.join(out, name));
}
const vendor = path.join(root, "assets/vendor");
fs.mkdirSync(vendor, { recursive: true });
fs.copyFileSync(path.join(nm, "gsap/dist/gsap.min.js"), path.join(vendor, "gsap.min.js"));
// Grain: 512 px of black and white specks at random opacity (0 to about 53%), tiled by film.css.
const grain = path.join(root, "assets/tex/grain.png");
if (!fs.existsSync(grain)) {
  fs.mkdirSync(path.dirname(grain), { recursive: true });
  const graph =
    "color=c=black:s=512x512:d=1,format=gray,geq=lum='255*gt(random(1),0.52)',format=rgb24[c];" +
    "color=c=black:s=512x512:d=1,format=gray,geq=lum='136*random(2)'[a];[c][a]alphamerge";
  try {
    execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-f", "lavfi", "-i", graph, "-frames:v", "1", "-pix_fmt", "rgba", grain]);
  } catch {
    console.error("setup: could not draw assets/tex/grain.png (is ffmpeg installed?); the film renders without grain");
  }
}
console.log(`setup: ${Object.keys(FONTS).length} fonts -> assets/fonts, gsap -> assets/vendor, grain -> assets/tex`);
