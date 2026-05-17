import { useEffect } from 'react';

/* Global keyboard shortcut: Cmd+. / Ctrl+. toggles light/dark theme.
   Runs the same View Transition wipe the toggle button uses by setting
   the wipe origin to the viewport center. */
export function useThemeShortcut() {
  useEffect(() => {
    function onKey(e) {
      const meta = e.metaKey || e.ctrlKey;
      if (!meta || e.key !== '.') return;
      e.preventDefault();

      const html = document.documentElement;
      const current =
        html.getAttribute('data-theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      const next = current === 'dark' ? 'light' : 'dark';

      // Wipe origin: viewport center for keyboard-triggered toggle.
      html.style.setProperty('--theme-x', `${window.innerWidth / 2}px`);
      html.style.setProperty('--theme-y', `${window.innerHeight / 2}px`);

      const apply = () => {
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
      };
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!reduced && document.startViewTransition) {
        document.startViewTransition(apply);
      } else {
        apply();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
}
