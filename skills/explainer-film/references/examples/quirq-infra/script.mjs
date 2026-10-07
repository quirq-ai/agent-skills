// The narration, one line per frame (chapter cards are silent). Every claim here is
// checked against FACTS.md. Lily (ElevenLabs) reads it; scripts/voice.mjs renders it.

export const VOICE = { id: "pFZP5JQG7iQjIQuC4Bku", name: "Lily", model: "eleven_multilingual_v2", speed: 0.96 };

// How Lily should say words she would otherwise misread. The captions keep the written
// word; only the text sent to the voice changes. Check new spellings with scripts/stt-check.mjs.
export const SAY = [
  ["qq", "Q Q"],
  ["quirq", "quirk"],
  ["innernet", "Inner-net"],
  ["xo-space", "X O space"],
  ["infra-config", "infra config"],
];

/** The text Lily is given for a line. */
export const spoken = (text) => SAY.reduce((t, [w, s]) => t.replace(new RegExp(`(?<![\\w-])${w.replace(/[-]/g, "\\-")}(?![\\w-])`, "g"), s), text);

export const LINES = {
  "01": "Every change to a quirq product starts as a pull request. And every one asks the same question: is it safe to ship?",
  "02": "quirq infra, qq for short, answers it the way Chromium does. Thirteen small public repositories, each with one job, running on GitHub.",
  "04": "A product writes one file by hand: its manifest, which pins its toolchains by digest. Everything else is generated from infra-config, the one repo where every policy lives as config.",
  "05": "Open a pull request, and presubmit runs. A drift check, then build, then test. Every result lands in one write-once store.",
  "06": "The gate decides what must pass. Then the merge queue is set to test the exact merge result, and squashes it onto main.",
  "07": "Every ten minutes, release marks the newest commit whose checks are all green. Last known good.",
  "08": "Each morning, release builds a canary from last known good and tests it. It is meant for agents and test environments; people still install from main. Dev and stable come later, and only when a person says so.",
  "10": "If main breaks, the gardener finds the culprit and proposes a clean revert. Never more than ten a day.",
  "11": "Rollers keep dependencies fresh, one small pull request at a time. And perf records the speed and size of every commit.",
  "12": "Agents may propose the routine: reverts, rolls and docs. People own the rules, and every promotion past canary.",
  "13": "Thirteen repositories. Policy flows down from infra-config, results flow back up, and every link is a pinned commit. Two products use it today: xo-space and innernet.",
  "15": "To start, clone the depot and put qq on your path. Then qq sync fetches every pinned toolchain, and checks its digest.",
  "16": "This is version zero, and it has edges. Toolchains are built for Linux, so Macs can't sync yet. Reverts are only proposed, and a person still merges every roll.",
  "17": "The first canary has been built for both products; for now, people still install from main. Next comes the alpha, where a small group lands real work through qq, and tells us what breaks.",
  "18": "One path, from a pull request to a release. Built in the open, made to be run by agents, and owned by people. quirq infra.",
};
