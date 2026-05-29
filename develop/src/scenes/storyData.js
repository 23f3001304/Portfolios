/*
 * The story beats, in walk-through order. Each room has a prop (drawn in
 * storyAssets.jsx), a kicker, a headline and a short line in Hemang's voice.
 * `gait` is what the walker does once this room settles (mostly idle; the
 * walk/run cycle plays while you're scrolling between rooms).
 */
export const STORY = [
  {
    id: 'intro',
    prop: 'books',
    kicker: 'hi, I’m Hemang',
    title: 'Twenty, and doing two degrees at once.',
    line: 'A B.Tech and a parallel B.S. in Data Science. The throughline is simple: I like helping people get unstuck.',
  },
  {
    id: 'fixer',
    prop: 'laptop',
    kicker: 'the fixer',
    title: 'I’ll open the thing that wasn’t meant to be opened.',
    line: 'Reapplying thermal paste at 2am, half asleep, because the fan was loud. Out-of-box problems are the fun ones.',
  },
  {
    id: 'talker',
    prop: 'bubbles',
    kicker: 'extrovert',
    title: 'I will absolutely talk your ear off.',
    line: 'Genuinely energised by people and conversation. Put me in a room and I’ll find the interesting one.',
  },
  {
    id: 'fuel',
    prop: 'fuel',
    kicker: 'running on',
    title: 'Dark chocolate, Red Bull, and opening things.',
    line: 'Taking things apart is great. Closing them back up cleanly is, uh, a work in progress.',
  },
  {
    id: 'lazy',
    prop: 'couch',
    kicker: 'honestly though',
    title: 'I’m lazy. (Who isn’t.)',
    line: 'Efficiency is just lazy with a nicer name. Both get me to the couch faster.',
  },
  {
    id: 'rig',
    prop: 'pc',
    kicker: 'the baby',
    title: 'An RTX 5080 I love like a child.',
    line: 'Built it, babied it, talk to it. It earns the affection every single day.',
  },
  {
    id: 'unwind',
    prop: 'monitor',
    kicker: 'a perfect day',
    title: 'No parties. Forza, a Spotify queue, and the rig.',
    line: 'Give me a race line and a good playlist over a crowded room, every time.',
  },
  {
    id: 'soft',
    prop: 'tv',
    kicker: 'the soft bit',
    title: 'I cry at home dramas. Young Sheldon got me.',
    line: 'Emotional, and fine with it. The good shows hit, and I let them.',
  },
];
