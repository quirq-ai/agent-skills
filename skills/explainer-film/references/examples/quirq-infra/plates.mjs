// The engraved plates of the quirq infra film, one function per plate. Each plate is a
// 1700x730 line drawing that sits 1:1 in the scene area (x 110 to 1810, y 150 to 880), in the
// five layers of lib.mjs (con, main, det, acc, lbl). Every name, number and schedule on a
// plate is from FACTS.md.
//
//   node assets/plates/src/plates.mjs        writes assets/plates/<id>.svg for every plate

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { P, line, circle, rect, path_, mono, note, display, arrow, curveArrow, arrowHead, hatch, ticks, centreLine, file } from "./lib.mjs";

const PW = 1700, PH = 730;
const here = path.dirname(fileURLToPath(import.meta.url));
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function write(id, title, L) {
  const g = (cls, w, items) => `<g class="${cls}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">\n${(items || []).join("\n")}\n</g>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${PW} ${PH}" fill="none" stroke="currentColor" data-plate="${id}" aria-label="${esc(title)}">
${g("L-con", 1.2, L.con)}
${g("L-main", 2.6, L.main)}
${g("L-det", 1.4, L.det)}
${g("L-acc", 3.4, L.acc)}
<g class="L-lbl" stroke="none">
${(L.lbl || []).join("\n")}
</g>
</svg>
`;
  fs.writeFileSync(path.resolve(here, "..", `${id}.svg`), svg);
  console.log(`${id}.svg  ${(svg.length / 1024).toFixed(1)} KB`);
}

const layers = () => ({ con: [], main: [], det: [], acc: [], lbl: [] });
const dashed = (x1, y1, x2, y2, on = 10, off = 8) => {
  const Ln = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / Ln, uy = (y2 - y1) / Ln;
  let d = "";
  for (let t = 0; t < Ln; t += on + off) d += `M${P(x1 + ux * t, y1 + uy * t)}L${P(x1 + ux * Math.min(t + on, Ln), y1 + uy * Math.min(t + on, Ln))}`;
  return path_(d);
};
const check = (x, y, s = 9) => path_(`M${P(x - s, y)}L${P(x - s * 0.3, y + s * 0.7)}L${P(x + s, y - s * 0.8)}`);
const cross = (x, y, s = 8) => path_(`M${P(x - s, y - s)}L${P(x + s, y + s)}M${P(x + s, y - s)}L${P(x - s, y + s)}`);
const person = (x, y, s = 1) => `${circle(x, y - 22 * s, 9 * s)}${path_(`M${P(x - 17 * s, y + 14 * s)}Q${P(x - 17 * s, y - 8 * s)} ${P(x, y - 8 * s)}Q${P(x + 17 * s, y - 8 * s)} ${P(x + 17 * s, y + 14 * s)}`)}`;
/** A rounded box with a hatched shadow edge, the plates' "station" glyph. */
function station(L, x, y, w, h, r = 14) {
  L.main.push(rect(x, y, w, h, r));
  L.det.push(hatch(x + 8, y + h, w - 8, 9, 7, -45));
}
/** A clock dial with a hand, for schedules. */
function dial(L, cx, cy, r, handDeg) {
  L.main.push(circle(cx, cy, r));
  let d = "";
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2, r0 = r - (i % 3 === 0 ? 13 : 7);
    d += `M${P(cx + r0 * Math.sin(a), cy - r0 * Math.cos(a))}L${P(cx + (r - 2) * Math.sin(a), cy - (r - 2) * Math.cos(a))}`;
  }
  L.det.push(path_(d));
  const a = (handDeg * Math.PI) / 180;
  L.acc.push(path_(`M${P(cx, cy)}L${P(cx + r * 0.72 * Math.sin(a), cy - r * 0.72 * Math.cos(a))}`));
  L.main.push(circle(cx, cy, 4));
}

