/*
 * Writeup text. A body is one string or a list of paragraphs, so a long
 * section can breathe instead of landing as one block. Inside the text,
 * `backticks` render as inline code and **double stars** as bold, which is
 * all the markup the project files need.
 */
const INLINE = /(`[^`]+`|\*\*[^*]+\*\*)/g;

function inline(text) {
  return text.split(INLINE).map((part, i) => {
    if (part.length > 2 && part.startsWith('`') && part.endsWith('`')) {
      return <code key={i}>{part.slice(1, -1)}</code>;
    }
    if (part.length > 4 && part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export function Prose({ text }) {
  const paras = (Array.isArray(text) ? text : [text]).filter(Boolean);
  return paras.map((p, i) => <p key={i}>{inline(p)}</p>);
}
