// Copies what the film loads from disk out of node_modules: the fonts (Latin subset, from
// the @fontsource packages, under the names src/build.mjs uses) into assets/fonts, and GSAP
// into assets/vendor, so renders never depend on a CDN. Runs on npm install. The fonts are
// SIL Open Font License; each package's LICENSE travels with it in node_modules.
//
//   node scripts/setup.mjs

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

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
console.log(`setup: ${Object.keys(FONTS).length} fonts -> assets/fonts, gsap -> assets/vendor`);
