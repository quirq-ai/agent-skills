// The music plan of the Innernet field guide film (2:49), kept as a worked example of
// src/music.mjs: a dawn open, a swell into each chapter card, an intimate close-in for the
// privacy beat (F07), a dusk into the night chapter (III), and dawn at the close. It was
// rendered by ElevenLabs music_v2_5 in one composition and fitted to the film with bed.mjs.
// Frame ids refer to that film: 03, 11 and 17 are its chapter cards, 21 its close.

export const PRE_CARD = 1.2;

// Gain trims on the raw render (dB, smoothstep ramps), pinned to film events like the chunks.
// The render's dawn intro arrives about 15 dB under the body, and its last chord dies early.
export const TRIMS = [
  { from: [null, "zero", 0], to: ["03", "start", -PRE_CARD - 0.3], db: 10, rampIn: 0, rampOut: 1.2 },
  { from: ["21", "voEnd", -4.5], to: [null, "end", 0], db: 6, rampIn: 2.0, rampOut: 0 },
];

// The privacy beat (F07 "Stays on your machine"): the bed closes in around the line, a low pass
// sweeping down to hz and a small dip, then opens again as the readers arrive.
export const CLOSE_IN = { from: ["07", "start", 0], to: ["08", "start", 0], hz: 2200, db: -2, ramp: 1.4 };

const NEG = ["vocals", "lyrics", "singing", "choir", "humming", "spoken word", "drum kit", "cymbals", "EDM", "busy lead melody", "bright synth lead"];

// Each chunk ends at `to`: [frame id, event, offset seconds]. The last one ends at the film's end.
export const CHUNKS = [
  {
    to: ["03", "start", -PRE_CARD],
    label: "Dawn (open)",
    text: "[Intro]",
    positive: [
      "cinematic ambient underscore",
      "instrumental only",
      "documentary film score",
      "felt piano, soft and close",
      "warm analog pads",
      "dawn light, hopeful and calm",
      "spacious and sparse",
      "gentle low mid register",
      "68 BPM",
      "D major",
      "great production quality",
    ],
    negative: [...NEG, "percussion", "fast tempo"],
  },
  {
    to: ["04", "voStart", 0],
    label: "Turn into I (swell)",
    text: "[Swell]\n{strings swell}",
    positive: ["a slow rising swell", "legato strings bloom in", "warm pads open up", "crescendo into a new section, then settle", "D major"],
    negative: [...NEG, "abrupt"],
  },
  {
    to: ["07", "start", 0],
    label: "I: crawl, read, index",
    text: "[Chapter One]",
    positive: ["gentle forward pulse", "soft low arpeggio on felt piano", "a sense of wonder", "legato strings enter softly", "warm pads", "steady and patient", "melody sparse, leaving room for a narrator"],
    negative: [...NEG, "staccato brass", "high busy melody"],
  },
  {
    to: ["08", "start", 0],
    label: "I: privacy beat (the bed closes in)",
    text: "[Interlude]\n{the pulse falls away}",
    positive: ["intimate and sheltered", "just felt piano and a warm low pad", "quiet, close, reassuring", "a held breath", "very sparse", "safe and still"],
    negative: [...NEG, "pulse", "arpeggio", "strings swell", "bright"],
  },
  {
    to: ["11", "start", -PRE_CARD],
    label: "I: the two readers",
    text: "[Chapter One, continued]",
    positive: ["the gentle pulse returns", "curious wonder", "strings and felt piano", "soft momentum", "warm", "D major"],
    negative: [...NEG, "high busy melody"],
  },
  {
    to: ["12", "voStart", 0],
    label: "Turn into II (swell)",
    text: "[Swell]\n{plucked strings bloom}",
    positive: ["a gentle swell", "plucked strings bloom in", "lifting and lighter", "crescendo, then settle", "D major"],
    negative: [...NEG, "abrupt"],
  },
  {
    to: ["17", "start", -PRE_CARD],
    label: "II: add a site",
    text: "[Chapter Two]",
    positive: ["lighter and curious", "plucked textures", "soft pizzicato strings", "felt piano", "airy pads", "playful but calm", "D major"],
    negative: [...NEG, "heavy", "dark"],
  },
  {
    to: ["18", "voStart", 0],
    label: "Turn into III (dusk swell)",
    text: "[Dusk]\n{a slow swell into night}",
    positive: ["dusk falling", "a slow swell sinking into darkness", "low cello enters", "pads deepen", "moving to B minor"],
    negative: [...NEG, "bright", "plucks"],
  },
  {
    to: ["20", "start", 0],
    label: "III: night",
    text: "[Night]",
    positive: ["night", "deep warm pads", "low solo cello", "introspective", "slow and still", "sparse felt piano notes", "low register", "B minor"],
    negative: [...NEG, "bright", "pizzicato", "fast", "high melody"],
  },
  {
    to: ["21", "start", -PRE_CARD],
    label: "III: swell before dawn",
    text: "[Night, before dawn]",
    positive: ["a slow swell building", "cello and pads rising", "anticipation of dawn", "light returning", "gradual crescendo"],
    negative: [...NEG, "abrupt"],
  },
  {
    to: ["21", "voEnd", 0],
    label: "Close: dawn returns",
    text: "[Dawn returns]",
    positive: ["dawn returns", "full warm swell", "strings and felt piano together", "the opening theme returns", "radiant but gentle", "D major"],
    negative: [...NEG, "bombastic"],
  },
  {
    to: null,
    label: "Close: resolve",
    text: "[Outro]",
    positive: ["soft resolve", "a final sustained D major chord", "let it ring", "gentle ending", "one last felt piano note"],
    negative: [...NEG, "abrupt ending", "building"],
  },
];
