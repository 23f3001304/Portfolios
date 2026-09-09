import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useOneko } from '../useOneko.js';
import { useDocumentTitle } from '../useDocumentTitle.js';
import { Reveal } from '../components/Reveal.jsx';
import { ProjectCard } from '../components/ProjectCard.jsx';
import { projects } from '../data.js';
import { useTheme } from '../theme.js';
import { STATUS, TECH, SORTS, applyFilters, counts } from '../lib/projectFilters.js';

/* The full index of work. Home shows four and expands inline; this is the
 * addressable version - /projects is a URL people paste, so it has to resolve
 * to something rather than fall through to the 404 route.
 *
 * Home's flat rows don't survive being repeated thirteen times, so the index
 * is a wall of cards instead: picture on top, body underneath. The card is a
 * recessed well built from the same --btn-* tokens as the site's buttons, so
 * it belongs to the page rather than floating over it.
 *
 * Status lives on the top row because it is the question most people have.
 * Tech and ordering fold away behind "More" - eleven more chips permanently
 * open would be a control panel bolted to the top of a portfolio - but the
 * button carries a count whenever they are doing something, so the page can
 * never be quietly filtered by a row you cannot see. */
export default function Projects() {
  const theme = useTheme();
  useOneko({ src: '/oneko/oneko-dog.gif' });
  useDocumentTitle('Projects');

  const [status, setStatus] = useState('all');
  const [tech, setTech] = useState([]);
  const [sort, setSort] = useState('featured');
  const [open, setOpen] = useState(false);

  const state = { status, tech, sort };
  const shown = useMemo(() => applyFilters(projects, state), [status, tech, sort]);
  const n = useMemo(() => counts(projects, state), [status, tech, sort]);

  const advanced = tech.length + (sort === 'featured' ? 0 : 1);
  const filtered = status !== 'all' || advanced > 0;
  const shipped = projects.filter((p) => p.status === 'LIVE' || p.status === 'SHIPPED').length;

  const toggleTech = (key) =>
    setTech((t) => (t.includes(key) ? t.filter((k) => k !== key) : [...t, key]));
  const clear = () => { setStatus('all'); setTech([]); setSort('featured'); };

  return (
    <main className="shell wide proj">
      <Reveal as="header" className="proj-header">
        <div className="proj-meta-strip">
          <span className="kv"><span className="k">INDEX</span> <span className="v">PROJECTS</span></span>
          <span className="kv"><span className="k">COUNT</span> <span className="v">{projects.length}</span></span>
          <span className="kv"><span className="k">SHIPPED</span> <span className="v">{shipped}</span></span>
        </div>
        <h1>Projects</h1>
        <p className="tagline">
          Everything worth writing up - agents, infrastructure, and a few things rebuilt
          from the plumbing just to see how they work.
        </p>

        <div className="pfilter" role="group" aria-label="Filter by status">
          {STATUS.map((f) => (
            <button
              key={f.key}
              type="button"
              className="btn pchip"
              aria-pressed={status === f.key}
              disabled={n.status[f.key] === 0 && status !== f.key}
              onClick={() => setStatus(f.key)}
            >
              {f.label} <span className="num">{n.status[f.key]}</span>
            </button>
          ))}
          <button
            type="button"
            className="btn pchip"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            More{advanced > 0 && <span className="num">{advanced}</span>}
            <span className="pchip-chev" aria-hidden="true">{open ? '−' : '+'}</span>
          </button>
          {filtered && (
            <button type="button" className="btn pchip pchip--clear" onClick={clear}>
              Clear
            </button>
          )}
        </div>

        {open && (
          <div className="pfilter pfilter--adv">
            <div className="pfilter-row" role="group" aria-label="Filter by tech">
              <span className="pfilter-label">Tech</span>
              {TECH.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  className="btn pchip"
                  aria-pressed={tech.includes(t.key)}
                  disabled={n.tech[t.key] === 0 && !tech.includes(t.key)}
                  onClick={() => toggleTech(t.key)}
                >
                  {t.label} <span className="num">{n.tech[t.key]}</span>
                </button>
              ))}
            </div>
            <div className="pfilter-row" role="group" aria-label="Order">
              <span className="pfilter-label">Order</span>
              {SORTS.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  className="btn pchip"
                  aria-pressed={sort === s.key}
                  onClick={() => setSort(s.key)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {filtered && (
          <p className="pcount">
            {shown.length} of {projects.length}
            {tech.length > 1 && ' · any of the selected tech'}
          </p>
        )}
      </Reveal>

      {/* Keyed on the whole filter state so the reveal stagger replays on every
          change - without it the surviving cards sit still and the rest just
          vanish, which reads as a glitch rather than as a filter. */}
      <div className="pgrid" key={`${status}|${tech.join(',')}|${sort}`}>
        {shown.map((p, i) => (
          <Reveal key={p.slug} className="project-card-wrap" style={{ '--i': i % 4 }}>
            <ProjectCard project={p} theme={theme} index={i} />
          </Reveal>
        ))}
      </div>

      {shown.length === 0 && (
        <p className="pempty">
          Nothing matches that combination.{' '}
          <button type="button" className="plink" onClick={clear}>Clear the filters</button>.
        </p>
      )}

      <nav className="proj-nav">
        <span />
        <Link to="/" style={{ color: 'var(--gray)', textDecoration: 'none' }}>index</Link>
        <span />
      </nav>
    </main>
  );
}
