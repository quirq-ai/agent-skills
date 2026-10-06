// 02 · Thirteen repos. The name arrives (quirq wordmark + "infra", "qq for short"), then on
// "Thirteen" the thirteen repos pop in as a grid of chips, each with its Chromium counterpart.

const REPOS = [
  ["infra-config", "infra/config"], ["depot", "depot_tools"], ["sync", "gclient"], ["recipes", "recipes"],
  ["toolchains", "CIPD"], ["remote-build", "RBE"], ["test-pipelines", "ResultDB"], ["gate", "commit queue"],
  ["gardener", "sheriffs"], ["rollers", "AutoRoll"], ["release", "lkgr finder"], ["installer", "updater"], ["perf", "perf dashboard"],
];

export default {
  id: "02",
  css: `
#s02 .name { position: absolute; left: 0; right: 0; top: 190px; display: flex; justify-content: center; align-items: flex-end; gap: 26px; }
#s02 .name svg { height: 118px; width: auto; overflow: visible; }
#s02 .name svg path { fill: var(--ink); }
#s02 .name .infra { font: 300 104px/1 Poppins, sans-serif; color: var(--link); letter-spacing: -0.02em; margin-bottom: 18px; }
#s02 .qq { position: absolute; left: 0; right: 0; top: 352px; text-align: center; font: 400 22px/1 "JetBrains Mono", monospace; letter-spacing: 6px; color: var(--muted); }
#s02 .qq b { color: var(--ink); font-weight: 600; }
#s02 .grid { position: absolute; left: 160px; right: 160px; top: 430px; display: flex; flex-wrap: wrap; justify-content: center; gap: 18px 18px; }
#s02 .chip2 { width: 300px; padding: 16px 20px; border: 2px solid var(--line); border-radius: 14px; background: var(--surface); }
#s02 .chip2 .n { font: 500 25px/1 "JetBrains Mono", monospace; color: var(--ink); }
#s02 .chip2 .c { margin-top: 10px; font: italic 300 20px/1 Poppins, sans-serif; color: var(--muted); }
#s02 .foot { position: absolute; left: 0; right: 0; top: 842px; text-align: center; font: 400 18px/1 "JetBrains Mono", monospace; letter-spacing: 5px; color: var(--muted); }
`,
  html(ctx) {
    const wm = ctx.wordmark();
    return `<div class="name" id="s02-name">${wm}<span class="infra" id="s02-infra">infra</span></div>
<div class="qq" id="s02-qq">"<b>qq</b>" FOR SHORT</div>
<div class="grid">${REPOS.map(([n, c]) => `<div class="chip2"><div class="n">${n}</div><div class="c">like ${c}</div></div>`).join("")}</div>
<div class="foot" id="s02-foot">PUBLIC · APACHE-2.0 · ON GITHUB</div>`;
  },
  motion(tl, S, T, k, seg, el) {
    const $ = (s) => el.querySelector(s);
    tl.fromTo($("#s02-name svg"), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, S + 0.1);
    tl.fromTo($("#s02-infra"), { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }, S + 0.45);
    k.fade($("#s02-qq"), k.word(seg, "qq") - 0.1, 0.5);
    const chips = Array.from(el.querySelectorAll(".chip2"));
    k.pop(chips, k.word(seg, "Thirteen") - 0.1, { from: 0.8, stagger: 0.07 });
    k.fade($("#s02-foot"), k.word(seg, "GitHub.") - 0.3, 0.6);
  },
};
