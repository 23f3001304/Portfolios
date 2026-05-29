import { useEffect, useRef, useState } from 'react';
import { useMode } from '../use3DMode.js';
import { useStory } from '../useStoryMode.js';

/*
 * Ambient audio toggle. Plays /audio/bedtime.mp3 in a loop with a soft
 * fade-in / fade-out. Routes the playback through a MediaElementAudio-
 * SourceNode so the canvas visualizer can sample live frequency data.
 *
 *   <audio> -> MediaElementSource -> Gain -> Analyser -> destination
 */

const SRC = '/audio/bedtime.mp3';
const TARGET_GAIN = 0.7;
const FADE_IN_SEC  = 1.6;
const FADE_OUT_SEC = 0.6;

function SpeakerOnIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 9h3l5-4v14l-5-4H4z" fill="currentColor"/>
      <path d="M16 8.5a4 4 0 0 1 0 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M19 5.5a8 8 0 0 1 0 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}
function SpeakerOffIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 9h3l5-4v14l-5-4H4z" fill="currentColor"/>
      <path d="M17 9l5 5M22 9l-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function AmbientAudio() {
  const [enabled, setEnabled] = useState(false);
  const refs = useRef({ ctx: null, audio: null, source: null, gain: null, analyser: null });
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  // Story/Studio modes have their own soundscape, so the site loop pauses while
  // either is open - the user's on/off preference is preserved meanwhile.
  // Both hooks must be called unconditionally (no `||` short-circuit, or the
  // hook order changes between renders and React throws).
  const studioOpen = useMode();
  const storyOpen = useStory();
  const active = enabled && !studioOpen && !storyOpen;

  useEffect(() => {
    if (localStorage.getItem('ambient') === 'on') setEnabled(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('ambient', enabled ? 'on' : 'off');
  }, [enabled]);

  useEffect(() => {
    if (active) start();
    else stop();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  function start() {
    if (refs.current.ctx) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;

    const ctx = new Ctx();
    const audio = new Audio(SRC);
    audio.loop = true;
    audio.preload = 'auto';
    audio.crossOrigin = 'anonymous';

    const source = ctx.createMediaElementSource(audio);
    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.gain.linearRampToValueAtTime(TARGET_GAIN, ctx.currentTime + FADE_IN_SEC);

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 128;
    analyser.smoothingTimeConstant = 0.82;

    source.connect(gain).connect(analyser).connect(ctx.destination);

    audio.play().catch(() => {
      // Autoplay can still be blocked on first load if context isn't user-
      // gestured; bail to off state instead of leaving a half-started loop.
      setEnabled(false);
    });

    refs.current = { ctx, audio, source, gain, analyser };
    startVisualizer();
  }

  function stop() {
    const { ctx, audio, gain } = refs.current;
    if (!ctx) return;
    refs.current = { ctx: null, audio: null, source: null, gain: null, analyser: null };
    try {
      gain.gain.cancelScheduledValues(ctx.currentTime);
      gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + FADE_OUT_SEC);
    } catch { /* */ }
    setTimeout(() => {
      try { audio.pause(); audio.currentTime = 0; } catch { /* */ }
      try { ctx.close(); } catch { /* */ }
    }, FADE_OUT_SEC * 1000 + 80);
    stopVisualizer();
  }

  function startVisualizer() {
    const { analyser } = refs.current;
    const canvas = canvasRef.current;
    if (!analyser || !canvas) return;
    const ctx2d = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const cssW = canvas.clientWidth;
    const cssH = canvas.clientHeight;
    canvas.width  = cssW * dpr;
    canvas.height = cssH * dpr;
    ctx2d.scale(dpr, dpr);

    const data = new Uint8Array(analyser.frequencyBinCount);
    const BARS = 7;

    function draw() {
      if (!refs.current.analyser) return;
      analyser.getByteFrequencyData(data);
      ctx2d.clearRect(0, 0, cssW, cssH);
      const colour = getComputedStyle(document.documentElement)
        .getPropertyValue('--accent').trim() || '#ff5e00';
      ctx2d.fillStyle = colour;
      const barW = (cssW - (BARS - 1) * 2) / BARS;
      for (let i = 0; i < BARS; i++) {
        const binIdx = 1 + Math.floor((i / BARS) * data.length * 0.6);
        const v = data[binIdx] / 255;
        const barH = Math.max(2, v * cssH * 1.4);
        const x = i * (barW + 2);
        const y = (cssH - barH) / 2;
        ctx2d.fillRect(x, y, barW, barH);
      }
      rafRef.current = requestAnimationFrame(draw);
    }
    draw();
  }

  function stopVisualizer() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx2d = canvas.getContext('2d');
      ctx2d.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  return (
    <button
      className="ambient-toggle"
      data-on={enabled}
      onClick={() => setEnabled((v) => !v)}
      aria-label={enabled ? 'Turn off ambient' : 'Turn on ambient'}
      aria-pressed={enabled}
      title={enabled ? 'Mute' : 'Play ambient loop'}
    >
      <canvas ref={canvasRef} className="ambient-vis" width="56" height="16" />
      <span className="ambient-icon">
        {enabled ? <SpeakerOnIcon /> : <SpeakerOffIcon />}
      </span>
    </button>
  );
}
