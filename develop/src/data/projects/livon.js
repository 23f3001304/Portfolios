export const livon = {
  id: 'PRJ-014',
  slug: 'livon',
  name: 'Livon',
  tagline: 'A life tracker for food, sleep, routine, lifts and walks that keeps everything on your device, with a coach that reads all of it.',
  when: 'Aug → Sep 2026',
  status: 'IN PROGRESS',
  stack: ['TypeScript', 'React', 'Tauri v2', 'Rust', 'Kotlin', 'SQLite', 'Hono', 'Node.js', 'Gemini'],
  metrics: [
    { value: '25',   unit: '', label: 'visual families, one record' },
    { value: '7.1k', unit: '', label: 'tests across app and server' },
    { value: '11k',  unit: '', label: 'foods in the offline catalogue' },
    { value: '0',    unit: '', label: 'servers needed to log a day' },
  ],
  sprite: '/oneko/oneko-classic.gif',
  accent: '#84cc16',
  // The default family is dark, so its screenshots invert to read as a light
  // UI in light mode. The hero is exempt: Livon has a real light feel, and
  // product-shots photographs that one for the light theme.
  invertShotsInLight: true,
  hero: {
    light: '/projects/livon/product-tilt-light.webp',
    dark: '/projects/livon/product-tilt-dark.webp',
  },
  heroAlt: 'Livon running as a desktop app, showing Today: calories left, the routine block due now, and the rest of the day',
  overview: [
    'Livon keeps a whole day in one place: what you ate, how you slept, the routine you planned, the weights you lifted and the walk you took. A coach reads all of it and tells you what it sees. It runs on desktop and on Android, has a watch tile for the thing you log most, and works with no network at all. The data lives on your device. The server is only somewhere it syncs to.',
    'I started it because every tracker I tried lost me at the logging step. A search box, a portion picker, a form for every set. So most of my time went into making logging take two seconds: foods suggested before you type, a strength sheet that accepts a sentence, and a voice mode that controls the app instead of chatting with you.',
  ],
  sections: [
    {
      title: 'Everything is saved on the device first',
      body: [
        'Every write goes first into a SQLite database running in a Web Worker. So the interface never waits on the network and never shows a spinner for something you already did. Sync is a separate job that runs in the background.',
        'The record is folded into a content-addressed tree. When two devices sync, they compare hashes and exchange only what is different, instead of replaying everything.',
        'The log it rebuilds from is append-only, and I hardened it against the ways a laptop actually dies. An entry counts as written only after an fsync, and if a power cut tears a line halfway, that line is detected and dropped instead of breaking the next read.',
      ],
    },
    {
      title: 'One record, twenty-five families',
      figure: { id: 'FIG 14.1', caption: 'Today on a phone in five of the twenty-five families: Phosphor, Contour, Comic, Gel and TTY. Same day, five different sets of rules.', src: '/projects/livon/phone-strip.png', alt: 'Five phone screens of Livon\'s Today view side by side: an amber monospace terminal, dark cards over survey contour lines, a halftone comic page, glossy glass panels, and a tiling desktop with box rules', noInvert: true },
      body: [
        'A theme that only swaps colours still feels like the same app. So in Livon a family changes everything a screen is drawn with: the type, the numbers, how a card is cut, the texture underneath and how things move.',
        'Some examples. Riso prints in two inks slightly out of register, Bevel is a nineties desktop with title bars and sunken wells, and TTY is a tiling window manager with one blinking block. A few go further and re-lay the whole screen: Lantern puts the number inside a lit room, Tessera cuts the day into tiles, and Telemetry reads like a strain gauge.',
        'Families share the record and the actions and nothing else. That forced a clean line between what the day holds and how it is drawn, which is why adding a family means adding a folder, not forking the app. The only thing every family keeps is the coach\'s face.',
      ],
    },
    {
      title: 'Home-screen widgets are the app\'s own cards',
      figure: { id: 'FIG 14.2', caption: 'Part of the default deck: the year of kept days at full width, weight and macros at half width, and small cards sharing a half between two.', src: '/projects/livon/widgets-deck.png', alt: 'A deck of Livon widgets on black: a year-long streak grid, a weight history chart with a weigh-in button, macros rings, last night\'s sleep against its window, the week\'s workouts, and small cards for clean days, level, the weight goal and earned badges' },
      body: [
        'Today is a deck you arrange yourself from forty-eight cards: twenty that show data from your day and twenty-eight that are decoration. Every card comes in three sizes. The small size is drawn separately for half the width instead of being a squeezed medium card, because a card that only gets narrower ends up cutting off whichever line overflows first.',
        'The phone\'s home-screen widgets are these same cards. When the launcher asks for a widget, a background service renders that card in an offscreen web view at exactly the size the launcher gave, waits for the card to report that it is drawn, and captures it as a bitmap. So when I change the weight card in the app, the home screen changes with it, and there is no second version to keep in sync.',
      ],
    },
    {
      title: 'Decorations that belong to one family',
      figure: { id: 'FIG 14.3', caption: 'Decorations, each available only under its own family: a two-ink poster, a mission countdown, a drafting title block, a pressed specimen, a comic cover, a week of glass lozenges, thirty days as survey lines and a nineties properties sheet.', src: '/projects/livon/widgets-decorations.png', alt: 'A grid of Livon decoration widgets, each in its own family\'s style: a risograph poster, a NASA countdown board, a blueprint title block, a herbarium specimen plate, a comic book cover, a glossy week of blue pills, a contour map of thirty days, and a Windows-style properties dialog', noInvert: true },
      body: [
        'Most cards are readings, like weight or sleep. A reading belongs to the app, not to a look, so it works under any family. Decorations are different. A two-ink poster only makes sense in Riso, a countdown board only in NASA, and a pressed specimen only in Herbarium.',
        'Decorations still use your data. The Riso poster prints your streak, and the Blueprint title block writes your weeks into a revision table. But each one is only offered under its own family, because anywhere else it would look like a card from a different app. The check is one line above the switch that mounts every card, so a decoration that is not available costs the deck nothing.',
      ],
    },
    {
      title: 'Logging food without a search box',
      figure: { id: 'FIG 14.4', caption: 'Food: 1,030 of 1,769 kcal eaten with 739 left, macros and micros as dials against the day\'s targets, and each meal broken into what was on the plate.', src: '/projects/livon/food-dark.png', alt: 'Livon Food view showing calories eaten against the target, protein, carbs and fat dials, fibre, iron, calcium and sodium dials, and two logged meals, poha and chai and dal chawal' },
      body: [
        'Logging a meal goes down a ladder and stops at the first step that knows the answer. First the foods you eat often, then an eleven-thousand-food catalogue, and last a model that reads a plain description like "dal chawal and a bit of curd" and splits it into items.',
        'The catalogue ships as a second SQLite file next to your record. That makes it searchable offline, and I can replace it completely without a migration touching your data. Indian home food was my test set from day one, because that is where generic food databases do worst.',
      ],
    },
    {
      title: 'Strength training as a sentence',
      figure: { id: 'FIG 14.5', caption: 'The strength sheet mid-session. The field takes a sentence, the chips are the movements you usually do, and two sets of incline push-ups are staged.', src: '/projects/livon/strength-dark.png', alt: 'Livon strength sheet with a compose field, movement chips for dumbbell row, goblet squat and incline push-up, and two staged sets of incline push-ups' },
      body: [
        'A set is a row, a movement is a name from a fixed list, and a variation is part of the name. So an incline push-up is its own movement, not a push-up with a note attached. That way your history can be compared with itself.',
        'Typing a workout uses the same parse as food. You write what you did the way you would say it, the model proposes sets from the movement list, and nothing is saved until you have seen them. A movement it does not know becomes your own custom movement instead of being forced into the nearest match.',
      ],
      blocks: [
        { kind: 'code', lang: 'js', caption: 'what a sentence becomes before you confirm it', code: [
          '"3x10 incline push-ups, then goblet squats 16kg 3x8"',
          '',
          'incline.push_up   10 · 10 · 10',
          'goblet_squat       8 ·  8 ·  8   @ 16 kg',
          '',
          '// one row per set in workout_sets; the movement is a key,',
          '// so last month\'s incline push-ups line up with today\'s.',
        ] },
      ],
    },
    {
      title: 'A coach that shows where its numbers come from',
      figure: { id: 'FIG 14.6', caption: 'The coach: its read of the week, the numbers behind it, and prompts that turn into actions you can undo.', src: '/projects/livon/coach-dark.png', alt: 'Livon coach view with the coach\'s face, a written read of the week, supporting stats, suggested prompts and a microphone button' },
      body: [
        'The coach is a language model with a narrow job. It cannot write to the record directly. It can only call actions from a registry, the same actions the buttons call, so everything it does goes into the log and can be undone like anything else.',
        'Its observations start from small, plain statistics that are computed first: streaks, trends, what slipped this week. The model is asked to explain those, not to discover them. So when it says your routine held on nine days out of ten, that number came from a query, not from the model.',
      ],
    },
    {
      title: 'State machines behind the animations',
      body: [
        'Anything in the app that changes over time, like a sheet opening, a sync running or a timer counting down, is a small state machine with named phases. The animation layer reads those phases instead of guessing from props. So a transition plays because a state was entered, and it cannot fire twice or get stuck halfway.',
        'All durations come from one set of motion tokens, with a single switch at the root for reduced motion. Moving the room change onto this model took it from 829 to 746 milliseconds and fixed its flicker along the way.',
      ],
    },
    {
      title: 'Voice that controls the app',
      body: [
        'The voice mode is not a chat window you talk into. It controls the app: "log two glasses of water", "move lunch to two", "I did three sets of rows".',
        'The model is the expensive part, so speech is checked first to see if it already says enough to act on. A command with a known verb and everything it needs goes straight to an action. Only something ambiguous goes to the model, and if something is missing you get a short question back instead of a guess. Speech-to-text streams over a websocket, so this checking starts before you finish speaking.',
      ],
    },
  ],
  conclusion: [
    'The main thing Livon taught me is to let the product decide the architecture. Offline-first storage, the second database, the action registry and the state machines all exist because of one requirement: logging has to be instant, and it has to be undoable. Anything that made that harder got redesigned.',
    'One rule I kept the whole way through: the model only ever proposes, and plain code decides what is true. The buttons, the coach and the voice all call the same set of actions.',
  ],
  figma: null,
  links: [],
};
