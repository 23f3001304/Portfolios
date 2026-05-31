/*
 * A captioned code listing. Deliberately three-tone, not a rainbow: code in
 * the foreground colour, comments dimmed, strings in the project accent. A
 * tiny hand-rolled tokenizer does that without a syntax-highlighting library.
 */

// Walk the source once, emitting {type, text} runs for comments, strings, and
// everything else. Good enough for the curated snippets on this page. `#` is a
// comment only in Python - in C/C++ it starts a preprocessor directive.
function tokenize(src, lang) {
  const hash = lang === 'py';
  const out = [];
  let i = 0;
  while (i < src.length) {
    const two = src.slice(i, i + 2);
    const c = src[i];
    if (two === '//' || (c === '#' && hash)) {
      let j = src.indexOf('\n', i);
      if (j < 0) j = src.length;
      out.push({ type: 'comment', text: src.slice(i, j) });
      i = j;
    } else if (two === '/*') {
      let j = src.indexOf('*/', i + 2);
      j = j < 0 ? src.length : j + 2;
      out.push({ type: 'comment', text: src.slice(i, j) });
      i = j;
    } else if (c === '"' || c === "'" || c === '`') {
      let j = i + 1;
      while (j < src.length && src[j] !== c) {
        if (src[j] === '\\') j += 1;
        j += 1;
      }
      j = Math.min(j + 1, src.length);
      out.push({ type: 'string', text: src.slice(i, j) });
      i = j;
    } else {
      let j = i;
      while (j < src.length) {
        const t = src.slice(j, j + 2);
        if (t === '//' || t === '/*' || (src[j] === '#' && hash) || src[j] === '"' || src[j] === "'" || src[j] === '`') break;
        j += 1;
      }
      out.push({ type: 'code', text: src.slice(i, j) });
      i = j;
    }
  }
  return out;
}

export function CodeBlock({ caption, lang = 'js', code }) {
  const src = (Array.isArray(code) ? code.join('\n') : code).replace(/\s+$/, '');
  const tokens = tokenize(src, lang);
  return (
    <figure className="codeblock">
      <div className="codeblock-bar">
        <span className="codeblock-dot" aria-hidden="true" />
        {caption && <span className="codeblock-name">{caption}</span>}
        <span className="codeblock-lang">{lang}</span>
      </div>
      <pre className="codeblock-pre" tabIndex={0}><code>
        {tokens.map((t, i) => (
          <span key={i} className={`tok-${t.type}`}>{t.text}</span>
        ))}
      </code></pre>
    </figure>
  );
}
