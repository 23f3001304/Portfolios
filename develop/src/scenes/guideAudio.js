/*
 * Voice for the guide. Plays real clips from /audio/guide/ when they exist
 * (drop in blip + ooh/ahh/uhh/umm/hmm as .mp3/.wav/.ogg), and falls back to
 * a built-in synth so it always works. Blips are pitch-varied per character
 * so words stay melodic. Context unlocks on the first click (a user gesture).
 */
const BASE = '/audio/guide/';
const NAMES = ['blip', 'ooh', 'ahh', 'uhh', 'umm', 'hmm'];
const FILLERS = ['ooh', 'ahh', 'uhh', 'umm', 'hmm'];

export function createGuideAudio() {
  let ctx = null;
  const buffers = {}; // name -> decoded AudioBuffer, when a file is present

  function ensure() {
    // Recreate when null OR closed - React StrictMode's mount/cleanup/mount
    // closes the first context in dev, and a closed one can't be revived.
    if (!ctx || ctx.state === 'closed') {
      try {
        const C = window.AudioContext || window.webkitAudioContext;
        if (C) { ctx = new C(); preload(); }
      } catch { /* no audio - silent fallback */ }
    }
    // A fresh context is "suspended" under the autoplay policy - resume it
    // (this is the other reason nothing played: created but never resumed).
    if (ctx && ctx.state === 'suspended') ctx.resume();
  }

  async function loadOne(name) {
    for (const ext of ['mp3', 'wav', 'ogg']) {
      try {
        const res = await fetch(`${BASE}${name}.${ext}`);
        if (!res.ok) continue;
        buffers[name] = await ctx.decodeAudioData(await res.arrayBuffer());
        return;
      } catch { /* try next extension, else stay on synth */ }
    }
  }
  function preload() { NAMES.forEach(loadOne); }

  function playBuffer(name, rate = 1, gain = 0.6) {
    const buf = buffers[name];
    if (!ctx || !buf) return false;
    const src = ctx.createBufferSource();
    const g = ctx.createGain();
    src.buffer = buf;
    src.playbackRate.value = rate;
    g.gain.value = gain;
    src.connect(g).connect(ctx.destination);
    src.start();
    return true;
  }

  /* ---- synth fallbacks (used until real clips are dropped in) ---- */
  function synthBlip(ch, i) {
    const t = ctx.currentTime;
    const code = String(ch).toLowerCase().charCodeAt(0) || 97;
    const base = 220 + ((code * 7) % 24) * 17;
    const osc = ctx.createOscillator();
    const filt = ctx.createBiquadFilter();
    const g = ctx.createGain();
    osc.type = i % 2 ? 'triangle' : 'square';
    osc.frequency.setValueAtTime(base, t);
    osc.frequency.exponentialRampToValueAtTime(base * 1.08, t + 0.05);
    filt.type = 'lowpass'; filt.frequency.value = 1400;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.04, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.075);
    osc.connect(filt).connect(g).connect(ctx.destination);
    osc.start(t); osc.stop(t + 0.09);
  }
  const FORMANTS = {
    ooh: { pitch: 150, f1: 320, f2: 760, dur: 0.34, peak: 0.06 },
    ahh: { pitch: 165, f1: 720, f2: 1180, dur: 0.30, peak: 0.06 },
    uhh: { pitch: 150, f1: 540, f2: 1000, dur: 0.26, peak: 0.055 },
    umm: { pitch: 140, f1: 360, f2: 600, dur: 0.34, peak: 0.05 },
    hmm: { pitch: 132, f1: 300, f2: 500, dur: 0.36, peak: 0.05 },
  };
  function synthVowel(name) {
    const v = FORMANTS[name] || FORMANTS.ooh;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const b1 = ctx.createBiquadFilter();
    const b2 = ctx.createBiquadFilter();
    const merge = ctx.createGain();
    const g = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(v.pitch, t);
    osc.frequency.linearRampToValueAtTime(v.pitch * 0.95, t + v.dur);
    b1.type = 'bandpass'; b1.frequency.value = v.f1; b1.Q.value = 6;
    b2.type = 'bandpass'; b2.frequency.value = v.f2; b2.Q.value = 8;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(v.peak, t + 0.04);
    g.gain.exponentialRampToValueAtTime(0.0001, t + v.dur);
    osc.connect(b1).connect(merge);
    osc.connect(b2).connect(merge);
    merge.connect(g).connect(ctx.destination);
    osc.start(t); osc.stop(t + v.dur + 0.03);
  }

  // a soft two-note rising "pop" when a new scene appears
  function synthCue() {
    const t = ctx.currentTime;
    [0, 0.085].forEach((dt, k) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      const f = k === 0 ? 520 : 700;
      osc.frequency.setValueAtTime(f, t + dt);
      osc.frequency.exponentialRampToValueAtTime(f * 1.45, t + dt + 0.12);
      g.gain.setValueAtTime(0.0001, t + dt);
      g.gain.exponentialRampToValueAtTime(0.05, t + dt + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dt + 0.2);
      osc.connect(g).connect(ctx.destination);
      osc.start(t + dt); osc.stop(t + dt + 0.22);
    });
  }

  /* ---- public API: real clip if present, else synth ---- */
  function cue() { if (!ctx) return; if (!playBuffer('pop', 1, 0.4)) synthCue(); }
  function blip(ch = 'a', i = 0) {
    if (!ctx) return;
    const code = String(ch).toLowerCase().charCodeAt(0) || 97;
    const rate = 0.85 + (((code * 7) % 24) / 24) * 0.5; // melodic pitch shift
    if (!playBuffer('blip', rate, 0.5)) synthBlip(ch, i);
  }
  function vowel(name = 'ooh') {
    if (!ctx) return;
    if (!playBuffer(name, 1, 0.6)) synthVowel(name);
  }
  function filler() { vowel(FILLERS[Math.floor(Math.random() * FILLERS.length)]); }
  /* ---- ambient bed: a quiet looped room tone (file: /audio/ambience.*),
     with a synth drone fallback if the file is missing. Kept low on purpose,
     and ducks further while the guide is narrating so the voice sits forward. ---- */
  const AMB_GAIN = 0.018; // subtle background bed - barely-there forest
  const AMB_DUCKED = 0.007; // a whisper while the guide is talking
  let ambient = null;
  let ambienceBuf = null;
  let ambienceTried = false;

  async function loadAmbience() {
    if (ambienceBuf || ambienceTried || !ctx) return;
    ambienceTried = true;
    for (const ext of ['mp3', 'wav', 'ogg']) {
      try {
        const res = await fetch(`/audio/ambience.${ext}`);
        if (!res.ok) continue;
        ambienceBuf = await ctx.decodeAudioData(await res.arrayBuffer());
        return;
      } catch { /* try next extension */ }
    }
  }
  function synthDrone(out) {
    const filt = ctx.createBiquadFilter();
    filt.type = 'lowpass'; filt.frequency.value = 620; filt.Q.value = 0.7;
    filt.connect(out);
    const oscs = [[110, 0.6, 'sine'], [165, 0.32, 'triangle'], [220, 0.22, 'sine']].map(([f, gv, type]) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type; o.frequency.value = f; g.gain.value = gv;
      o.connect(g).connect(filt); o.start();
      return o;
    });
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.05; lfoGain.gain.value = 240;
    lfo.connect(lfoGain).connect(filt.frequency); lfo.start();
    return [...oscs, lfo];
  }
  async function startAmbient() {
    ensure();
    if (!ctx || ambient) return;
    const claim = {};
    ambient = claim; // reserve the slot before the async load (no double-start)
    await loadAmbience();
    if (ambient !== claim || !ctx || ctx.state === 'closed') { if (ambient === claim) ambient = null; return; }
    const out = ctx.createGain();
    out.gain.setValueAtTime(0.0001, ctx.currentTime);
    out.gain.linearRampToValueAtTime(AMB_GAIN, ctx.currentTime + 2.5);
    out.connect(ctx.destination);
    let nodes;
    if (ambienceBuf) {
      const src = ctx.createBufferSource();
      src.buffer = ambienceBuf; src.loop = true; src.connect(out); src.start();
      nodes = [src];
    } else {
      nodes = synthDrone(out);
    }
    ambient = { out, nodes };
  }
  function stopAmbient() {
    if (!ambient || !ctx) return;
    const cur = ambient;
    ambient = null;
    if (!cur.out) return; // was only a claim token (file still loading)
    const t = ctx.currentTime;
    try {
      cur.out.gain.cancelScheduledValues(t);
      cur.out.gain.setTargetAtTime(0.0001, t, 0.4);
    } catch { /* node may be gone */ }
    (cur.nodes || []).forEach((n) => { try { n.stop(t + 1.1); } catch { /* already stopped */ } });
  }
  // Dialog-game ducking: drop the bed while the guide is talking, then bring it
  // back when he's done, so the voice always sits forward.
  function setAmbientGain(target, ramp = 0.18) {
    if (!ambient || !ambient.out || !ctx) return;
    const t = ctx.currentTime;
    try {
      ambient.out.gain.cancelScheduledValues(t);
      ambient.out.gain.setTargetAtTime(target, t, ramp);
    } catch { /* node may be gone */ }
  }
  function duck() { setAmbientGain(AMB_DUCKED, 0.08); }
  function unduck() { setAmbientGain(AMB_GAIN, 0.5); }
  function close() {
    stopAmbient();
    if (ctx && ctx.state !== 'closed') ctx.close();
    ctx = null;
    Object.keys(buffers).forEach((k) => delete buffers[k]);
    // Crucial in dev (React StrictMode mounts twice): the ambience buffer is
    // bound to THIS context - if we keep it, the next context tries to play a
    // buffer from a closed context and produces silence (so only the synth
    // drone is heard, which is what the "humm" was). Reload fresh next time.
    ambienceBuf = null;
    ambienceTried = false;
  }

  return { ensure, cue, blip, vowel, filler, startAmbient, stopAmbient, duck, unduck, close };
}