// ================================================================ 05 presubmit
{
  const L = layers();
  const Y = 300;
  // the pull request
  station(L, 40, Y - 90, 250, 180);
  L.det.push(circle(84, Y - 40, 9), circle(84, Y + 40, 9), circle(150, Y - 40, 9));
  L.det.push(path_(`M${P(84, Y - 31)}L${P(84, Y + 31)}M${P(150, Y - 31)}Q${P(150, Y + 10)} ${P(93, Y + 36)}`));
  L.lbl.push(mono(180, Y - 32, "PULL", { size: 20, ls: 4 }), mono(180, Y - 6, "REQUEST", { size: 20, ls: 4 }), mono(180, Y + 46, "→ main", { size: 18, ls: 1 }));
  // stations
  const S = [
    { x: 420, k: "DRIFT CHECK", step: "qq drift check", n: "generated, not hand-edited" },
    { x: 760, k: "BUILD", step: "build (node-app)", n: "same steps, every time" },
    { x: 1100, k: "TEST", step: "test (node-app)", n: "JUnit for every run" },
  ];
  L.con.push(centreLine(290, Y, 1420, Y));
  for (const s of S) {
    station(L, s.x, Y - 80, 220, 160);
    L.lbl.push(mono(s.x + 110, Y - 104, s.k, { anchor: "middle", size: 21, ls: 5 }));
    L.lbl.push(mono(s.x + 110, Y + 126, s.step, { anchor: "middle", size: 17, ls: 1 }));
    L.lbl.push(note(s.x + 110, Y + 160, s.n, { anchor: "middle", size: 22 }));
  }
  // glyphs inside the stations
  L.det.push(path_(`M${P(500, Y - 36)}L${P(490, Y + 36)}M${P(540, Y - 36)}L${P(530, Y + 36)}M${P(476, Y - 12)}L${P(562, Y - 12)}M${P(470, Y + 14)}L${P(556, Y + 14)}`)); // #
  L.det.push(path_(`M${P(830, Y + 34)}L${P(830, Y - 10)}L${P(870, Y - 34)}L${P(910, Y - 10)}L${P(910, Y + 34)}ZM${P(830, Y - 10)}L${P(870, Y + 12)}L${P(910, Y - 10)}M${P(870, Y + 12)}L${P(870, Y + 56)}`)); // box
  L.det.push(path_(`M${P(1190, Y - 40)}L${P(1190, Y - 6)}L${P(1162, Y + 42)}L${P(1258, Y + 42)}L${P(1230, Y - 6)}L${P(1230, Y - 40)}M${P(1182, Y - 40)}L${P(1238, Y - 40)}M${P(1172, Y + 22)}L${P(1248, Y + 22)}`)); // flask
  // the flow (accent), station by station
  L.acc.push(arrow(296, Y, 410, Y, 13), arrow(646, Y, 750, Y, 13), arrow(986, Y, 1090, Y, 13));
  L.acc.push(path_(`M${P(1326, Y)}L${P(1440, Y)}Q${P(1480, Y)} ${P(1480, Y + 40)}L${P(1480, Y + 150)}` + arrowHead(1480, Y + 150, Math.PI / 2, 13)));
  // the store: a write-once ledger (cylinder)
  const cx = 1480, top = Y + 172, rx = 150, ry = 34, h = 150;
  L.main.push(path_(`M${P(cx - rx, top)}A${rx} ${ry} 0 1 0 ${P(cx + rx, top)}A${rx} ${ry} 0 1 0 ${P(cx - rx, top)}`));
  L.main.push(path_(`M${P(cx - rx, top)}L${P(cx - rx, top + h)}A${rx} ${ry} 0 0 0 ${P(cx + rx, top + h)}L${P(cx + rx, top)}`));
  L.det.push(path_(`M${P(cx - rx, top + 50)}A${rx} ${ry} 0 0 0 ${P(cx + rx, top + 50)}M${P(cx - rx, top + 100)}A${rx} ${ry} 0 0 0 ${P(cx + rx, top + 100)}`));
  L.lbl.push(mono(cx, top + h + 74, "TEST-PIPELINES", { anchor: "middle", size: 21, ls: 5 }));
  L.lbl.push(note(cx, top + h + 108, "write-once results store", { anchor: "middle", size: 22 }));
  L.lbl.push(mono(40, 660, "qq-innernet-presubmit.yml · generated by infra-config", { size: 17, ls: 2 }));
  write("presubmit", "Presubmit", L);
}

