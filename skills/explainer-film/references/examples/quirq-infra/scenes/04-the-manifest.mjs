// 04 · The manifest. innernet's real infra/repo.toml as a file card; the digest is marked on
// "digest". On "infra-config" a second card appears and generates the three real qq-*.yml
// workflows into the product, one arrow each.

export default {
  id: "04",
  css: `
#s04 .file { position: absolute; left: 130px; top: 220px; width: 860px; background: var(--surface); border: 2px solid var(--line); border-radius: 18px; overflow: hidden; box-shadow: 0 40px 80px -36px rgba(0,0,0,.7); }
#s04 .bar { padding: 18px 26px; border-bottom: 2px solid var(--line); font: 500 22px/1 "JetBrains Mono", monospace; color: var(--ink); display: flex; justify-content: space-between; }
#s04 .bar span { color: var(--muted); font-weight: 400; letter-spacing: 3px; font-size: 17px; }
#s04 pre { padding: 24px 26px 28px; font: 400 21px/1.65 "JetBrains Mono", monospace; color: var(--ink2); white-space: pre; }
#s04 pre .c { color: var(--muted); } #s04 pre .k { color: var(--ink); } #s04 pre .s { color: var(--amber, #eac17a); }
#s04 .dg { position: relative; color: var(--link); }
#s04 .dgu { position: absolute; left: 0; right: 0; bottom: -4px; height: 3px; background: var(--link); transform-origin: 0 50%; }
#s04 .ic { position: absolute; left: 1150px; top: 220px; width: 600px; padding: 26px 30px; border: 2px solid var(--link); border-radius: 18px; background: var(--surface); }
#s04 .ic .n { font: 500 32px/1 "JetBrains Mono", monospace; color: var(--ink); }
#s04 .ic .d { margin-top: 12px; font: italic 300 25px/1.3 Poppins, sans-serif; color: var(--ink2); }
#s04 .gen { position: absolute; left: 1150px; top: 520px; width: 600px; }
#s04 .gen .lab { font: 400 17px/1 "JetBrains Mono", monospace; letter-spacing: 5px; color: var(--muted); margin-bottom: 18px; }
#s04 .wf { margin-bottom: 14px; padding: 14px 20px; border: 2px dashed var(--line); border-radius: 12px; font: 400 21px/1 "JetBrains Mono", monospace; color: var(--ink); }
#s04 .arrows { position: absolute; inset: 0; overflow: visible; }
#s04 .arrows path { stroke: var(--link); stroke-width: 2.4; fill: none; stroke-dasharray: 100 110; }
`,
  html(ctx) {
    return `${ctx.fig(1, "THE MANIFEST")}
<div class="file" id="s04-file"><div class="bar">innernet/infra/repo.toml<span>WRITTEN BY HAND</span></div>
<pre><span class="k">schema</span> = <span class="s">"quirq-repo/1"</span>

<span class="k">[[targets]]</span>
name = <span class="s">"app"</span>
kind = <span class="s">"node-app"</span>

<span class="k">[toolchains.node]</span>
version = <span class="s">"24.21.0"</span>
linux-x86_64 = { digest = <span class="dg">"sha256:8c0ab89a…"<i class="dgu" id="s04-mark"></i></span> }</pre></div>
<div class="ic" id="s04-ic"><div class="n">infra-config</div><div class="d">every policy, as config in one repo</div></div>
<div class="gen" id="s04-gen"><div class="lab">GENERATED INTO THE PRODUCT</div>
<div class="wf">qq-innernet-presubmit.yml</div><div class="wf">qq-innernet-postsubmit.yml</div><div class="wf">qq-roll-land.yml</div></div>
<svg class="arrows" viewBox="0 0 1920 1080"><path pathLength="100" d="M1450 330 L1450 500"/></svg>`;
  },
  motion(tl, S, T, k, seg, el) {
    const $ = (s) => el.querySelector(s);
    tl.fromTo($("#s04-file"), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, S + 0.1);
    tl.fromTo(el.querySelector("#s04-file pre"), { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 1.6, ease: "power2.inOut" }, S + 0.4);
    k.strike($("#s04-mark"), k.word(seg, "digest.") - 0.1, 0.6, 0);
    const ic = k.word(seg, "infra-config,");
    tl.fromTo($("#s04-file"), { opacity: 1 }, { opacity: 0.55, duration: 0.8, ease: "none" }, ic - 0.3);
    k.rise($("#s04-ic"), ic - 0.2, { y: 24 });
    k.draw(Array.from(el.querySelectorAll(".arrows path")), ic + 0.3, 0.5, 0);
    k.fade($("#s04-gen .lab"), ic + 0.5, 0.4);
    k.rise(Array.from(el.querySelectorAll("#s04-gen .wf")), ic + 0.6, { y: 16, stagger: 0.18 });
  },
};
