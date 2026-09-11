export const livon = {
  id: 'PRJ-014',
  slug: 'livon',
  name: 'Livon',
  tagline: 'A life tracker that keeps the whole day on your own device - food, sleep, routine, lifts, walks - with a coach that reads all of it.',
  when: 'Aug → Sep 2026',
  status: 'IN PROGRESS',
  stack: ['TypeScript', 'React', 'Tauri v2', 'Rust', 'Kotlin', 'SQLite', 'Hono', 'Node.js', 'Gemini'],
  metrics: [
    { value: '25',   unit: '', label: 'app families over one record' },
    { value: '7.1k', unit: '', label: 'tests, app and server' },
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
    'Livon holds a whole day in one place: what you ate, how you slept, the routine you meant to keep, the weights you lifted, the walk you took. A coach reads all of it and says what it sees. It runs as a desktop app and on an Android phone, with a watch tile for the one thing you log most, and it works with no network at all. The record lives on the device, and the server is somewhere it syncs to, never somewhere it has to ask.',
    'The bet is friction. Every tracker I used lost me at the logging step - a search box, a portion picker, a form per set. So most of the work went into the two seconds between deciding to log something and it being logged: foods offered before you type, a strength sheet that takes a sentence, a voice mode that drives the app instead of chatting with it.',
  ],
  sections: [
    {
      title: 'The record lives on the device',
      body: 'Every write lands first in a SQLite database running in a Web Worker, so the interface never waits on a network and never shows a spinner for something you already did. Sync is a separate job that runs behind it. The record folds into a content-addressed tree, so two devices compare hashes and exchange only what differs rather than replaying everything. The log it replays from is append-only and hardened against the ways a laptop actually dies: an entry counts as written only after an fsync, and a line torn by a power cut is detected and dropped instead of poisoning the next read.',
    },
    {
      title: 'Twenty-five apps over one record',
      figure: { id: 'FIG 14.1', caption: 'Today on a phone in five of the twenty-five families - Phosphor, Contour, Comic, Gel and TTY. The same day, drawn by five different sets of rules.', src: '/projects/livon/phone-strip.png', alt: 'Five phone screens of Livon\'s Today view side by side: an amber monospace terminal, dark cards over survey contour lines, a halftone comic page, glossy glass panels, and a tiling desktop with box rules', noInvert: true },
      body: 'A theme that only swaps colours still feels like the same app, so a family changes everything a screen is drawn with: the type and the figures, how a card is cut, the texture underneath, how things move. Riso prints in two inks out of register, Bevel is a nineties desktop with title bars and sunken wells, TTY is a tiling window manager with one blinking block. A few go further and re-lay the screen from their reference. Lantern sets the number inside a lit room, Tessera cuts the day into uniform tiles, and Telemetry reads like a strain gauge. Families share the record and the actions and nothing else. That forced one clean seam between what the day holds and how it is drawn, and it is why a new family is a folder, not a fork. The coach\'s face is the one thing every family keeps.',
    },
    {
      title: 'Widgets are the app\'s own cards',
      figure: { id: 'FIG 14.2', caption: 'Part of the default deck: the year of kept days at full width, weight and macros at half, and the small cards that share a half between two.', src: '/projects/livon/widgets-deck.png', alt: 'A deck of Livon widgets on black: a year-long streak grid, a weight history chart with a weigh-in button, macros rings, last night\'s sleep against its window, the week\'s workouts, and small cards for clean days, level, the weight goal and earned badges' },
      body: 'Today is a deck you arrange yourself, out of forty-eight cards: twenty that read the day and twenty-eight that decorate it. Every card comes in three sizes, and a small one is not a squeezed medium. It is its own composition, drawn for half a track, because a card that only gets narrower ellipses whichever line goes first. The phone\'s home-screen widgets are the same cards, not a second set. When the launcher asks for a widget, a background service lays that one card out in an offscreen web view at exactly the size the launcher gave it, waits for the card to say it is drawn, and photographs it onto a bitmap. Change the weight card in the app and the home screen changes with it, with nothing to keep in step.',
    },
    {
      title: 'Cards made of a family\'s material',
      figure: { id: 'FIG 14.3', caption: 'Decorations, each drawn only under its own family: a two-ink poster, a mission countdown, a drafting title block, a pressed specimen, a comic cover, a week of glass lozenges, thirty days as survey lines, and a nineties properties sheet.', src: '/projects/livon/widgets-decorations.png', alt: 'A grid of Livon decoration widgets, each in its own family\'s style: a risograph poster, a NASA countdown board, a blueprint title block, a herbarium specimen plate, a comic book cover, a glossy week of blue pills, a contour map of thirty days, and a Windows-style properties dialog', noInvert: true },
      body: 'Most cards are readings, and a reading belongs to the app rather than to a look, so they can be worn under any family. Decorations are the other kind. A poster printed in two inks out of register only makes sense in Riso, a countdown board only in NASA, a pressed specimen only in Herbarium. Each decoration is still fed by the record - the Riso poster prints your streak, the Blueprint title block types your weeks into a revision table - but it is only offered under the family it is made of. Put it under another family and it would look like a card from a different app. The gate is one line above the switch that mounts every card, so a decoration that is not on offer costs the deck nothing.',
    },
    {
      title: 'Food without the search box',
      figure: { id: 'FIG 14.4', caption: 'Food: 1,030 of 1,769 kcal eaten with 739 left, macros and micros as dials against the day\'s targets, and each meal broken into what was on the plate.', src: '/projects/livon/food-dark.png', alt: 'Livon Food view showing calories eaten against the target, protein, carbs and fat dials, fibre, iron, calcium and sodium dials, and two logged meals, poha and chai and dal chawal' },
      body: 'Logging a meal climbs a ladder and stops at the first rung that knows the answer. Foods you eat often come first, then an eleven-thousand-food catalogue, then a model that reads a plain description like "dal chawal and a bit of curd" and splits it into items. The catalogue is shipped as a second SQLite file beside the record, so it is searchable offline and can be replaced wholesale without a migration touching your data. Indian home food was the test set from the start, because that is what the generic databases are worst at.',
    },
    {
      title: 'Strength as a sentence',
      figure: { id: 'FIG 14.5', caption: 'The strength sheet mid-session. The field takes a sentence, the chips are the movements you actually do, and two sets of incline push-ups are staged.', src: '/projects/livon/strength-dark.png', alt: 'Livon strength sheet with a compose field, movement chips for dumbbell row, goblet squat and incline push-up, and two staged sets of incline push-ups' },
      body: 'A set is a row, a movement is a name from a fixed vocabulary, and a variation is part of the name, so an incline push-up is its own movement rather than a push-up with a note attached. That makes your history comparable to itself. Vague input goes through the same parse as food: you type what you did the way you would say it, the model proposes sets against the vocabulary, and nothing is saved until you have seen the sets. Movements it does not know become your own custom ones instead of being forced into the nearest match.',
      blocks: [
        { kind: 'code', lang: 'js', caption: 'what a sentence becomes, before you confirm it', code: [
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
      title: 'A coach that shows its work',
      figure: { id: 'FIG 14.6', caption: 'The coach: its read of the week, the numbers it read it from, and prompts that turn into actions you can undo.', src: '/projects/livon/coach-dark.png', alt: 'Livon coach view with the coach\'s face, a written read of the week, supporting stats, suggested prompts and a microphone button' },
      body: 'The coach is a language model with a narrow job and a paper trail. It cannot write to the record directly. It can only call actions from a registry, the same ones the buttons call, so everything it does lands in the log and can be undone like anything else. Its observations come from small, plain statistics computed first - streaks, trends, what slipped this week - and it is asked to explain those, not to discover them. When it says your routine held on nine days out of ten, the number came from a query, not from the model.',
    },
    {
      title: 'State machines under the motion',
      body: 'Anything in the app that changes over time - a sheet opening, a sync running, a timer counting down - is a small state machine with named phases. The animation layer reads those phases instead of guessing from props, so a transition plays because a state was entered, and it cannot fire twice or get stuck halfway. Durations come from one set of motion tokens, with a single switch at the root for reduced motion. Moving the room change onto that model took it from 829 to 746 milliseconds, and it stopped flickering on the way.',
    },
    {
      title: 'Voice that drives the app',
      body: 'The voice mode is not a chat window you talk into. It controls the app: "log two glasses of water", "move lunch to two", "I did three sets of rows". The expensive part is the model, so speech is checked first for whether it already says enough to act on. A command with a known verb and everything it needs goes straight to an action. Only something genuinely ambiguous goes to the model, and when something is missing you get a short question back rather than a guess. Speech-to-text streams over a websocket, so the checking starts before you have finished speaking.',
    },
  ],
  conclusion: [
    'Livon is the project where the architecture came from the product and not the other way round. Offline-first, the second database, the action registry and the state machines all exist because of one requirement: logging something has to be instant and has to be undoable. Everything that made that harder got redesigned until it didn\'t.',
    'What I would defend is the discipline more than any single feature. One record and many ways to draw it. One set of actions that the buttons, the coach and the voice all call. A model that only ever proposes, while plain code decides what is true.',
  ],
  figma: null,
  links: [],
};
