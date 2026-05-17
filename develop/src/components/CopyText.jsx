import { useEffect, useRef, useState } from 'react';

/* Click-to-copy text with inline feedback. Falls back to selecting the
   text if the Clipboard API isn't available. */
export function CopyText({ value, children, className = '', label }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  async function onClick(e) {
    e.preventDefault();
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const r = document.createRange();
        r.selectNodeContents(e.currentTarget);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(r);
      }
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1400);
    } catch { /* */ }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`copy-text${copied ? ' is-copied' : ''} ${className}`.trim()}
      aria-label={label || `Copy ${value}`}
      title={copied ? 'Copied' : 'Click to copy'}
    >
      <span className="copy-text-value">{children ?? value}</span>
      <span className="copy-text-flash" aria-hidden="true">copied</span>
    </button>
  );
}
