// The film's looks. THEME in src/film.mjs picks one: its palette drives the runtime's colour
// tokens and its stylesheet (src/themes/<name>.css) is appended after src/film.css.
//
//   quirq  the quirq brand: plum-black ground, pink accent that turns amber in the night
//          chapter, Poppins for display and serif faces (the quirq infra film's look)
//   paper  the Innernet field guide: warm paper by day, ink at night, Instrument Serif and
//          Newsreader
//
// Palettes are RGB; `link` is the one saturated accent. For a product with its own design
// tokens, copy the closer theme, rename it and take the colours from those tokens.

export const THEMES = {
  quirq: {
    palette: {
      day: { bg: [16, 15, 20], ink: [243, 236, 228], ink2: [208, 195, 204], muted: [177, 162, 180], link: [242, 162, 213], surface: [25, 22, 30] },
      night: { bg: [11, 10, 14], ink: [243, 236, 228], ink2: [208, 195, 204], muted: [177, 162, 180], link: [234, 193, 122], surface: [23, 20, 27] },
    },
  },
  paper: {
    palette: {
      day: { bg: [247, 245, 240], ink: [28, 27, 24], ink2: [70, 67, 60], muted: [95, 90, 82], link: [42, 82, 196], surface: [255, 254, 251] },
      night: { bg: [15, 15, 14], ink: [236, 234, 227], ink2: [200, 197, 187], muted: [162, 157, 146], link: [157, 182, 255], surface: [26, 26, 24] },
    },
  },
};

export const POPPINS_WEIGHTS = ["300", "400", "500", "600"];

// Every face the film can use, as @font-face rules (files copied by scripts/setup.mjs).
const FONTS = [
  ["Instrument Serif", "instrument-serif-normal-400.woff2", "normal", "400"],
  ["Instrument Serif", "instrument-serif-italic-400.woff2", "italic", "400"],
  ["Newsreader", "newsreader-normal-var.woff2", "normal", "200 800"],
  ["Newsreader", "newsreader-italic-var.woff2", "italic", "200 800"],
  ["Inter", "inter-normal-var.woff2", "normal", "100 900"],
  ["JetBrains Mono", "jetbrains-mono-normal-var.woff2", "normal", "100 800"],
  ...POPPINS_WEIGHTS.flatMap((w) => [
    ["Poppins", `poppins-normal-${w}.woff2`, "normal", w],
    ["Poppins", `poppins-italic-${w}.woff2`, "italic", w],
  ]),
];
export const fontFaces = (dir = "assets/fonts") =>
  FONTS.map(([f, file, st, w]) => `@font-face{font-family:"${f}";src:url("${dir}/${file}") format("woff2");font-style:${st};font-weight:${w};font-display:block}`).join("\n");
