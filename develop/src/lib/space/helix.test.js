import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseWhen, timeIndex, helixLayout, indexToTime, timeLabel } from './helix.js';

const now = { y: 2026, m: 9 };

test('parseWhen handles every date shape the projects use', () => {
  assert.deepEqual(parseWhen('Aug → Sep 2026', now), { start: { y: 2026, m: 8 }, end: { y: 2026, m: 9 } });
  assert.deepEqual(parseWhen('Jun 2026', now), { start: { y: 2026, m: 6 }, end: { y: 2026, m: 6 } });
  assert.deepEqual(parseWhen('May 2026 → Present', now), { start: { y: 2026, m: 5 }, end: { y: 2026, m: 9 } });
  assert.deepEqual(parseWhen('2025', now), { start: { y: 2025, m: 6 }, end: { y: 2025, m: 6 } });
  assert.deepEqual(parseWhen('Nov → Dec 2025', now), { start: { y: 2025, m: 11 }, end: { y: 2025, m: 12 } });
  assert.deepEqual(parseWhen('Dec 2024 → Feb 2025', now), { start: { y: 2024, m: 12 }, end: { y: 2025, m: 2 } });
});

test('timeIndex is fractional years', () => {
  assert.equal(timeIndex({ y: 2025, m: 1 }), 2025);
  assert.equal(timeIndex({ y: 2025, m: 7 }), 2025.5);
});

test('helixLayout sorts newest first, spreads collisions, climbs with time', () => {
  const layout = helixLayout([
    { slug: 'a', when: 'Jun 2026' }, { slug: 'b', when: 'Jun 2026' }, { slug: 'c', when: 'Oct → Nov 2024' },
  ], { now, radius: 7, pitch: 5 });
  assert.deepEqual(layout.items.map((i) => i.project.slug), ['b', 'a', 'c']);
  assert.ok(layout.items[0].t - layout.items[1].t >= 0.09 - 1e-9, 'same-month projects are spread apart');
  assert.equal(layout.items[2].pos.y, 0, 'the oldest sits at the base');
  assert.ok(layout.items[0].pos.y > layout.items[1].pos.y, 'newer is higher');
  assert.ok(Math.abs(Math.hypot(layout.items[0].pos.x, layout.items[0].pos.z) - 7) < 1e-9, 'plates sit on the radius');
});

test('indexToTime interpolates and clamps', () => {
  const layout = helixLayout([{ when: 'Jun 2026' }, { when: 'Jun 2025' }], { now });
  assert.equal(indexToTime(layout, 0), layout.items[0].t);
  assert.equal(indexToTime(layout, 1), layout.items[1].t);
  assert.ok(Math.abs(indexToTime(layout, 0.5) - (layout.items[0].t + layout.items[1].t) / 2) < 1e-9);
  assert.equal(indexToTime(layout, 5), layout.items[1].t);
  assert.equal(indexToTime(layout, -3), layout.items[0].t);
});

test('timeLabel prints year and month', () => {
  assert.equal(timeLabel(2026 + 7 / 12), '2026 · 08');
  assert.equal(timeLabel(2025), '2025 · 01');
});
