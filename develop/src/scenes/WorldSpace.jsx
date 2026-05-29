import { useEffect, useRef, useState } from 'react';
import { worldPhotos } from '../worldData.js';
import { createGuideAudio } from './guideAudio.js';

/* ============================================================
   The world - an infinite canvas of photographs. A flat plane
   you pan (drag) and zoom (⌘/ctrl-scroll or pinch) around
   forever. Photos sit in infinite masonry columns at their TRUE
   aspect ratio - never cropped. Only the columns/rows in view
   are in the DOM, so it's endless in every direction. The 3D
   lives in the hover: the photo under the cursor tilts in
   perspective and lifts toward you while the rest blur back.
   ============================================================ */

const COL_W = 270;     // column width in world units (at zoom 1)
const COL_GAP = 44;
const ROW_GAP = 44;
const COL_STRIDE = COL_W + COL_GAP;
const MIN_ZOOM = 0.28;
const MAX_ZOOM = 2.4;
const FRICTION = 0.9;  // pan-momentum decay per frame
const CURVE_ANG = 10;  // max degrees a cell rotates at the viewport edge (sphere bow)
const CURVE_DEPTH = 130; // how far edge cells recede in Z (the globe curvature)

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hashInt(n) {
  let h = Math.imul((n | 0) ^ 0x9e3779b9, 2654435761);
  h ^= h >>> 15;
  return h >>> 0;
}
function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
function photoHeight(i) { return COL_W * worldPhotos[i].h / worldPhotos[i].w; }

const N = worldPhotos.length;

function formatTaken(iso) {
  if (!iso) return { date: '—', time: '—', dow: '' };
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { date: '—', time: '—', dow: '' };
  try {
    return {
      date: d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      dow: d.toLocaleDateString('en-GB', { weekday: 'long' }),
    };
  } catch {
    return { date: '—', time: '—', dow: '' };
  }
}

