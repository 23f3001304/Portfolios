import { useSyncExternalStore } from 'react';

/*
 * Single source of truth for the 3D gallery mode (mirrors theme.js).
 * Opening it toggles a `mode-3d` class on <html> - the fold transition and
 * the "hide the pursuit pet" rule key off that - and pauses Lenis so wheel
 * input doesn't scroll the folded page underneath the canvas.
 */
let open = false;
const listeners = new Set();

function emit() {
  listeners.forEach((fn) => fn());
}

export function set3DMode(next) {
  if (next === open) return;
  open = next;
  document.documentElement.classList.toggle('mode-3d', open);
  const lenis = window.__lenis;
  if (open) lenis?.stop();
  else lenis?.start();
  emit();
}

export function toggle3DMode() {
  set3DMode(!open);
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useMode() {
  return useSyncExternalStore(subscribe, () => open, () => open);
}
