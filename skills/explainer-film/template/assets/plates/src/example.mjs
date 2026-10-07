// example: THE IDEA. A starter plate to copy: three stations (what goes in, the one step
// that matters, what comes out), engraved in the five layers, with the accent on the step
// the narration names. Replace the labels with the product's real ones from FACTS.md.
//
//   node assets/plates/src/example.mjs

import { W, H, line, circle, rect, path_, centreLine, dimLine, hatch, ticks, leader, file, writing, arrow, register, mono, note, writePlate } from "./lib.mjs";

const con = [], main = [], det = [], acc = [], lbl = [];

// ---------------------------------------------------------------- construction
const CY = 500;
con.push(centreLine(120, CY, W - 120, CY));
for (const x of [360, 800, 1240]) con.push(centreLine(x, 200, x, 800));
con.push(dimLine(240, 830, 1360, 830));
con.push(ticks(240, 870, 1360, 870, 40, 7, 5));
for (const [x, y] of [[40, 40], [W - 40, 40], [40, H - 40], [W - 40, H - 40]]) con.push(register(x, y, 14));

// ---------------------------------------------------------------- station 1: what goes in (a stack of pages)
for (let i = 0; i < 3; i++) main.push(file(270 + i * 22, 380 - i * 22, 150, 200));
det.push(writing(312, 400, 96, 7, 20, 3));

// ---------------------------------------------------------------- station 2: the step (a hatched core in a ring)
main.push(circle(800, CY, 150));
main.push(circle(800, CY, 104));
det.push(hatch(740, 440, 120, 120, 10, -35));
det.push(ticks(650, 680, 950, 680, 20, 6, 5));

// ---------------------------------------------------------------- station 3: what comes out (one clean page)
main.push(rect(1160, 360, 170, 230, 10));
det.push(line(1185, 400, 1305, 400));
det.push(writing(1185, 432, 120, 6, 22, 7));

// ---------------------------------------------------------------- L-acc: the idea itself
acc.push(arrow(450, CY, 640, CY, 14));
acc.push(arrow(960, CY, 1150, CY, 14));
acc.push(circle(800, CY, 46));

// ---------------------------------------------------------------- labels
lbl.push(mono(360, 640, "WHAT GOES IN", { anchor: "middle", size: 20, ls: 4 }));
lbl.push(mono(800, 300, "THE ONE STEP", { anchor: "middle", size: 20, ls: 4 }));
lbl.push(mono(1240, 640, "WHAT COMES OUT", { anchor: "middle", size: 20, ls: 4 }));
const [ld, lx, ly] = leader(870, 420, 980, 300, 50);
det.push(ld);
lbl.push(note(lx, ly, "named on the key word", { size: 26 }));

writePlate("example", "The idea: what goes in, the one step, what comes out", { con, main, det, acc, lbl });
