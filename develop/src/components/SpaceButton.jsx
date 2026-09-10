import { useSpace, toggleSpaceMode } from '../useSpaceMode.js';

// A helix seen side-on: two turns of thread.
function HelixIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 4c0 3 12 3 12 6s-12 3-12 6 12 3 12 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M18 4c0 3-12 3-12 6s12 3 12 6-12 3-12 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" opacity="0.45" />
    </svg>
  );
}

export function SpaceButton() {
  const open = useSpace();
  return (
    <button
      className="btn"
      onClick={() => toggleSpaceMode()}
      aria-pressed={open}
      aria-label={open ? 'Leave the space' : 'Enter the space'}
      title={open ? 'Leave the space' : 'Enter the space'}
    >
      <HelixIcon />
      <span>space</span>
    </button>
  );
}
