export const typereal = {
  id: 'PRJ-004',
  slug: 'typereal',
  name: 'TypeReal',
  tagline: 'A typing trainer in the style of Monkeytype, with seven modes, a 16 ms input target and real-time 1v1 duels.',
  when: 'May 2026 → Present',
  status: 'LIVE',
  stack: ['React', 'TypeScript', 'Fastify', 'Prisma', 'Socket.IO'],
  metrics: [
    { value: '7',  unit: '',   label: 'test modes' },
    { value: '16', unit: 'ms', label: 'keystroke-to-paint target' },
    { value: '6',  unit: '',   label: 'built-in themes' },
    { value: '0',  unit: '',   label: 'accounts needed to start typing' },
  ],
  accent: '#ff6b35',
  hero: {
    light: '/projects/typereal/product-flat-light.webp',
    dark: '/projects/typereal/product-flat-dark.webp',
  },
  invertShotsInLight: true,
  overview: [
    'TypeReal is a typing-speed trainer in the Monkeytype family, built around one goal: you should never feel the gap between pressing a key and the letter turning correct. The input path is built to fit inside one 60 Hz frame. Each keystroke colours its character and moves the caret in the same synchronous keydown handler, with no async or animation-frame step in between.',
    'It is a monorepo with a React and TypeScript client on Vite, and a Fastify API with Prisma and Lucia sessions. You sign in with a magic-link email or a Google popup verified through Firebase. Guests can type right away. Signing in unlocks history, 1v1 duels, and a ghost that races your own best run.',
  ],
  sections: [
    {
      title: 'The typing surface',
      body: [
        'Correct and wrong characters are counted in refs instead of React state. So WPM and accuracy are exact on every keystroke, instead of being estimated from the cursor position.',
        'The caret is a single absolutely positioned bar that slides for about 80 ms between letters, while its height snaps instantly, so changing the font size never feels rubbery.',
      ],
      figure: { id: 'FIG 4.1', caption: 'The /test screen: seven modes, live WPM and accuracy, no signup.', src: '/projects/typereal/test.png', alt: 'TypeReal typing surface with mode pills, live stats, and a word passage' },
    },
    {
      title: 'Duels, and a ghost of your best run',
      body: [
        'A 1v1 duel puts your opponent\'s cursor on your passage in real time over Socket.IO. The server is the authority on every run, so a result cannot be forged from the client. Pick a track, create a private room and share the link.',
        'Ghost mode races you against your own fastest run on the exact same text. Of the seven solo modes (time, words, quote, zen, numbers, code in four languages, and custom text you paste), the four that make sense head to head are available in duels.',
      ],
      figure: { id: 'FIG 4.2', caption: 'The duel lobby: private 1v1 rooms over a shared passage.', src: '/projects/typereal/duel.png', alt: 'TypeReal duel lobby with track and difficulty pills' },
    },
    {
      title: 'Themes down to every token',
      body: 'Every colour is a `--tr-*` token: surfaces, text, borders and states, down to the opponent and ghost cursors. The editor sets each one against a live preview that types in solo, versus-opponent and versus-ghost modes at once, so you judge a theme on real passages instead of swatches. Six themes are built in, and the custom editor unlocks when you sign in.',
      figure: { id: 'FIG 4.3', caption: 'The theme editor: every token, with a live typing preview.', src: '/projects/typereal/themes-editor.png', alt: 'TypeReal theme token editor with color tokens and a live preview' },
    },
    {
      title: 'History, accounts and the backend',
      body: [
        'Signed-in users get every test logged (WPM, raw, accuracy, consistency and time), filterable by mode.',
        'Behind it is a Fastify API that issues Lucia cookie sessions in two ways. One is a magic-link email, with single-use tokens hashed at rest, a 10-minute expiry and per-route rate limits. The other is Google sign-in: the browser runs a Google OAuth popup, passes the ID token to Firebase, and the API verifies that Firebase token before it creates a session.',
        'Account linking only trusts a verified email, consuming a token is race-safe, and every secret the API reads is documented.',
      ],
      figure: { id: 'FIG 4.4', caption: 'History: every test by mode, with per-run stats.', src: '/projects/typereal/history.png', alt: 'TypeReal history table of past tests with WPM and accuracy' },
    },
    {
      title: 'A landing page that types by itself',
      body: [
        'The landing page runs three live typing demos at once. One is the solo surface. One is a 1v1 duel with a second cursor racing at 70 ms against 55 ms, with scripted mistakes at characters 18 and 52. The third is a ghost demo that maps `--tr-color-opponent` to `--tr-color-ghost`, so the rival cursor reads as your past self.',
        'The stats under each demo update in tabular figures as it backspaces through its own mistakes. The final call to action has falling characters over GSAP scroll reveals.',
      ],
      figure: { id: 'FIG 4.5', caption: 'The landing page: a self-typing demo of the surface, the duel and the ghost.', src: '/projects/typereal/landing.png', alt: 'TypeReal landing hero reading "Type fast. Type real." above a live typing demo' },
    },
    {
      title: 'Seven settings for the typing surface',
      body: [
        'A floating widget opens into a tray, and its Surface tab has seven settings: text size from 18 to 40 px (the caret re-measures instantly through a ResizeObserver), alignment, density, how many lines are visible, smooth or instant caret, difficulty, and a choice of six fonts applied live through `--tr-font-passage`.',
        'Every value is saved to localStorage, so the surface stays the way you left it without needing an account.',
      ],
      figure: { id: 'FIG 4.6', caption: 'The Surface tray: size, density, caret, alignment and font, applied live to a real passage.', src: '/projects/typereal/surface.png', alt: 'TypeReal surface customization panel with size, density, caret, alignment and font controls' },
    },
    {
      title: 'Code mode: four languages, two ways to time it',
      body: 'Code mode types real one-liners in JavaScript, Python, Rust and Go. You can run it by lines, which joins 5, 10 or 20 snippets with real newlines and shows a return symbol at the end of each line, or by time, which counts down 30, 60 or 120 seconds. The Enter key actually types the newline.',
      figure: { id: 'FIG 4.7', caption: 'Code mode: real multi-line snippets in four languages.', src: '/projects/typereal/code-mode.png', alt: 'TypeReal code mode typing a JavaScript snippet with newline glyphs' },
    },
    {
      title: 'The result screen',
      body: [
        'Finishing a run shows a result card: a large WPM number over a hand-made SVG chart of per-second samples. A solid line for WPM, a dashed line for raw speed, and red dots only on the seconds where the error count went up.',
        'If accuracy drops below 70%, the run counts as failed. The card turns red, the WPM is struck through, and a small `test failed` badge replaces the save or sign-up button. A bad run should not get a celebration.',
      ],
      figure: { id: 'FIG 4.8', caption: 'The result card and the per-second WPM chart.', src: '/projects/typereal/result.png', alt: 'TypeReal result card with a large WPM number and a WPM-over-time chart' },
    },
  ],
  conclusion: [
    'TypeReal started as a Monkeytype clone, and I learned that the clone part is easy. The real work was in the places people usually skip: keeping the input loop synchronous so a keystroke paints within a frame, counting WPM and accuracy exactly instead of estimating them, and making duels server-authoritative so a run cannot be forged.',
    'Anyone can start typing without an account. History, duels, the ghost and the theme editor unlock once you sign in.',
  ],
  figma: null,
  links: [
    { label: 'Website', href: 'https://typereal.coehemang.dev' },
  ],
};
