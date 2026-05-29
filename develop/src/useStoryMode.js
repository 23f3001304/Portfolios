import { useSyncExternalStore } from 'react';

/*
 * Single source of truth for Story Mode (mirrors use3DMode.js / theme.js).
 * Opening it toggles a `story-mode` class on <html> and pauses Lenis, since the
 * story runs its own scroll-driven timeline inside a fixed overlay.
 */
let open = false;
const listeners = new Set();

function emit() {
  listeners.forEach((fn) => fn());
}

export function setStoryMode(next) {
  if (next === open) return;
  open = next;
  document.documentElement.classList.toggle('story-mode', open);
  const lenis = window.__lenis;
  if (open) lenis?.stop();
  else lenis?.start();
  emit();
}

export function toggleStoryMode() {
  setStoryMode(!open);
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useStory() {
  return useSyncExternalStore(subscribe, () => open, () => open);
}
