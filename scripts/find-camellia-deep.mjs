// The "Penting" badge is rose text on a blush surface. Blush is light, so the
// rose must be deepened to stay above 4.5:1. This finds the deepest-but-still
// rosy value that passes on blush AND on ivory.
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
const blush = "#f7e4e9";
const ivory = "#faf6ef";
const paper = "#ffffff";
const hex = (r, g, b) =>
  "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("").toUpperCase();

console.log("current #B04A66 on blush:", ratio("#B04A66", blush).toFixed(2));
console.log("current #B04A66 on ivory:", ratio("#B04A66", ivory).toFixed(2));

const results = [];
for (let r = 110; r <= 175; r++) {
  for (let g = 40; g <= 95; g++) {
    for (let b = 55; b <= 115; b++) {
      // Rose character: red dominant, blue between green and red.
      if (!(r > b && b > g && r - g >= 55)) continue;
      const c = hex(r, g, b);
      const bl = ratio(c, blush);
      const iv = ratio(c, ivory);
      const pa = ratio(c, paper);
      if (bl < 4.5 || iv < 4.5 || pa < 4.5) continue;
      results.push({ c, blush: +bl.toFixed(2), ivory: +iv.toFixed(2), paper: +pa.toFixed(2) });
    }
  }
}

// Prefer the brightest that passes, so it still reads as camellia rose.
results.sort((a, b) => b.blush - a.blush);
console.log("\ncandidates:", results.length);
for (const r of results.slice(0, 6)) console.log(" ", r);
