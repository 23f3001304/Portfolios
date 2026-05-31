export const formdash = {
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
  conclusion: [
    'Formdash is built on a single distrust: a form builder is only as good as the parts nobody demos. The rule engine behind branching is written once and run in three places - editor, public runtime, and server - and the server is the one that counts, re-evaluating visibility so a hand-rolled POST can\'t answer a question it was never shown.',
    'Around that sit the unglamorous guarantees - layered rate limits, magic-byte upload checks, an SSRF-guarded webhook path, and 44 specs holding them in place. The surface on top - projects over a flat list, a per-form design system, four ways through a form, responses that read like filled-in forms - is the easy half; the half that matters assumes every request is hostile until it proves otherwise.',
  ],
  figma: null,
  links: [
    { label: 'Website', href: 'https://formdash.coehemang.dev' },
  ],
};
