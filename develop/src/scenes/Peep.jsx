import { memo, useEffect, useRef } from 'react';
import RawPeep from 'react-peeps';
import { useTheme } from '../theme.js';
import { Face } from './Face.jsx';

/*
 * The illustrated guide - a face-less Open Peeps head/body (so the baked eyes
 * and mouth are gone) with our own <Face> layer on top for cursor-tracking
 * pupils + lip-sync. Layers: .guide turns toward the cursor, .guide-pop is the
 * one-shot click hop, .guide-bob does the idle bob and hosts the face overlay.
 */
export const Guide = memo(function Guide({
  look = 0, lookY = 0, pop = 0, talking = false, talkFrame = false, mood = 'idle', blink = false,
}) {
  const isDark = useTheme() === 'dark';
  const stroke = isDark ? '#f5f6f8' : '#15171c';
  const fill = isDark ? '#1c1f25' : '#ffffff';
  const popRef = useRef(null);

  useEffect(() => {
    const el = popRef.current;
    if (!el || !pop) return undefined;
    el.classList.remove('is-pop');
    void el.offsetWidth;
    el.classList.add('is-pop');
    const t = setTimeout(() => el.classList.remove('is-pop'), 480);
    return () => clearTimeout(t);
  }, [pop]);

  return (
    <div className="guide" style={{ '--look': look, '--look-y': lookY }} data-talking={talking}>
      <div className="guide-pop" ref={popRef}>
        <div className="guide-bob">
          <RawPeep
            body="ShirtPantsWB"
            hair="ShortMessy"
            strokeColor={stroke}
            backgroundColor={fill}
            style={{ width: '100%', height: '100%' }}
          />
          <Face
            stroke={stroke}
            look={look}
            lookY={lookY}
            talking={talking}
            talkFrame={talkFrame}
            mood={mood}
            blink={blink}
          />
        </div>
      </div>
    </div>
  );
});
