// Finds a headless Chrome for the screenshot scripts: $CHROME if set, else the newest
// Playwright build in $PLAYWRIGHT_BROWSERS_PATH, ~/Library/Caches/ms-playwright (macOS) or
// ~/.cache/ms-playwright (Linux), else Chrome or Chromium on the PATH.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export function chrome() {
  if (process.env.CHROME) return process.env.CHROME;
  const roots = [process.env.PLAYWRIGHT_BROWSERS_PATH, path.join(os.homedir(), "Library/Caches/ms-playwright"), path.join(os.homedir(), ".cache/ms-playwright")].filter(Boolean);
  const exe = [
    ["chrome-headless-shell-mac-arm64", "chrome-headless-shell"], ["chrome-headless-shell-mac-x64", "chrome-headless-shell"],
    ["chrome-headless-shell-linux64", "chrome-headless-shell"], ["chrome-linux", "headless_shell"], ["chrome-linux", "chrome"], ["chrome-linux64", "chrome"],
  ];
  for (const r of roots) {
    if (!fs.existsSync(r)) continue;
    const dirs = fs.readdirSync(r).filter((d) => /^chromium(_headless_shell)?-\d+$/.test(d)).sort((a, b) => Number(b.split("-").pop()) - Number(a.split("-").pop()) || (b.includes("headless") ? 1 : 0) - (a.includes("headless") ? 1 : 0));
    for (const d of dirs) for (const [sub, bin] of exe) {
      const p = path.join(r, d, sub, bin);
      if (fs.existsSync(p)) return p;
    }
  }
  for (const name of ["chromium", "chromium-browser", "google-chrome", "chrome"]) {
    try {
      return execFileSync("which", [name], { encoding: "utf8" }).trim();
    } catch {}
  }
  throw new Error("no headless Chrome found; set CHROME=/path/to/chrome");
}

/** Extra flags: full Chrome needs --headless (the headless shell is headless already), and
 *  Chrome refuses to run as root (containers, CI) without --no-sandbox. */
export const chromeFlags = (bin) => [
  ...(/headless/.test(path.basename(bin)) ? [] : ["--headless=new"]),
  ...(process.getuid?.() === 0 ? ["--no-sandbox"] : []),
];
