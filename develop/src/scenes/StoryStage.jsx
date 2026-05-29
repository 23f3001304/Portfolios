import { useEffect, useRef, useState } from 'react';
import { STORY } from './storyData.js';
import { ASSETS } from './storyAssets.jsx';
import { StoryNarrator } from './StoryNarrator.jsx';

const N = STORY.length;

/*
 * Narrated vignettes. The page is a vertical stack of full-screen scenes (one
 * per story beat); an IntersectionObserver tracks which scene is centred, that
 * scene's prop animates in, and the corner narrator speaks the beat's line.
 */
export default function StoryStage() {
  const scrollRef = useRef(null);
  const sections = useRef([]);
  const idx = useRef(0);
  const locked = useRef(false);
  const lockT = useRef(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return undefined;

    // Track the active beat for any scroll source (touch, scrollbar) - but not
    // while a wheel/key jump is animating, so it doesn't fight the target.
    const io = new IntersectionObserver(
      (entries) => {
        if (locked.current) return;
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio >= 0.55) {
            idx.current = Number(e.target.dataset.index);
            setActive(idx.current);
          }
        });
      },
      { root, threshold: [0.55, 0.8] },
    );
    sections.current.forEach((s) => s && io.observe(s));

    // One wheel notch / arrow press = one section, smooth-scrolled. CSS snap
    // alone springs back with a discrete mouse wheel, so we drive it ourselves.
    // Smooth-scroll the container to a section with a hand-rolled rAF tween -
    // reliable everywhere (native smooth scrollTo is a no-op in headless and
    // gets cancelled by CSS snap, both of which bit us here).
    function animateTo(top) {
      const from = root.scrollTop;
      const dist = top - from;
      const dur = 460;
      let t0 = null;
      function step(ts) {
        if (t0 === null) t0 = ts;
        const t = Math.min(1, (ts - t0) / dur);
        const e = 1 - (1 - t) ** 3; // easeOutCubic
        root.scrollTop = from + dist * e;
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    function go(dir) {
      const next = Math.max(0, Math.min(N - 1, idx.current + dir));
      if (next === idx.current) return;
      idx.current = next;
      setActive(next);
      locked.current = true;
      animateTo(next * root.clientHeight);
      clearTimeout(lockT.current);
      lockT.current = setTimeout(() => { locked.current = false; }, 560);
    }
    function onWheel(e) {
      e.preventDefault();
      if (locked.current || Math.abs(e.deltaY) < 6) return;
      go(e.deltaY > 0 ? 1 : -1);
    }
    function onKey(e) {
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); go(1); }
      else if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); go(-1); }
    }
    root.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);
    return () => {
      io.disconnect();
      root.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
      clearTimeout(lockT.current);
    };
  }, []);

  return (
    <>
      <div className="story-scroll" ref={scrollRef} data-lenis-prevent>
        {STORY.map((beat, i) => {
          const Prop = ASSETS[beat.prop];
          return (
            <section
              key={beat.id}
              data-index={i}
              ref={(el) => { sections.current[i] = el; }}
              className={`story-section is-${beat.id}${i === active ? ' is-active' : ''}`}
            >
              <div className="story-scene">
                <div className="story-prop">
                  <div className="story-prop-fx">{Prop ? <Prop /> : null}</div>
                </div>
                <p className="story-kicker">{beat.kicker}</p>
                <h2 className="story-headline">{beat.title}</h2>
              </div>
            </section>
          );
        })}
      </div>

      <StoryNarrator text={STORY[active]?.line} />

      <div className="story-rail" aria-hidden="true">
        {STORY.map((beat, i) => (
          <span key={beat.id} className={`story-dot${i === active ? ' is-on' : ''}`} />
        ))}
      </div>
      <p className="story-scrollhint" data-hide={active > 0}>scroll ↓</p>
    </>
  );
}
