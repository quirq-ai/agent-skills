// 05 · Presubmit. The presubmit plate draws on; the flow (accent) runs station by station on
// "drift", "build", "test", and the store fills on "store".
import { PLATE_CSS, plateHtml } from "./_plate.mjs";

export default {
  id: "05",
  css: PLATE_CSS("05"),
  html: (ctx) => plateHtml(ctx, "presubmit"),
  motion(tl, S, T, k, seg, el) {
    k.camera(el.querySelector(".cam"), S, T, { from: { scale: 1.04, y: 10 }, to: { scale: 1.02, y: -6 } });
    k.drawPlate(el, S, T, { acc: false, lbl: 0.4 });
    const acc = Array.from(el.querySelectorAll(".L-acc path"));
    const at = [k.word(seg, "drift"), k.word(seg, "build,"), k.word(seg, "test."), k.word(seg, "store.") - 0.6];
    acc.forEach((p, i) => k.draw([p], at[Math.min(i, 3)] - 0.2, 0.6, 0, "power2.out"));
  },
};
