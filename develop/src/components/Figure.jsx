export function Figure({ id, caption, kind = 'PLACEHOLDER · IMAGE' }) {
  return (
    <figure className="figure">
      <div className="frame" data-kind={kind} aria-label={caption || id} />
      {(id || caption) && (
        <figcaption className="caption">
          {id && <span className="id">{id}</span>}
          {caption && <span>{caption}</span>}
        </figcaption>
      )}
    </figure>
  );
}
