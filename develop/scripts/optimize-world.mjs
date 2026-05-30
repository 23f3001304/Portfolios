/*
 * Convert the World photos to WebP at full resolution (no resize) and high
 * quality, so the big inspector view stays crisp while the files get smaller.
 * Re-run after dropping new .jpg/.jpeg/.png files into public/world.
 *
 *   node scripts/optimize-world.mjs
 */
import sharp from 'sharp';
import { readdir, stat, unlink } from 'node:fs/promises';
import path from 'node:path';

const DIR = path.resolve('../public/world');
const QUALITY = Number(process.argv[2]) || 82; // pass a number to override, e.g. `node scripts/optimize-world.mjs 80`

const files = (await readdir(DIR)).filter((f) => /\.(jpe?g|png)$/i.test(f));
if (!files.length) { console.log('No source images in public/world.'); process.exit(0); }

let before = 0, after = 0;
for (const f of files) {
  const src = path.join(DIR, f);
  const out = path.join(DIR, f.replace(/\.(jpe?g|png)$/i, '.webp'));
  const inBytes = (await stat(src)).size;
  await sharp(src).webp({ quality: QUALITY, effort: 5 }).toFile(out);
  const outBytes = (await stat(out)).size;
  before += inBytes; after += outBytes;
  await unlink(src); // drop the original so only the .webp ships
  const pct = Math.round((1 - outBytes / inBytes) * 100);
  console.log(`${f}  ${(inBytes / 1024).toFixed(0)}KB -> ${(outBytes / 1024).toFixed(0)}KB  (-${pct}%)`);
}
console.log(`\nTotal: ${(before / 1024 / 1024).toFixed(2)}MB -> ${(after / 1024 / 1024).toFixed(2)}MB  (-${Math.round((1 - after / before) * 100)}%)`);
