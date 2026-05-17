import { useEffect } from 'react';

/*
 * Oneko pursuit pet - port of github.com/adryd325/oneko.js (MIT, © adryd325).
 *
 * States: idle ⇄ alert ⇄ chase ⇄ tired ⇄ sleeping ⇄ scratching
 *                          ⇅
 *                  distracted (freeze in place, do idle stuff)
 *
 * "Distracted" means the cat ignores the cursor for a stretch and stays
 * where it is, letting the idle animation pool take over (sleep, scratch,
 * yawn). It does NOT wander to a random point.
 */

const SPEED = 10;
const FRAME_MS = 100;
const DISTRACT_CHANCE = 1 / 160;   // ~once per 16 s of chasing
const DISTRACT_MIN_FRAMES = 90;    // 9 s
const DISTRACT_MAX_FRAMES = 240;   // 24 s
const SIT_CHANCE = 1 / 220;        // mid-chase, just stop and sit
const SIT_MIN_FRAMES = 40;         // 4 s
const SIT_MAX_FRAMES = 120;        // 12 s
const IDLE_ACT_CHANCE = 1 / 60;    // how often the cat picks an idle behaviour
const IDLE_TRIGGER = 6;            // frames of idle before an act can kick in

const spriteSets = {
  idle:         [[-3, -3]],
  alert:        [[-7, -3]],
  scratchSelf:  [[-5, 0], [-6, 0], [-7, 0]],
  scratchWallN: [[0, 0], [0, -1]],
  scratchWallS: [[-7, -1], [-6, -2]],
  scratchWallE: [[-2, -2], [-2, -3]],
  scratchWallW: [[-4, 0], [-4, -1]],
  tired:        [[-3, -2]],
  sleeping:     [[-2, 0], [-2, -1]],
  N:  [[-1, -2], [-1, -3]],
  NE: [[0, -2],  [0, -3]],
  E:  [[-3, 0],  [-3, -1]],
  SE: [[-5, -1], [-5, -2]],
  S:  [[-6, -3], [-7, -2]],
  SW: [[-5, -3], [-6, -1]],
  W:  [[-4, -2], [-4, -3]],
  NW: [[-1, 0],  [-1, -1]],
};

export function useOneko({ src = '/oneko/oneko-dog.gif' } = {}) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const existing = document.getElementById('oneko');
    if (existing) existing.remove();

    // Append to <html>, not <body>. Body has filter/transform animations
    // applied (page-in, route-fade) which create stacking contexts and
    // break `position: fixed` - the cat would scroll with the page.
    // <html> stays free of those styles, so fixed positioning stays
    // viewport-relative and the cat sticks while the page scrolls.
    const mountParent = document.documentElement;
    const nekoEl = document.createElement('div');
    let nekoPosX = window.innerWidth / 2;
    let nekoPosY = window.innerHeight / 2 + 80;
    let mousePosX = window.innerWidth / 2;
    let mousePosY = window.innerHeight / 2;

    let frameCount = 0;
    let idleTime = 0;
    let idleAnimation = null;
    let idleAnimationFrame = 0;

    // Ignore-cursor counters. While either is > 0, the cat freezes in
    // place and only runs idle animations.
    let distractFrames = 0;
    let sitFrames = 0;

    let rafId = null;
    let lastFrameTimestamp = null;

    nekoEl.id = 'oneko';
    nekoEl.setAttribute('aria-hidden', 'true');
    Object.assign(nekoEl.style, {
      width: '32px',
      height: '32px',
      position: 'fixed',
      pointerEvents: 'none',
      imageRendering: 'pixelated',
      backgroundImage: `url(${src})`,
      left: `${nekoPosX - 16}px`,
      top: `${nekoPosY - 16}px`,
      zIndex: '2147483647',
      transition: 'opacity 300ms ease-out',
      opacity: '0',
    });
    mountParent.appendChild(nekoEl);
    requestAnimationFrame(() => { nekoEl.style.opacity = '1'; });

    // Speech bubble - appears above the cat when clicked/awoken.
    const existingBubble = document.getElementById('oneko-bubble');
    if (existingBubble) existingBubble.remove();
    const bubbleEl = document.createElement('div');
    bubbleEl.id = 'oneko-bubble';
    bubbleEl.setAttribute('aria-hidden', 'true');
    bubbleEl.setAttribute('data-show', 'false');
    mountParent.appendChild(bubbleEl);

    const wakePhrases = [
      'ok following!',
      'i\'m up, i\'m up!',
      'huh? oh hey.',
      'where to?',
      'let\'s go',
      'right behind you',
      'on it',
      'yes boss',
      'woof',
    ];
    // Random facts the dog occasionally tells visitors about Hemang.
