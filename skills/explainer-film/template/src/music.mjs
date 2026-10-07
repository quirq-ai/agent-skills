// The music plan: what the bed should feel like, section by section, pinned to the film's
// turns. assets/audio/music/bed.mjs reads it (plan / generate / build).
//
// A pin is [frame id, event, offset seconds]. Events: "start" / "end" of a frame, "voStart" /
// "voEnd" of its line, "zero" (film start), "end" (film end). Every chunk must last at least
// 3 seconds (the API's floor). Re-run `bed.mjs plan` after timing changes to check.
// references/examples/innernet/music-plan.mjs is the full plan of the reference film.

export const PRE_CARD = 1.2; // a turn's swell starts this long before its card

// Styles every chunk refuses: no voices or drums under a narrator.
const NEG = ["vocals", "lyrics", "singing", "choir", "humming", "spoken word", "drum kit", "cymbals", "EDM", "busy lead melody", "bright synth lead"];

// Each chunk ends at `to`; the last one (to: null) ends at the film's end.
export const CHUNKS = [
  {
    to: ["02", "start", -PRE_CARD],
    label: "Open",
    text: "[Intro]",
    positive: ["cinematic ambient underscore", "instrumental only", "documentary film score", "felt piano, soft and close", "warm analog pads", "hopeful and calm", "spacious and sparse", "68 BPM", "D major", "great production quality"],
    negative: [...NEG, "percussion", "fast tempo"],
  },
  {
    to: ["03", "voStart", 0],
    label: "Turn into I (swell)",
    text: "[Swell]\n{strings swell}",
    positive: ["a slow rising swell", "legato strings bloom in", "warm pads open up", "crescendo into a new section, then settle", "D major"],
    negative: [...NEG, "abrupt"],
  },
  {
    to: ["04", "start", 0],
    label: "I",
    text: "[Chapter One]",
    positive: ["gentle forward pulse", "soft low arpeggio on felt piano", "a sense of wonder", "warm pads", "melody sparse, leaving room for a narrator", "D major"],
    negative: [...NEG, "high busy melody"],
  },
  {
    to: null,
    label: "Close: resolve",
    text: "[Outro]",
    positive: ["the opening theme returns", "full warm swell, then a soft resolve", "a final sustained D major chord", "let it ring"],
    negative: [...NEG, "abrupt ending", "bombastic"],
  },
];

// Gain trims on the raw render (dB, smoothstep ramps), pinned like the chunks. Listen to the
// raw render first: Innernet's intro came back about 15 dB under the body (+10 dB fixed it).
export const TRIMS = [];

// Optional: one beat where the bed closes in around the line (a low pass sweeping down to hz
// and a small dip), then opens again. Innernet used it for its privacy beat. null for none.
export const CLOSE_IN = null; // e.g. { from: ["07", "start", 0], to: ["08", "start", 0], hz: 2200, db: -2, ramp: 1.4 }
