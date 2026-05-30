import { Link, useParams, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useOneko } from '../useOneko.js';
import { useDocumentTitle } from '../useDocumentTitle.js';
import { Reveal } from '../components/Reveal.jsx';
import { Figure } from '../components/Figure.jsx';
import { ProjectToc } from '../components/ProjectToc.jsx';
import { projects, projectBySlug } from '../data.js';

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = projectBySlug[slug];

  useOneko({ src: '/oneko/oneko-dog.gif' });
  useDocumentTitle(project?.name);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [slug]);

  if (!project) return <Navigate to="/" replace />;

  const idx = projects.findIndex((p) => p.slug === slug);
  const prev = idx > 0 ? projects[idx - 1] : null;
  const next = idx < projects.length - 1 ? projects[idx + 1] : null;

  const toc = [
    { id: 'overview', label: 'Overview' },
    ...project.sections.map((s, i) => ({ id: `s-${i + 1}`, label: s.title })),
    ...(project.figma ? [{ id: 'figma', label: 'Figma board' }] : []),
    ...(project.links?.length ? [{ id: 'links', label: 'Links' }] : []),
  ];

  return (
    <main className="shell wide proj">
      <ProjectToc items={toc} accent={project.accent} />
      <Reveal as="header" className="proj-header">
        <div className="proj-meta-strip">
          <span className="kv"><span className="k">ID</span> <span className="v">{project.id}</span></span>
          <span className="kv"><span className="k">PERIOD</span> <span className="v">{project.when}</span></span>
          <span className="kv"><span className="k">STATUS</span> <span className="v" style={{ color: project.accent }}>{project.status}</span></span>
        </div>
        <h1>{project.name}</h1>
        <p className="tagline">{project.tagline}</p>
        <div className="proj-stack">
          {project.stack.map((s) => (
            <span className="btn" key={s} style={{ cursor: 'default' }}>{s}</span>
          ))}
        </div>
      </Reveal>

      <Reveal className="proj-metrics" role="list" aria-label="Project metrics">
        {project.metrics.map((m, i) => (
          <div className="metric-cell" role="listitem" key={i}>
            <div className="value">
              {m.value}<span className="unit">{m.unit}</span>
            </div>
            <div className="label">{m.label.toUpperCase()}</div>
          </div>
        ))}
      </Reveal>

      <Reveal as="section" className="proj-overview" id="overview">
        {project.overview.map((p, i) => <p key={i}>{p}</p>)}
      </Reveal>

      {project.sections.map((s, i) => (
        <Reveal as="section" className="proj-section" key={i} id={`s-${i + 1}`}>
          <div className="label">{String(i + 1).padStart(2, '0')}</div>
          <div className="body">
            <h3>{s.title}</h3>
            <p>{s.body}</p>
            {s.figure && <Figure id={s.figure.id} caption={s.figure.caption} src={s.figure.src} alt={s.figure.alt} kind="PLACEHOLDER · IMG" />}
          </div>
        </Reveal>
      ))}

      {project.figma && (
        <Reveal as="section" className="proj-figma" id="figma">
          <div className="label">FIGMA</div>
          <div>
            <Figure
              id={project.figma.id}
              caption={project.figma.caption}
              src={project.figma.src}
              alt={project.figma.alt}
              kind="PLACEHOLDER · FIGMA"
            />
          </div>
        </Reveal>
      )}

      {project.links?.length > 0 && (
        <Reveal as="section" className="proj-section" id="links">
          <div className="label">LINKS</div>
          <div className="body" style={{ flexDirection: 'row', gap: 'var(--gap-half)' }}>
            {project.links.map((l) => (
              l.href && l.href !== '#' ? (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="btn"
                  style={{ textDecoration: 'none' }}
                >
                  {l.label} <span aria-hidden="true">↗</span>
                </a>
              ) : (
                <span key={l.label} className="btn" style={{ cursor: 'default', opacity: 0.6 }}>
                  {l.label} · soon
                </span>
              )
            ))}
          </div>
        </Reveal>
      )}

      <nav className="proj-nav">
        {prev ? (
          <Link to={`/projects/${prev.slug}`} className="prev">← {prev.name}</Link>
        ) : <span />}
        <Link to="/" style={{ color: 'var(--gray)', textDecoration: 'none' }}>index</Link>
        {next ? (
          <Link to={`/projects/${next.slug}`} className="next">{next.name} →</Link>
        ) : <span />}
      </nav>
    </main>
  );
}