// ================================================================ 06 gate and merge queue
{
  const L = layers();
  const Y = 330;
  // the gate: two posts and a bar
  L.main.push(rect(150, Y - 150, 26, 260, 6), rect(330, Y - 150, 26, 260, 6));
  L.det.push(hatch(150, Y - 150, 26, 260, 7), hatch(330, Y - 150, 26, 260, 7));
  L.main.push(line(120, Y + 110, 386, Y + 110));
  L.acc.push(path_(`M${P(176, Y - 60)}L${P(330, Y - 60)}`));
  L.lbl.push(mono(253, Y - 184, "GATE", { anchor: "middle", size: 24, ls: 8 }));
  L.lbl.push(note(253, Y + 158, "decides what must pass", { anchor: "middle", size: 23 }));
  L.lbl.push(mono(253, Y + 200, "required: xo-space-presubmit", { anchor: "middle", size: 16, ls: 1 }));
  L.lbl.push(mono(253, Y + 226, "required: innernet-presubmit", { anchor: "middle", size: 16, ls: 1 }));
  // the queue track
  L.con.push(centreLine(400, Y, 1080, Y));
  L.main.push(path_(`M${P(470, Y - 70)}L${P(1040, Y - 70)}M${P(470, Y + 70)}L${P(1040, Y + 70)}`));
  L.det.push(ticks(470, Y + 70, 1040, Y + 70, 38, 6, 5, 1));
  for (let i = 0; i < 3; i++) {
    const x = 520 + i * 170;
    L.main.push(rect(x, Y - 48, 130, 96, 10));
    L.det.push(circle(x + 30, Y, 8), path_(`M${P(x + 50, Y - 14)}L${P(x + 108, Y - 14)}M${P(x + 50, Y + 6)}L${P(x + 96, Y + 6)}M${P(x + 50, Y + 24)}L${P(x + 84, Y + 24)}`));
  }
  L.lbl.push(mono(755, Y - 104, "MERGE QUEUE", { anchor: "middle", size: 22, ls: 6 }));
  L.lbl.push(note(755, Y + 120, "re-tests the exact merge result", { anchor: "middle", size: 23 }));
  L.lbl.push(mono(755, Y + 158, "on: merge_group", { anchor: "middle", size: 16, ls: 1 }));
  // main
  const MY = Y;
  L.main.push(line(1180, MY, 1660, MY));
  for (let i = 0; i < 6; i++) L.main.push(circle(1220 + i * 80, MY, 11));
  L.lbl.push(mono(1640, MY - 34, "MAIN", { anchor: "end", size: 22, ls: 6 }));
  L.lbl.push(note(1420, MY + 76, "one squash commit per change", { anchor: "middle", size: 23 }));
  // the accent path: through the gate, along the queue, onto main
  L.acc.push(arrow(380, Y, 500, Y, 13));
  L.acc.push(path_(`M${P(1040, Y)}Q${P(1120, Y)} ${P(1180, Y - 50)}L${P(1300, Y - 110)}Q${P(1340, Y - 120)} ${P(1340, Y - 60)}L${P(1340, Y - 14)}` + arrowHead(1340, Y - 14, Math.PI / 2, 12)));
  L.acc.push(circle(1380, MY, 15));
  write("queue", "Gate and merge queue", L);
}

// ================================================================ 07 last known good
{
  const L = layers();
  const Y = 380, X0 = 120, DX = 118, N = 12;
  // status per commit: 1 green, 0 pending, -1 red (illustrative sequence)
  const st = [1, 1, 1, -1, 1, 1, 1, 1, 1, 0, 0, 0];
  L.main.push(line(X0 - 60, Y, X0 + DX * (N - 1) + 70, Y));
  L.det.push(ticks(X0 - 60, Y + 44, X0 + DX * (N - 1) + 70, Y + 44, 60, 5, 5, 1));
  st.forEach((s, i) => {
    const x = X0 + i * DX;
    L.main.push(circle(x, Y, 14));
    if (s === 1) L.det.push(check(x, Y - 58));
    else if (s === -1) L.det.push(cross(x, Y - 58));
    else L.det.push(circle(x, Y - 58, 3), circle(x - 12, Y - 58, 3), circle(x + 12, Y - 58, 3));
  });
  L.lbl.push(mono(X0 - 60, Y + 100, "MAIN · NEWEST →", { size: 18, ls: 4 }));
  L.lbl.push(mono(X0 + DX * 9 - 12, Y - 98, "CHECKS PENDING", { size: 16, ls: 3 }));
  // the clock
  dial(L, 150, 140, 62, 60);
  L.lbl.push(mono(240, 132, "SCHEDULED", { size: 20, ls: 5 }), mono(240, 162, "EVERY 10 MINUTES", { size: 20, ls: 5 }));
  // accent: the bracket over the newest all-green commit (index 8)
  const gx = X0 + 8 * DX;
  L.acc.push(path_(`M${P(gx, Y - 16)}L${P(gx, Y - 230)}`), path_(`M${P(gx, Y - 230)}L${P(gx + 120, Y - 210)}L${P(gx, Y - 190)}`));
  L.lbl.push(display(gx + 140, Y - 196, "last known good", { size: 40 }));
  L.lbl.push(mono(gx - 4, Y + 140, "release · lkgr.yml", { anchor: "middle", size: 17, ls: 1 }));
  write("lkgr", "Last known good", L);
}

