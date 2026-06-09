export const contribConsole = {
  id: 'PRJ-011',
  slug: 'contrib-console',
  name: 'contrib.console',
  tagline: 'A local-first control panel that steers an AI through real open-source contributions - one small, reviewed commit at a time, with your token and the worker never leaving your machine.',
  when: 'Jun 2026',
  status: 'LIVE',
  stack: ['React', 'Vite', 'TypeScript', 'Tailwind v4', 'shadcn', 'Claude Code'],
  metrics: [
    { value: '1',  unit: '',  label: 'small commit, then it stops' },
    { value: '50', unit: '',  label: 'changed lines, hard cap' },
    { value: '9',  unit: '',  label: 'panels, discover to ship' },
    { value: '0',  unit: '',  label: 'pushes without your approval' },
  ],
  accent: '#e07d1a',
  overview: [
    'contrib.console is a local-first control panel for steering an AI through real open-source contributions. You set target languages, it suggests repositories with good first issues, you approve the ones worth your time and queue an issue, and a worker makes one small commit toward it - then stops. Every commit lands in a review inbox with its diff and a per-file note; you approve or request changes, and only once you write the PR description does the dashboard push and open it as you.',
    'It is built to be boring on purpose. Your GitHub token lives in a dev-server env file, read only on the host and never shipped to the browser. The worker is Claude Code running in an embedded terminal, talking to the dashboard through plain JSON files in a pipeline directory rather than a remote queue. Commits stay local - the worker is blocked from any network git call - so nothing leaves your machine until you approve a diff and open the PR yourself.',
  ],
  sections: [
    {
      title: 'Find repos worth contributing to',
      body: 'Discover takes your target languages and optional topics and ranks repositories that carry good first issues - here vue, vscode, dify, next.js, excalidraw, and node - each with a one-click Approve. A short-lived in-memory cache sits in front of the GitHub proxy so paging and filter changes do not burst the search API into a secondary rate limit, and the footer keeps your remaining core and search quota in view.',
      figure: { id: 'FIG 11.1', caption: 'Discover - ranked repositories with good first issues, filtered by language and topic.', src: '/projects/contrib-console/discover.png', alt: 'contrib.console discover page showing a grid of popular repositories like vue, vscode and next.js each with an approve button' },
    },
    {
      title: 'The repos you said yes to',
      body: 'My repos is the shortlist you actually approved, each stamped with when you approved it. The worker only ever touches this set, so the boundary of what an AI can change on your behalf is a list you curate by hand, not a search it runs.',
      figure: { id: 'FIG 11.2', caption: 'My repos - the curated set of approved repositories the worker is allowed to touch.', src: '/projects/contrib-console/repos.png', alt: 'contrib.console my-repos page listing approved repositories next.js, excalidraw, hono and node with approval dates' },
    },
    {
      title: 'A queue, one issue at a time',
      body: 'Picking an issue filters to the ones worth a worker\'s time - unassigned, label-matched, and with no linked pull request - and queues it. The work list then shows each queued issue with a live status that advances as the run proceeds: selected, in-progress, awaiting-review, changes-requested. Anything you no longer want, you dequeue.',
      figure: { id: 'FIG 11.3', caption: 'Work - the queued issues, each carrying the status of its run.', src: '/projects/contrib-console/work.png', alt: 'contrib.console work page listing four queued issues across repos with status pills like selected, in-progress and awaiting-review' },
    },
    {
      title: 'A board that tracks each issue through the pipeline',
      body: 'The status board is where every queued issue sits as the worker moves it along, from selected through awaiting-review to pr-open. A worker pill turns green only while a run is genuinely live - the heartbeat is a file the worker host rewrites every couple of seconds, so a stale beat reads honestly as off rather than pretending to be busy.',
      figure: { id: 'FIG 11.4', caption: 'Status - the task board, one row per queued issue, advancing as the worker runs.', src: '/projects/contrib-console/status.png', alt: 'contrib.console status task board showing four issues at different pipeline stages with a worker-idle indicator' },
    },
    {
      title: 'Review every commit before it lands',
      body: 'This is the whole point. Each commit the worker makes arrives in the review inbox with its branch and sha, the files it touched with per-file additions, deletions, and a plain-English note, and a colorized diff - and nothing is pushed until you approve the final commit. You approve, or request changes with a note that resumes the worker on its own. The fifty-line, two-file cap is not decoration; it is what keeps each diff small enough to actually read.',
      figure: { id: 'FIG 11.5', caption: 'Reviews - a pending commit with its diff, per-file notes, and approve / request-changes controls.', src: '/projects/contrib-console/reviews.png', alt: 'contrib.console reviews page showing a pending commit for a next.js docs change with a unified diff and approve and request-changes buttons' },
    },
    {
      title: 'Your identity, your schedule',
      body: 'Settings fixes the git identity every commit and PR is authored as - your name, no bot, no co-author line - so the contribution reads as yours because it is. An automation block can auto-start the worker on a schedule with a bounded prompt that still pushes nothing without approval, and the run-now button kicks a single pass when you want one.',
      figure: { id: 'FIG 11.6', caption: 'Settings - the commit identity and the scheduled-run automation, both gated on your approval.', src: '/projects/contrib-console/settings.png', alt: 'contrib.console settings page with a git identity form and an automation section for scheduling worker runs' },
    },
    {
      title: 'Why it runs locally',
      body: 'The landing page makes the case the product is built around: stay in the loop on every commit. The token never reaches the browser, the worker never reaches the network, and the bus between the dashboard and Claude Code is just JSON on disk - so an always-on contributor never costs you control of your credentials, or your name on the commit.',
      figure: { id: 'FIG 11.7', caption: 'The landing page - the pitch for keeping a human in the loop on every single commit.', src: '/projects/contrib-console/landing.png', alt: 'contrib.console landing page with the headline "Stay in the loop on every commit" over a dark layout with an amber accent' },
    },
  ],
  conclusion: [
    'contrib.console treats an AI contributor the way a careful maintainer treats a new one: small changes, every commit reviewed, nothing pushed without a human. The constraints - fifty changed lines, two files, one commit at a time - are not limits bolted on after the fact; they are the design, the thing that keeps each diff small enough to read and each decision yours.',
    'The architecture follows from a single rule: your machine stays the boundary. The token never reaches the browser, the worker never reaches the network, and the file bus between the dashboard and Claude Code is plain JSON on disk. You get an always-available contributor without handing your credentials, or your judgment, to a service.',
  ],
  figma: null,
  links: [
    { label: 'Website', href: 'https://contrib.coehemang.dev' },
    { label: 'GitHub', href: 'https://github.com/23f3001304/contrib.console' },
  ],
};
