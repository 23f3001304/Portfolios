import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { projects } from '../data.js';
import { useTheme } from '../theme.js';
import { setSpaceMode } from '../useSpaceMode.js';
import { helixLayout, helixPoint, indexToTime, timeLabel } from '../lib/space/helix.js';
import { stepTravel, nudgeTarget, snapTarget } from '../lib/space/travel.js';
import { createGuideAudio } from './guideAudio.js';
import SpaceCrawl from './SpaceCrawl.jsx';

/* ============================================================
   The helix. Thirteen plates on a spiral of time: one turn per
   year, newest at the top. The camera travels the inside of the
   spiral and looks out at the plate under it; the nearest plate
   turns to face you and shows its readout. Labels are HTML,
   projected each frame. Click the focused plate to read it (the
   crawl); click a far one to travel to it; O for the overview.
   ============================================================ */
const NOW = { y: 2026, m: 9 };
const PLATE_W = 3, PLATE_H = 2;
const CAM_R = 0.3;       // camera path radius, as a share of the helix radius
const CAM_UP = 0.55;     // camera height above the plate it looks at
const FLIGHT_MS = 1600;  // entry flight from the overview to the path
const EXIT_MS = 900;
const BANK = 0.12;       // radians of roll per unit of travel speed

const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const easeOut = (x) => 1 - Math.pow(1 - x, 5);

