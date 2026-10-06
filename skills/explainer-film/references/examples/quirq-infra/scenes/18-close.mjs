// 18 · Close. The wordmark and "infra" settle; the three promises land word by word; the
// org's address and the maker's credit arrive; stillness while the music resolves.

export default {
  id: "18",
  css: `
#s18 .name { position: absolute; left: 0; right: 0; top: 260px; display: flex; justify-content: center; align-items: flex-end; gap: 30px; }
#s18 .name svg { height: 170px; width: auto; overflow: visible; }
#s18 .name svg path { fill: var(--ink); }
#s18 .name .infra { font: 300 150px/1 Poppins, sans-serif; color: var(--link); letter-spacing: -0.02em; margin-bottom: 26px; }
#s18 .line { position: absolute; left: 0; right: 0; top: 520px; text-align: center; font: 400 40px/1.2 Poppins, sans-serif; color: var(--ink2); }
#s18 .tag { position: absolute; left: 0; right: 0; top: 610px; display: flex; justify-content: center; gap: 22px; font: italic 300 34px/1 Poppins, sans-serif; color: var(--ink2); }
#s18 .tag .dot { font-style: normal; color: var(--muted); }
#s18 .url { position: absolute; left: 50%; top: 720px; transform: translateX(-50%); padding: 13px 26px; border: 2px solid var(--link); border-radius: 999px; font: 500 26px/1 "JetBrains Mono", monospace; color: var(--link); white-space: nowrap; }
#s18 .credit { position: absolute; left: 50%; top: 806px; transform: translateX(-50%); display: flex; align-items: center; gap: 14px; white-space: nowrap; }
#s18 .credit svg { width: 34px; height: 34px; }
#s18 .credit .tile { fill: var(--ink); } #s18 .credit .q { fill: var(--bg); }
#s18 .credit .by { font: 500 15px/1 "JetBrains Mono", monospace; letter-spacing: 5px; color: var(--muted); }
#s18 .credit .nm { font: 500 30px/1 Poppins, sans-serif; color: var(--ink); }
`,
  html(ctx) {
    return `<div class="name" id="s18-name">${ctx.wordmark()}<span class="infra" id="s18-infra">infra</span></div>
<div class="line" id="s18-line">One path, from a pull request to a release.</div>
<div class="tag"><span id="s18-w1">in the open</span><span class="dot" id="s18-d1">·</span><span id="s18-w2">made to be run by agents</span><span class="dot" id="s18-d2">·</span><span id="s18-w3">owned by people</span></div>
<div class="url" id="s18-url">github.com/quirq-ai</div>
<div class="credit" id="s18-credit"><svg viewBox="0 0 64 64" aria-hidden="true"><rect class="tile" width="64" height="64" rx="14"/><path class="q" transform="translate(15,9) scale(0.34)" d="M50 0A50 50 0 0 1 100 50V118A14 14 0 0 1 86 132A14 14 0 0 1 72 118V94.87A50 50 0 1 1 50 0ZM50 33A17 17 0 1 0 50 67A17 17 0 1 0 50 33Z"/></svg><span class="by">MADE BY</span><span class="nm">QuirqAI</span></div>`;
  },
  motion(tl, S, T, k, seg, el) {
    const $ = (s) => el.querySelector(s);
    k.rise($("#s18-line"), k.word(seg, "One") - 0.2, { y: 16, dur: 0.8 });
    k.fade($("#s18-w1"), k.word(seg, "open,") - 0.3, 0.6);
    k.fade($("#s18-d1"), k.word(seg, "open,"), 0.4);
    k.fade($("#s18-w2"), k.word(seg, "agents,") - 0.3, 0.6);
    k.fade($("#s18-d2"), k.word(seg, "agents,"), 0.4);
    k.fade($("#s18-w3"), k.word(seg, "people.") - 0.3, 0.6);
    const q = k.word(seg, "quirq");
    tl.fromTo($("#s18-name svg"), { opacity: 0, y: 30, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 1.0, ease: "power3.out" }, q - 0.3);
    tl.fromTo($("#s18-infra"), { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.9, ease: "power3.out" }, q + 0.1);
    k.rise($("#s18-url"), q + 0.8, { y: 10 });
    k.rise($("#s18-credit"), q + 1.2, { y: 10 });
  },
};
