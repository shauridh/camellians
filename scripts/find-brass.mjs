// Finds a warm gold ("brass") that satisfies three constraints at once:
//   - >= 3:1 against ivory   (SC 1.4.11, petal indicators)
//   - >= 3:1 against paper   (SC 1.4.11, on raised surfaces)
//   - >= 4.5:1 for ink text sitting ON brass (SC 1.4.3, badges)
// Gold hue is enforced (red > green > blue with a real warm cast) so the
// optimizer cannot drift into olive.
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
  const la = lum(a);
  const lb = lum(b);
  const hi = Math.max(la, lb);
  const lo = Math.min(la, lb);
  return (hi + 0.05) / (lo + 0.05);
};
const ivory = "#faf6ef";
const paper = "#ffffff";
const ink = "#16241e";
const hex = (r, g, b) =>
  "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("").toUpperCase();

const results = [];
for (let r = 150; r <= 205; r++) {
  for (let g = 105; g <= 160; g++) {
    for (let b = 30; b <= 95; b++) {
      const warmCast = r - g; // gold has a clear red-over-green step
      const blueStep = g - b; // and green well above blue
      if (!(warmCast >= 22 && warmCast <= 55 && blueStep >= 50)) continue;
      const c = hex(r, g, b);
      const iv = ratio(c, ivory);
      const pa = ratio(c, paper);
      const ik = ratio(ink, c);
      if (iv < 3 || pa < 3 || ik < 4.5) continue;
      const margin = Math.min(iv - 3, pa - 3, ik - 4.5);
      results.push({ c, iv: +iv.toFixed(2), pa: +pa.toFixed(2), ik: +ik.toFixed(2), margin: +margin.toFixed(3) });
    }
  }
}

results.sort((a, b) => b.margin - a.margin);
console.log("candidates:", results.length);
console.log("top 5 by min margin:");
for (const r of results.slice(0, 5)) console.log(" ", r);
