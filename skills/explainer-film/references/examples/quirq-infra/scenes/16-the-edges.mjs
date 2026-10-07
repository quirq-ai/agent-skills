// 16 · The edges. An honest ledger of version zero, one row per limit, each landing on its
// word. Real strings only (the macOS error is sync's own message).

export default {
  id: "16",
  css: `
#s16 .ledger { position: absolute; left: 190px; top: 220px; width: 1540px; }
#s16 .h { font: 500 60px/1 Poppins, sans-serif; color: var(--ink); }
#s16 .h b { color: var(--link); font-weight: 500; }
#s16 .row { display: grid; grid-template-columns: 230px 1fr 520px; gap: 30px; align-items: center; padding: 24px 0; border-top: 2px solid var(--line); }
#s16 .h + .row { margin-top: 34px; }
#s16 .k { font: 500 20px/1 "JetBrains Mono", monospace; letter-spacing: 5px; color: var(--link); }
#s16 .t { font: 400 31px/1.25 Poppins, sans-serif; color: var(--ink); }
#s16 .m { font: 400 19px/1.4 "JetBrains Mono", monospace; color: var(--muted); }
`,
  html(ctx) {
    return `${ctx.fig(11, "THE EDGES")}
<div class="ledger"><div class="h" id="s16-h">Version <b>zero</b></div>
<div class="row" id="s16-r1"><span class="k">MACS</span><span class="t">can't run qq sync yet</span><span class="m">no pin for platform macos-arm64</span></div>
<div class="row" id="s16-r2"><span class="k">REVERTS</span><span class="t">proposed, never landed alone</span><span class="m">auto_land_repos = []</span></div>
<div class="row" id="s16-r3"><span class="k">ROLLS</span><span class="t">a person merges every one</span><span class="m">auto-land off</span></div>
<div class="row" id="s16-r4"><span class="k">CI</span><span class="t">doesn't run through qq yet</span><span class="m">interim steps, pnpm 10</span></div></div>`;
  },
  motion(tl, S, T, k, seg, el) {
    const $ = (s) => el.querySelector(s);
    k.rise($("#s16-h"), S + 0.1, { y: 26 });
    k.rise($("#s16-r1"), k.word(seg, "Macs") - 0.6, { y: 14 });
    k.rise($("#s16-r2"), k.word(seg, "Reverts") - 0.1, { y: 14 });
    k.rise($("#s16-r3"), k.word(seg, "roll.") - 0.5, { y: 14 });
    k.rise($("#s16-r4"), k.word(seg, "roll.") + 0.2, { y: 14 });
  },
};
