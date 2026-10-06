// 04 · Close. The wordmark engraves itself (outline, then ink), the closing line lands word
// by word, then stillness while the music resolves. The HUD counter ticks once: the
// callback to the open.

export default {
  id: "04",
  css: `
#s04 .wm { position: absolute; left: 0; right: 0; top: 300px; height: 240px; }
#s04 .wm svg { width: 100%; height: 100%; overflow: visible; }
#s04 .wm text { font-family: "Instrument Serif", serif; font-size: 200px; fill: var(--ink); stroke: var(--ink); stroke-width: 1.3; stroke-dasharray: 2400; paint-order: stroke; }
#s04 .tag { position: absolute; left: 0; right: 0; top: 590px; display: flex; justify-content: center; gap: 22px; font: italic 400 46px/1.2 Newsreader, Georgia, serif; color: var(--ink2); }
#s04 .tag .dot { color: var(--muted); font-style: normal; }
`,
  html() {
    return `<div class="wm" id="s04-wm"><svg viewBox="0 0 1920 240"><text x="960" y="190" text-anchor="middle">product</text></svg></div>
<div class="tag"><span id="s04-w1">Small</span><span class="dot" id="s04-d1">·</span><span id="s04-w2">clear</span><span class="dot" id="s04-d2">·</span><span id="s04-w3">yours</span></div>`;
  },
  motion(tl, S, T, k, seg, el) {
    const $ = (s) => el.querySelector(s);
    const text = $("#s04-wm text");
    tl.fromTo(text, { strokeDashoffset: 2400, fillOpacity: 0 }, { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut" }, S + 0.1);
    tl.fromTo(text, { fillOpacity: 0 }, { fillOpacity: 1, duration: 0.8, ease: "power1.inOut", immediateRender: false }, S + 1.1);
    tl.fromTo($("#s04-wm"), { scale: 1.05, y: 12 }, { scale: 1, y: 0, duration: 2.4, ease: "expo.out" }, S + 0.1);
    const w = ["small", "clear", "yours"].map((x) => k.word(seg, x));
    k.rise($("#s04-w1"), w[0] - 0.08, { y: 14, dur: 0.7 });
    k.rise([$("#s04-d1"), $("#s04-w2")], w[1] - 0.12, { y: 14, dur: 0.7, stagger: 0.06 });
    k.rise([$("#s04-d2"), $("#s04-w3")], w[2] - 0.12, { y: 14, dur: 0.7, stagger: 0.06 });
    k.counter(S + 0.6, "THINGS", 1201, 0.4);
  },
  sfx(ctx) {
    return [{ name: "tick", at: ctx.seg.start + 0.6 }];
  },
};
