// Sage must clear 3:1 on ivory (SC 1.4.11) because it draws icons, but it
// should stay as light and quiet as possible. So: maximise luminance subject
// to the constraint, not margin.
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
  return (hi + 0.05) / (lo + 0.05);
};
const ivory = "#faf6ef";
const paper = "#ffffff";
const hex = (r, g, b) =>
  "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("").toUpperCase();

// Small buffer above the threshold so rounding never dips below 3.
const TARGET = 3.03;

const results = [];
for (let r = 95; r <= 150; r++) {
  for (let g = 120; g <= 175; g++) {
    for (let b = 105; b <= 165; b++) {
      // Sage character: green dominant, restrained saturation.
      if (!(g > r && g > b && g - r <= 40 && g - b <= 30)) continue;
      const c = hex(r, g, b);
      const iv = ratio(c, ivory);
      const pa = ratio(c, paper);
      if (iv < TARGET || pa < TARGET) continue;
      results.push({ c, L: +lum(c).toFixed(4), iv: +iv.toFixed(2), pa: +pa.toFixed(2) });
    }
  }
}

// Lightest first.
results.sort((a, b) => b.L - a.L);
console.log("candidates:", results.length);
console.log("lightest compliant:");
for (const r of results.slice(0, 6)) console.log(" ", r);