// ================================================================ 08 channels
{
  const L = layers();
  const rows = [
    { y: 150, k: "CANARY", n: "daily at 06:17 UTC, for agents and test environments", m: "build · full tests · fuzz smoke · trial deploy on the CI runner", live: true },
    { y: 370, k: "DEV", n: "a human owner, after 24 h and 3 green canaries", m: "later (v1)" },
    { y: 590, k: "STABLE", n: "suraj, after 72 h, rolled out 10 / 50 / 100 %", m: "later (v2)" },
  ];
  // source
  station(L, 40, 300, 210, 140);
  L.lbl.push(mono(145, 362, "LAST", { anchor: "middle", size: 20, ls: 5 }), mono(145, 390, "KNOWN GOOD", { anchor: "middle", size: 20, ls: 5 }));
  for (const r of rows) {
    const x0 = 420;
    if (r.live) L.acc.push(path_(`M${P(250, 370)}Q${P(330, 370)} ${P(340, r.y + 60)}Q${P(345, r.y)} ${P(x0, r.y)}L${P(1640, r.y)}` + arrowHead(1640, r.y, 0, 14)));
    else {
      L.det.push(dashed(250, 370, 330, 370), dashed(330, r.y, 1640, r.y, 14, 10));
      if (r.y !== 370) L.det.push(dashed(330, Math.min(370, r.y), 330, Math.max(370, r.y)));
      L.main.push(person(1560, r.y - 48, 1.1));
    }
    L.main.push(circle(x0, r.y, 12));
    L.lbl.push(mono(x0 + 40, r.y - 24, r.k, { size: 24, ls: 8 }));
    L.lbl.push(note(x0 + 40, r.y + 46, r.n, { size: 25 }));
    L.lbl.push(mono(x0 + 40, r.y + 82, r.m, { size: 16, ls: 2 }));
  }
  write("channels", "Channels", L);
}

// ================================================================ 10 gardener
{
  const L = layers();
  const Y = 330, X0 = 120, DX = 110, N = 13, BAD = 7;
  L.main.push(line(X0 - 50, Y, X0 + DX * (N - 1) + 60, Y));
  for (let i = 0; i < N; i++) {
    const x = X0 + i * DX;
    L.main.push(circle(x, Y, 13));
    if (i < BAD) L.det.push(check(x, Y + 52));
    else L.det.push(cross(x, Y + 52));
  }
  L.lbl.push(mono(X0 - 50, Y + 120, "MAIN", { size: 18, ls: 6 }));
  // bisect brackets narrowing to the culprit (accent)
  const br = (a, b, h) => path_(`M${P(X0 + a * DX - 20, Y - h + 26)}L${P(X0 + a * DX - 20, Y - h)}L${P(X0 + b * DX + 20, Y - h)}L${P(X0 + b * DX + 20, Y - h + 26)}`);
  L.acc.push(br(3, 12, 150), br(5, 9, 110), br(6, 8, 70));
  L.acc.push(circle(X0 + BAD * DX, Y, 26));
  L.lbl.push(mono(X0 + BAD * DX, Y - 172, "BISECT", { anchor: "middle", size: 18, ls: 6 }));
  L.lbl.push(note(X0 + BAD * DX + 40, Y - 214, "the culprit", { size: 26 }));
  // the revert: an arc from the culprit to a new commit at the end
  L.acc.push(path_(`M${P(X0 + BAD * DX, Y + 30)}Q${P(X0 + BAD * DX + 60, Y + 240)} ${P(X0 + 12 * DX + 120, Y + 220)}`));
  station(L, X0 + 12 * DX - 30, Y + 170, 290, 120);
  L.lbl.push(mono(X0 + 12 * DX + 115, Y + 222, "REVERT", { anchor: "middle", size: 22, ls: 6 }));
  L.lbl.push(note(X0 + 12 * DX + 115, Y + 262, "proposed, clean", { anchor: "middle", size: 22 }));
  // the cap
  L.main.push(rect(80, Y + 230, 520, 70, 35));
  for (let i = 0; i < 10; i++) L.det.push(circle(130 + i * 46, Y + 265, 12));
  L.lbl.push(mono(80, Y + 344, "AT MOST 10 REVERTS IN ANY 24 HOURS", { size: 17, ls: 3 }));
  write("gardener", "The gardener", L);
}

