import { useTheme, toggleTheme } from '../theme.js';

function SunIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4.2" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="12" y1="2.5"  x2="12" y2="5" />
        <line x1="12" y1="19"   x2="12" y2="21.5" />
        <line x1="2.5"  y1="12" x2="5"  y2="12" />
        <line x1="19"   y1="12" x2="21.5" y2="12" />
        <line x1="5.05" y1="5.05"   x2="6.8"  y2="6.8" />
        <line x1="17.2" y1="17.2"   x2="18.95" y2="18.95" />
        <line x1="5.05" y1="18.95"  x2="6.8"  y2="17.2" />
        <line x1="17.2" y1="6.8"    x2="18.95" y2="5.05" />
      </g>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20.5 13.6A8.5 8.5 0 1 1 10.4 3.5a7 7 0 0 0 10.1 10.1z"
        fill="currentColor"
      />
    </svg>
  );
}

export function ThemeToggle() {
  // Reads from the shared theme store, so the switch reflects every change -
  // including the Cmd/Ctrl+. keyboard shortcut, not just its own click.
  const isDark = useTheme() === 'dark';

  function toggle(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    toggleTheme({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
  }

  return (
    <button
      className="theme-switch"
      data-on={isDark}
      onClick={toggle}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      role="switch"
      aria-checked={isDark}
    >
      <span className="track">
        <span className="icon left"  aria-hidden="true"><SunIcon /></span>
        <span className="icon right" aria-hidden="true"><MoonIcon /></span>
        <span className="thumb" />
      </span>
    </button>
  );
}
