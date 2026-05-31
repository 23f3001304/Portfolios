export const typereal = {
  id: 'PRJ-004',
  slug: 'typereal',
  name: 'TypeReal',
  tagline: 'A Monkeytype-class typing instrument - seven modes, a 16 ms input target, and a server-authoritative duel.',
  when: 'May 2026 → Present',
  status: 'LIVE',
  stack: ['React', 'TypeScript', 'Fastify', 'Prisma', 'Socket.IO'],
  metrics: [
    { value: '7',  unit: '',   label: 'test modes' },
    { value: '16', unit: 'ms', label: 'keystroke-to-paint target' },
    { value: '6',  unit: '',   label: 'built-in themes' },
    { value: '0',  unit: '',   label: 'signup to start typing' },
  ],
  accent: '#ff6b35',
  overview: [
    'TypeReal is a typing-speed trainer in the Monkeytype lineage, rebuilt around one obsession: the gap between a key going down and the glyph turning correct should never be felt. The input path is built to land inside a single 60 Hz frame - each keystroke colours its character and moves the caret on the same synchronous keydown, with no async or animation-frame step in between.',
    'It runs as a monorepo - a React + TypeScript client on Vite, and a Fastify API with Prisma and Lucia sessions, signed into by a magic-link email or a Google popup verified through Firebase. Guests type immediately; signing in unlocks history, a 1v1 duel, and a ghost that races your own best run.',
  ],
  sections: [
    {
      title: 'The typing surface',
      body: 'The interactive surface counts correct and error characters in refs rather than React state, so WPM and accuracy are exact on every keystroke instead of approximated from cursor position. The caret is a single absolutely-positioned bar that slides ~80 ms between cells, its height snapping instantly so a font-size change never feels rubbery. Below 70% accuracy the run is marked failed - the WPM number is struck through and a quiet `test failed` badge appears instead of celebrating a bad result.',
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
      body: 'Signed-in users get every test logged - WPM, raw, accuracy, consistency, and time, filterable per mode. Behind it is a Fastify API issuing Lucia cookie sessions two ways: a magic-link email (single-use tokens hashed at rest, 10-minute TTL, rate-limited per route) and Google sign-in, where the browser runs a Google OAuth popup, hands the ID token to Firebase, and the API verifies that Firebase token before it mints the session. Account linking only trusts a verified email, token consumption is race-safe, and the whole surface is documented down to every secret it reads.',
      figure: { id: 'FIG 4.4', caption: 'History - every test, by mode, with per-run telemetry.', src: '/projects/typereal/history.png', alt: 'TypeReal history table of past tests with WPM and accuracy' },
    },
    {
      title: 'A landing page that types itself',
      body: 'The marketing page runs three live TypingDemo instances at once - a solo surface, a 1v1 duel with a second cursor racing 70 ms against 55 ms (scripted errors at characters 18 and 52), and a ghost demo that remaps `--tr-color-opponent` to `--tr-color-ghost` so the rival cursor reads as your past self. Stats under each panel update in tabular figures as the demo backspaces through its own mistakes, and the closing call-to-action runs a CharacterRain of falling glyphs over GSAP scroll reveals.',
      figure: { id: 'FIG 4.5', caption: 'The landing page - a self-typing demo of the surface, duel, and ghost.', src: '/projects/typereal/landing.png', alt: 'TypeReal landing hero reading "Type fast. Type real." above a live typing demo' },
    },
    {
      title: 'Seven knobs for the typing surface',
      body: 'A floating ThemeWidget springs open into a tabbed tray whose Surface tab carries seven persisted controls - a text-size slider clamped 18-40 px with instant caret re-measure via ResizeObserver, left / center / right / justify alignment on a stroke-icon segmented control, compact / default / spacious density, a 2 / 3 / 4 / 5 / full lines limit, smooth-vs-instant caret, an easy-to-mixed difficulty picker, and a six-font grid (JetBrains Mono, IBM Plex Mono, Fira Code, Roboto Mono, Inter, System mono) live-applied through `--tr-font-passage`. Every value persists to localStorage, so the surface stays exactly as you left it with no account required.',
      figure: { id: 'FIG 4.6', caption: 'The Surface tray - size, density, caret, alignment, and font, live over a real passage.', src: '/projects/typereal/surface.png', alt: 'TypeReal surface customization panel with size, density, caret, alignment and font controls' },
    },
    {
      title: 'Code mode - four languages, two clocks',
      body: 'Code mode types real one-liners in javascript, python, rust, and go, with a lines-vs-time kind toggle: lines joins 5 / 10 / 20 snippets with real newlines and renders a return glyph per line, while time counts down 30 / 60 / 120 s. The Enter key actually types the newline, each line wraps on its own, and the sub-option pill row re-animates whenever you switch language or clock.',
      figure: { id: 'FIG 4.7', caption: 'Code mode - real multi-line snippets across four languages.', src: '/projects/typereal/code-mode.png', alt: 'TypeReal code mode typing a JavaScript snippet with newline glyphs' },
    },
    {
      title: 'One number, one chart, a fail state in red',
      body: 'Finishing a run springs in a result card: a WPM number up to 96 px over a hand-rolled SVG chart that plots per-second ticks sampled during the test - a solid wpm line, a dashed raw line, and red dots only on the seconds the cumulative error count rose. Drop below 70 % accuracy and the panel rings error-red, the WPM number is struck through, and a quiet "test failed" badge replaces the save / sign-up call to action instead of celebrating a bad run.',
      figure: { id: 'FIG 4.8', caption: 'The end-of-test result card and per-second WPM chart.', src: '/projects/typereal/result.png', alt: 'TypeReal result card with a large WPM number and a WPM-over-time chart' },
    },
  ],
  conclusion: [
    'TypeReal began as a Monkeytype clone and turned into an argument that the clone is the easy part. The work went where it usually gets skipped: the input loop kept synchronous so a keystroke paints within a frame, WPM and accuracy counted exactly from refs instead of estimated off the cursor, and a 1v1 duel made server-authoritative so an opponent\'s run can\'t be forged.',
    'It stays honest about the line between guest and account - anyone types immediately, and history, duels, the ghost, and the custom theme editor unlock the moment you sign in. The result reads less like a typing test than a typing instrument: every knob persisted, every result either earned or struck through in red.',
  ],
  figma: null,
  links: [
    { label: 'Website', href: 'https://typereal.coehemang.dev' },
  ],
};
