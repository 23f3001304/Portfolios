import { useMode, toggle3DMode } from '../use3DMode.js';

function PersonIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="7.5" r="3.2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function ModeToggle() {
  const open = useMode();
  return (
    <button
      className="btn"
      onClick={() => toggle3DMode()}
      aria-pressed={open}
      aria-label={open ? 'Leave the studio' : 'Enter the studio'}
      title={open ? 'Leave the studio' : 'Enter the studio'}
    >
      <PersonIcon />
      <span>studio</span>
    </button>
  );
}