// ================================================================ 13 the map
{
  const L = layers();
  const box = (cx, cy, w, label, sub, opt = {}) => {
    const h = 64;
    L.main.push(rect(cx - w / 2, cy - h / 2, w, h, 12));
    if (opt.hatch) L.det.push(hatch(cx - w / 2 + 6, cy + h / 2, w - 6, 8, 6));
    L.lbl.push(mono(cx, cy + 7, label, { anchor: "middle", size: 21, ls: 2, weight: 500 }));
    if (sub) L.lbl.push(note(cx, cy + h / 2 + 28, sub, { anchor: "middle", size: 19 }));
    return { cx, cy, w, h, t: cy - h / 2, b: cy + h / 2, l: cx - w / 2, r: cx + w / 2 };
  };
  const ic = box(850, 60, 270, "infra-config", null, { hatch: true });
  L.lbl.push(note(1010, 68, "every policy, as config", { size: 20 }));
  const t2y = 250;
  const gate = box(250, t2y, 160, "gate", "what must pass");
  const gard = box(560, t2y, 200, "gardener", "keeps main green");
  const rel = box(870, t2y, 180, "release", "lkgr and canary");
  const inst = box(1160, t2y, 200, "installer", "main today, channels later");
  const roll = box(1460, t2y, 180, "rollers", "fresh dependencies");
  const t3y = 470;
  const depot = box(170, t3y, 150, "depot", "the qq command");
  const sync = box(400, t3y, 140, "sync", "the manifest");
  const rec = box(640, t3y, 170, "recipes", "how to build");
  const rb = box(880, t3y, 230, "remote-build", "not called yet");
  const tp = box(1140, t3y, 240, "test-pipelines", "every result");
  const perf = box(1370, t3y, 130, "perf", "speed, size");
  const tc = box(1580, t3y, 200, "toolchains", "pinned Python, Node");
  const py = 660;
  const xo = box(640, py, 220, "xo-space", null, { hatch: true });
  const inn = box(1060, py, 220, "innernet", null, { hatch: true });
  L.lbl.push(mono(850, py + 66, "PRODUCTS", { anchor: "middle", size: 16, ls: 6 }));
  // policy flows down (accent)
  for (const n of [gate, gard, rel, inst, roll]) L.acc.push(curveArrow(ic.cx + (n.cx - ic.cx) * 0.12, ic.b, n.cx, (ic.b + n.t) / 2 - 10, n.cx, n.t - 4, 11));
  // generated workflows to the products
  L.det.push(dashed(ic.cx - 140, ic.b, 120, 140), dashed(120, 140, 60, 600), dashed(60, 600, xo.l - 6, py));
  L.det.push(path_(arrowHead(xo.l - 6, py, 0, 10)));
  // results flow back up: products -> test-pipelines -> gardener -> release
  L.det.push(curveArrow(xo.r, py - 8, 900, 600, tp.l + 30, tp.b + 4), curveArrow(inn.cx + 40, inn.t, inn.cx + 40, 560, tp.cx, tp.b + 4));
  L.det.push(curveArrow(tp.cx - 40, tp.t, 900, 380, gard.cx + 40, gard.b + 34));
  L.det.push(arrow(gard.r + 2, t2y, rel.l - 6, t2y, 10), arrow(rel.r + 2, t2y, inst.l - 6, t2y, 10));
  // developer side
  L.det.push(arrow(depot.r + 2, t3y, sync.l - 6, t3y, 10), arrow(sync.r + 2, t3y, rec.l - 6, t3y, 10), dashed(rec.r + 4, t3y, rb.l - 8, t3y, 6, 6));
  L.det.push(curveArrow(depot.cx, depot.t, 170, 360, gate.cx - 30, gate.b + 4));
  L.det.push(arrow(perf.l - 2, t3y, tp.r + 6, t3y, 10));
  L.det.push(curveArrow(tc.cx, tc.t, 1590, 360, roll.cx + 30, roll.b + 34));
  L.det.push(curveArrow(roll.cx - 20, roll.b + 34, 1400, 640, inn.r + 6, py));
  write("map", "The map of the thirteen repos", L);
}
