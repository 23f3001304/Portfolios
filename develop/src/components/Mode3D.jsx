import { Suspense, lazy, useEffect, useState } from 'react';
import { useMode, set3DMode } from '../use3DMode.js';

// The illustrated scene is a lazy chunk - it only loads on first open.
const Lobby = lazy(() => import('../scenes/Lobby.jsx'));

export function Mode3D() {
  const open = useMode();
  const [mounted, setMounted] = useState(false);

  // Keep the scene mounted ~700ms past close so the overlay can fade out.
  useEffect(() => {
    if (open) { setMounted(true); return undefined; }
    const t = setTimeout(() => setMounted(false), 700);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    function onKey(e) { if (e.key === 'Escape') set3DMode(false); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className="scene-3d" data-open={open} aria-hidden={!open}>
      {mounted && (
        <Suspense fallback={<div className="scene-loading">loading studio</div>}>
          <Lobby />
        </Suspense>
      )}
      {open && (
        <button className="btn scene-exit" onClick={() => set3DMode(false)} aria-label="Leave the studio">
          <span aria-hidden="true">←</span> exit <span className="kbd">ESC</span>
        </button>
      )}
    </div>
  );
}
