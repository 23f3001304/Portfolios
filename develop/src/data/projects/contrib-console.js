export const contribConsole = {
  id: 'PRJ-011',
  slug: 'contrib-console',
  name: 'contrib.console',
  tagline: 'A local control panel for guiding an AI through real open-source contributions, one small reviewed commit at a time.',
  when: 'Jun 2026',
  status: 'LIVE',
  stack: ['React', 'Vite', 'TypeScript', 'Tailwind v4', 'shadcn', 'Claude Code'],
  metrics: [
    { value: '1',  unit: '',  label: 'commit per run, then it stops' },
    { value: '50', unit: '',  label: 'changed lines max per commit' },
    { value: '9',  unit: '',  label: 'screens, from discover to PR' },
    { value: '0',  unit: '',  label: 'pushes without your approval' },
  ],
  accent: '#e07d1a',
  hero: {
    light: '/projects/contrib-console/product-tilt-light.webp',
    dark: '/projects/contrib-console/product-tilt-dark.webp',
  },
  invertShotsInLight: true,
  overview: [
    'contrib.console is a local control panel for guiding an AI through real open-source contributions. You set the languages you care about, and it suggests repositories with good first issues. You approve the ones worth your time and queue an issue. A worker then makes one small commit toward it, and stops.',
    'Every commit lands in a review inbox with its diff and a note for each file. You approve it or ask for changes. Only after you write the PR description does the dashboard push and open the PR, as you.',
    'Your GitHub token stays in a dev-server env file, read only on your machine and never sent to the browser. The worker is Claude Code in an embedded terminal, and it talks to the dashboard through plain JSON files in a pipeline folder instead of a remote queue. The worker is also blocked from any network git call, so commits stay local and nothing leaves your machine until you approve it.',
  ],
  sections: [
    {
      title: 'Finding repos worth contributing to',
      body: [
        'Discover takes your languages and optional topics and ranks repositories that have good first issues, here vue, vscode, dify, next.js, excalidraw and node, each with a one-click Approve.',
        'A short-lived in-memory cache sits in front of the GitHub proxy, so paging and changing filters does not hammer the search API into a secondary rate limit. The footer keeps your remaining core and search quota visible.',
      ],
      figure: { id: 'FIG 11.1', caption: 'Discover: ranked repositories with good first issues, filtered by language and topic.', src: '/projects/contrib-console/discover.png', alt: 'contrib.console discover page showing a grid of popular repositories like vue, vscode and next.js each with an approve button' },
    },
    {
      title: 'Only the repos you approved',
      body: 'My repos is the shortlist you approved, each with the date you approved it. The worker only ever touches this list. So the boundary of what an AI can change for you is a list you keep by hand, not a search it runs on its own.',
      figure: { id: 'FIG 11.2', caption: 'My repos: the approved repositories the worker is allowed to touch.', src: '/projects/contrib-console/repos.png', alt: 'contrib.console my-repos page listing approved repositories next.js, excalidraw, hono and node with approval dates' },
    },
    {
      title: 'A queue, one issue at a time',
      body: [
        'When you pick an issue, the list is filtered to ones worth a worker\'s time: unassigned, matching your labels, and with no linked pull request.',
        'The work list then shows each queued issue with a live status that moves as the run goes: selected, in-progress, awaiting-review, changes-requested. Anything you no longer want, you can dequeue.',
      ],
      figure: { id: 'FIG 11.3', caption: 'Work: the queued issues, each with the status of its run.', src: '/projects/contrib-console/work.png', alt: 'contrib.console work page listing four queued issues across repos with status pills like selected, in-progress and awaiting-review' },
    },
    {
      title: 'A status board for the pipeline',
      body: [
        'The status board shows every queued issue as the worker moves it from selected, through awaiting-review, to pr-open.',
        'The worker pill turns green only while a run is live. Its heartbeat is a file the worker rewrites every couple of seconds, so if the heartbeat goes stale the pill shows off instead of pretending to be busy.',
      ],
      figure: { id: 'FIG 11.4', caption: 'Status: one row per queued issue, moving forward as the worker runs.', src: '/projects/contrib-console/status.png', alt: 'contrib.console status task board showing four issues at different pipeline stages with a worker-idle indicator' },
    },
    {
      title: 'Reviewing every commit',
      body: [
        'This is the main reason the tool exists. Each commit the worker makes arrives in the review inbox with its branch and sha, the files it touched with additions and deletions, a plain-English note per file, and a coloured diff. Nothing is pushed until you approve the final commit.',
        'You can approve, or request changes with a note, and the worker picks the note up and continues on its own. The cap of fifty changed lines across two files is what keeps each diff small enough to read properly.',
      ],
      figure: { id: 'FIG 11.5', caption: 'Reviews: a pending commit with its diff, per-file notes, and approve or request-changes buttons.', src: '/projects/contrib-console/reviews.png', alt: 'contrib.console reviews page showing a pending commit for a next.js docs change with a unified diff and approve and request-changes buttons' },
    },
    {
      title: 'Your name on your commits',
      body: [
        'Settings fixes the git identity every commit and PR uses: your name, no bot account and no co-author line. The contribution is yours because you reviewed and approved it.',
        'An automation block can start the worker on a schedule with a fixed prompt, and it still pushes nothing without your approval. The run-now button starts a single pass when you want one.',
      ],
      figure: { id: 'FIG 11.6', caption: 'Settings: the commit identity and the scheduled-run automation.', src: '/projects/contrib-console/settings.png', alt: 'contrib.console settings page with a git identity form and an automation section for scheduling worker runs' },
    },
    {
      title: 'The landing page',
      body: 'The landing page sums up the whole idea in one line: stay in the loop on every commit.',
      figure: { id: 'FIG 11.7', caption: 'The public landing page.', src: '/projects/contrib-console/landing.png', alt: 'contrib.console landing page with the headline "Stay in the loop on every commit" over a dark layout with an amber accent' },
    },
  ],
  conclusion: [
    'I built contrib.console to treat an AI contributor the way a careful maintainer treats a new human one: small changes, every commit reviewed, and nothing pushed until a person says yes. The limits (fifty lines, two files, one commit at a time) were where the design started, not something I added later.',
    'Everything else follows from one rule: your machine is the boundary. You get a contributor that is always available, without handing your credentials, or your judgement, to a service.',
  ],
  figma: null,
  links: [
    { label: 'Website', href: 'https://contrib.coehemang.dev' },
    { label: 'GitHub', href: 'https://github.com/23f3001304/contrib.console' },
  ],
};
