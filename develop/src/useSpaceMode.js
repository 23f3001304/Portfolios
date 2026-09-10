import { useSyncExternalStore } from 'react';

/*
 * Single source of truth for the project space (mirrors use3DMode.js).
 * Opening it toggles a `mode-space` class on <html> - the page fold keys off
 * that - and pauses Lenis so wheel input travels the helix instead of
 * scrolling the folded page underneath.
 */
let open = false;
const listeners = new Set();

function emit() {
  listeners.forEach((fn) => fn());
}

export function setSpaceMode(next) {
  if (next === open) return;
  open = next;
  document.documentElement.classList.toggle('mode-space', open);
  const lenis = window.__lenis;
  if (open) lenis?.stop();
  else lenis?.start();
  emit();
}

export function toggleSpaceMode() {
  setSpaceMode(!open);
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useSpace() {
  return useSyncExternalStore(subscribe, () => open, () => open);
}
