import { useEffect, useRef, useState } from 'react';

/* ============================================================
   The crawl. A project's story - tagline, overview, every
   section, the conclusion - set on a plane tilted away from
   you and scrolling slowly into the distance, its figures set
   into the story beside the sections they illustrate. Click a
   figure and it comes straight to the camera, face-on; click
   again and it goes back. Wheel or drag scrubs; auto-advance
   pauses when you do.
   ============================================================ */
const SPEED = 34;         // px per second of auto-advance
const PAUSE_MS = 2600;    // after a scrub, before auto-advance resumes
const FLY_MS = 640;

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function SpaceCrawl({ item, onClose, onOpenPage }) {
  const p = item.project;
  const colRef = useRef(null);
  const figRefs = useRef({});
  const [front, setFront] = useState(null); // { src, alt, cap, from: rect, to: rect, back: bool }
  const frontRef = useRef(null);
  frontRef.current = front;
  const pos = useRef(0);
  const pausedUntil = useRef(0);

  // Auto-advance and scrubbing.
  useEffect(() => {
    const rm = reduced();
    let raf = 0, last = 0;
    // The column starts below the hinge and climbs until its end has receded.
    const max = () => (colRef.current?.scrollHeight || 0) + window.innerHeight * 0.55;
    function frame(now) {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - (last || now)) / 1000);
      last = now;
      if (!rm && frontRef.current == null && now > pausedUntil.current) {
        pos.current = Math.min(max(), pos.current + SPEED * dt);
      }
      if (colRef.current) colRef.current.style.transform = `translate3d(0, ${(-pos.current).toFixed(1)}px, 0)`;
    }
    raf = requestAnimationFrame(frame);
    const onWheel = (e) => {
      if (frontRef.current != null) return;
      e.preventDefault();
      pos.current = Math.max(0, Math.min(max(), pos.current + e.deltaY));
      pausedUntil.current = performance.now() + PAUSE_MS;
    };
    let drag = null;
    const onDown = (e) => { if (e.target.closest('button')) return; drag = e.clientY; };
    const onMove = (e) => {
      if (drag == null || frontRef.current != null) return;
      pos.current = Math.max(0, Math.min(max(), pos.current - (e.clientY - drag) * 1.6));
      drag = e.clientY;
      pausedUntil.current = performance.now() + PAUSE_MS;
    };
    const onUp = () => { drag = null; };
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, []);

  // A figure comes straight: a face-on copy starts exactly over the tilted
  // one and flies to the centre of the screen; on the way back it flies to
  // wherever the original is now and disappears into it.
  function bring(f, key, e) {
    e.stopPropagation();
    if (front) return;
    const r = figRefs.current[key].getBoundingClientRect();
    const from = { left: r.left, top: r.top, width: r.width, height: r.height };
    const ratio = f.w && f.h ? f.w / f.h : r.width / r.height;
    let width = window.innerWidth * 0.82, height = width / ratio;
    if (height > window.innerHeight * 0.82) { height = window.innerHeight * 0.82; width = height * ratio; }
    const to = { left: (window.innerWidth - width) / 2, top: (window.innerHeight - height) / 2, width, height };
    setFront({ ...f, key, from, to, at: from });
    requestAnimationFrame(() => requestAnimationFrame(() => setFront((s) => (s ? { ...s, at: s.to } : s))));
  }
  function sendBack() {
    const s = frontRef.current;
    if (!s || s.back) return;
    const r = figRefs.current[s.key]?.getBoundingClientRect();
    const at = r ? { left: r.left, top: r.top, width: r.width, height: r.height } : s.from;
    setFront({ ...s, at, back: true });
    setTimeout(() => setFront(null), reduced() ? 0 : FLY_MS);
  }

  return (
    <div className={`crawl${front ? ' has-front' : ''}`}>
      <div className="crawl-stage">
        <div className="crawl-plane">
          <div className="crawl-column" ref={colRef}>
            <p className="kicker">{p.id} · {p.when} · {p.status}</p>
            <h2>{p.name}</h2>
            <p className="tagline">{p.tagline}</p>
            {(p.overview || []).map((t, i) => <p key={`o${i}`}>{t}</p>)}
            {(p.sections || []).map((s, i) => (
              <section key={i}>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                {s.figure && (
                  <button
                    type="button"
                    className="crawl-fig"
                    ref={(el) => { figRefs.current[i] = el; }}
                    onClick={(e) => bring(s.figure, i, e)}
                    aria-label={`Bring forward: ${s.figure.caption}`}
                  >
                    <img src={s.figure.src} alt={s.figure.alt} loading="lazy" />
                    <span className="cap">{s.figure.id} · {s.figure.caption}</span>
                  </button>
                )}
              </section>
            ))}
            {(p.conclusion || []).map((t, i) => <p key={`c${i}`}>{t}</p>)}
            <p className="end">end of transmission</p>
          </div>
        </div>
      </div>

      {front && (
        <>
          <div className="crawl-backdrop" onClick={sendBack} aria-hidden="true" />
          <figure
            className="crawl-front"
            style={{ left: front.at.left, top: front.at.top, width: front.at.width, height: front.at.height }}
            onClick={sendBack}
            data-back={!!front.back}
          >
            <img src={front.src} alt={front.alt} />
            <figcaption className="cap">{front.id} · {front.caption}</figcaption>
          </figure>
        </>
      )}

      <div className="crawl-hud">
        <button type="button" className="btn" onClick={onClose}><span aria-hidden="true">←</span> helix <span className="kbd">ESC</span></button>
        <span>{front ? 'click anywhere to send it back' : 'scroll to read · click a figure to bring it forward'}</span>
        <button type="button" className="btn" onClick={onOpenPage}>open full page <span aria-hidden="true">↗</span></button>
      </div>
    </div>
  );
}
