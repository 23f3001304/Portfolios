import { useStory, toggleStoryMode } from '../useStoryMode.js';

function BookIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 6c-1.6-1.2-3.8-1.8-6-1.8V18c2.2 0 4.4.6 6 1.8 1.6-1.2 3.8-1.8 6-1.8V4.2c-2.2 0-4.4.6-6 1.8Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M12 6v13.8" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export function StoryButton() {
  const open = useStory();
  return (
    <button
      className="btn"
      onClick={() => toggleStoryMode()}
      aria-pressed={open}
      aria-label={open ? 'Leave the story' : 'Read my story'}
      title={open ? 'Leave the story' : 'Read my story'}
    >
      <BookIcon />
      <span>story</span>
    </button>
  );
}
