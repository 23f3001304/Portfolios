import { useSyncExternalStore } from 'react';

/*
 * Single source of truth for World Mode (mirrors useStoryMode.js / use3DMode.js).
 * Opening it toggles a `world-mode` class on <html> and pauses Lenis, since the
 * world runs its own pointer/wheel-driven camera inside a fixed overlay.
 */
let open = false;
const listeners = new Set();

function emit() {
  listeners.forEach((fn) => fn());
}

export function setWorldMode(next) {
  if (next === open) return;
  open = next;
  document.documentElement.classList.toggle('world-mode', open);
  const lenis = window.__lenis;
  if (open) lenis?.stop();
  else lenis?.start();
  emit();
}

export function toggleWorldMode() {
  setWorldMode(!open);
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useWorld() {
  return useSyncExternalStore(subscribe, () => open, () => open);
}
