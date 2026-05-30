import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/*
 * Project-page table of contents, presented as a control in the floating
 * toolbar (a peer of studio / story / world) that opens a centered, backdrop-
 * blurred panel - the same modal language as the command palette.
 *
 * Self-contained and mounted only by ProjectDetail: it scroll-spies the
 * section being read, portals its trigger button into the toolbar's #toc-slot
 * so it sits among the other controls, and portals the modal to <body>. Jumps
 * reuse the shared Lenis instance for smooth scroll.
 */

const SI = { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': true };
const TriggerIcon = () => (
  <svg {...SI}>
    <circle cx="5" cy="6" r="1.4" fill="currentColor" /><path d="M9.5 6H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="5" cy="12" r="1.4" fill="currentColor" /><path d="M9.5 12H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="5" cy="18" r="1.4" fill="currentColor" /><path d="M9.5 18H15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
const IconOverview = () => (
  <svg {...SI}><path d="M5 7h14M5 12h14M5 17h8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
);
const IconFigma = () => (
  <svg {...SI}><rect x="4.5" y="4.5" width="15" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.7" /><circle cx="12" cy="12" r="2.4" stroke="currentColor" strokeWidth="1.7" /></svg>
);
const IconLinks = () => (
  <svg {...SI}><path d="M8 16 16 8M9.5 8H16v6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

function marker(item) {
  if (item.id === 'overview') return <IconOverview />;
  if (item.id === 'figma') return <IconFigma />;
  if (item.id === 'links') return <IconLinks />;
  const m = /^s-(\d+)$/.exec(item.id);
  if (m) return <span className="toc-pop-num">{String(m[1]).padStart(2, '0')}</span>;
  return null;
}

export function ProjectToc({ items, accent }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? null);
  const [open, setOpen] = useState(false);
  const [slot, setSlot] = useState(null);
  const buttonRef = useRef(null);
  const lockUntil = useRef(0);

  // The trigger portals into the toolbar slot once it exists.
  useEffect(() => { setSlot(document.getElementById('toc-slot')); }, []);

  // Scroll-spy: active = the last section whose heading crossed a line just
  // under the sticky nav; pinned to the final item once scrolled to the bottom.
  useEffect(() => {
    if (!items.length) return undefined;
    const LINE = 120;
    let raf = 0;
    function compute() {
      raf = 0;
      if (performance.now() < lockUntil.current) return;
      let current = items[0].id;
      for (const it of items) {
        const el = document.getElementById(it.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top - LINE <= 0) current = it.id;
        else break;
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        current = items[items.length - 1].id;
      }
      setActiveId((prev) => (prev === current ? prev : current));
    }
    function onScroll() { if (!raf) raf = requestAnimationFrame(compute); }
    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [items]);

  // Close on Escape while the modal is open.
  useEffect(() => {
    if (!open) return undefined;
    function onKey(e) { if (e.key === 'Escape') { setOpen(false); buttonRef.current?.focus(); } }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  function jump(id) {
    const el = document.getElementById(id);
    if (!el) return;
    setActiveId(id);
    lockUntil.current = performance.now() + 1150;
    const lenis = window.__lenis;
    if (lenis) lenis.scrollTo(el, { offset: -88, duration: 1.1 });
    else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (window.history?.replaceState) window.history.replaceState(null, '', `#${id}`);
    setOpen(false);
  }

  if (!items.length || typeof document === 'undefined') return null;

  const trigger = (
    <button
      ref={buttonRef}
      type="button"
      className="btn toc-trigger"
      data-open={open}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-label="Table of contents"
      title="Table of contents"
      onClick={() => setOpen((o) => !o)}
    >
      <TriggerIcon />
      <span>contents</span>
    </button>
  );

  // Backdrop catches outside clicks and (via data-lenis-prevent) stops the page
  // scrolling behind the blur, while leaving Lenis live so the jump still glides.
  const modal = open ? (
    <div
      className="toc-overlay"
      data-lenis-prevent
      onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
    >
      <div
        className="toc-pop"
        role="dialog"
        aria-modal="true"
        aria-label="Table of contents"
        style={accent ? { '--toc-accent': accent } : undefined}
      >
        <div className="toc-pop-head">Table of contents</div>
        <ul className="toc-pop-list">
          {items.map((it) => {
            const isActive = it.id === activeId;
            return (
              <li key={it.id}>
                <button
                  type="button"
                  className="toc-pop-item"
                  data-active={isActive}
                  aria-current={isActive ? 'true' : undefined}
                  onClick={() => jump(it.id)}
                >
                  <span className="toc-pop-marker">{marker(it)}</span>
                  <span className="toc-pop-label">{it.label}</span>
                  <span className="toc-pop-flag" aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  ) : null;

  return (
    <>
      {slot && createPortal(trigger, slot)}
      {createPortal(modal, document.body)}
    </>
  );
}