export default function WorldSpace({ selected, setSelected }) {
  const wrapRef = useRef(null);
  const surfaceRef = useRef(null);
  const readoutRef = useRef(null);
  const [cells, setCells] = useState([]);
  const [dims, setDims] = useState(null);

  // Mirror the rendered cells + their DOM nodes into refs so the rAF loop can
  // write each cell's curvature transform without re-rendering React.
  const cellsRef = useRef([]);
  const forceRef = useRef(false);
  useEffect(() => { cellsRef.current = cells; forceRef.current = true; }, [cells]);
  const nodesRef = useRef(new Map());

  const stateRef = useRef({ x: 60, y: 60, zoom: 0.7, vx: 0, vy: 0, moved: false, dragging: false });
  const reduceRef = useRef(false);
  useEffect(() => { reduceRef.current = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false; }, []);
  const inspectingRef = useRef(selected != null);
  useEffect(() => { inspectingRef.current = selected != null; }, [selected]);
  useEffect(() => { setDims(null); }, [selected]);

  // Same ambient room-tone bed as the studio and story, with the same
  // autoplay-unlock-on-gesture + close-on-exit behaviour.
  const audioRef = useRef(null);
  if (!audioRef.current) audioRef.current = createGuideAudio();
  useEffect(() => {
    const a = audioRef.current;
    a.startAmbient();
    const unlock = () => a.ensure();
    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('keydown', unlock, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
      a.close();
    };
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    const surface = surfaceRef.current;
    if (!wrap || !surface || !N) return undefined;

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const V = stateRef.current;
    const pointers = new Map();
    const baseCache = new Map();
    const colCache = new Map();
    let pinch = null;
    let lastRange = '';

    function geometry(order) {
      const heights = order.map((i) => photoHeight(i));
      const cumY = new Array(N);
      let acc = 0;
      for (let k = 0; k < N; k++) { cumY[k] = acc; acc += heights[k] + ROW_GAP; }
      return { order, heights, cumY, ph: acc };
    }

    // Each column is its OWN random permutation of every photo (independent per
    // column - not a rotation), so the structured diagonal repeats are gone.
    function colBase(c) {
      let b = baseCache.get(c);
      if (b) return b;
      const order = worldPhotos.map((_, i) => i);
      const rnd = mulberry32((hashInt(c) ^ 0x1b873593) >>> 0);
      for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(rnd() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
      }
      const g = geometry(order);
      g.baseY = (hashInt(c * 2 + 1) % 100000) / 100000 * g.ph;
      baseCache.set(c, b = g);
      return b;
    }

    // Final column: repair the permutation so no photo touches the same photo
    // above it (vertical) or in the overlapping cells of the column to its left
    // (horizontal). Swaps stay within the column, so it's still a permutation.
    function getColumn(c) {
      let col = colCache.get(c);
      if (col) return col;
      const self = colBase(c);
      const left = colBase(c - 1);
      const order = self.order.slice();
      for (let k = 0; k < N; k++) {
        const y = self.baseY + self.cumY[k];
        const h = self.heights[k];
        const forbidden = new Set();
        if (k > 0) forbidden.add(order[k - 1]);
        const rStart = Math.floor((y - left.baseY) / left.ph) - 1;
        for (let r = rStart; r <= rStart + 2; r++) {
          const rBase = left.baseY + r * left.ph;
          for (let kk = 0; kk < N; kk++) {
            const ly = rBase + left.cumY[kk];
            if (ly < y + h && ly + left.heights[kk] > y) forbidden.add(left.order[kk]);
          }
        }
        if (forbidden.has(order[k])) {
          for (let j = k + 1; j < N; j++) {
            if (!forbidden.has(order[j])) { const t = order[k]; order[k] = order[j]; order[j] = t; break; }
          }
        }
      }
      col = geometry(order);
      col.baseY = self.baseY;
      colCache.set(c, col);
      return col;
    }

    function paint() {
      surface.style.transform = `translate(${V.x.toFixed(2)}px, ${V.y.toFixed(2)}px) scale(${V.zoom.toFixed(4)})`;
      wrap.style.backgroundSize = `${(COL_STRIDE * V.zoom).toFixed(2)}px ${(COL_STRIDE * V.zoom).toFixed(2)}px`;
      wrap.style.backgroundPosition = `${V.x.toFixed(2)}px ${V.y.toFixed(2)}px`;
      if (readoutRef.current) readoutRef.current.textContent = `${Math.round(V.zoom * 100)}%`;
    }

    // Bow the whole canvas into a sphere: each cell rotates away and recedes in
    // Z by how far its centre sits from the viewport centre, so the photos near
    // the middle face you and the ones toward the edges curl back like a globe.
    function curve() {
      const z = V.zoom;
      const vw = wrap.clientWidth, vh = wrap.clientHeight;
      // Device factor: phones get a gentler bow and shallower depth than wide
      // screens, so the effect never feels cramped or dizzying on a small canvas.
      const f = clamp(vw / 1300, 0.5, 1);
      const ang = CURVE_ANG * f, depth = CURVE_DEPTH * f;
      const vcx = (-V.x + vw / 2) / z, vcy = (-V.y + vh / 2) / z; // view centre (world)
      const hw = vw / 2 / z, hh = vh / 2 / z;
      const list = cellsRef.current;
      const nodes = nodesRef.current;
      for (let n = 0; n < list.length; n++) {
        const c = list[n];
        const node = nodes.get(c.key);
        if (!node) continue;
        if (reduce) { node.style.transform = ''; continue; }
        const ox = clamp((c.x + COL_W / 2 - vcx) / hw, -1.8, 1.8);
        const oy = clamp((c.y + c.h / 2 - vcy) / hh, -1.8, 1.8);
        const dz = -(ox * ox + oy * oy) * depth;
        node.style.transform =
          `translateZ(${dz.toFixed(1)}px) rotateY(${(ox * ang).toFixed(2)}deg) rotateX(${(-oy * ang).toFixed(2)}deg)`;
      }
    }

    function recomputeCells() {
      const w = wrap.clientWidth, h = wrap.clientHeight, z = V.zoom;
      const wl = -V.x / z, wt = -V.y / z;
      const wr = wl + w / z, wb = wt + h / z;
      const cMin = Math.floor(wl / COL_STRIDE) - 1;
      const cMax = Math.ceil(wr / COL_STRIDE) + 1;
      const key = `${cMin},${cMax},${Math.round(wt / 140)},${Math.round(wb / 140)}`;
      if (key === lastRange) return;
      lastRange = key;
      const arr = [];
      for (let c = cMin; c <= cMax; c++) {
        const col = getColumn(c);
        const x = c * COL_STRIDE;
        const rMin = Math.floor((wt - col.baseY) / col.ph) - 1;
        const rMax = Math.ceil((wb - col.baseY) / col.ph) + 1;
        for (let r = rMin; r <= rMax; r++) {
          const rBase = col.baseY + r * col.ph;
          for (let k = 0; k < N; k++) {
            const y = rBase + col.cumY[k];
            const hgt = col.heights[k];
            if (y < wb && y + hgt > wt) {
              arr.push({ key: `${c}.${r}.${k}`, x, y, h: hgt, idx: col.order[k] });
            }
          }
        }
      }
      setCells(arr);
    }

    function zoomAt(cx, cy, factor) {
      const nz = clamp(V.zoom * factor, MIN_ZOOM, MAX_ZOOM);
      const wx = (cx - V.x) / V.zoom;
      const wy = (cy - V.y) / V.zoom;
      V.zoom = nz;
      V.x = cx - wx * nz;
      V.y = cy - wy * nz;
    }

    function onPointerDown(e) {
      if (inspectingRef.current) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      V.moved = false; V.dragging = true; V.vx = 0; V.vy = 0;
      V.downX = e.clientX; V.downY = e.clientY;
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        pinch = { dist: Math.hypot(a.x - b.x, a.y - b.y) || 1, zoom: V.zoom, cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2 };
      }
      wrap.classList.add('is-grabbing');
    }
    function onPointerMove(e) {
      const p = pointers.get(e.pointerId);
      if (!p) return; // only pressed pointers pan; hover tilt is handled per-cell
      const dx = e.clientX - p.x, dy = e.clientY - p.y;
      p.x = e.clientX; p.y = e.clientY;
      if (pinch && pointers.size >= 2) {
        const [a, b] = [...pointers.values()];
        const dist = Math.hypot(a.x - b.x, a.y - b.y) || 1;
        const rect = wrap.getBoundingClientRect();
        zoomAt(pinch.cx - rect.left, pinch.cy - rect.top, (dist / pinch.dist) * (pinch.zoom / V.zoom));
        V.moved = true;
      } else {
        V.x += dx; V.y += dy;
        V.vx = dx; V.vy = dy;
        // Flag a drag by TOTAL distance from the press point, not per-move - a
        // slow pan is many tiny moves that each fall under a per-event threshold.
        if (Math.hypot(e.clientX - V.downX, e.clientY - V.downY) > 5) V.moved = true;
      }
    }
    function onPointerUp(e) {
      if (!pointers.has(e.pointerId)) return;
      pointers.delete(e.pointerId);
      if (pointers.size < 2) pinch = null;
      if (pointers.size === 0) { V.dragging = false; wrap.classList.remove('is-grabbing'); }
    }
    function onWheel(e) {
      e.preventDefault();
      if (inspectingRef.current) return;
      if (e.ctrlKey || e.metaKey) {
        const rect = wrap.getBoundingClientRect();
        zoomAt(e.clientX - rect.left, e.clientY - rect.top, Math.exp(-e.deltaY * 0.0015));
      } else {
        V.x -= e.deltaX; V.y -= e.deltaY; V.vx = 0; V.vy = 0;
      }
    }

    const onDragStart = (e) => e.preventDefault(); // backstop vs native drag
    wrap.addEventListener('wheel', onWheel, { passive: false });
    wrap.addEventListener('pointerdown', onPointerDown);
    wrap.addEventListener('dragstart', onDragStart);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    let raf = 0;
    let lastKey = '';
    function frame() {
      raf = requestAnimationFrame(frame);
      if (!reduce && !V.dragging && (V.vx || V.vy)) {
        V.x += V.vx; V.y += V.vy;
        V.vx *= FRICTION; V.vy *= FRICTION;
        if (Math.abs(V.vx) < 0.05) V.vx = 0;
        if (Math.abs(V.vy) < 0.05) V.vy = 0;
      }
      // Only touch the DOM when the view actually changed (or new cells just
      // mounted) - idle frames cost nothing, which is most of them.
      const key = `${Math.round(V.x)},${Math.round(V.y)},${V.zoom.toFixed(4)},${wrap.clientWidth},${wrap.clientHeight}`;
      if (key !== lastKey || forceRef.current) {
        lastKey = key;
        forceRef.current = false;
        paint();
        recomputeCells();
        curve();
      }
    }
    paint();
    recomputeCells();
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      wrap.removeEventListener('wheel', onWheel);
      wrap.removeEventListener('pointerdown', onPointerDown);
      wrap.removeEventListener('dragstart', onDragStart);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
  }, []);

  // Cursor-following perspective tilt on the hovered photo.
  function onCellMove(e) {
    if (stateRef.current.dragging || reduceRef.current) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--rx', `${(-ny * 13).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${(nx * 15).toFixed(2)}deg`);
  }
  function onCellLeave(e) {
    const el = e.currentTarget;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  }

  const total = N;
  const photo = selected != null ? worldPhotos[selected] : null;
  const meta = photo ? formatTaken(photo.taken) : null;

  if (!total) {
    return (
      <div className="world-empty">
        <p className="world-kicker">the world</p>
        <p>No photographs yet — add some in <code>src/worldData.js</code>.</p>
      </div>
    );
  }

  return (
    <div className="world">
      <div className={`world-canvas${selected != null ? ' is-inspecting' : ''}`} ref={wrapRef}>
        <div className="world-surface" ref={surfaceRef}>
          {cells.map((c) => {
            const p = worldPhotos[c.idx];
            return (
              <button
                key={c.key}
                type="button"
                className="world-cell"
                ref={(node) => { const m = nodesRef.current; if (node) m.set(c.key, node); else m.delete(c.key); }}
                style={{ left: c.x, top: c.y, width: COL_W, height: c.h }}
                onPointerMove={onCellMove}
                onPointerLeave={onCellLeave}
                onClick={() => { if (!stateRef.current.moved) setSelected(c.idx); }}
                aria-label={`View ${p.caption || p.alt}`}
                tabIndex={-1}
              >
                <span className="world-cell-inner">
                  <img src={p.src} alt="" draggable="false" decoding="async" loading="lazy" />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Corner blur - softens the edges so the centre of the globe holds focus. */}
      <div className="world-fog" aria-hidden="true" />

      {/* Heads-up chrome */}
      <p className="world-hint" aria-hidden="true">
        <span className="world-hint-fine">drag to pan · ⌘ / ctrl + scroll to zoom · hover, then click a photo</span>
        <span className="world-hint-touch">drag · tap a photo</span>
      </p>
      <p className="world-readout" aria-hidden="true">
        <span className="world-readout-label">zoom</span> <span ref={readoutRef}>70%</span>
      </p>

      {/* Inspector */}
      {photo && (
        <div className="world-inspect" role="dialog" aria-modal="true" aria-label={photo.caption || photo.alt}>
          <button type="button" className="world-inspect-scrim" onClick={() => setSelected(null)} aria-label="Close" />
          <div className="world-inspect-panel">
            <div className="world-inspect-stage">
              <img
                key={photo.src}
                src={photo.src}
                alt={photo.alt}
                draggable="false"
                onLoad={(e) => setDims({ w: e.target.naturalWidth, h: e.target.naturalHeight })}
              />
            </div>
            <figcaption className="world-inspect-meta">
              <p className="world-inspect-caption">{photo.caption || photo.alt}</p>
              <dl className="world-meta-grid">
                <div><dt>date</dt><dd>{meta.date}{meta.dow ? <span className="world-meta-dim"> · {meta.dow}</span> : null}</dd></div>
                <div><dt>time</dt><dd>{meta.time}</dd></div>
                <div><dt>frame</dt><dd>{String(selected + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</dd></div>
                <div><dt>size</dt><dd>{dims ? `${dims.w} × ${dims.h}` : `${photo.w} × ${photo.h}`}</dd></div>
              </dl>
            </figcaption>

            {total > 1 && (
              <>
                <button
                  type="button"
                  className="world-inspect-nav world-inspect-prev"
                  onClick={() => setSelected((s) => (s - 1 + total) % total)}
                  aria-label="Previous photo"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <button
                  type="button"
                  className="world-inspect-nav world-inspect-next"
                  onClick={() => setSelected((s) => (s + 1) % total)}
                  aria-label="Next photo"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </>
            )}

            <button type="button" className="world-inspect-close" onClick={() => setSelected(null)} aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
