export const profile = {
  name: 'Hemang Choudhary',
  role: 'B.Tech IT · Backend & ML systems',
  location: 'Jodhpur, IN',
  email: 'hemangc37@gmail.com',
  altEmail: 'coehemang@gmail.com',
  phone: '+91 8302 465 967',
  links: [
    { label: 'GitHub',   href: 'https://github.com/coehemang' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/coehemang' },
  ],
};

export const intro = [
  'Engineer working on backend systems, ML pipelines, and the occasional weird side-project. Currently a B.Tech IT student at MBM University while parallel-tracking a B.S. in Data Science & AI at IIT Madras.',
  'Recently trained CycleGANs at DRDO Jodhpur, shipped a Pydantic-AI agent framework that scored 92/100 on adversarial evals, and wrote Git from scratch in Node because the manual was not enough.',
];

export const experience = [
  {
    role: 'Research Intern',
    org: 'Defence Research & Development Organisation',
    place: 'Jodhpur, IN',
    when: 'May → Jul 2025',
    bullets: [
      'Trained an image-to-image translation model (CycleGAN) for 50 epochs per experiment on 1,000+ paired & unpaired images using CUDA-accelerated GPU training.',
      'Evaluated outputs through qualitative comparisons every 5 epochs and tuned training parameters against observed artefacts and performance trends.',
    ],
  },
];

export const skills = [
  { label: 'Languages', items: ['Python', 'C', 'C++', 'Java', 'JavaScript', 'SQL', 'Kotlin'] },
  { label: 'Web',       items: ['React', 'Next.js', 'Node.js', 'Flask', 'Tailwind', 'HTML', 'CSS'] },
  { label: 'Data',      items: ['SQLite', 'MySQL', 'MongoDB'] },
  { label: 'Systems',   items: ['Linux', 'Git', 'POSIX', 'Docker'] },
  { label: 'Tools',     items: ['Heroku', 'GitHub', 'Figma'] },
];

export const education = [
  { school: 'MBM University, Jodhpur', degree: 'B.Tech, Information Technology', score: '7.8 / 10', when: '2023 → Present' },
  { school: 'IIT Madras, Chennai',     degree: 'B.S, Data Science & AI',          score: '8.0 / 10', when: '2023 → Present' },
];

export const certifications = [
  { name: 'Introduction to Software Development - Amazon (Coursera)', when: '2024' },
  { name: 'SQL Advanced - HackerRank',            when: '2024' },
  { name: 'JavaScript Intermediate - HackerRank', when: '2024' },
  { name: 'Intermediate SQL - DataCamp',          when: '2023' },
];

/* ============================================================
   Project detail records - one per /projects/:slug subpage.
   ============================================================ */
export const projects = [
  {
    id: 'PRJ-004',
    slug: 'typereal',
    name: 'TypeReal',
    tagline: 'A Monkeytype-class typing instrument - seven modes, a sub-16 ms engine, and a server-authoritative duel.',
    when: 'May 2026 → Present',
    status: 'LIVE',
    stack: ['React', 'TypeScript', 'Fastify', 'Prisma', 'Socket.IO'],
    metrics: [
      { value: '7',  unit: '',   label: 'test modes' },
      { value: '16', unit: 'ms', label: 'keystroke-to-pixel budget' },
      { value: '6',  unit: '',   label: 'built-in themes' },
      { value: '0',  unit: '',   label: 'signup to start typing' },
    ],
    accent: '#ff6b35',
    overview: [
      'TypeReal is a typing-speed trainer in the Monkeytype lineage, rebuilt around one obsession: the gap between a key going down and the glyph turning correct should never be felt. The whole front end is budgeted to keep that path under 16 ms - one frame at 60 Hz.',
      'It runs as a monorepo - a React + TypeScript client on Vite, and a Fastify API with Prisma, Lucia sessions, and Arctic OAuth. Guests type immediately; signing in unlocks history, a 1v1 duel, and a ghost that races your own best run.',
    ],
    sections: [
      {
        title: 'The typing surface',
        body: 'The interactive surface counts correct and error characters in refs rather than React state, so WPM and accuracy are exact on every keystroke instead of approximated from cursor position. The caret is a single absolutely-positioned bar that slides ~80 ms between cells and snaps on line wrap. Below 70% accuracy the run is marked failed - the WPM number is struck through and a quiet `test failed` badge appears instead of celebrating a bad result.',
        figure: { id: 'FIG 4.1', caption: 'The /test surface - seven modes, live WPM and accuracy, no signup.', src: '/projects/typereal/test.png', alt: 'TypeReal typing surface with mode pills, live stats, and a word passage' },
      },
      {
        title: 'Real-time duels and a ghost of your best run',
        body: 'A server-authoritative 1v1 duel puts the opponent\'s cursor on your passage in real time over Socket.IO - pick a track, create a private room, share the link. A ghost mode races you against your own fastest run on the exact same text. The seven solo modes (time, words, quote, zen, numbers, code across four languages, and paste-your-own custom) narrow to the four that make sense head-to-head.',
        figure: { id: 'FIG 4.2', caption: 'The duel lobby - private 1v1 rooms over a shared passage.', src: '/projects/typereal/duel.png', alt: 'TypeReal duel lobby with track and difficulty pills' },
      },
      {
        title: 'A theme system down to the token',
        body: 'Every colour is a `--tr-*` token - surfaces, foreground, borders, and semantic states all the way down to the opponent and ghost cursors. The editor sets each one against a live preview that types in solo, versus-opponent, and versus-ghost states at once, so a theme is judged on real passages rather than swatches. Six built-in themes ship; the custom editor unlocks for signed-in users.',
        figure: { id: 'FIG 4.3', caption: 'The theme editor - every token, with a live typing preview.', src: '/projects/typereal/themes-editor.png', alt: 'TypeReal theme token editor with color tokens and a live preview' },
      },
      {
        title: 'History, accounts, and the backend behind them',
        body: 'Signed-in users get every test logged - WPM, raw, accuracy, consistency, and time, filterable per mode. Behind it is a Fastify API issuing Lucia cookie sessions via magic-link email (single-use tokens hashed at rest, 10-minute TTL, rate-limited per route) and Google OAuth through Arctic with state-cookie CSRF protection. Account linking only trusts a verified Google email, token consumption is race-safe, and the whole surface is documented down to every secret it reads.',
        figure: { id: 'FIG 4.4', caption: 'History - every test, by mode, with per-run telemetry.', src: '/projects/typereal/history.png', alt: 'TypeReal history table of past tests with WPM and accuracy' },
      },
      {
        title: 'A landing page that types itself',
        body: 'The marketing page runs three live TypingDemo instances at once - a solo surface, a 1v1 duel with a second cursor racing 70 ms against 55 ms (scripted errors at characters 18 and 52), and a ghost demo that remaps `--tr-color-opponent` to `--tr-color-ghost` so the rival cursor reads as your past self. Stats under each panel update in tabular figures as the demo backspaces through its own mistakes, and the closing call-to-action runs a CharacterRain of falling glyphs over GSAP scroll reveals and Lenis smooth scroll.',
        figure: { id: 'FIG 4.5', caption: 'The landing page - a self-typing demo of the surface, duel, and ghost.', src: '/projects/typereal/landing.png', alt: 'TypeReal landing hero reading "Type fast. Type real." above a live typing demo' },
      },
      {
        title: 'Seven knobs for the typing surface',
        body: 'A floating ThemeWidget springs open into a tabbed tray whose Surface tab carries seven persisted controls - a text-size slider clamped 18-40 px with instant caret re-measure via ResizeObserver, left / center / right / justify alignment on a stroke-icon segmented control, compact / default / spacious density, a 2 / 3 / 4 / 5 / full lines limit, smooth-vs-instant caret, an easy-to-mixed difficulty picker, and a six-font grid (JetBrains Mono, IBM Plex Mono, Fira Code, Roboto Mono, Inter, System mono) live-applied through `--tr-font-passage`. Every value persists to localStorage; a drop-in custom-font upload stays locked behind sign-in.',
        figure: { id: 'FIG 4.6', caption: 'The Surface tray - size, density, caret, alignment, and font, live over a real passage.', src: '/projects/typereal/surface.png', alt: 'TypeReal surface customization panel with size, density, caret, alignment and font controls' },
      },
      {
        title: 'Code mode - four languages, two clocks',
        body: 'Code mode types real one-liners in javascript, python, rust, and go, with a lines-vs-time kind toggle: lines joins 5 / 10 / 20 snippets with real newlines and renders a return glyph per line, while time counts down 30 / 60 / 120 s. The Enter key actually types the newline, each line wraps on its own, and the sub-option pill row re-animates whenever you switch language or clock.',
        figure: { id: 'FIG 4.7', caption: 'Code mode - real multi-line snippets across four languages.', src: '/projects/typereal/code-mode.png', alt: 'TypeReal code mode typing a JavaScript snippet with newline glyphs' },
      },
      {
        title: 'One number, one chart, a fail state in red',
        body: 'Finishing a run springs in a result card: a 96 px WPM number over a hand-rolled SVG chart that plots per-second ticks sampled during the test - a solid wpm line, a dashed raw line, and red dots only on the seconds the cumulative error count rose. Drop below 70 % accuracy and the panel rings error-red, the WPM number is struck through, and a quiet "test failed" badge replaces the save / sign-up call to action instead of celebrating a bad run.',
        figure: { id: 'FIG 4.8', caption: 'The end-of-test result card and per-second WPM chart.', src: '/projects/typereal/result.png', alt: 'TypeReal result card with a large WPM number and a WPM-over-time chart' },
      },
    ],
    figma: null,
    links: [
      { label: 'Website', href: 'https://typereal.coehemang.dev' },
      { label: 'GitHub',  href: 'https://github.com/coehemang' },
    ],
  },
  {
    id: 'PRJ-005',
    slug: 'formdash',
    name: 'Formdash',
    tagline: 'A form builder where the branching actually holds - one rule engine, enforced in three places.',
    when: 'May 2026',
    status: 'LIVE',
    stack: ['React', 'Express', 'Prisma', 'PostgreSQL', 'Tailwind'],
    metrics: [
      { value: '24', unit: '',  label: 'field & display block types' },
      { value: '44', unit: '',  label: 'API tests, ~450 ms' },
      { value: '3',  unit: '',  label: 'contexts, one rule engine' },
      { value: '7',  unit: '+', label: 'anti-abuse guards' },
    ],
    accent: '#5c7cfa',
    overview: [
      'Formdash takes the boring parts of forms seriously: branching that holds, responses that can\'t be forged, and uploads that are what they claim to be. You drag questions onto a canvas, wire up show/hide rules, publish to a public URL, and watch responses land with per-question analytics.',
      'It is a pnpm monorepo - a React 19 client on Vite with Tailwind v4 and shadcn primitives, and an Express API on Prisma. The web tier deploys to Cloudflare Pages, the API to Heroku with Postgres, and files go to any S3-compatible bucket through one storage driver.',
    ],
    sections: [
      {
        title: 'A builder that previews itself',
        body: 'The editor is drag-and-drop over dnd-kit, with 18 question types and 6 display blocks, a live preview, and per-form theming. Drafts persist through a dedicated Web Worker that owns IndexedDB - the UI never touches the network directly, so autosave and offline edits stay smooth, and the old localStorage store migrates itself on first run.',
        figure: { id: 'FIG 5.1', caption: 'The drag-and-drop editor with live preview.', src: '/projects/formdash/editor-build.png', alt: 'Formdash drag-and-drop form editor' },
      },
      {
        title: 'One rule engine, three contexts',
        body: 'Conditional logic - nested AND/OR groups over eq / neq / gt / lt / contains - is written once in a shared package and evaluated in three places: the editor preview, the public runtime, and the server. The last one matters. A respondent can POST straight to `/submit` and skip the UI, so the server re-evaluates visibility and only requires answers to questions that were actually shown.',
        figure: { id: 'FIG 5.2', caption: 'Branching rules in the editor, mirrored server-side.', src: '/projects/formdash/editor-logic.png', alt: 'Formdash conditional logic editor' },
      },
      {
        title: 'Responses, analytics, and an API',
        body: 'Owners get a filtered responses list, per-question charts in Recharts, CSV export, HMAC-signed webhooks, and personal access tokens for a public REST API. Each form carries its own constraints - password gating, a response cap, a close date, and optional geolocation gated behind explicit consent.',
        figure: { id: 'FIG 5.3', caption: 'Per-question analytics for a live form.', src: '/projects/formdash/analytics.png', alt: 'Formdash response analytics dashboard' },
      },
      {
        title: 'Anti-abuse and the file path',
        body: 'Public endpoints sit behind layered rate limits (per-IP, per-form-and-IP, per-token), a honeypot, timing checks, and payload size and nesting caps. Uploads are validated by MIME and magic bytes, not just extension, and webhook delivery runs through an SSRF guard so a hostile target URL can\'t reach internal hosts. 44 vitest specs cover the guards, the webhook HMAC round-trip, and the rate-limit math.',
        figure: { id: 'FIG 5.4', caption: 'The public form runtime a respondent sees.', src: '/projects/formdash/public-form.png', alt: 'Formdash public form runtime' },
      },
      {
        title: 'Projects, not a flat list of forms',
        body: 'Every form lives inside a project, so the dashboard opens on a project pane with a live KPI line over one row per form - question count, response count, a Draft / Live / Closed status dot, and a relative "updated" time. A per-row menu handles rename, duplicate, move-to-project, copy public link, and a guarded delete; the active project rides in `?project=` so the view is shareable and survives reloads. Response counts refresh on an 8-second background poll into the data worker, so a new submission shows up without a manual refresh.',
        figure: { id: 'FIG 5.5', caption: 'The projects workspace - a live forms-and-responses overview.', src: '/projects/formdash/dashboard.png', alt: 'Formdash dashboard listing the forms in a project with status dots and response counts' },
      },
      {
        title: 'A per-form design system, not a colour picker',
        body: 'Design mode ships four full presets - Forest, Ink, Midnight, Sunrise - each a complete theme (palette, type, density, radius) that swaps the document wholesale, then exposes six editable colour tokens, three densities, three corner radii, and four type pairings. Every change repaints a real respondent preview in the centre pane - the same render path the public form uses - and themes ride onto the live form as `--p-*` custom properties rather than hardcoded styles.',
        figure: { id: 'FIG 5.6', caption: 'Design mode - a preset, a live themed preview, and per-token controls.', src: '/projects/formdash/editor-design.png', alt: 'Formdash editor in Design mode with theme presets and a live preview' },
      },
      {
        title: 'Four ways through a form',
        body: 'Flow mode picks how respondents move: single page, paginated with Next / Back, vertical scroll, or a horizontal snap one question per panel - and the snap modes add a scroll-by-question-vs-section toggle. The progress indicator is its own axis with four styles (none / bar / dots / N-of-M), as is question numbering, with ten formats from 01. to Roman, lettered, #3, and Q3, and statements or media never numbered. The centre pane is the live interactive preview, so the feel is verified before anything ships.',
        figure: { id: 'FIG 5.7', caption: 'Flow mode - navigation model, progress, and numbering over a live preview.', src: '/projects/formdash/editor-flow.png', alt: 'Formdash editor in Flow mode showing navigation, progress and numbering options' },
      },
      {
        title: 'Publish: a slug, a QR, and a way back',
        body: 'Publishing is a popover, not a wizard: set a public slug (live-previewed as /f/your-slug), hit publish, and the form goes live with a copy-link row, an open-in-new-tab affordance, and a QR card rendered through qrcode.react that exports a 512 px PNG. Double-clicks are guarded with an in-flight pending state so a slow network cannot race the snapshot, and Settings rounds it out with a response cap, a close-at datetime, a shared-password gate, redirect-on-submit, and an iframe embed for anonymous forms.',
        figure: { id: 'FIG 5.8', caption: 'The publish popover - slug, public URL, copy link, and a downloadable QR.', src: '/projects/formdash/publish-popover.png', alt: 'Formdash publish popover with a public slug, URL, copy button and QR code' },
      },
      {
        title: 'Responses read like filled-in forms',
        body: 'The responses surface is master-detail, not a wide spreadsheet: a list on the left, the full submission rendered as a readable filled-in form on the right. A filter strip composes a date range, respondent type (anyone / signed-in / anonymous), a with-location toggle, and free-text search across answers, email, and timezone - and the question-aware filters reuse the exact same evaluateConditional engine as the branching rules. The header reads "12 of 47 submissions" as filters narrow, Export CSV always streams the current view, and live submissions poll in every 5 seconds.',
        figure: { id: 'FIG 5.9', caption: 'The responses inbox - a filterable list beside the full filled-in response.', src: '/projects/formdash/responses.png', alt: 'Formdash responses page with a filter strip, a submission list and one rendered response' },
      },
      {
        title: 'Templates: start from curated, save your own',
        body: 'The gallery ships 15 starter templates across Feedback, Growth, Ops, Internal, and Hiring, each carrying a real question list - the research template alone seeds 11 questions across statement, scale, checkbox, and long-text. Clicking one clones it into the active project; cards show a category, an icon, and an exact question count. A six-strong anime pack ships its own palette, typography, and inline SVG background for instant identity, and any form you build can be saved back as a reusable template under the "Yours" tab.',
        figure: { id: 'FIG 5.10', caption: 'The templates gallery - 15 curated starters plus an anime pack, each cloneable.', src: '/projects/formdash/templates.png', alt: 'Formdash templates gallery grid with categories, icons and question counts' },
      },
    ],
    figma: null,
    links: [
      { label: 'Website', href: 'https://formdash.coehemang.dev' },
      { label: 'GitHub',  href: 'https://github.com/coehemang' },
    ],
  },
  {
    id: 'PRJ-001',
    slug: 'quizzy',
    name: 'Quizzy',
    tagline: 'A Pydantic-AI agent framework that survived 22/24 adversarial evals.',
    when: 'Nov → Dec 2025',
    status: 'SHIPPED',
    stack: ['FastAPI', 'Pydantic AI', 'Docker', 'Heroku'],
    metrics: [
      { value: '92', unit: '/100', label: 'adversarial eval score' },
      { value: '50', unit: '+',    label: 'custom tools' },
      { value: '4',  unit: '',     label: 'layered architecture' },
      { value: '3',  unit: '+',    label: 'agent-tool pipelines' },
    ],
    sprite: '/oneko/oneko-tora.gif',
    accent: '#ff5e00',
    overview: [
      'Quizzy is a quiz-generation backend built around Pydantic-AI agents. The brief was simple - given a topic, produce a structured, gradeable assessment - but the interesting part was the agent harness: three pipelines, fifty-plus custom tools, and a queue-based background runner.',
      'The architecture splits into four flat layers (agents, models, tools, core) with strict Pydantic contracts between them. The whole thing containerises into one image and ships on Heroku.',
    ],
    sections: [
      {
        title: 'Problem',
        body: 'LLM-driven quiz generators usually fall over on two axes - hallucinated answer keys, and unstructured outputs that downstream code can\'t consume. Pydantic-AI gave us a type-safe scaffold for the agents; the rest was harness design.',
      },
      {
        title: 'Architecture',
        body: 'Four layers, one direction of dependency. Agents own decisions, Models own shape, Tools own side-effects, Core owns orchestration. Background tasks run on a lightweight queue so request latency stays bounded even on multi-step generations.',
        figure: { id: 'FIG 1.1', caption: 'Four-layer dependency graph - agents → models → tools → core.' },
      },
      {
        title: 'Adversarial evaluation',
        body: 'A 24-scenario adversarial suite probed prompt injection, malformed inputs, tool-loop deadlocks, and out-of-distribution topics. The system passed 22, earning a 92/100. The two failures both involved chained tool calls timing out under cold-start; both are fixable with a warmer worker pool.',
        figure: { id: 'FIG 1.2', caption: 'Pass/fail matrix across the 24-scenario adversarial suite.' },
      },
    ],
    figma: {
      id: 'FIG 1.3',
      caption: 'System-design board: pipeline routing and tool registry.',
    },
    links: [
      { label: 'GitHub', href: 'https://github.com/coehemang' },
    ],
  },
  {
    id: 'PRJ-002',
    slug: 'animy',
    name: 'ANIMY',
    tagline: 'Prompt-driven video generator with a four-thread render farm.',
    when: 'Feb → Aug 2025',
    status: 'SHIPPED',
    stack: ['React', 'Node.js', 'Python', 'GenAI'],
    metrics: [
      { value: '10', unit: '/hr', label: 'throughput delta' },
      { value: '4',  unit: '',    label: 'parallel render threads' },
      { value: '3',  unit: '',    label: 'service components' },
      { value: '2',  unit: '',    label: 'real-time strategies evaluated' },
    ],
    sprite: '/oneko/oneko-vaporwave.gif',
    accent: '#8a5cff',
    overview: [
      'ANIMY takes a natural-language prompt and emits a short animated video. The frontend is React; the API tier is Node; the render tier is Python running parallel workers. The interesting design decisions sat at the seam between API and render.',
      'After prototyping with WebSockets we ripped them out - the cost-of-keeping-a-socket-warm-per-user outweighed the latency we were saving. Long-poll-with-progress-id won on simplicity.',
    ],
    sections: [
      {
        title: 'Render parallelism',
        body: 'Four parallel render threads with bounded queues. Throughput moved from ~6 to ~16 videos/hour - a delta of +10/hr. Worker isolation kept blast-radius small when a single render failed.',
        figure: { id: 'FIG 2.1', caption: 'Per-thread render throughput over a 60-minute window.' },
      },
      {
        title: 'WebSockets vs polling',
        body: 'WebSockets gave 200ms-tier latency but added per-user state, reconnection logic, and infra cost. Long-poll with a progress-id offered ~600ms latency at one-tenth the infrastructural surface area. We picked the simpler one.',
        figure: { id: 'FIG 2.2', caption: 'Decision matrix - WebSockets vs long-poll on five axes.' },
      },
    ],
    figma: {
      id: 'FIG 2.3',
      caption: 'Frontend mocks: prompt entry, queue view, completed-render gallery.',
    },
    links: [
      { label: 'Website', href: '#' },
    ],
  },
  {
    id: 'PRJ-003',
    slug: 'build-my-own-git',
    name: 'Build My Own Git',
    tagline: 'Six core Git commands, rebuilt in Node, byte-compatible with the real thing.',
    when: 'Dec 2024 → Feb 2025',
    status: 'ARCHIVED',
    stack: ['Node.js', 'SHA-1', 'zlib'],
    metrics: [
      { value: '6', unit: '',  label: 'Git commands implemented' },
      { value: '3', unit: '',  label: 'object types (blob/tree/commit)' },
      { value: '1', unit: '',  label: '.git directory structure recreated' },
    ],
    sprite: '/oneko/oneko-dog.gif',
    accent: '#10a37f',
    overview: [
      'A from-scratch implementation of Git\'s plumbing layer in pure Node. The goal: make `init`, `hash-object`, `write-tree`, `commit-tree`, `ls-tree`, and `cat-file` produce byte-identical objects to the official client.',
      'Mostly a study in content-addressable storage. SHA-1 hashes, zlib compression, deterministic tree serialisation - every detail has to match or `git fsck` rejects the result.',
    ],
    sections: [
      {
        title: 'Object model',
        body: 'Three object types: blob (content), tree (directory entries), commit (root + parent + metadata). All compressed with zlib and stored at .git/objects/aa/bb…cc where aa…cc is the SHA-1 of the uncompressed content.',
        figure: { id: 'FIG 3.1', caption: 'Object directory layout under .git/objects.' },
      },
      {
        title: 'Why byte-identical matters',
        body: 'Producing "a Git" is easy. Producing one whose objects the real Git can read back is the whole exercise. Tree entries must sort lexicographically with the trailing-slash quirk; commit headers must be space-and-newline-exact; mode strings are octal-with-no-leading-zero. None of it is documented in one place.',
      },
    ],
    figma: null,
    links: [
      { label: 'GitHub', href: 'https://github.com/coehemang' },
    ],
  },
];

export const projectBySlug = Object.fromEntries(projects.map((p) => [p.slug, p]));
