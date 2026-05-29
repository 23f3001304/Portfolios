import { Suspense, lazy, useEffect, useState } from 'react';
import { useWorld, setWorldMode } from '../useWorldMode.js';
import { worldPhotos } from '../worldData.js';

// The photo space is a lazy chunk - only loads the first time it's opened.
const WorldSpace = lazy(() => import('../scenes/WorldSpace.jsx'));

export function WorldMode() {
  const open = useWorld();
  const [mounted, setMounted] = useState(false);
  // Index of the photo pulled up in the inspector, or null. Lifted here so the
  // single keydown handler can choose between "close the inspector" and "exit".
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (open) { setMounted(true); return undefined; }
    const t = setTimeout(() => setMounted(false), 700);
    return () => clearTimeout(t);
  }, [open]);

  // Reset the inspector whenever the world closes, so it reopens clean.
  useEffect(() => { if (!open) setSelected(null); }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const n = worldPhotos.length;
    function onKey(e) {
      if (e.key === 'Escape') {
        // Esc backs out one layer at a time: inspector first, then the world.
        if (selected != null) setSelected(null);
        else setWorldMode(false);
      } else if (selected != null && n > 0 && e.key === 'ArrowLeft') {
        setSelected((s) => (s - 1 + n) % n);
      } else if (selected != null && n > 0 && e.key === 'ArrowRight') {
        setSelected((s) => (s + 1) % n);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, selected]);

  return (
    <div className="world-overlay" data-open={open} aria-hidden={!open}>
      {mounted && (
        <Suspense fallback={<div className="scene-loading">loading world</div>}>
          <WorldSpace selected={selected} setSelected={setSelected} />
        </Suspense>
      )}
      {open && (
        <button className="btn world-exit" onClick={() => setWorldMode(false)} aria-label="Leave the world">
          <span aria-hidden="true">←</span> exit <span className="kbd">ESC</span>
        </button>
      )}
    </div>
  );
}
