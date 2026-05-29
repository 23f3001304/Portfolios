import { useEffect } from 'react';
import {
  SPEED, FRAME_MS, DISTRACT_CHANCE, DISTRACT_MIN_FRAMES, DISTRACT_MAX_FRAMES,
  SIT_CHANCE, SIT_MIN_FRAMES, SIT_MAX_FRAMES, IDLE_ACT_CHANCE, IDLE_TRIGGER,
  FACT_CHANCE, FACT_COOLDOWN_FRAMES,
} from './oneko/constants.js';
import { spriteSets } from './oneko/sprites.js';
import { wakePhrases, factPhrases, statePhrases, pick } from './oneko/phrases.js';
import { createOnekoSynth } from './oneko/audio.js';
import { createOnekoBubble } from './oneko/bubble.js';

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
 *
 * The supporting pieces live alongside this hook: sprite frames in
 * ./oneko/sprites, bubble copy in ./oneko/phrases, sound effects in
 * ./oneko/audio, and the speech-bubble element in ./oneko/bubble. This
 * file owns the DOM element, input listeners, and the per-frame state
 * machine that drives them. Behaviour tuning lives in ./oneko/constants.
 */

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
    const bubble = createOnekoBubble(mountParent);

    // Cadence is tuned in ./oneko/constants; this tracks the last fire.
    let lastFactFrame = -Infinity;

    // Web Audio synth - unlocked lazily on the first wake click (a user
    // gesture), then reused for idle scratch/yawn effects.
    const synth = createOnekoSynth();

    // Track the previous idle animation so we only bubble/sound on transitions.
    let lastIdleAnimation = null;
    function onIdleAnimationStarted(name) {
      const list = statePhrases[name];
      if (list) bubble.show(pick(list), name === 'sleeping' ? 2400 : 1500);
      if (name === 'tired')                                 synth.yawn();
      else if (name && name.startsWith('scratch'))          synth.scratch();
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
        bubble.show(pick(factPhrases), 3200);
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

    function onAnimationFrame(timestamp) {
      if (!nekoEl.isConnected) return;
      if (!lastFrameTimestamp) lastFrameTimestamp = timestamp;
      if (timestamp - lastFrameTimestamp > FRAME_MS) {
        lastFrameTimestamp = timestamp;
        frame();
        bubble.moveTo(nekoPosX, nekoPosY);
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
      // The click is a user gesture - safe to unlock audio and play a woof.
      synth.ensure();
      synth.woof();

      // Wobble: re-trigger by removing then re-adding next frame.
      nekoEl.classList.remove('oneko-wake');
      void nekoEl.offsetWidth;
      nekoEl.classList.add('oneko-wake');
      if (wakeTimer) clearTimeout(wakeTimer);
      wakeTimer = setTimeout(() => nekoEl.classList.remove('oneko-wake'), 560);

      // Speech bubble with a random wake phrase.
      bubble.show(pick(wakePhrases));
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
      if (rafId) window.cancelAnimationFrame(rafId);
      synth.close();
      nekoEl.remove();
      bubble.destroy();
    };
  }, [src]);
}
