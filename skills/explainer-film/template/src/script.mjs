// The narration, one line per frame (chapter cards are silent). Every claim here is
// checked against FACTS.md. scripts/voice.mjs renders it with the voice below.

// The narrator. Pick by ear: render one line with three or four candidate voices
// (node scripts/eleven.mjs voices; node scripts/eleven.mjs tts <id> "<line>" <out.mp3>)
// and let the requester choose. Innernet's film used Lily (velvety British, warm, clear).
export const VOICE = { id: "pFZP5JQG7iQjIQuC4Bku", name: "Lily", model: "eleven_multilingual_v2", speed: 0.96 };

// How the voice should say words it otherwise slurs (product names, acronyms). The captions
// keep the written word; only the text sent to the voice changes. Prove each spelling by
// transcribing it back (node scripts/stt-check.mjs). Innernet needed:
//   ["Innerpedia", "Innerr-pedia"], ["Innernet", "Inner-net"], ["README", "read me"]
export const SAY = [];

/** The text the voice is given for a line. */
export const spoken = (text) => SAY.reduce((t, [w, s]) => t.replace(new RegExp(`\\b${w}\\b`, "g"), s), text);

export const LINES = {
  "01": "Every product starts with a problem worth a minute of your time.",
  "03": "Here is the one idea that makes it work, drawn on as the narrator names it.",
  "04": "That is the whole of it. Small, clear, and yours.",
};
