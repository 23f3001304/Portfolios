// Card thumbnails for the /projects index.
//
// The heroes ship at 2400px because the detail pages show them full width. The
// index draws the same picture at ~450 CSS px, and letting the browser do a
// 5x downscale of a screenshot is what makes the UI text inside it look
// crunchy and harsh. So the index gets its own derivatives, resampled properly
// (lanczos3, one pass) at the two sizes it actually paints: 1000w for 2x
// displays, 500w for 1x. The <img> picks between them with srcset.
//
// Source is the raw capture in scripts/.shots/product when it's there - one
// resample from the original beats resampling an already-compressed webp.
//
// Run: node scripts/card-thumbs.mjs [project ...]
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import sharp from 'sharp';
import { projects } from '../src/data.js';

const WIDTHS = [1000, 500];

const targets = process.argv.slice(2);
const list = projects.filter(
  (p) => p.hero && (targets.length === 0 || targets.includes(p.slug)),
);

const dims = [];
for (const p of list) {
  for (const feel of ['light', 'dark']) {
    const hero = p.hero[feel];   // /projects/<id>/{product-<style>,poster}-<feel>.webp
    const style = hero.includes('-flat-') ? 'flat' : 'tilt';
    const raw = [
      `scripts/.shots/product/${p.slug}--${style}-${feel}.png`,
      `scripts/.shots/poster/${p.slug}--${feel}.png`,
    ].map((f) => resolve(f)).find(existsSync);
    const src = raw ?? resolve(`public${hero}`);

    for (const w of WIDTHS) {
      const rel = `/projects/${p.slug}/card-${feel}${w === 1000 ? '' : `-${w}`}.webp`;
      const info = await sharp(src)
        .resize({ width: w, kernel: 'lanczos3' })
        .webp({ quality: 92 })
        .toFile(resolve(`public${rel}`));
      dims.push(`  '${rel}': [${info.width}, ${info.height}],`);
    }
    console.log('done', p.slug, feel, raw ? '(from raw)' : '(from webp)');
  }
}

console.log('\n// paste into src/imageDims.js:\n' + dims.join('\n'));
