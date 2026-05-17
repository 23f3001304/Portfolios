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
