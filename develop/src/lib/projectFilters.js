/* Filtering and ordering for the project index.
 *
 * Kept out of the page because it is all pure: given the projects and a filter
 * state, it hands back the list to draw. The page owns the state and the
 * chrome, nothing else.
 */

/* Status collapses to four buckets. Six chips for six statuses is too much
 * chrome for the four questions anyone actually asks, and "Live" vs "Shipped"
 * is not one of them. The buckets are disjoint and cover every project, so the
 * counts add up to the total on the strip above. */
export const STATUS = [
  { key: 'all',      label: 'All',      match: () => true },
  { key: 'live',     label: 'Live',     match: (p) => p.status === 'LIVE' || p.status === 'SHIPPED' },
  { key: 'building', label: 'Building', match: (p) => p.status === 'IN PROGRESS' || p.status === 'COMING SOON' },
  { key: 'design',   label: 'Design',   match: (p) => p.status === 'DESIGN' },
  { key: 'archived', label: 'Archived', match: (p) => p.status === 'ARCHIVED' },
];

/* Tech buckets, matched against the entries in each project's `stack`.
 *
 * Forty-nine distinct stack entries across thirteen projects is a tag cloud,
 * not a filter, so these group them by the thing someone is actually looking
 * for. Membership is exact against the stack strings rather than a substring
 * test - "React" must not quietly claim "React 19" by accident, so anything
 * that belongs is listed. A project can be in several buckets; that is the
 * point of allowing more than one to be selected. */
export const TECH = [
  { key: 'ai',      label: 'AI / LLM',   any: ['OpenAI', 'Ollama', 'Gemini', 'Pydantic AI', 'Claude Code', 'bge-m3'] },
  { key: 'react',   label: 'React',      any: ['React', 'React 19', 'Next.js 16'] },
  { key: 'ts',      label: 'TypeScript', any: ['TypeScript'] },
  { key: 'node',    label: 'Node',       any: ['Node.js', 'Express', 'Fastify'] },
  { key: 'python',  label: 'Python',     any: ['FastAPI', 'Pydantic AI', 'Optuna'] },
  { key: 'systems', label: 'Systems',    any: ['Rust', 'C++', 'POSIX', 'wgpu', 'Windows Graphics Capture', 'FFmpeg', 'zlib', 'Buffer', 'SHA-1', 'fork / exec', 'CMake'] },
  { key: 'data',    label: 'Data',       any: ['Postgres', 'PostgreSQL', 'SQLite', 'Prisma', 'Qdrant'] },
  { key: 'figma',   label: 'Figma',      any: ['Figma'] },
];

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

/* When a project last moved, as a sortable number, read off the `when` string.
 *
 * The strings are written for people, not for parsing - "Aug → Sep 2026",
 * "Jun 2026", "May 2026 → Present", "2025" - so this takes the part after the
 * last arrow (the end of the range), then the year, then the month if one is
 * named. A bare year sorts as December, so "2025" lands after "Nov 2025"
 * rather than before it. "Present" is still going, so it sorts above
 * everything finished. */
export function endsAt(when = '') {
  const tail = when.split('→').pop().trim();
  if (/present|now|ongoing/i.test(tail)) return Number.MAX_SAFE_INTEGER;
  const year = Number(tail.match(/\b(19|20)\d{2}\b/)?.[0]);
  if (!year) return 0;
  const month = MONTHS.findIndex((m) => tail.toLowerCase().startsWith(m));
  return year * 12 + (month < 0 ? 11 : month);
}

export const SORTS = [
  { key: 'featured', label: 'Featured', cmp: null },   // the curated order in data/projects/index.js
  { key: 'newest',   label: 'Newest',   cmp: (a, b) => endsAt(b.when) - endsAt(a.when) },
  { key: 'oldest',   label: 'Oldest',   cmp: (a, b) => endsAt(a.when) - endsAt(b.when) },
  { key: 'az',       label: 'A–Z',      cmp: (a, b) => a.name.localeCompare(b.name) },
];

const inTech = (p, key) => {
  const bucket = TECH.find((t) => t.key === key);
  return !!bucket && p.stack.some((s) => bucket.any.includes(s));
};

/* Status AND tech, but OR within tech: picking React and Rust means "either",
 * which is what a row of tags is always taken to mean. No tech selected means
 * tech is not filtering at all, rather than matching nothing. */
export function applyFilters(projects, { status = 'all', tech = [], sort = 'featured' } = {}) {
  const byStatus = STATUS.find((s) => s.key === status) ?? STATUS[0];
  const out = projects.filter(
    (p) => byStatus.match(p) && (tech.length === 0 || tech.some((k) => inTech(p, k))),
  );
  const cmp = SORTS.find((s) => s.key === sort)?.cmp;
  return cmp ? [...out].sort(cmp) : out;
}

/* How many projects each chip would show on its own - the count next to a
 * label has to mean "this many", so it ignores that chip's own group. */
export function counts(projects, state) {
  return {
    status: Object.fromEntries(
      STATUS.map((s) => [s.key, applyFilters(projects, { ...state, status: s.key }).length]),
    ),
    tech: Object.fromEntries(
      TECH.map((t) => [t.key, applyFilters(projects, { ...state, tech: [t.key] }).length]),
    ),
  };
}
