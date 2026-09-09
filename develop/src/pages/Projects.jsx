import { Link } from 'react-router-dom';
import { useOneko } from '../useOneko.js';
import { useDocumentTitle } from '../useDocumentTitle.js';
import { Reveal } from '../components/Reveal.jsx';
import { projects } from '../data.js';

/* The full index of work. Home shows four and expands inline; this is the
 * addressable version - /projects is a URL people paste, so it has to resolve
 * to something rather than fall through to the 404 route. Styling is borrowed
 * wholesale from the detail header (.proj-*) and the home grid (.project-*),
 * so this page adds no CSS of its own. */
export default function Projects() {
  useOneko({ src: '/oneko/oneko-dog.gif' });
  useDocumentTitle('Projects');

  const live = projects.filter((p) => p.status === 'LIVE' || p.status === 'SHIPPED').length;

  return (
    <main className="shell proj">
      <Reveal as="header" className="proj-header">
        <div className="proj-meta-strip">
          <span className="kv"><span className="k">INDEX</span> <span className="v">PROJECTS</span></span>
          <span className="kv"><span className="k">COUNT</span> <span className="v">{projects.length}</span></span>
          <span className="kv"><span className="k">SHIPPED</span> <span className="v">{live}</span></span>
        </div>
        <h1>Projects</h1>
        <p className="tagline">
          Everything worth writing up - agents, infrastructure, and a few things rebuilt
          from the plumbing just to see how they work.
        </p>
      </Reveal>

      <div className="project-grid">
        {projects.map((p, i) => (
          <Reveal key={p.slug} className="project-card-wrap" style={{ '--i': i }}>
            <Link to={`/projects/${p.slug}`} className="project-card">
              <span className="id">{p.id}</span>
              <span className="name">
                <span className="status" data-status={p.status}>{p.status}</span>
                <strong>{p.name}</strong>
                <span className="tagline">{p.tagline}</span>
              </span>
            </Link>
          </Reveal>
        ))}
      </div>

      <nav className="proj-nav">
        <span />
        <Link to="/" style={{ color: 'var(--gray)', textDecoration: 'none' }}>index</Link>
        <span />
      </nav>
    </main>
  );
}
