/*
 * The helix is time. One turn of the spiral is one year; a project sits on
 * it at the month it shipped (the end of its `when`), newest at the top and
 * nearest the camera. Everything here is pure geometry on plain numbers so
 * the scene can be laid out without a DOM and the layout can be tested.
 */
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

// "Aug → Sep 2026" | "Jun 2026" | "May 2026 → Present" | "2025" |
// "Dec 2024 → Feb 2025"  ->  { start: {y, m}, end: {y, m} }  (m is 1-12)
export function parseWhen(when, now = { y: 2026, m: 9 }) {
  const sides = String(when).split('→').map((s) => s.trim());
  const parse = (s) => {
    if (/present/i.test(s)) return { ...now, present: true };
    const y = (s.match(/\d{4}/) || [])[0];
    const mo = MONTHS.indexOf((s.match(/[A-Za-z]{3}/) || [''])[0].toLowerCase());
    return { y: y ? Number(y) : null, m: mo >= 0 ? mo + 1 : null };
  };
  const a = parse(sides[0]);
  const b = sides.length > 1 ? parse(sides[1]) : null;
  const end = b || a;
  // A bare month on the left borrows the year on the right.
  if (a.y == null) a.y = end.y ?? now.y;
  if (end.y == null) end.y = a.y;
  // A bare year sits mid-year.
  if (a.m == null) a.m = 6;
  if (end.m == null) end.m = a === end ? 6 : 6;
  return { start: { y: a.y, m: a.m }, end: { y: end.y, m: end.m } };
}

// Fractional years: Jan 2025 -> 2025.0, Jul 2025 -> 2025.5
export function timeIndex({ y, m }) {
  return y + (m - 1) / 12;
}

// A point on the helix at time t (years), radius r. The axis is y; one turn
// per year; height grows with time so newer is higher.
export function helixPoint(t, r, pitch, tBase) {
  const a = t * Math.PI * 2;
  return { x: Math.cos(a) * r, y: (t - tBase) * pitch, z: Math.sin(a) * r };
}

// Lay the projects out. Returns them sorted newest first, each with its time
// and its plate position. Two projects within `minGap` years of each other
// are spread apart so plates never overlap.
export function helixLayout(projects, { radius = 7, pitch = 5, minGap = 0.09, now } = {}) {
  const items = projects.map((p) => {
    const { end } = parseWhen(p.when, now);
    return { project: p, t: timeIndex(end) };
  });
  items.sort((a, b) => a.t - b.t);
  // Spread collisions downward (older), so the newest keeps its true date.
  for (let i = items.length - 2; i >= 0; i--) {
    if (items[i + 1].t - items[i].t < minGap) items[i].t = items[i + 1].t - minGap;
  }
  const tBase = items[0].t;
  const laid = items.map((it) => ({ ...it, pos: helixPoint(it.t, radius, pitch, tBase) }));
  laid.reverse(); // newest first
  return { items: laid, tMin: tBase, tMax: laid[0].t, radius, pitch };
}

// Continuous index (0 = newest) -> time, interpolating between neighbours.
export function indexToTime(layout, i) {
  const n = layout.items.length;
  const c = Math.max(0, Math.min(n - 1, i));
  const lo = Math.floor(c), hi = Math.min(n - 1, lo + 1);
  const f = c - lo;
  return layout.items[lo].t * (1 - f) + layout.items[hi].t * f;
}

// Fractional years -> a "2026 · 08" readout.
export function timeLabel(t) {
  const y = Math.floor(t);
  const m = Math.min(12, Math.max(1, Math.round((t - y) * 12) + 1));
  return `${y} · ${String(m).padStart(2, '0')}`;
}
