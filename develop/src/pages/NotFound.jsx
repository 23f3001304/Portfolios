import { Link } from 'react-router-dom';
import { useOneko } from '../useOneko.js';
import { Reveal } from '../components/Reveal.jsx';
import { useDocumentTitle } from '../useDocumentTitle.js';

export default function NotFound() {
  useOneko({ src: '/oneko/oneko-dog.gif' });
  useDocumentTitle('404');

  return (
    <main className="shell nf">
      <Reveal as="section" className="nf-block">
        <div className="nf-strip">
          <span className="kv"><span className="k">STATUS</span> <span className="v">404</span></span>
          <span className="kv"><span className="k">TYPE</span> <span className="v">NOT_FOUND</span></span>
          <span className="kv"><span className="k">TS</span> <span className="v">{new Date().toISOString().slice(0, 19).replace('T', ' ')}Z</span></span>
        </div>
        <h1 className="nf-code" aria-label="Error 404">4·0·4</h1>
        <p className="nf-tagline">
          We don&apos;t have that here. The dog looked - nothing under the rug, nothing behind the couch.
        </p>
        <div className="nf-actions">
          <Link to="/" className="btn nf-btn">
            <span aria-hidden="true">←</span> back to index
          </Link>
          <span className="nf-hint">
            or press <kbd>⌘</kbd><kbd>K</kbd> to search
          </span>
        </div>
      </Reveal>
    </main>
  );
}
