import { Link } from 'react-router-dom';
import { useOneko } from '../useOneko.js';
import { useDocumentTitle } from '../useDocumentTitle.js';
import { Reveal } from '../components/Reveal.jsx';
import {
  profile, intro, experience, projects, skills, education, certifications,
} from '../data.js';

function Section({ id, label, children }) {
  return (
    <Reveal as="section" className="section" id={id}>
      <h2>{label}</h2>
      <div className="section-body">{children}</div>
    </Reveal>
  );
}

export default function Home() {
  useOneko({ src: '/oneko/oneko-dog.gif' });
  useDocumentTitle();

  return (
    <main className="shell">
      <Reveal as="header" className="hero">
        <div>
          <h1>{profile.name}</h1>
          <p className="role">
            {profile.role}
            <span className="sep" aria-hidden="true" />
            {profile.location}
          </p>
        </div>
        <div className="contacts">
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          {profile.links.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noreferrer">
              {l.label.toLowerCase()}
            </a>
          ))}
        </div>
      </Reveal>

      <div className="sections">
        <Section id="about" label="About">
          <div className="intro">
            {intro.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </Section>

        <Section id="experience" label="Experience">
          {experience.map((e) => (
            <article className="row" key={e.role}>
              <div className="row-head">
                <h3>{e.role}</h3>
                <span className="meta">{e.when}</span>
              </div>
              <p className="org">{e.org}</p>
              <p className="sub">{e.place}</p>
              <ul>{e.bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>
            </article>
          ))}
        </Section>

        <Section id="projects" label="Projects">
          <div className="project-grid">
            {projects.map((p, i) => (
              <Reveal key={p.slug} className="project-card-wrap" style={{ '--i': i }}>
                <Link
                  to={`/projects/${p.slug}`}
                  className="project-card"
                >
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
        </Section>

        <Section id="skills" label="Skills">
          <div className="skills-grid">
            {skills.map((s, idx) => (
              <Reveal className="skill-row" key={s.label} style={{ '--i': idx }}>
                <div className="label">{s.label.toUpperCase()}</div>
                <div className="tags">
                  {s.items.map((it, i) => (
                    <span key={it} className="tag">
                      {it}
                      {i < s.items.length - 1 && <span className="tag-sep">·</span>}
                    </span>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        <Section id="education" label="Education">
          {education.map((ed) => (
            <div className="education-row" key={ed.school}>
              <div className="top">
                <span className="school">{ed.school}</span>
                <span className="meta">{ed.when}</span>
              </div>
              <div className="top">
                <span className="degree">{ed.degree}</span>
                <span className="meta">CGPA {ed.score}</span>
              </div>
            </div>
          ))}
        </Section>

        <Section id="certifications" label="Certifications">
          <div className="certs">
            {certifications.map((c, i) => (
              <Reveal className="cert" key={c.name} style={{ '--i': i }}>
                <span>{c.name}</span>
                <span className="when">{c.when}</span>
              </Reveal>
            ))}
          </div>
        </Section>
      </div>

      <footer className="footer">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span className="footer-hint">
          <kbd>/</kbd> to navigate · <kbd className="footer-key">⌘</kbd><kbd>.</kbd> to toggle theme
        </span>
      </footer>
    </main>
  );
}
