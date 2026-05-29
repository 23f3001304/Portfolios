import { useEffect, useRef, useState } from 'react';
import { Guide } from './Peep.jsx';
import { createGuideAudio } from './guideAudio.js';

/*
 * The narrator: the studio guide's head (head + torso bust) parked in the corner,
 * lip-syncing the current beat's line in a speech bubble - reusing the exact
 * talking/blip/blink machinery from the studio. `text` changes as you scroll to
 * a new beat, and he re-speaks it.
 */
export function StoryNarrator({ text }) {
  const audio = useRef(null);
  if (!audio.current) audio.current = createGuideAudio();

  const [typed, setTyped] = useState('');
  const [talking, setTalking] = useState(false);
  const [talkFrame, setTalkFrame] = useState(false);
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    audio.current.startAmbient(); // room tone; becomes audible once unlocked
    return () => audio.current?.close();
  }, []);

  // The AudioContext starts suspended (autoplay policy) and the lazy-load breaks
  // the open-click gesture link, so resume on the first interaction in the story.
  useEffect(() => {
    const unlock = () => audio.current?.ensure();
    const opts = { passive: true };
    window.addEventListener('pointerdown', unlock, opts);
    window.addEventListener('wheel', unlock, opts);
    window.addEventListener('keydown', unlock, opts);
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('wheel', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);

  // Type out + lip-sync the active line: a blip + mouth flap every few chars,
  // a vowel filler at punctuation pauses. Ducks the ambient bed while talking
  // so the voice always sits forward.
  useEffect(() => {
    if (!text) { setTyped(''); setTalking(false); return undefined; }
    let i = 0;
    setTyped('');
    setTalking(true);
    const a = audio.current;
    a.ensure();
    a.duck(); // drop the bed while he speaks
    a.cue(); // a soft "pop" as the scene appears
    a.filler();
    const id = setInterval(() => {
      i += 1;
      const ch = text[i - 1] || '';
      setTyped(text.slice(0, i));
      if (ch !== ' ' && i % 3 === 0) { a.blip(ch, i); setTalkFrame((f) => !f); }
      if (ch === ',' || ch === '.') a.filler();
      if (i >= text.length) { clearInterval(id); setTalking(false); a.unduck(); }
    }, 36);
    return () => { clearInterval(id); a.unduck(); };
  }, [text]);

  // Occasional blink in every state.
  useEffect(() => {
    let openT;
    let closeT;
    function schedule() {
      openT = setTimeout(() => {
        setBlink(true);
        closeT = setTimeout(() => { setBlink(false); schedule(); }, 120);
      }, 2800 + Math.random() * 3000);
    }
    schedule();
    return () => { clearTimeout(openT); clearTimeout(closeT); };
  }, []);

  const mood = talking ? 'talk' : 'happy';

  return (
    <div className="narrator" data-talking={talking}>
      <div className="narrator-head">
        <Guide talking={talking} talkFrame={talkFrame} mood={mood} blink={blink} />
      </div>
      <div className="narrator-bubble" role="status">
        <p className="narrator-text">
          {typed}
          <span className="speech-caret" data-on={talking} aria-hidden="true" />
        </p>
      </div>
    </div>
  );
}