// Everything three.js, built once; React only reads a little state out of it.
function buildScene(host, theme) {
  const layout = helixLayout(projects, { now: NOW });
  const { items, radius: R, pitch, tMin, tMax } = layout;
  const n = items.length;

  const colors = () => ({
    bg: new THREE.Color(cssVar('--bg')),
    accent: new THREE.Color(cssVar('--accent')),
    gray: new THREE.Color(cssVar('--gray')),
    line: new THREE.Color(cssVar('--light-gray')),
  });
  let c = colors();

  const scene = new THREE.Scene();
  scene.background = c.bg.clone();
  scene.fog = new THREE.Fog(c.bg.clone(), 5, 20);

  const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 200);
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  host.appendChild(renderer.domElement);

  // The rail: the thread of time, with month ticks and a square at the start.
  const railPts = [];
  const RAIL_R = R - 0.3, RAIL_DY = -1.3;
  for (let t = tMin - 0.35; t <= tMax + 0.55; t += 1 / 96) {
    const p = helixPoint(t, RAIL_R, pitch, tMin); railPts.push(new THREE.Vector3(p.x, p.y + RAIL_DY, p.z));
  }
  const railMat = new THREE.LineBasicMaterial({ color: c.accent, transparent: true, opacity: 0.75 });
  const rail = new THREE.Line(new THREE.BufferGeometry().setFromPoints(railPts), railMat);
  scene.add(rail);

  const tickPts = [];
  const years = [];
  for (let m = Math.ceil((tMin - 0.3) * 12); m <= Math.floor((tMax + 0.5) * 12); m++) {
    const t = m / 12;
    const isYear = m % 12 === 0;
    const a = helixPoint(t, RAIL_R - (isYear ? 0.35 : 0.14), pitch, tMin);
    const b = helixPoint(t, RAIL_R + (isYear ? 0.35 : 0.14), pitch, tMin);
    tickPts.push(new THREE.Vector3(a.x, a.y + RAIL_DY, a.z), new THREE.Vector3(b.x, b.y + RAIL_DY, b.z));
    if (isYear) { const yp = helixPoint(t, RAIL_R + 0.9, pitch, tMin); years.push({ label: String(m / 12), point: { x: yp.x, y: yp.y + RAIL_DY, z: yp.z } }); }
  }
  const tickMat = new THREE.LineBasicMaterial({ color: c.gray, transparent: true, opacity: 0.45 });
  scene.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(tickPts), tickMat));

  const startMat = new THREE.MeshBasicMaterial({ color: c.accent });
  const start = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.4), startMat);
  const sp = helixPoint(tMin - 0.35, RAIL_R, pitch, tMin);
  start.position.set(sp.x, sp.y + RAIL_DY, sp.z);
  start.lookAt(0, sp.y, 0);
  scene.add(start);

  // Drafting-paper grid far below.
  const gridMat = new THREE.LineBasicMaterial({ color: c.gray, transparent: true, opacity: 0.12 });
  const grid = new THREE.GridHelper(120, 60);
  grid.material = gridMat;
  grid.position.y = -3;
  scene.add(grid);

  // Plates.
  const loader = new THREE.TextureLoader();
  const plateGeo = new THREE.PlaneGeometry(PLATE_W, PLATE_H);
  const frameGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-PLATE_W / 2, -PLATE_H / 2, 0), new THREE.Vector3(PLATE_W / 2, -PLATE_H / 2, 0),
    new THREE.Vector3(PLATE_W / 2, PLATE_H / 2, 0), new THREE.Vector3(-PLATE_W / 2, PLATE_H / 2, 0),
  ]);
  const plates = items.map((it) => {
    const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 1 });
    const mesh = new THREE.Mesh(plateGeo, mat);
    const frameMat = new THREE.LineBasicMaterial({ color: c.line, transparent: true, opacity: 0.8 });
    const frame = new THREE.LineLoop(frameGeo, frameMat);
    frame.scale.set(1.015, 1.02, 1);
    const group = new THREE.Group();
    group.add(mesh, frame);
    group.position.set(it.pos.x, it.pos.y, it.pos.z);
    group.lookAt(0, it.pos.y, 0); // faces the axis, so it reads from the inner path
    group.userData.baseQuat = group.quaternion.clone();
    scene.add(group);
    return { it, group, mesh, mat, frameMat, tex: null };
  });

  function loadTextures(th) {
    for (const p of plates) {
      const url = `/projects/${p.it.project.slug}/card-${th}-500.webp`;
      loader.load(url, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
        if (p.tex) p.tex.dispose();
        p.tex = tex; p.mat.map = tex; p.mat.needsUpdate = true;
      });
    }
  }
  loadTextures(theme);

  function recolor() {
    c = colors();
    scene.background.copy(c.bg);
    scene.fog.color.copy(c.bg);
    railMat.color.copy(c.accent);
    startMat.color.copy(c.accent);
    tickMat.color.copy(c.gray);
    gridMat.color.copy(c.gray);
    for (const p of plates) p.frameMat.color.copy(c.line);
  }

  // Camera poses.
  const yMid = (items[0].pos.y + items[n - 1].pos.y) / 2;
  const overview = { pos: new THREE.Vector3(R * 1.1, yMid + 6, R * 3.3), look: new THREE.Vector3(0, yMid, 0) };
  const pathPose = (idx, out) => {
    const t = indexToTime(layout, idx);
    // A portrait screen has a narrow horizontal field of view, so the camera
    // stands further back the narrower the screen gets (the plate fills about
    // four fifths of the width), and looks lower so the plate sits in the
    // upper half with the readout docked beneath it.
    const portrait = camera.aspect < 1;
    const back = Math.max(1, Math.min(2, 0.9 / camera.aspect));
    const d = R * (1 - CAM_R) * back;
    const cp = helixPoint(t, R - d, pitch, tMin);
    const lp = helixPoint(t, R, pitch, tMin);
    out.pos.set(cp.x, cp.y + CAM_UP * back, cp.z);
    out.look.set(lp.x, lp.y - (portrait ? 1.7 : 0.35), lp.z);
    return out;
  };

  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();

  return {
    layout, n, items, scene, camera, renderer, plates, years, overview, pathPose, raycaster, ndc,
    recolor, loadTextures,
    accentHex: () => `#${c.accent.getHexString()}`,
    dispose() {
      renderer.dispose();
      plateGeo.dispose(); frameGeo.dispose();
      rail.geometry.dispose(); railMat.dispose(); tickMat.dispose(); gridMat.dispose(); startMat.dispose();
      for (const p of plates) { p.mat.dispose(); p.frameMat.dispose(); p.tex?.dispose(); }
      renderer.domElement.remove();
    },
  };
}

