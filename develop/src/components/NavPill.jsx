import { useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const items = [
  { to: '/',                          label: 'index',    match: (p) => p === '/' },
  { to: '/projects/quizzy',           label: 'projects', match: (p) => p.startsWith('/projects') },
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
    if (!root) return;
    const active = root.querySelector('.item.active');
    if (active) {
      const r = active.getBoundingClientRect();
      const rootR = root.getBoundingClientRect();
      setIndicator({ left: r.left - rootR.left, width: r.width });
    } else {
      setIndicator(null);
    }
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
