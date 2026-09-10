import { useEffect, useRef } from 'react';
import { useLightbox } from '../components/LightboxProvider.jsx';

/* ============================================================
   The crawl. A project's story - tagline, overview, every
   section, the conclusion - set on a plane tilted away from
   you and scrolling slowly into the distance, its figures set
   into the story beside the sections they illustrate. Click a
   figure and it opens in the site's gallery, face-on, with
   prev/next through the project's figures. Wheel or drag
   scrubs; auto-advance pauses when you do.
   ============================================================ */
const SPEED = 34;         // px per second of auto-advance
const PAUSE_MS = 2600;    // after a scrub, before auto-advance resumes

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const galleryOpen = () => !!document.querySelector('.lightbox');

export default function SpaceCrawl({ item, onClose, onOpenPage }) {
  const p = item.project;
  const colRef = useRef(null);
  const pos = useRef(0);
  const pausedUntil = useRef(0);
  const lb = useLightbox();
  const register = lb?.register;
  const figures = (p.sections || [])
    .map((s, i) => (s.figure ? { ...s.figure, key: `space:${p.slug}:${i}` } : null))
    .filter(Boolean);

  // The project's figures join the page-wide gallery while the crawl is up.
  useEffect(() => {
    if (!register) return undefined;
    const offs = figures.map((f) => register({ id: f.key, src: f.src, alt: f.alt || f.caption, caption: f.caption, label: f.id }));
    return () => offs.forEach((off) => off());
  }, [register, p.slug]); // eslint-disable-line react-hooks/exhaustive-deps

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
      if (!rm && !galleryOpen() && now > pausedUntil.current) {
        pos.current = Math.min(max(), pos.current + SPEED * dt);
      }
      if (colRef.current) colRef.current.style.transform = `translate3d(0, ${(-pos.current).toFixed(1)}px, 0)`;
    }
    raf = requestAnimationFrame(frame);
    const onWheel = (e) => {
      if (galleryOpen()) return;
      e.preventDefault();
      pos.current = Math.max(0, Math.min(max(), pos.current + e.deltaY));
      pausedUntil.current = performance.now() + PAUSE_MS;
    };
    let drag = null;
    const onDown = (e) => { if (e.target.closest('button') || galleryOpen()) return; drag = e.clientY; };
    const onMove = (e) => {
      if (drag == null) return;
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

  return (
    <div className="crawl">
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
                    onClick={(e) => { e.stopPropagation(); lb?.open(`space:${p.slug}:${i}`); }}
                    aria-label={`Open in the gallery: ${s.figure.caption}`}
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

      <div className="crawl-hud">
        <button type="button" className="btn" onClick={onClose}><span aria-hidden="true">←</span> helix <span className="kbd">ESC</span></button>
        <span>scroll to read · click a figure to open it</span>
        <button type="button" className="btn" onClick={onOpenPage}>open full page <span aria-hidden="true">↗</span></button>
      </div>
    </div>
  );
}
