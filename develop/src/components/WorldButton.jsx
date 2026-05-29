import { useWorld, toggleWorldMode } from '../useWorldMode.js';

function GlobeIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      <ellipse cx="12" cy="12" rx="4" ry="9" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3.2 9.5h17.6M3.2 14.5h17.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function WorldButton() {
  const open = useWorld();
  return (
    <button
      className="btn"
      onClick={() => toggleWorldMode()}
      aria-pressed={open}
      aria-label={open ? 'Leave the world' : 'Enter the world'}
      title={open ? 'Leave the world' : 'Enter the world'}
    >
      <GlobeIcon />
      <span>world</span>
    </button>
  );
}
