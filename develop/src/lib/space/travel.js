/*
 * Travel along the helix. The camera has a continuous position `t` in index
 * space (0 = the newest project, n-1 = the oldest) and a `target` it eases
 * toward with a critically damped spring, so a flick of the wheel carries it
 * a few plates and it settles without overshoot. Pure: numbers in, numbers out.
 */
export function stepSpring(state, dt, omega) {
  const a = -2 * omega * state.v - omega * omega * state.x;
  const v = state.v + a * dt;
  const x = state.x + v * dt;
  return { x, v };
}

export function clamp(v, lo, hi) {
  return v < lo ? lo : v > hi ? hi : v;
}

// One frame of easing toward the target. `omega` sets the feel: ~6 is a
// glide, 40 is effectively instant (reduced motion).
export function stepTravel(s, dt, { omega = 6, min = 0, max }) {
  const target = clamp(s.target, min, max);
  const sp = stepSpring({ x: s.t - target, v: s.v }, Math.min(dt, 0.05), omega);
  const t = clamp(target + sp.x, min, max);
  const settled = Math.abs(sp.x) < 1e-3 && Math.abs(sp.v) < 1e-2;
  return { t: settled ? target : t, v: settled ? 0 : sp.v, target };
}

// Where the target lands after a wheel or drag delta, before snapping.
export function nudgeTarget(target, delta, min, max) {
  return clamp(target + delta, min, max);
}

// Once input goes quiet the target snaps to the nearest plate.
export function snapTarget(target, min, max) {
  return clamp(Math.round(target) || 0, min, max); // `|| 0` turns -0 into 0
}
