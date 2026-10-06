// 01 · Open. The hook, inside two seconds: a title rises over a ruled field while the HUD
// counter counts up from nothing. Replace with the product's real opening image (BRIEF.md).

export default {
  id: "01",
  css: `
#s01 .field { position: absolute; left: 110px; right: 110px; top: 220px; height: 560px; }
#s01 .field svg { width: 100%; height: 100%; overflow: visible; }
#s01 .field path { stroke: var(--con); stroke-width: 1.4; fill: none; }
#s01 .title { position: absolute; left: 0; right: 0; top: 360px; text-align: center; font: var(--display-w) 150px/1 var(--display); color: var(--ink); }
#s01 .line { position: absolute; left: 0; right: 0; top: 548px; text-align: center; font: italic var(--serif-w) 40px/1.2 var(--serif); color: var(--ink2); }
#s01 .rule { position: absolute; left: 760px; width: 400px; top: 528px; height: 2px; background: var(--ink); }
`,
  html() {
    const rows = Array.from({ length: 12 }, (_, i) => `<path pathLength="100" d="M0 ${i * 50}H1700"/>`).join("");
    return `<div class="field"><svg viewBox="0 0 1700 560">${rows}</svg></div>
<div class="title" id="s01-title">Your product</div>
<div class="rule" id="s01-rule"></div>
<div class="line" id="s01-line">one sentence on why it matters</div>`;
  },
  motion(tl, S, T, k, seg, el) {
    k.draw(Array.from(el.querySelectorAll(".field path")), S + 0.05, 1.2, 0.9, "power1.inOut");
    k.camera(el.querySelector(".scene-in"), S, T, { settle: 1.6 });
    k.rise(el.querySelector("#s01-title"), S + 0.15, { y: 30, dur: 0.9 });
    k.strike(el.querySelector("#s01-rule"), S + 0.6, 0.8);
    k.rise(el.querySelector("#s01-line"), S + 0.9, { y: 14, dur: 0.7 });
    k.counter(S + 0.3, "THINGS", 1200, 2.6);
  },
};
