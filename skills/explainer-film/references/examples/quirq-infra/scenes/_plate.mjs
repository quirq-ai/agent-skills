// Shared shape of a plate scene: the plate 1:1 in the scene area, drawn on layer by layer,
// with the camera settling in and drifting. Scenes add their own HTML and motion on top.

export const PLATE_CSS = (id) => `
#s${id} .cam { position: absolute; inset: 0; transform-origin: 960px 515px; }
#s${id} .plate { position: absolute; left: 110px; top: 150px; width: 1700px; height: 730px; }
`;

export const plateHtml = (ctx, id, extra = "") =>
  `${ctx.fig(ctx.seg.fig, ctx.seg.name.toUpperCase())}<div class="cam" id="s${ctx.seg.id}-cam"><div class="plate">${ctx.plate(id)}</div>${extra}</div>`;