const factPhrases = [
  'fyi: he\'s lazy but productive',
  'life\'s a circle - it loops',
  'he loves Jason Bourne movies',
  'fact: he\'s 5\'9"',
  'debugging at 2am counts as cardio',
  'he studies computer science and questions reality daily',
  'dual degree = double the paperwork',
  'he fixes bugs by staring aggressively at the screen',
  'his tabs have tabs',
  'he knows the pain of sem backlog calculations',
  'coffee is basically a runtime dependency',
  'he learns DSA like it\'s a boss fight',
  'sometimes the code works and nobody knows why',
  'he opens youtube for one tutorial and emerges 3 hours later',
  'ctrl+c and ctrl+v are trusted companions',
  'he measures semesters in assignments survived',
  'his sleep schedule uses random number generation',
  'stack overflow has seen things',
  'he trusts dark mode more than humanity',
  'git commit messages become emotional near deadlines',
  'his projects start with ambition and end with hotfixes',
  'he treats warnings like decorative UI elements',
  'there is always one sem subject plotting against him',
  'he can explain neural networks but not his sleep cycle',
  'wifi speed directly affects academic confidence',
  'he survives on determination and cached notes',
  'his code may not be clean but it has character',
  'he believes every bug is a personal attack',
];
    // ~1/50 per 100ms frame ≈ once per ~5s on average.
    const FACT_CHANCE = 1 / 150;
    let lastFactFrame = -Infinity;
    const FACT_COOLDOWN_FRAMES = 300; // ~10s minimum between facts
    // Context-aware idle bubbles - one fires when the cat enters each state.
    const statePhrases = {
      sleeping:     ['zzz...', '*snore*', 'dreaming...', '💤'],
      tired:        ['*yawn*', 'so tired', 'mmm...'],
      scratchSelf:  ['scritch scritch', 'itchy!', '*scratch*'],
      scratchWallN: ['scratch', '*scrape*'],
      scratchWallS: ['scratch', '*scrape*'],
      scratchWallE: ['scratch', '*scrape*'],
      scratchWallW: ['scratch', '*scrape*'],
    };
    function pick(list) {
      return list[Math.floor(Math.random() * list.length)];
    }
    let bubbleHideTimer = null;
    function showBubble(text, duration = 1800) {
      bubbleEl.textContent = text;
      bubbleEl.setAttribute('data-show', 'true');
      if (bubbleHideTimer) clearTimeout(bubbleHideTimer);
      bubbleHideTimer = setTimeout(() => {
        bubbleEl.setAttribute('data-show', 'false');
      }, duration);
    }

    /* Lightweight Web Audio synth. Audio context is created lazily on the
       first user gesture (the wake click) so autoplay policies don't block.
       Once unlocked, idle-state sound effects can play too. */
    let audioCtx = null;
    function ensureAudio() {
      if (audioCtx) return;
      try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (Ctx) audioCtx = new Ctx();
      } catch { /* no audio - silent fallback */ }
    }
    function playWoof() {
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
    function playScratch() {
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
    function playYawn() {
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

    // Track the previous idle animation so we only bubble/sound on transitions.
    let lastIdleAnimation = null;
    function onIdleAnimationStarted(name) {
      const list = statePhrases[name];
      if (list) showBubble(pick(list), name === 'sleeping' ? 2400 : 1500);
      if (name === 'tired')                                 playYawn();
      else if (name && name.startsWith('scratch'))          playScratch();
    }

    function setSprite(name, frame) {
      const sprite = spriteSets[name][frame % spriteSets[name].length];
      nekoEl.style.backgroundPosition = `${sprite[0] * 32}px ${sprite[1] * 32}px`;
    }

    function resetIdleAnimation() {
      idleAnimation = null;
      idleAnimationFrame = 0;
    }

    function idle() {
      idleTime += 1;
      if (
        idleTime > IDLE_TRIGGER &&
        Math.random() < IDLE_ACT_CHANCE &&
        idleAnimation === null
      ) {
        const pool = ['sleeping', 'scratchSelf'];
        if (nekoPosX < 32) pool.push('scratchWallW');
        if (nekoPosY < 32) pool.push('scratchWallN');
        if (nekoPosX > window.innerWidth - 32) pool.push('scratchWallE');
        if (nekoPosY > window.innerHeight - 32) pool.push('scratchWallS');
        idleAnimation = pool[Math.floor(Math.random() * pool.length)];
      }
      switch (idleAnimation) {
        case 'sleeping':
          if (idleAnimationFrame < 8) { setSprite('tired', 0); break; }
          setSprite('sleeping', Math.floor(idleAnimationFrame / 4));
          if (idleAnimationFrame > 192) resetIdleAnimation();
          break;
        case 'scratchWallN':
        case 'scratchWallS':
        case 'scratchWallE':
        case 'scratchWallW':
        case 'scratchSelf':
          setSprite(idleAnimation, idleAnimationFrame);
          if (idleAnimationFrame > 9) resetIdleAnimation();
          break;
        default:
          setSprite('idle', 0);
          return;
      }
      idleAnimationFrame += 1;
    }

    function frame() {
      frameCount += 1;

      // Occasionally drop a random fact about Hemang. Cooldown prevents
      // these from stacking on top of state/wake bubbles.
      if (
        frameCount - lastFactFrame > FACT_COOLDOWN_FRAMES &&
        Math.random() < FACT_CHANCE
      ) {
        lastFactFrame = frameCount;
        showBubble(pick(factPhrases), 3200);
      }

      // Ignore-cursor mode - freeze in place, let idle behaviours play.
      if (distractFrames > 0 || sitFrames > 0) {
        if (distractFrames > 0) distractFrames -= 1;
        if (sitFrames > 0) sitFrames -= 1;
        idle();
        return;
      }

      // Roll for a long distraction.
      if (idleAnimation === null && Math.random() < DISTRACT_CHANCE) {
        distractFrames = DISTRACT_MIN_FRAMES +
          Math.floor(Math.random() * (DISTRACT_MAX_FRAMES - DISTRACT_MIN_FRAMES));
        idleTime = IDLE_TRIGGER + 2;
        idle();
        return;
      }

      // Roll for a shorter sit break.
      if (idleAnimation === null && Math.random() < SIT_CHANCE) {
        sitFrames = SIT_MIN_FRAMES +
          Math.floor(Math.random() * (SIT_MAX_FRAMES - SIT_MIN_FRAMES));
        idleTime = IDLE_TRIGGER + 2;
        idle();
        return;
      }

      // Default - chase the cursor.
      const diffX = nekoPosX - mousePosX;
      const diffY = nekoPosY - mousePosY;
      const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

      if (distance < SPEED || distance < 48) {
        idle();
        return;
      }

      idleAnimation = null;
      idleAnimationFrame = 0;

      // Alert beat before pursuing.
      if (idleTime > 1) {
        setSprite('alert', 0);
        idleTime = Math.min(idleTime, 7);
        idleTime -= 1;
        return;
      }

      let direction = '';
      direction += diffY / distance > 0.5 ? 'N' : '';
      direction += diffY / distance < -0.5 ? 'S' : '';
      direction += diffX / distance > 0.5 ? 'W' : '';
      direction += diffX / distance < -0.5 ? 'E' : '';
      setSprite(direction, frameCount);

      nekoPosX -= (diffX / distance) * SPEED;
      nekoPosY -= (diffY / distance) * SPEED;
      nekoPosX = Math.min(Math.max(16, nekoPosX), window.innerWidth - 16);
      nekoPosY = Math.min(Math.max(16, nekoPosY), window.innerHeight - 16);

      nekoEl.style.left = `${nekoPosX - 16}px`;
      nekoEl.style.top = `${nekoPosY - 16}px`;
    }

    function updateBubblePosition() {
      // Anchor the bubble's bottom-center pointer ~6px above the cat.
      bubbleEl.style.left = `${nekoPosX}px`;
      bubbleEl.style.top  = `${nekoPosY - 16 - 6}px`;
    }

    function onAnimationFrame(timestamp) {
      if (!nekoEl.isConnected) return;
      if (!lastFrameTimestamp) lastFrameTimestamp = timestamp;
      if (timestamp - lastFrameTimestamp > FRAME_MS) {
        lastFrameTimestamp = timestamp;
        frame();
        updateBubblePosition();
        // Detect transitions into a named idle animation.
        if (idleAnimation !== lastIdleAnimation) {
          if (idleAnimation) onIdleAnimationStarted(idleAnimation);
          lastIdleAnimation = idleAnimation;
        }
      }
      rafId = window.requestAnimationFrame(onAnimationFrame);
    }

    function onMouseMove(e) {
      mousePosX = e.clientX;
      mousePosY = e.clientY;
    }
    function onTouch(e) {
      const t = e.touches[0];
      if (t) { mousePosX = t.clientX; mousePosY = t.clientY; }
    }

    // Cat is pointer-events: none so a real click on the element is
    // impossible - instead listen on the document and check whether the
    // click landed inside the cat's bounding box (with a small forgiving
    // hit-padding because pixel sprites are small targets).
    let wakeTimer = null;
    function onDocPointerDown(e) {
      const cx = e.clientX;
      const cy = e.clientY;
      const pad = 6;
      const left   = nekoPosX - 16 - pad;
      const right  = nekoPosX + 16 + pad;
      const top    = nekoPosY - 16 - pad;
      const bottom = nekoPosY + 16 + pad;
      if (cx < left || cx > right || cy < top || cy > bottom) return;

      // Wake up - clear every "ignore cursor" state and snap to alert.
      distractFrames = 0;
      sitFrames = 0;
      idleAnimation = null;
      idleAnimationFrame = 0;
      idleTime = 0;
      setSprite('alert', 0);
      // The click is a user gesture - safe to unlock audio and play a meow.
      ensureAudio();
      playWoof();

      // Wobble: re-trigger by removing then re-adding next frame.
      nekoEl.classList.remove('oneko-wake');
      void nekoEl.offsetWidth;
      nekoEl.classList.add('oneko-wake');
      if (wakeTimer) clearTimeout(wakeTimer);
      wakeTimer = setTimeout(() => nekoEl.classList.remove('oneko-wake'), 560);

      // Speech bubble with a random wake phrase.
      showBubble(pick(wakePhrases));
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('touchmove', onTouch, { passive: true });
    document.addEventListener('pointerdown', onDocPointerDown);
    rafId = window.requestAnimationFrame(onAnimationFrame);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('touchmove', onTouch);
      document.removeEventListener('pointerdown', onDocPointerDown);
      if (wakeTimer) clearTimeout(wakeTimer);
      if (bubbleHideTimer) clearTimeout(bubbleHideTimer);
      if (rafId) window.cancelAnimationFrame(rafId);
      if (audioCtx && audioCtx.state !== 'closed') audioCtx.close();
      nekoEl.remove();
      bubbleEl.remove();
    };
  }, [src]);
}
