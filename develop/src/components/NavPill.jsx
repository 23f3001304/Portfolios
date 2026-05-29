import { useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const items = [
  { to: '/',                          label: 'index',    match: (p) => p === '/' },
  { to: '/projects/typereal',         label: 'projects', match: (p) => p.startsWith('/projects') },
];

const externals = [
  { href: 'https://github.com/coehemang', label: 'github', hideOnSm: true },
];

export function NavPill() {
  const { pathname } = useLocation();
  const ref = useRef(null);
  const [indicator, setIndicator] = useState(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    // Use offsetLeft/offsetWidth instead of getBoundingClientRect: the topbar
    // lives inside .app-root, which is transformed (perspective + rotateX +
    // scale) while studio mode is opening/closing. Rect-based measurement
    // would capture POST-transform pixels, so the indicator settled at the
    // wrong x once the transform released. Offsets are CSS-pixel and immune
    // to ancestor transforms.
    function measure() {
      const active = root.querySelector('.item.active');
      if (!active) { setIndicator(null); return; }
      if (active.offsetParent === root) {
        setIndicator({ left: active.offsetLeft, width: active.offsetWidth });
      } else {
        // fall back if .nav-pill ever loses position:relative
        const r = active.getBoundingClientRect();
        const rootR = root.getBoundingClientRect();
        setIndicator({ left: r.left - rootR.left, width: r.width });
      }
    }
    measure();
    // Re-measure when the web font finishes loading (item widths change when
    // Inter swaps in over the fallback) and on viewport resize.
    let cancelled = false;
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => { if (!cancelled) measure(); });
    }
    window.addEventListener('resize', measure);
    return () => {
      cancelled = true;
      window.removeEventListener('resize', measure);
    };
  }, [pathname]);

  return (
    <div className="nav-pill" ref={ref}>
      {indicator && (
        <span
          className="indicator"
          style={{ left: `${indicator.left}px`, width: `${indicator.width}px` }}
          aria-hidden="true"
        />
      )}
      {items.map((it) => (
        <Link
          key={it.to}
          to={it.to}
          className={`item${it.match(pathname) ? ' active' : ''}`}
        >
          {it.label}
        </Link>
      ))}
      {externals.map((e) => (
        <a
          key={e.href}
          href={e.href}
          target="_blank"
          rel="noreferrer"
          className={`item${e.hideOnSm ? ' hide-sm' : ''}`}
        >
          {e.label} ↗
        </a>
      ))}
    </div>
  );
}
