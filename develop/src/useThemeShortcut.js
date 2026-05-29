import { useEffect } from 'react';
import { toggleTheme } from './theme.js';

/* Global keyboard shortcut: Cmd+. / Ctrl+. toggles light/dark theme.
   Goes through the shared theme store (so the ThemeToggle switch stays in
   sync) and wipes from the viewport centre. */
export function useThemeShortcut() {
  useEffect(() => {
    function onKey(e) {
      const meta = e.metaKey || e.ctrlKey;
      if (!meta || e.key !== '.') return;
      e.preventDefault();
      toggleTheme({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
}
