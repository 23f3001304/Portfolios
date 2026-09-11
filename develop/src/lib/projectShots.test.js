import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cardShot, heroShot } from './projectShots.js';

test('a project with card derivatives draws the 1000w card with its 500w beside it', () => {
  const shot = cardShot({ slug: 'tcursor', hero: { dark: '/projects/tcursor/product-tilt-dark.webp' } }, 'dark');
  assert.equal(shot.src, '/projects/tcursor/card-dark.webp');
  assert.equal(shot.srcSet, '/projects/tcursor/card-dark-500.webp 500w, /projects/tcursor/card-dark.webp 1000w');
  assert.deepEqual([shot.width, shot.height], [1000, 667]);
});

test('each theme gets its own feel of the card', () => {
  assert.equal(cardShot({ slug: 'saathi' }, 'light').src, '/projects/saathi/card-light.webp');
  assert.equal(cardShot({ slug: 'saathi' }, 'dark').src, '/projects/saathi/card-dark.webp');
});

test('a project without derivatives falls back to its hero', () => {
  const shot = cardShot({ slug: 'not-generated', hero: { light: '/projects/x/product-tilt-light.webp' } }, 'light');
  assert.equal(shot.src, '/projects/x/product-tilt-light.webp');
  assert.equal(shot.srcSet, undefined);
});

test('a project with neither is drawn with nothing', () => {
  assert.equal(cardShot({ slug: 'not-generated' }, 'dark'), null);
});

test('the hero offers its card derivatives, so a narrow column never downscales the 2400px file', () => {
  const shot = heroShot({ slug: 'livon', hero: { dark: '/projects/livon/product-tilt-dark.webp' } }, 'dark');
  assert.equal(shot.src, '/projects/livon/product-tilt-dark.webp');
  assert.equal(
    shot.srcSet,
    '/projects/livon/card-dark-500.webp 500w, /projects/livon/card-dark.webp 1000w, /projects/livon/product-tilt-dark.webp 2400w',
  );
  assert.deepEqual([shot.width, shot.height], [2400, 1600]);
});

test('a hero with no derivatives is offered alone', () => {
  const shot = heroShot({ slug: 'not-generated', hero: { light: '/projects/x/product-tilt-light.webp' } }, 'light');
  assert.equal(shot.src, '/projects/x/product-tilt-light.webp');
  assert.equal(shot.srcSet, undefined);
  assert.equal(heroShot({ slug: 'not-generated' }, 'light'), null);
});
