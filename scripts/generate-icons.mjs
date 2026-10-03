// Renders the Camellians mark — a six-petal camellia bloom — into the PNG
// icon set the manifest needs. Colours mirror the design tokens; they are
// duplicated here because an icon is generated at build time, outside the
// CSS token pipeline, and must never depend on the app's stylesheet.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import sharp from "sharp";

const OUT_DIR = join(process.cwd(), "public", "icons");

const IVORY = "#faf6ef";
const EVERGREEN_DEEP = "#1d3b31";
const BRASS = "#a68645";
const BRASS_LIGHT = "#c4a670";

/**
 * Builds the bloom as SVG. `inset` shrinks the mark inside its tile so the
 * maskable variant survives Android's aggressive cropping.
 */
function bloomSvg(size, { inset = 0, background = EVERGREEN_DEEP } = {}) {
  const c = size / 2;
  const r = c - inset;
  const petalW = r * 0.42;
  const petalH = r * 0.62;
  const petalCy = c - r * 0.5;

  const petals = Array.from({ length: 6 })
    .map((_, i) => {
      const angle = i * 60;
      const fill = i % 2 === 0 ? BRASS : BRASS_LIGHT;
      return `<g transform="rotate(${angle} ${c} ${c})">
        <ellipse cx="${c}" cy="${petalCy}" rx="${petalW}" ry="${petalH}"
                 fill="${fill}" opacity="0.95" />
      </g>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" fill="${background}" />
    ${petals}
    <circle cx="${c}" cy="${c}" r="${r * 0.17}" fill="${IVORY}" />
    <circle cx="${c}" cy="${c}" r="${r * 0.09}" fill="${EVERGREEN_DEEP}" />
  </svg>`;
}

const targets = [
  { file: "icon-192.png", size: 192, inset: 18 },
  { file: "icon-512.png", size: 512, inset: 48 },
  // Maskable: extra breathing room so the mark is never clipped.
  { file: "icon-512-maskable.png", size: 512, inset: 96 },
  { file: "apple-touch-icon.png", size: 180, inset: 20 },
  { file: "favicon-48.png", size: 48, inset: 5 },
];

mkdirSync(OUT_DIR, { recursive: true });

for (const { file, size, inset } of targets) {
  const svg = bloomSvg(size, { inset });
  const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
  writeFileSync(join(OUT_DIR, file), png);
  console.log(`wrote public/icons/${file} (${size}x${size}, ${png.length} bytes)`);
}

console.log("icons generated");
