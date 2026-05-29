import { useSyncExternalStore } from 'react';

/*
 * Single source of truth for the colour theme. Both the ThemeToggle button
 * and the Cmd/Ctrl+. shortcut go through here, so the switch UI and the
 * document's data-theme attribute can never drift out of sync (the bug:
 * the keyboard shortcut used to flip the theme without the switch moving).
 *
 * The swap runs as a View Transition circular wipe from a supplied origin
 * (the button's centre, or the viewport centre for the shortcut), and
 * falls back to an instant change when prefers-reduced-motion is set or the
 * API is missing.
 */
const STORAGE_KEY = 'theme';
const listeners = new Set();

function systemPrefersDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/* The active theme: an explicit data-theme wins, otherwise the OS preference. */
export function getTheme() {
  const attr = document.documentElement.getAttribute('data-theme');
  return attr === 'light' || attr === 'dark'
    ? attr
    : (systemPrefersDark() ? 'dark' : 'light');
}

function commit(next) {
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem(STORAGE_KEY, next);
  listeners.forEach((fn) => fn());
}

/* Apply a stored preference on first paint, without animating. */
export function initTheme() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') {
    document.documentElement.setAttribute('data-theme', stored);
  }
}

/* Switch to `next`, wiping from `origin` ({x, y} in px) when motion is allowed. */
export function setTheme(next, origin) {
  const html = document.documentElement;
  if (origin) {
    html.style.setProperty('--theme-x', `${origin.x}px`);
    html.style.setProperty('--theme-y', `${origin.y}px`);
  }
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduced && document.startViewTransition) {
    document.startViewTransition(() => commit(next));
  } else {
    commit(next);
  }
}

export function toggleTheme(origin) {
  setTheme(getTheme() === 'dark' ? 'light' : 'dark', origin);
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/* React binding - re-renders the caller whenever the theme commits. */
export function useTheme() {
  return useSyncExternalStore(subscribe, getTheme, getTheme);
}
