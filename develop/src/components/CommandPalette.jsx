import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { projects } from '../data.js';

/* Small line icons for the nav rows - 15px, stroke = currentColor so they
   pick up the row's gray and flip to accent when the row is active. */
const S = { width: 15, height: 15, viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': true };
const IconAbout = () => (
  <svg {...S}><circle cx="12" cy="7.5" r="3.2" stroke="currentColor" strokeWidth="1.8" /><path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
);
const IconExperience = () => (
  <svg {...S}><rect x="3.5" y="7.5" width="17" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" /><path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5M3.5 12.5h17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
);
const IconProjects = () => (
  <svg {...S}><rect x="3.5" y="3.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" /></svg>
);
const IconSkills = () => (
  <svg {...S}><path d="M12 3v18M3 12h18M5.5 5.5l13 13M18.5 5.5l-13 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
);
const IconEducation = () => (
  <svg {...S}><path d="M12 4 2.5 9 12 14l9.5-5L12 4Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /><path d="M6 11v4.5c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
);
const IconCerts = () => (
  <svg {...S}><circle cx="12" cy="9" r="5" stroke="currentColor" strokeWidth="1.7" /><path d="M9 13.5 8 21l4-2.2L16 21l-1-7.5" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /></svg>
);
const IconHome = () => (
  <svg {...S}><path d="M4 11.5 12 4l8 7.5M6 10v9h12v-9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

const baseCommands = [
  { id: 'home',         icon: <IconHome />,       label: 'Go to index',    hint: 'Home',       to: '/' },
  { id: 'about',        icon: <IconAbout />,      label: 'About',          hint: 'Home · 01',  to: '/#about',          anchor: 'about' },
  { id: 'experience',   icon: <IconExperience />, label: 'Experience',     hint: 'Home · 02',  to: '/#experience',     anchor: 'experience' },
  { id: 'projects',     icon: <IconProjects />,   label: 'All projects',   hint: 'Home · 03',  to: '/#projects',       anchor: 'projects' },
  { id: 'skills',       icon: <IconSkills />,     label: 'Skills',         hint: 'Home · 04',  to: '/#skills',         anchor: 'skills' },
  { id: 'education',    icon: <IconEducation />,  label: 'Education',      hint: 'Home · 05',  to: '/#education',      anchor: 'education' },
  { id: 'certs',        icon: <IconCerts />,      label: 'Certifications', hint: 'Home · 06',  to: '/#certifications', anchor: 'certifications' },
];

const externalCommands = [
  { id: 'github',   icon: '↗', label: 'Open GitHub',   hint: 'External', href: 'https://github.com/23f3001304' },
  { id: 'linkedin', icon: '↗', label: 'Open LinkedIn', hint: 'External', href: 'https://linkedin.com/in/coehemang' },
  { id: 'email',    icon: '✉', label: 'Send email',    hint: 'External', href: 'mailto:coehemang@gmail.com' },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef(null);
  const panelRef = useRef(null);
  const navigate = useNavigate();

  // Project commands
  const projectCommands = useMemo(
    () => projects.map((p) => ({
      id: `proj-${p.slug}`,
      icon: p.id.split('-')[1],
      label: p.name,
      hint: p.tagline,
      to: `/projects/${p.slug}`,
    })),
    []
  );

  const groups = useMemo(() => [
    { label: 'NAV',      items: baseCommands },
    { label: 'PROJECTS', items: projectCommands },
    { label: 'LINKS',    items: externalCommands },
  ], [projectCommands]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map((g) => ({
        ...g,
        items: g.items.filter((it) => {
          const hay = `${it.label} ${it.hint || ''}`.toLowerCase();
          return hay.includes(q);
        }),
      }))
      .filter((g) => g.items.length > 0);
  }, [groups, query]);

  const flat = useMemo(() => filtered.flatMap((g) => g.items), [filtered]);

  useEffect(() => { setActiveIdx(0); }, [query, open]);

  useEffect(() => {
    function onKey(e) {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      // `/` opens the palette unless the user is already typing into a field.
      if (!open && e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const t = e.target;
        const inField = t && (
          t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable
        );
        if (!inField) {
          e.preventDefault();
          setOpen(true);
          return;
        }
      }
      if (!open) return;
      if (e.key === 'Escape')      { e.preventDefault(); setOpen(false); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, flat.length - 1)); }
      else if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, 0)); }
      else if (e.key === 'Enter')     { e.preventDefault(); run(flat[activeIdx]); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, flat, activeIdx]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 30);
      document.body.style.overflow = 'hidden';
      // Pause Lenis so wheel events inside the palette don't bleed through
      // to the main page scroll.
      const lenis = window.__lenis;
      lenis?.stop();
      return () => {
        clearTimeout(t);
        document.body.style.overflow = '';
        lenis?.start();
      };
    }
  }, [open]);

  // Close on click outside the palette panel. Document-level listener is the
  // most robust pattern - survives backdrop-vs-panel event ordering quirks.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown, { passive: true });
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
    };
  }, [open]);

  function run(cmd) {
    if (!cmd) return;
    setOpen(false);
    setQuery('');
    if (cmd.href) {
      window.open(cmd.href, cmd.href.startsWith('mailto:') ? '_self' : '_blank', 'noopener,noreferrer');
      return;
    }
    if (cmd.to) {
      navigate(cmd.to);
      if (cmd.anchor) {
        setTimeout(() => {
          const el = document.getElementById(cmd.anchor);
          if (!el) return;
          const lenis = window.__lenis;
          if (lenis) lenis.scrollTo(el, { offset: -80, duration: 1.2 });
          else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 80);
      }
    }
  }

  // Build flat index for hover/active mapping
  let runningIdx = -1;

  return (
    <>
      <button
        className="btn cmd-trigger"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <svg className="cmd-burger" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
        </svg>
        <span className="cmd-glyph" aria-hidden="true">⌘</span>
        <span className="cmd-label">Menu</span>
        <span className="kbd">⌘K</span>
      </button>

      {open && (
        <div
          className="cp-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          <div className="cp" ref={panelRef}>
            <div className="cp-input-row">
              <span className="prompt">›</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Jump to a page or section…"
                aria-label="Search commands"
              />
              <span className="esc">ESC</span>
            </div>

            <ul className="cp-list" role="listbox" data-lenis-prevent>
              {flat.length === 0 && (
                <li className="cp-empty">No matches for "{query}"</li>
              )}
              {filtered.map((group) => (
                <li key={group.label}>
                  <div className="cp-group-label">{group.label}</div>
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                    {group.items.map((it) => {
                      runningIdx += 1;
                      const idx = runningIdx;
                      const isActive = idx === activeIdx;
                      return (
                        <li
                          key={it.id}
                          className="cp-item"
                          data-active={isActive}
                          onMouseEnter={() => setActiveIdx(idx)}
                          onClick={() => run(it)}
                          role="option"
                          aria-selected={isActive}
                        >
                          <span className="icon">{it.icon}</span>
                          <span className="label-text" title={it.label}>{it.label}</span>
                          <span className="hint" title={it.hint}>{it.hint}</span>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
