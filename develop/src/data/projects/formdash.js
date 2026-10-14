export const formdash = {
  id: 'PRJ-005',
  slug: 'formdash',
  name: 'Formdash',
  tagline: 'A form builder where conditional logic actually holds. One rule engine, checked in the editor, the live form and on the server.',
  when: 'May 2026',
  status: 'LIVE',
  stack: ['React', 'Express', 'Prisma', 'PostgreSQL', 'Tailwind'],
  metrics: [
    { value: '23', unit: '',  label: 'field and display block types' },
    { value: '44', unit: '',  label: 'API tests, under a second' },
    { value: '3',  unit: '',  label: 'places the same rules run' },
    { value: '7',  unit: '+', label: 'anti-abuse guards' },
  ],
  accent: '#5c7cfa',
  hero: {
    light: '/projects/formdash/product-tilt-light.webp',
    dark: '/projects/formdash/product-tilt-dark.webp',
  },
  invertShotsInLight: true,
  overview: [
    'Formdash is a form builder that takes the boring parts of forms seriously: branching that holds, responses that cannot be forged, and uploads that really are what they claim to be. You drag questions onto a canvas, set show and hide rules, publish to a public URL, and watch responses come in with per-question analytics.',
    'It is a pnpm monorepo: a React client on Vite with Tailwind and shadcn, and an Express API on Prisma. The web app runs on Cloudflare Pages, the API on Heroku with Postgres, and files go to any S3-compatible bucket through one storage driver.',
  ],
  sections: [
    {
      title: 'An editor with a live preview',
      body: [
        'The editor is drag and drop on dnd-kit, with 17 question types, 6 display blocks, a live preview and per-form themes.',
        'Drafts are saved by a dedicated Web Worker that owns IndexedDB. The UI never talks to the network directly, so autosave and offline editing stay smooth. Old localStorage drafts migrate themselves on the first run.',
      ],
      figure: { id: 'FIG 5.1', caption: 'The drag-and-drop editor with live preview.', src: '/projects/formdash/editor-build.png', alt: 'Formdash drag-and-drop form editor' },
    },
    {
      title: 'One rule engine, used in three places',
      body: [
        'Conditional logic (nested AND and OR groups over eq, neq, gt, lt and contains) is written once in a shared package and evaluated in three places: the editor preview, the public form and the server.',
        'The server is the one that matters. Someone can POST straight to `/submit` and skip the UI completely, so the server re-checks visibility and only requires answers to the questions that were actually shown.',
      ],
      figure: { id: 'FIG 5.2', caption: 'Branching rules in the editor, checked again on the server.', src: '/projects/formdash/editor-logic.png', alt: 'Formdash conditional logic editor' },
    },
    {
      title: 'Responses, analytics and an API',
      body: 'Owners get a filterable list of responses, per-question charts in Recharts, CSV export, HMAC-signed webhooks, and personal access tokens for a public REST API. Each form can have its own limits: a password, a response cap, a close date, and optional geolocation that only works with explicit consent.',
      figure: { id: 'FIG 5.3', caption: 'Per-question analytics for a live form.', src: '/projects/formdash/analytics.png', alt: 'Formdash response analytics dashboard' },
    },
    {
      title: 'Anti-abuse and file uploads',
      body: [
        'Public endpoints sit behind layered rate limits (per IP, per form and IP, and per token), a honeypot, timing checks, and limits on payload size and nesting.',
        'Uploads are checked by MIME type and magic bytes, not just the file extension. Webhook delivery goes through an SSRF guard, so a hostile URL cannot reach internal hosts. 44 vitest specs cover the guards, the webhook HMAC round trip and the rate-limit maths.',
      ],
      figure: { id: 'FIG 5.4', caption: 'The public form a respondent sees.', src: '/projects/formdash/public-form.png', alt: 'Formdash public form runtime' },
    },
    {
      title: 'Projects instead of a flat list',
      body: [
        'Every form lives inside a project. The dashboard opens on a project with a live summary line and one row per form: question count, response count, a Draft, Live or Closed status dot, and when it was last updated.',
        'A menu on each row handles rename, duplicate, move to another project, copy public link and a guarded delete. The active project is kept in `?project=`, so the view can be shared and survives a reload. Response counts refresh every 8 seconds in the background, so new submissions show up on their own.',
      ],
      figure: { id: 'FIG 5.5', caption: 'The projects workspace: forms and responses at a glance.', src: '/projects/formdash/dashboard.png', alt: 'Formdash dashboard listing the forms in a project with status dots and response counts' },
    },
    {
      title: 'A design system for each form',
      body: [
        'Design mode has four full presets, Forest, Ink, Midnight and Sunrise. Each one is a complete theme with palette, type, density and corner radius. On top of a preset you can edit six colour tokens, three densities, three radii and four font pairings.',
        'Every change repaints a real respondent preview in the centre pane, using the same render path as the public form. Themes reach the live form as `--p-*` CSS custom properties, not hardcoded styles.',
      ],
      figure: { id: 'FIG 5.6', caption: 'Design mode: a preset, a live themed preview and per-token controls.', src: '/projects/formdash/editor-design.png', alt: 'Formdash editor in Design mode with theme presets and a live preview' },
    },
    {
      title: 'Four ways through a form',
      body: 'Flow mode picks how respondents move through a form: a single page, pages with Next and Back, vertical scroll, or horizontal snapping with one question per panel. The progress indicator has four styles (none, bar, dots, and N of M), and question numbering has ten formats, from 01. to Roman numerals to Q3. Statements and media are never numbered.',
      figure: { id: 'FIG 5.7', caption: 'Flow mode: navigation, progress and numbering over a live preview.', src: '/projects/formdash/editor-flow.png', alt: 'Formdash editor in Flow mode showing navigation, progress and numbering options' },
    },
    {
      title: 'Publishing',
      body: [
        'Publishing is a small popover, not a wizard. Set a public slug (previewed as /f/your-slug), press publish, and you get a copy-link row, an open-in-new-tab link and a QR code that downloads as a 512 px PNG. Double clicks are guarded with a pending state, so a slow network cannot race the snapshot.',
        'Settings adds a response cap, a close date and time, a shared password, a redirect after submit, and an iframe embed for anonymous forms.',
      ],
      figure: { id: 'FIG 5.8', caption: 'The publish popover: slug, public URL, copy link and a downloadable QR code.', src: '/projects/formdash/publish-popover.png', alt: 'Formdash publish popover with a public slug, URL, copy button and QR code' },
    },
    {
      title: 'Responses that read like filled-in forms',
      body: [
        'The responses screen is a list on the left and the full submission on the right, shown as a filled-in form instead of a wide spreadsheet row.',
        'Filters combine a date range, respondent type (anyone, signed in or anonymous), a with-location toggle, and text search across answers, email and timezone. The question-based filters reuse the same `evaluateConditional` engine as the branching rules. The header shows "12 of 47 submissions" as you narrow down, Export CSV always exports the current view, and new submissions are pulled in every 5 seconds.',
      ],
      figure: { id: 'FIG 5.9', caption: 'The responses inbox: a filterable list next to the full response.', src: '/projects/formdash/responses.png', alt: 'Formdash responses page with a filter strip, a submission list and one rendered response' },
    },
    {
      title: 'Templates',
      body: [
        'The gallery has 15 starter templates across Feedback, Growth, Ops, Internal and Hiring, each with a real question list. The research template alone has 11 questions across statements, scales, checkboxes and long text. Clicking one copies it into the active project.',
        'There is also a pack of six anime-themed templates with their own palette, fonts and inline SVG backgrounds. Any form you build can be saved as a template under the Yours tab.',
      ],
      figure: { id: 'FIG 5.10', caption: 'The templates gallery: 15 starters plus an anime pack, each one copyable.', src: '/projects/formdash/templates.png', alt: 'Formdash templates gallery grid with categories, icons and question counts' },
    },
  ],
  conclusion: [
    'Formdash is built on not trusting the client. The branching rules are written once and run in three places, and the server is the one that counts: it re-checks visibility, so a hand-written POST cannot answer a question it was never shown.',
    'Around that sit rate limits, magic-byte upload checks, an SSRF-guarded webhook path, and 44 tests holding them in place. The editor, themes and flows on top were the easier half. The half that mattered assumes every request is hostile until it proves otherwise.',
  ],
  figma: null,
  links: [
    { label: 'Website', href: 'https://formdash.coehemang.dev' },
  ],
};
