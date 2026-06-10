import { useEffect, useRef } from 'react';
import { useLightbox } from './LightboxProvider.jsx';

/*
 * Fullscreen image viewer. Reads the active image from LightboxProvider, locks
 * body scroll while open, handles Esc + arrow keys, and supports horizontal
 * swipe on touch (pointer events so it covers touch + trackpad drag).
 */
export function Lightbox() {
  const lb = useLightbox();
  const item = lb?.items.find((x) => x.id === lb.activeId);
  const open = !!item;
  const total = lb?.items.length || 0;
  const idx = item ? lb.items.findIndex((x) => x.id === lb.activeId) : -1;
  const dragStart = useRef(null);

  // Keyboard nav while open.
  useEffect(() => {
    if (!open || !lb) return undefined;
    function onKey(e) {
      if (e.key === 'Escape') lb.close();
      else if (e.key === 'ArrowLeft') lb.prev();
      else if (e.key === 'ArrowRight') lb.next();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, lb]);

  // Lock the page behind the overlay so background scroll doesn't sneak through.
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  if (!open) return null;

  function onPointerDown(e) { dragStart.current = { x: e.clientX, t: Date.now() }; }
  function onPointerUp(e) {
    const s = dragStart.current;
    dragStart.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    const dt = Date.now() - s.t;
    if (Math.abs(dx) > 50 && dt < 700) (dx < 0 ? lb.next : lb.prev)();
  }

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      <button
        type="button"
        className="lightbox-backdrop"
        onClick={lb.close}
        aria-label="Close image viewer"
      />
      <div className="lightbox-stage">
        <img
          key={item.id}
          src={item.src}
          alt={item.alt || item.caption || ''}
          className={item.invert ? 'lightbox-img invert-light' : 'lightbox-img'}
          draggable="false"
        />
        {(item.label || item.caption) && (
          <figcaption className="lightbox-caption">
            {item.label && <span className="lightbox-caption-id">{item.label}</span>}
            {item.caption && <span>{item.caption}</span>}
          </figcaption>
        )}
      </div>

      {total > 1 && (
        <>
          <button type="button" className="lightbox-nav lightbox-prev" onClick={lb.prev} aria-label="Previous image">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" className="lightbox-nav lightbox-next" onClick={lb.next} aria-label="Next image">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="lightbox-counter" aria-live="polite">
            {idx + 1} / {total}
          </div>
        </>
      )}

      <button type="button" className="lightbox-close" onClick={lb.close} aria-label="Close">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
