import { useEffect } from 'react';
import { useLightbox } from './LightboxProvider.jsx';
import { IMG_DIMS } from '../imageDims.js';

/*
 * A captioned figure. When `src` is provided the image registers itself with
 * the page-wide lightbox on mount and opens it on click, so the viewer can
 * step through every figure on the page with prev/next.
 */
export function Figure({ id, caption, kind = 'PLACEHOLDER · IMAGE', src, alt, invert = false }) {
  const lb = useLightbox();
  const fid = id || src;
  const register = lb?.register;

  useEffect(() => {
    if (!src || !register) return undefined;
    return register({ id: fid, src, alt: alt || caption || id || '', caption, label: id, invert });
  }, [src, fid, alt, caption, register, invert]);

  const label = (id || caption) ? (
    <figcaption className="caption">
      {id && <span className="id">{id}</span>}
      {caption && <span>{caption}</span>}
    </figcaption>
  ) : null;

  if (!src) {
    return (
      <figure className="figure">
        <div className="frame" data-kind={kind} aria-label={caption || id} />
        {label}
      </figure>
    );
  }

  return (
    <figure className="figure">
      <button
        type="button"
        className="frame-img-btn"
        onClick={() => lb?.open(fid)}
        aria-label={`Enlarge ${alt || caption || id || 'image'}`}
      >
        <img
          className={invert ? 'frame-img invert-light' : 'frame-img'}
          src={src}
          alt={alt || caption || id || ''}
          loading="lazy"
          width={IMG_DIMS[src]?.[0]}
          height={IMG_DIMS[src]?.[1]}
        />
        <span className="frame-zoom-hint" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M11 8v6M8 11h6M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
      </button>
      {label}
    </figure>
  );
}
