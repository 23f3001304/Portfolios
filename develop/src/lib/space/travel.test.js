import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stepTravel, nudgeTarget, snapTarget } from './travel.js';

test('stepTravel eases toward the target and settles without overshoot', () => {
  let s = { t: 0, v: 0, target: 3 };
  let minT = 0, maxT = 0;
  for (let i = 0; i < 300; i++) { s = stepTravel(s, 1 / 60, { omega: 6, min: 0, max: 12 }); minT = Math.min(minT, s.t); maxT = Math.max(maxT, s.t); }
  assert.equal(s.t, 3);
  assert.equal(s.v, 0);
  assert.ok(maxT <= 3 + 0.02, `no overshoot, max was ${maxT}`);
  assert.ok(minT >= 0);
});

test('stepTravel clamps the target to the range', () => {
  const s = stepTravel({ t: 5, v: 0, target: 40 }, 1 / 60, { omega: 6, min: 0, max: 12 });
  assert.equal(s.target, 12);
});

test('nudgeTarget and snapTarget stay in range', () => {
  assert.equal(nudgeTarget(11.6, 3, 0, 12), 12);
  assert.equal(nudgeTarget(0.2, -3, 0, 12), 0);
  assert.equal(snapTarget(2.6, 0, 12), 3);
  assert.equal(snapTarget(-0.4, 0, 12), 0);
});
