export const menthub = {
  id: 'PRJ-009',
  slug: 'menthub',
  name: 'MentHub',
  tagline: 'A verified Q&A and notes hub for M.B.M. University students and teachers, with a question feed, shared resources and an events board. Designed in Figma.',
  when: '2025',
  status: 'DESIGN',
  stack: ['Figma', 'Product Design', 'UI Design', 'Design System'],
  metrics: [
    { value: '13', unit: '',  label: 'screens, from sign-in to events' },
    { value: '2',  unit: '',  label: 'roles: student and teacher' },
    { value: '4',  unit: '',  label: 'steps in the verified signup' },
    { value: '6',  unit: '',  label: 'main sections in the app' },
  ],
  sprite: '/oneko/oneko-tora.gif',
  accent: '#fd5555',
  hero: {
    light: '/projects/menthub/product-tilt-light.webp',
    dark: '/projects/menthub/product-tilt-dark.webp',
  },
  overview: [
    'MentHub (called Mentor Hub inside the product) is a community Q&A platform I designed for M.B.M. University, Jodhpur. It is a student initiative where juniors ask, seniors and teachers answer, and the whole campus shares notes and events in one place. I designed it end to end in Figma, from verified signup to the question feed, a resource shelf and an events board.',
    'It has two parts with two different moods. Onboarding is calm: royal blue on a soft grid of scattered squares, one card at a time, because it asks for real identity. Students give their Aadhar and Academic Bank of Credits ID, and teachers give their department and post. The app itself is warmer and busier, with a coral wordmark and coral buttons, so posting a question or an answer always looks like the obvious next step.',
  ],
  sections: [
    {
      title: 'The login screen',
      body: [
        'The login screen is split down the middle. On the left is a compact form: email, password, keep me signed in, forgot password. On the right is a full-bleed photo of the Mugneeram Bangur Memorial campus building, flag and all.',
        'Putting the actual building next to sign-in tells a student this is their college\'s platform, not a generic forum, before they type anything. A "not registered yet? create an account" line takes first-timers straight to onboarding.',
      ],
      figure: { id: 'FIG 9.1', caption: 'The login screen: a compact form next to a photo of the M.B.M. campus.', src: '/projects/menthub/login.png', alt: 'MentHub login screen with email and password fields next to a photograph of the M.B.M. University building' },
    },
    {
      title: 'A signup built around identity',
      body: [
        'Creating an account starts with one choice, Student or Teacher, and the rest of the flow adapts to it. The student form asks for identity first: full name, branch and year, then email, Aadhar ID and ABC ID (the Academic Bank of Credits number every Indian student now has).',
        'A checkbox above the Register button, "the details provided are accurate and belong to me", sets the tone that this is a real-name campus space.',
      ],
      figure: { id: 'FIG 9.2', caption: 'The student registration form: branch, year, Aadhar ID and ABC ID.', src: '/projects/menthub/register-student.png', alt: 'MentHub student registration form with full name, branch, year, email, Aadhar ID and ABC ID fields' },
    },
    {
      title: 'A separate path for teachers',
      body: 'Teachers get their own form, not the student form with fields greyed out. It asks for department, position and an official email instead of Aadhar and ABC ID, because those are what identify a staff member. So one flow verifies two very different kinds of user without feeling like a compromise between them.',
      figure: { id: 'FIG 9.3', caption: 'The teacher registration form: department, position and an official email.', src: '/projects/menthub/register-teacher.png', alt: 'MentHub teacher registration form with full name, department, position and official email fields' },
    },
    {
      title: 'Verify first, then set a password',
      body: [
        'Both paths lead to an OTP step. The code goes to the registered mobile number (shown masked, "ending XX09"), with a 60-second resend timer and a checkbox to agree to the platform\'s rules.',
        'Only after the number is verified does the last card ask for a password, with a live strength meter. So the account is verified before it is created, not after.',
      ],
      figure: { id: 'FIG 9.4', caption: 'OTP verification: a masked number, a resend timer and a rules agreement.', src: '/projects/menthub/verify.png', alt: 'MentHub OTP verification screen with a masked mobile number, a 60-second resend timer and a rules checkbox' },
    },
    {
      title: 'The home feed',
      body: [
        'Home is a ranked question feed with a filter rail. Each row starts with its signals (upvotes, how long ago, answer count), then the question in brand blue, a two-line preview, who asked, and topic tags.',
        'The left rail filters by tag, department (CSE, EE, ECE, IT and so on), academic year and subject, with Apply and Clear. The top bar keeps search and a coral "Add question" button in reach. Pagination runs to dozens of pages, because the design expects the feed to fill up.',
      ],
      figure: { id: 'FIG 9.5', caption: 'The home feed: upvote-ranked questions next to a department and year filter rail.', src: '/projects/menthub/home.png', alt: 'MentHub home page with a ranked question feed and a left filter rail for tags, department, academic year and subject' },
    },
    {
      title: 'Inside a question',
      body: [
        'Opening a question gives it room: the title, who asked and when, the upvote count, the full body, any attached media and its tags. An action row has Upvote, Bookmark, Answer Question and Report a problem.',
        'Answers stack below with their own up and down votes, a Sort by control, attachments and a "read more" fold, so a long thread stays easy to skim.',
      ],
      figure: { id: 'FIG 9.6', caption: 'A question page: body and media at the top, sortable answers with votes below.', src: '/projects/menthub/question.png', alt: 'MentHub question detail page with the question body, attached media, tags and a list of answers with vote counts' },
    },
    {
      title: 'One composer for questions and answers',
      body: [
        'Asking and answering use the same composer: a focused modal with a tag field, a rich-text body, media and file attachments (three of each at most) and a character limit on the title.',
        'Instead of lorem ipsum, the mockup notes how it should be built: a Quill editor for the body and shadcn components for the controls. So the design hands the front-end developer a clear brief.',
      ],
      figure: { id: 'FIG 9.7', caption: 'The add-a-question composer: tags, a rich-text body and limited attachments.', src: '/projects/menthub/ask.png', alt: 'MentHub add-a-question modal with a tag field, a rich-text editor area and media and file attachment slots' },
    },
    {
      title: 'A shared resource shelf',
      body: [
        'Resources is where notes live beyond a single thread. A short modal (a title, a shareable Drive link and tags) adds a set of notes or a question bank to the same filterable, paginated grid that questions use.',
        'Keeping a resource to a link plus tags was on purpose. There is no file hosting to moderate, just a searchable index of what is already on Drive.',
      ],
      figure: { id: 'FIG 9.8', caption: 'The add-a-resource modal: a title, a Drive link and tags, over the resource grid.', src: '/projects/menthub/resources.png', alt: 'MentHub resources page with an add-a-resource modal asking for a title, a shareable Drive link and tags' },
    },
    {
      title: 'Campus events',
      body: 'The events board covers what a Q&A feed cannot: the annual fest, workshop weeks, results. Each event looks like a feed item, but with a date range and a Follow button instead of an answer count. So students follow "Encarta, the MBM event" the same way they follow a question.',
      figure: { id: 'FIG 9.9', caption: 'The events board: feed-style cards with date ranges and a follow button.', src: '/projects/menthub/events.png', alt: 'MentHub events page listing campus events as feed cards with date ranges and follow buttons' },
    },
  ],
  conclusion: [
    'MentHub is two moods serving one community: a careful, verified blue onboarding that builds trust, and a warm coral app that turns that trust into participation. Designing signup as its own quiet system is what lets the busy, tag-heavy feed feel safe instead of chaotic.',
    'I also drew it to be built: real Indian student IDs, role-based signup, a filterable feed with real pagination, and composer mockups that name their Quill and shadcn implementation. The Figma file works as a spec.',
  ],
  figma: {
    id: 'FIG 9.10',
    caption: 'The onboarding flow on one board: login, account type, student details, OTP and set password.',
    src: '/projects/menthub/flow-auth.png',
    alt: 'MentHub onboarding flow board showing login, account-type select, student details, OTP and set-password screens laid out together',
  },
  links: [
    { label: 'Figma', href: 'https://www.figma.com/design/H0HkxwayiDiKUKMn6mvmEt/Mentor-Hub?node-id=0-1' },
  ],
};
