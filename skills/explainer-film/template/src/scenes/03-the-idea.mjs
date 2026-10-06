// 03 · The idea. The example plate engraves itself on the right while the caption block
// names the beat on the left; the accent (the one step) lands on the word "idea".

export default {
  id: "03",
  css: `
#s03 .plate { position: absolute; left: 640px; top: 170px; width: 1170px; height: 731px; }
`,
  html(ctx) {
    return `${ctx.fig(ctx.seg.fig, "THE IDEA")}
<div class="plate" id="s03-plate">${ctx.plate("example")}</div>
${ctx.cap("s03c", { big: "1", unit: "step", title: "The one idea", line: "what goes in, what comes out" })}`;
  },
  motion(tl, S, T, k, seg, el) {
    k.camera(el.querySelector("#s03-plate"), S, T, { from: { scale: 1.04, x: 20, y: 10 }, to: { scale: 1.02, x: -10, y: -6 } });
    k.drawPlate(el.querySelector("#s03-plate"), S, T, { acc: k.word(seg, "idea") });
    k.capBlock("s03c", S);
  },
};
