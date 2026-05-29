import { Suspense, lazy, useEffect, useState } from 'react';
import { useStory, setStoryMode } from '../useStoryMode.js';

// The story stage is a lazy chunk - only loads the first time it's opened.
const StoryStage = lazy(() => import('../scenes/StoryStage.jsx'));

export function StoryMode() {
  const open = useStory();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (open) { setMounted(true); return undefined; }
    const t = setTimeout(() => setMounted(false), 700);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    function onKey(e) { if (e.key === 'Escape') setStoryMode(false); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className="story-overlay" data-open={open} aria-hidden={!open}>
      {mounted && (
        <Suspense fallback={<div className="scene-loading">loading story</div>}>
          <StoryStage />
        </Suspense>
      )}
      {open && (
        <button className="btn story-exit" onClick={() => setStoryMode(false)} aria-label="Leave the story">
          <span aria-hidden="true">←</span> exit <span className="kbd">ESC</span>
        </button>
      )}
    </div>
  );
}