export default function SpaceStage({ open }) {
  const hostRef = useRef(null);
  const canvasRef = useRef(null);
  const labelRefs = useRef([]);
  const yearRefs = useRef([]);
  const focusRef = useRef(null);
  const theme = useTheme();
  const navigate = useNavigate();
  const S = useRef(null); // the three.js world + travel state

  const [focus, setFocus] = useState(0);
  const [reading, setReading] = useState(null);
  const [inOverview, setInOverview] = useState(false);
  const [readout, setReadout] = useState('');
  const [hover, setHover] = useState(null);
  const [showFocus, setShowFocus] = useState(false);
  const readingRef = useRef(null);
  const overviewRef = useRef(false);
  const openRef = useRef(open);
  openRef.current = open;

  // Build the scene once.
  useEffect(() => {
    const host = canvasRef.current;
    const w = buildScene(host, theme);
    const audio = createGuideAudio();
    const unlock = () => audio.ensure();
    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('keydown', unlock, { passive: true });
    audio.startAmbient();

    const rm = reduced();
    const travel = { t: 0, v: 0, target: 0 };
    const state = {
      w, audio, travel,
      flight: rm ? 1 : 0, flightFrom: performance.now(), leaving: false,
      lastInput: 0, mouse: { x: 0, y: 0 }, drag: null, hoverIdx: null, lastFocus: -1,
      pose: { pos: new THREE.Vector3(), look: new THREE.Vector3() },
      cur: { pos: new THREE.Vector3(), look: new THREE.Vector3() },
      raf: 0,
    };
    S.current = state;

    const size = () => {
      const r = hostRef.current.getBoundingClientRect();
      w.renderer.setSize(r.width, r.height);
      w.camera.aspect = r.width / r.height;
      w.camera.updateProjectionMatrix();
    };
    size();
    window.addEventListener('resize', size);

    const v3 = new THREE.Vector3();
    const project = (p) => {
      v3.copy(p).project(w.camera);
      const r = hostRef.current.getBoundingClientRect();
      return { x: (v3.x + 1) / 2 * r.width, y: (1 - v3.y) / 2 * r.height, behind: v3.z > 1, z: v3.z };
    };

    let last = 0;
    function frame(now) {
      state.raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - (last || now)) / 1000);
      last = now;
      const idle = now - state.lastInput > 260;

      // Travel.
      if (idle && !state.drag) travel.target = snapTarget(travel.target, 0, w.n - 1);
      const next = stepTravel(travel, dt, { omega: rm ? 40 : 6, min: 0, max: w.n - 1 });
      travel.t = next.t; travel.v = next.v; travel.target = next.target;
      const f = Math.round(travel.t);
      if (f !== state.lastFocus) {
        if (state.lastFocus >= 0) audio.blip('o', f);
        state.lastFocus = f;
        setFocus(f);
      }

      // Flight: entry glides from the overview to the path; exit pulls back.
      if (!state.leaving && state.flight < 1) state.flight = Math.min(1, (now - state.flightFrom) / FLIGHT_MS);
      if (state.leaving) state.flight = Math.max(0, 1 - (now - state.flightFrom) / EXIT_MS);
      const k = overviewRef.current ? 1 - easeOut(Math.min(1, (now - state.flightFrom) / 900)) : easeOut(state.flight);
      w.pathPose(travel.t, state.pose);
      state.cur.pos.lerpVectors(w.overview.pos, state.pose.pos, k);
      state.cur.look.lerpVectors(w.overview.look, state.pose.look, k);
      if (!rm) {
        state.cur.pos.x += state.mouse.x * 0.35 * k;
        state.cur.pos.y += -state.mouse.y * 0.25 * k;
      }
      w.camera.position.copy(state.cur.pos);
      w.camera.lookAt(state.cur.look);
      if (!rm) w.camera.rotateZ(-travel.v * BANK * k);
      w.scene.fog.far = 20 + (1 - k) * 40;

      // Plates: face the axis, the focused one faces the camera; dim with distance.
      for (let i = 0; i < w.plates.length; i++) {
        const p = w.plates[i];
        const d = Math.abs(i - travel.t);
        const portrait = w.camera.aspect < 1;
        const isFocus = i === f && k > 0.6;
        if (isFocus) {
          const q = p.group.quaternion.clone();
          p.group.lookAt(w.camera.position);
          q.slerp(p.group.quaternion, 0.12);
          p.group.quaternion.copy(q);
        } else {
          p.group.quaternion.slerp(p.group.userData.baseQuat, 0.12);
        }
        const lift = isFocus ? 0.18 : 0;
        p.group.position.y += (p.it.pos.y + lift - p.group.position.y) * 0.12;
        const dim = k < 0.6 ? 1 : Math.max(portrait ? 0.18 : 0.3, 1 - d * (portrait ? 0.45 : 0.28));
        p.mat.opacity = dim;
        p.frameMat.color.set(isFocus || i === state.hoverIdx ? w.accentHex() : cssVar('--light-gray'));
        p.frameMat.opacity = isFocus ? 1 : 0.6 * dim;
      }

      w.renderer.render(w.scene, w.camera);

      // Labels, projected. Beside the plate on a wide screen; on a phone only
      // the focused plate is labelled, centred beneath it.
      const portrait = w.camera.aspect < 1;
      const right = new THREE.Vector3(PLATE_W / 2 + 0.25, PLATE_H / 2 - 0.15, 0);
      const below = new THREE.Vector3(0, -PLATE_H / 2 - 0.3, 0);
      for (let i = 0; i < w.plates.length; i++) {
        const el = labelRefs.current[i];
        if (!el) continue;
        if (portrait && i !== f) { el.style.opacity = '0'; continue; }
        const wp = w.plates[i].group.localToWorld((portrait ? below : right).clone());
        const s = project(wp);
        const d = Math.abs(i - travel.t);
        const vis = s.behind ? 0 : (k < 0.6 ? 1 : Math.max(0, 1 - d * 0.35));
        el.style.opacity = vis.toFixed(2);
        el.style.transform = portrait
          ? `translate(-50%, 0) translate3d(${s.x.toFixed(1)}px, ${s.y.toFixed(1)}px, 0)`
          : `translate(0, -50%) translate3d(${s.x.toFixed(1)}px, ${s.y.toFixed(1)}px, 0)`;
        el.dataset.focus = i === f;
        el.dataset.center = portrait;
      }
      for (let i = 0; i < w.years.length; i++) {
        const el = yearRefs.current[i];
        if (!el) continue;
        const y = w.years[i].point;
        const s = project(v3.set(y.x, y.y, y.z));
        el.style.opacity = s.behind ? 0 : 0.7;
        el.style.transform = `translate(-50%, -50%) translate3d(${s.x.toFixed(1)}px, ${s.y.toFixed(1)}px, 0)`;
      }
      const fe = focusRef.current;
      if (fe) {
        const bottom = w.plates[f].group.localToWorld(new THREE.Vector3(0, -PLATE_H / 2, 0));
        const s = project(bottom);
        fe.style.transform = `translate(-50%, 0) translate3d(${s.x.toFixed(1)}px, ${s.y.toFixed(1)}px, 0)`;
      }
      setShowFocus(idle && Math.abs(travel.t - f) < 0.02 && k > 0.98 && !overviewRef.current);
      setReadout(timeLabel(indexToTime(w.layout, travel.t)));
    }
    state.raf = requestAnimationFrame(frame);

    // Input.
    const el = host;
    const nudge = (d) => { travel.target = nudgeTarget(travel.target, d, 0, w.n - 1); state.lastInput = performance.now(); };
    const hitPlate = (e) => {
      const r = el.getBoundingClientRect();
      w.ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      w.raycaster.setFromCamera(w.ndc, w.camera);
      const hits = w.raycaster.intersectObjects(w.plates.map((p) => p.mesh), false);
      if (!hits.length) return null;
      return w.plates.findIndex((p) => p.mesh === hits[0].object);
    };
    const onWheel = (e) => { if (readingRef.current) return; e.preventDefault(); nudge(e.deltaY * 0.0035); };
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      state.mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      state.mouse.y = ((e.clientY - r.top) / r.height) * 2 - 1;
      if (state.drag) {
        // Drag sideways or up-and-down (a phone swipe) to travel.
        const dx = e.clientX - state.drag.x;
        const dy = e.clientY - state.drag.y;
        state.drag.x = e.clientX; state.drag.y = e.clientY;
        state.drag.moved += Math.abs(dx) + Math.abs(dy);
        nudge(-(dx + dy) * 0.01);
        return;
      }
      const h = hitPlate(e);
      state.hoverIdx = h;
      setHover(h);
      el.classList.toggle('has-hover', h != null);
    };
    const onDown = (e) => { if (readingRef.current) return; state.drag = { x: e.clientX, y: e.clientY, moved: 0 }; el.classList.add('is-grabbing'); };
    const onUp = (e) => {
      el.classList.remove('is-grabbing');
      const d = state.drag; state.drag = null;
      if (!d || d.moved > 6 || readingRef.current) return;
      const h = hitPlate(e);
      if (h == null) return;
      if (overviewRef.current) { overviewRef.current = false; setInOverview(false); state.flightFrom = performance.now(); state.flight = 1; }
      if (h === Math.round(travel.t) && !overviewRef.current) openReading(h);
      else { travel.target = h; state.lastInput = 0; }
    };
    const openReading = (i) => { readingRef.current = w.items[i]; setReading(w.items[i]); audio.cue?.(); };
    const toggleOverview = () => {
      overviewRef.current = !overviewRef.current;
      setInOverview(overviewRef.current);
      state.flightFrom = performance.now();
      if (!overviewRef.current) state.flight = 0;
    };
    const onKey = (e) => {
      if (document.querySelector('.lightbox')) return; // the gallery owns the keys
      if (readingRef.current) {
        if (e.key === 'Escape') { readingRef.current = null; setReading(null); }
        return;
      }
      switch (e.key) {
        case 'ArrowDown': case 'ArrowRight': case 'j': travel.target = snapTarget(travel.target + 1, 0, w.n - 1); state.lastInput = 0; break;
        case 'ArrowUp': case 'ArrowLeft': case 'k': travel.target = snapTarget(travel.target - 1, 0, w.n - 1); state.lastInput = 0; break;
        case 'Enter': if (!overviewRef.current) openReading(Math.round(travel.t)); break;
        case 'o': case 'O': toggleOverview(); break;
        case 'Escape': if (overviewRef.current) toggleOverview(); else setSpaceMode(false); break;
        default: return;
      }
      e.preventDefault();
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('keydown', onKey);
    state.api = { openReading, toggleOverview, goTo: (i) => { travel.target = i; state.lastInput = 0; } };

    return () => {
      cancelAnimationFrame(state.raf);
      window.removeEventListener('resize', size);
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
      audio.close();
      w.dispose();
      S.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Theme swaps: recolour the scene and reload the plate shots.
  useEffect(() => {
    const s = S.current;
    if (!s) return;
    s.w.recolor();
    s.w.loadTextures(theme);
  }, [theme]);

  // Closing: pull the camera back out while the overlay fades.
  useEffect(() => {
    const s = S.current;
    if (!s || open) return;
    s.leaving = true;
    s.flightFrom = performance.now();
  }, [open]);

  const it = S.current?.w.items[focus];
  const p = it?.project;

  return (
    <div className={`space${reading ? ' is-reading' : ''}`} ref={hostRef}>
      <div className="space-canvas" ref={canvasRef} />

      <div className="space-labels" aria-hidden="true">
        {(S.current?.w.items || []).map((item, i) => (
          <div className="space-label" key={item.project.slug} ref={(el) => { labelRefs.current[i] = el; }}>
            <span className="id">{item.project.id}</span>
            <span className="name">{item.project.name}</span>
            <span className="when">{item.project.when}</span>
          </div>
        ))}
        {(S.current?.w.years || []).map((y, i) => (
          <div className="space-year" key={y.label} ref={(el) => { yearRefs.current[i] = el; }}>{y.label}</div>
        ))}
      </div>

      {p && (
        <div className="space-focus" ref={focusRef} data-show={showFocus}>
          <p className="tagline">{p.tagline}</p>
          <div className="metrics">
            {(p.metrics || []).map((m) => (
              <div className="metric" key={m.label}><b>{m.value}<small>{m.unit}</small></b><span>{m.label}</span></div>
            ))}
          </div>
          <button type="button" className="open" onClick={() => S.current?.api.openReading(focus)}>read it <span aria-hidden="true">→</span></button>
        </div>
      )}

      <div className="space-hud">
        <span className="kicker">the space · one turn is one year</span>
        <span className="hint">
          <kbd>scroll</kbd> travel · <kbd>enter</kbd> read · <kbd>o</kbd> overview · <kbd>esc</kbd> {inOverview ? 'back' : 'leave'}
        </span>
        <span className="readout"><b>{readout}</b> {hover != null && hover !== focus ? `· ${S.current?.w.items[hover].project.name}` : ''}</span>
        <div className="scrubber" role="tablist" aria-label="Projects">
          {(S.current?.w.items || []).map((item, i) => (
            <button type="button" key={item.project.slug} aria-current={i === focus} aria-label={item.project.name} title={item.project.name}
              onClick={() => S.current?.api.goTo(i)} />
          ))}
        </div>
        <span className="index">{String(focus + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span>
      </div>

      <button className="btn space-exit" onClick={() => setSpaceMode(false)} aria-label="Leave the space">
        <span aria-hidden="true">←</span> exit <span className="kbd">ESC</span>
      </button>

      {reading && (
        <SpaceCrawl
          item={reading}
          onClose={() => { readingRef.current = null; setReading(null); }}
          onOpenPage={() => { setSpaceMode(false); navigate(`/projects/${reading.project.slug}`); }}
        />
      )}
    </div>
  );
}
