import { Link } from 'react-router-dom';
import { useCardReveal } from '../useCardReveal.js';
import { cardShot } from '../lib/projectShots.js';

/* One card on the project index. Split out of the page because the WebGL
 * hover reveal is a hook, and a hook cannot be called inside a .map(). */
export function ProjectCard({ project: p, theme, index }) {
  const reveal = useCardReveal();

  /* The hero is a 2400px file for the detail page; drawing it at card size
   * means a 5x browser downscale, which turns the UI text inside the
   * screenshot to mush. card-thumbs.mjs resamples it properly at the sizes
   * this page actually paints. Fall back to the hero if a project's
   * derivatives have not been generated yet. */
  const shot = cardShot(p, theme);

  return (
    <Link
      to={`/projects/${p.slug}`}
      className={`pbox${shot ? '' : ' pbox--text'}`}
      style={p.accent ? { '--card-accent': p.accent } : undefined}
    >
      {shot && (
        <span className="pbox-media" {...reveal}>
          <img
            src={shot.src}
            srcSet={shot.srcSet}
            sizes="(max-width: 46rem) 92vw, 28rem"
            alt=""
            aria-hidden="true"
            loading={index < 4 ? 'eager' : 'lazy'}
            decoding="async"
            width={shot.width}
            height={shot.height}
          />
        </span>
      )}
      <span className="pbox-body">
        <span className="pbox-top">
          <span className="pbox-id">{p.id}</span>
          <span className="pbox-status">{p.status}</span>
        </span>
        <strong className="pbox-name">{p.name}</strong>
        <span className="pbox-tagline">{p.tagline}</span>
        <span className="pbox-go">read →</span>
      </span>
    </Link>
  );
}
