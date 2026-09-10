// The site's mark, and the favicon set cut from it.
//
// An H in two ink bars, with the crossbar in the accent - the same orange bar
// the page uses as its separator dot and its section counters, so the mark and
// the page share a vocabulary. Geometric on purpose: it has to survive 16px in
// a tab and still be the same shape at 180px on a phone's home screen.
//
// Out: public/favicon.svg          (bars follow the tab's light/dark scheme)
//      public/favicon-32.png       (32x32, for browsers that skip SVG icons)
//      public/apple-touch-icon.png (180x180 on the page ground; iOS rounds it)
// Run: node scripts/favicon.mjs
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import sharp from 'sharp';

const INK = '#0a0a0a', INK_DARK = '#f5f6f8', ACCENT = '#ff5e00', BG = '#fafafa';

// One shape, three renderings. Coordinates are a 32-unit grid: two 6-wide bars
// 10 apart, a 5-tall crossbar spanning both, everything centred.
export const markPaths = (ink, accent) => `
  <rect x="5"  y="4"    width="6"  height="24" rx="1.5" fill="${ink}"/>
  <rect x="21" y="4"    width="6"  height="24" rx="1.5" fill="${ink}"/>
  <rect x="5"  y="13.5" width="22" height="5"  rx="1.5" fill="${accent}"/>`;

export const markSvg = ({ size = 32, ink = INK, accent = ACCENT, attrs = '' } = {}) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32"${attrs}>${markPaths(ink, accent)}</svg>`;

// Only run the file writes when invoked directly, so og.mjs can import the
// mark without regenerating the icons.
if (process.argv[1] && resolve(process.argv[1]) === resolve('scripts/favicon.mjs')) {
  // SVG favicon: the bars flip with the tab's colour scheme, the accent stays.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <style>
    .ink { fill: ${INK}; }
    @media (prefers-color-scheme: dark) { .ink { fill: ${INK_DARK}; } }
  </style>
  <rect x="5"  y="4"    width="6"  height="24" rx="1.5" class="ink"/>
  <rect x="21" y="4"    width="6"  height="24" rx="1.5" class="ink"/>
  <rect x="5"  y="13.5" width="22" height="5"  rx="1.5" fill="${ACCENT}"/>
</svg>
`;
  writeFileSync(resolve('public/favicon.svg'), svg);

  await sharp(Buffer.from(markSvg({ size: 32 }))).png().toFile(resolve('public/favicon-32.png'));

  // Apple ignores transparency and rounds the corners itself, so: the page
  // ground, the mark at ~62% so the rounding never clips a bar.
  const touch = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
    <rect width="180" height="180" fill="${BG}"/>
    <g transform="translate(34 34) scale(3.5)">${markPaths(INK, ACCENT)}</g>
  </svg>`;
  await sharp(Buffer.from(touch)).png().toFile(resolve('public/apple-touch-icon.png'));

  console.log('done public/favicon.svg, favicon-32.png, apple-touch-icon.png');
}
