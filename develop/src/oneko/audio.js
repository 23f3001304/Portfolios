/*
 * Lightweight Web Audio synth for the oneko pet's sound effects.
 * The audio context is created lazily on the first user gesture (the wake
 * click) so autoplay policies don't block it. Once unlocked, idle-state
 * effects (scratch, yawn) can play too.
 *
 * Returns a small controller; all play methods are no-ops until ensure()
 * has successfully created a context.
 */
export function createOnekoSynth() {
  let audioCtx = null;

  function ensure() {
    if (audioCtx) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) audioCtx = new Ctx();
    } catch { /* no audio - silent fallback */ }
  }

  function woof() {
    if (!audioCtx) return;
    const t = audioCtx.currentTime;

    // Low-fundamental body of the bark: sawtooth sliding 180 -> 80 Hz.
    const osc = audioCtx.createOscillator();
    const oscGain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(85, t + 0.16);
    const oscFilter = audioCtx.createBiquadFilter();
    oscFilter.type = 'lowpass';
    oscFilter.frequency.setValueAtTime(1100, t);
    oscFilter.frequency.exponentialRampToValueAtTime(380, t + 0.18);
    oscFilter.Q.value = 1.6;
    oscGain.gain.setValueAtTime(0, t);
    oscGain.gain.linearRampToValueAtTime(0.09, t + 0.015);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    osc.connect(oscFilter).connect(oscGain).connect(audioCtx.destination);
    osc.start(t);
    osc.stop(t + 0.23);

    // Plosive noise burst for the "uff" texture.
    const noiseBuf = audioCtx.createBuffer(1, 0.12 * audioCtx.sampleRate, audioCtx.sampleRate);
    const noiseData = noiseBuf.getChannelData(0);
    for (let i = 0; i < noiseData.length; i++) noiseData[i] = (Math.random() * 2 - 1) * 0.6;
    const noiseSrc = audioCtx.createBufferSource();
    noiseSrc.buffer = noiseBuf;
    const noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.value = 900;
    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.045, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
    noiseSrc.connect(noiseFilter).connect(noiseGain).connect(audioCtx.destination);
    noiseSrc.start(t);
    noiseSrc.stop(t + 0.15);
  }

  function scratch() {
    if (!audioCtx) return;
    const t = audioCtx.currentTime;
    // 80 ms burst of band-passed noise.
    const buffer = audioCtx.createBuffer(1, 0.08 * audioCtx.sampleRate, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
    const src = audioCtx.createBufferSource();
    src.buffer = buffer;
    const filt = audioCtx.createBiquadFilter();
    filt.type = 'bandpass';
    filt.frequency.value = 2400;
    filt.Q.value = 1.4;
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.035, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
    src.connect(filt).connect(gain).connect(audioCtx.destination);
    src.start(t);
    src.stop(t + 0.09);
  }

  function yawn() {
    if (!audioCtx) return;
    const t = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, t);
    osc.frequency.linearRampToValueAtTime(140, t + 0.5);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.03, t + 0.15);
    gain.gain.linearRampToValueAtTime(0, t + 0.55);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(t);
    osc.stop(t + 0.6);
  }

  function close() {
    if (audioCtx && audioCtx.state !== 'closed') audioCtx.close();
  }

  return { ensure, woof, scratch, yawn, close };
}
