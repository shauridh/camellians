// Prints every contrast ratio the palette claims, so comments in globals.css
// can be checked against reality instead of asserted from memory.
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
const token = (name) => {
  const m = css.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{3,8});`));
  if (!m) throw new Error(`missing token --${name}`);
  return m[1];
};

const lum = (hex) => {
  const v = hex.replace("#", "");
  const ch = (raw) => {
    const c = raw / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return (
    0.2126 * ch(parseInt(v.slice(0, 2), 16)) +
    0.7152 * ch(parseInt(v.slice(2, 4), 16)) +
    0.0722 * ch(parseInt(v.slice(4, 6), 16))
  );
};
const ratio = (a, b) => {
  const la = lum(a), lb = lum(b);
  const hi = Math.max(la, lb), lo = Math.min(la, lb);
  return Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100;
};

const C = {
  ivory: token("color-ivory"),
  paper: token("color-paper"),
  ink: token("color-ink"),
  evergreen: token("color-evergreen"),
  evergreenDeep: token("color-evergreen-deep"),
  sage: token("color-sage"),
  mist: token("color-mist"),
  camellia: token("color-camellia"),
  blush: token("color-blush"),
  brass: token("color-brass"),
  stone: token("color-stone"),
  slateMuted: token("color-slate-muted"),
  alert: token("color-alert"),
};

const checks = [
  ["ink / ivory", C.ink, C.ivory],
  ["ink / paper", C.ink, C.paper],
  ["ink / mist", C.ink, C.mist],
  ["ink / blush", C.ink, C.blush],
  ["ink / brass", C.ink, C.brass],
  ["evergreen / ivory", C.evergreen, C.ivory],
  ["evergreen / paper", C.evergreen, C.paper],
  ["evergreen-deep / ivory", C.evergreenDeep, C.ivory],
  ["ivory / evergreen", C.ivory, C.evergreen],
  ["camellia / ivory", C.camellia, C.ivory],
  ["camellia / paper", C.camellia, C.paper],
  ["slate-muted / ivory", C.slateMuted, C.ivory],
  ["slate-muted / paper", C.slateMuted, C.paper],
  ["alert / ivory", C.alert, C.ivory],
  ["sage / ivory", C.sage, C.ivory],
  ["sage / paper", C.sage, C.paper],
  ["brass / ivory", C.brass, C.ivory],
  ["brass / paper", C.brass, C.paper],
  ["stone / ivory", C.stone, C.ivory],
];

const pad = (s, n) => String(s).padEnd(n);
for (const [label, fg, bg] of checks) {
  console.log(`${pad(label, 24)} ${pad(ratio(fg, bg), 6)}`);
}
