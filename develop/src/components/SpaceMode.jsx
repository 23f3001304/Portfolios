import { Suspense, lazy, useEffect, useState } from 'react';
import { useSpace } from '../useSpaceMode.js';

// The helix (and three.js with it) is a lazy chunk - only loads on first open.
const SpaceStage = lazy(() => import('../scenes/SpaceStage.jsx'));

export function SpaceMode() {
  const open = useSpace();
  const [mounted, setMounted] = useState(false);

  // Stay mounted ~1s past close so the camera can pull back out and the
  // overlay can fade before the scene is torn down.
  useEffect(() => {
    if (open) { setMounted(true); return undefined; }
    const t = setTimeout(() => setMounted(false), 1000);
    return () => clearTimeout(t);
  }, [open]);

  return (
    <div className="space-overlay" data-open={open} aria-hidden={!open}>
      {mounted && (
        <Suspense fallback={<div className="scene-loading">loading space</div>}>
          <SpaceStage open={open} />
        </Suspense>
      )}
    </div>
  );
}
