import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projects } from '../data.js';
import { set3DMode } from '../use3DMode.js';
import { Guide } from './Peep.jsx';
import { createGuideAudio } from './guideAudio.js';

// The guide's project pitches - a couple of sentences each, spoken aloud.
const BLURBS = {
  typereal: "TypeReal's a typing trainer built for speed. Seven modes, a real-time engine budgeted under 16 milliseconds a keystroke, a 1v1 duel over a live socket, and a ghost that races your own best run.",
  formdash: "Formdash is a form builder where the branching actually holds. One rule engine checks visibility in the editor, the live form, and the server, so nobody forges a hidden answer. Plus webhooks and real file validation.",
  quizzy: "Quizzy is a Pydantic-AI agent that solves a quiz end to end: a fast planner, a tool-using solver, and a sandbox that runs Python it writes on the fly. Ninety tools across twelve modules, and it graded 92 out of 100.",
  animy: "ANIMY turns a text prompt into a short animated video. Four workers render in parallel while the browser polls for progress. WebSockets were too expensive to keep open for every user, and Heroku kept timing out the long polls, so each status request just returns fast with the current state.",
  'build-my-own-git': "This one is Git, rebuilt from scratch in Node. Six core commands producing byte-identical objects the real Git reads right back, SHA-1 and zlib and all.",
  'build-my-own-shell': "Build My Own Shell is a POSIX shell in C++, written from the syscalls up. A read-parse-run loop, six built-ins, a PATH walk, and fork-plus-exec to launch real programs. No libraries past the standard one.",
  'spider-man': "Spider-Man is a concept site for Into the Spider-Verse, designed in Figma. Chromatic comic-book title type, a Marvel marquee, and glassmorphism over Miles Morales art, all keyed off one tight palette.",
  stic: "STIC is a brand and landing-page design for a student tech council. A red-and-cream editorial system, a big numbered section grid, and a full social asset kit, built to make a brand-new council look settled.",
};

// What the guide says when you click him directly - about Hemang or the oneko pet.
const GUIDE_LINES = [
  "You're in Hemang's portfolio. Full-stack apps, ML pipelines, and the occasional weird side-project.",
  "Hemang trained CycleGANs at DRDO, then wrote Git from scratch in Node because the manual wasn't enough.",
  "He's doing a B.Tech at MBM and a parallel B.S. in Data Science at IIT Madras. Busy guy.",
  "See that pixel dog chasing your cursor on the main page? That's oneko. Click it, it barks and tells you things.",
  "Between you and me, his sleep schedule runs on a random number generator.",
  "The little dog out front shares random facts about Hemang. Go say hi after this.",
];

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

export default function Lobby() {
  const navigate = useNavigate();
  const audio = useRef(null);
  if (!audio.current) audio.current = createGuideAudio();

  const [look, setLook] = useState(0);
  const [lookY, setLookY] = useState(0);
  const [hover, setHover] = useState(null);
  const [speech, setSpeech] = useState(null); // { text, slug|null }
  const [typed, setTyped] = useState('');
  const [talking, setTalking] = useState(false);
  const [talkFrame, setTalkFrame] = useState(false);
  const [blink, setBlink] = useState(false);
  const [pop, setPop] = useState(0);

  useEffect(() => {
    function onMove(e) {
      setLook(Math.max(-1, Math.min(1, (e.clientX / window.innerWidth) * 2 - 1)));
      setLookY(Math.max(-1, Math.min(1, (e.clientY / window.innerHeight) * 2 - 1)));
    }
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useEffect(() => {
    const a = audio.current;
    a.startAmbient(); // quiet room-tone bed; audible once the context unlocks
    const unlock = () => a.ensure();
    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('keydown', unlock, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
      a.close();
    };
  }, []);

  // Talk: open with a random vowel, then type with a blip + mouth flap every
  // few characters and a vowel filler at each punctuation pause. Ducks the
  // ambient bed while he speaks so the voice always sits forward.
  useEffect(() => {
    if (!speech) { setTyped(''); setTalking(false); return undefined; }
    const text = speech.text;
    let i = 0;
    setTyped('');
    setTalking(true);
    const a = audio.current;
    a.ensure();
    a.duck();
    a.filler();
    const id = setInterval(() => {
      i += 1;
      const ch = text[i - 1] || '';
      setTyped(text.slice(0, i));
      if (ch !== ' ' && i % 3 === 0) { a.blip(ch, i); setTalkFrame((f) => !f); }
      if (ch === ',' || ch === '.') a.filler();
      if (i >= text.length) { clearInterval(id); setTalking(false); a.unduck(); }
    }, 38);
    return () => { clearInterval(id); a.unduck(); };
  }, [speech]);

  // Occasional blink in any state (including while talking), but spaced out.
  useEffect(() => {
    let openTimer;
    let closeTimer;
    function schedule() {
      openTimer = setTimeout(() => {
        setBlink(true);
        closeTimer = setTimeout(() => { setBlink(false); schedule(); }, 120);
      }, 3000 + Math.random() * 3000);
    }
    schedule();
    return () => { clearTimeout(openTimer); clearTimeout(closeTimer); };
  }, []);

  function pickProject(slug) {
    audio.current.ensure();
    setPop((p) => p + 1);
    setHover(null);
    setSpeech({ text: BLURBS[slug] || '', slug });
  }
  function talkAboutSelf() {
    audio.current.ensure();
    setPop((p) => p + 1);
    setSpeech({ text: pickRandom(GUIDE_LINES), slug: null });
  }
  function openProject() {
    set3DMode(false);
    navigate(`/projects/${speech.slug}`);
  }

  const proj = (slug) => projects.find((p) => p.slug === slug);
  const titleName = speech?.slug
    ? proj(speech.slug)?.name
    : speech
      ? 'oh, me?'
      : hover
        ? proj(hover)?.name
        : 'Pick a project.';
  const mood = talking ? 'talk' : (speech || hover) ? 'happy' : 'idle';

  return (
    <div className="lobby">
      <p className="lobby-kicker">the studio</p>
      <h2 className="lobby-title">{titleName}</h2>

      <div className="lobby-stage">
        <div className="guide-col">
          <button className="guide-hit" onClick={talkAboutSelf} aria-label="Talk to the guide">
            <Guide look={look} lookY={lookY} pop={pop} talking={talking} talkFrame={talkFrame} mood={mood} blink={blink} />
          </button>
          {!speech && <span className="guide-hint">psst, click me</span>}
        </div>

        {speech && (
          <div className="speech" role="status">
            <button className="speech-close" onClick={() => setSpeech(null)} aria-label="Close">×</button>
            <p className="speech-text">
              {typed}
              <span className="speech-caret" data-on={talking} aria-hidden="true" />
            </p>
            {speech.slug && !talking && (
              <button className="btn speech-more" onClick={openProject}>
                more details <span aria-hidden="true">→</span>
              </button>
            )}
          </div>
        )}
      </div>

      <div className="lobby-cards" role="list">
        {projects.map((p) => (
          <button
            key={p.slug}
            type="button"
            role="listitem"
            className={`lobby-card${speech?.slug === p.slug ? ' is-active' : ''}`}
            style={{ '--c': p.accent }}
            onMouseEnter={() => setHover(p.slug)}
            onMouseLeave={() => setHover((s) => (s === p.slug ? null : s))}
            onClick={() => pickProject(p.slug)}
          >
            <span className="lobby-card-id">{p.id}</span>
            <strong>{p.name}</strong>
          </button>
        ))}
      </div>
    </div>
  );
}
