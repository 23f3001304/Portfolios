export const menthub = {
  id: 'PRJ-009',
  slug: 'menthub',
  name: 'MentHub',
  tagline: 'An identity-verified Q&A and resource hub for M.B.M. University - role-aware onboarding for students and teachers, an upvoted question feed, shared Drive resources, and a campus events board. Designed in Figma.',
  when: '2025',
  status: 'DESIGN',
  stack: ['Figma', 'Product Design', 'UI Design', 'Design System'],
  metrics: [
    { value: '13', unit: '',  label: 'screens, sign-in to events' },
    { value: '2',  unit: '',  label: 'roles - student & teacher' },
    { value: '4',  unit: '',  label: 'step verified onboarding' },
    { value: '6',  unit: '',  label: 'sections across the app' },
  ],
  sprite: '/oneko/oneko-tora.gif',
  accent: '#fd5555',
  overview: [
    'MentHub - branded Mentor Hub in the product - is a community Q&A platform designed for M.B.M. University, Jodhpur: a student initiative where juniors ask, seniors and teachers answer, and the whole campus shares notes and events in one place. I designed it end to end in Figma, from a verified sign-up through the question feed to a resource shelf and an events board.',
    'It runs on two surfaces with two personalities. The onboarding is calm and trustworthy - royal blue on a soft scattered-square grid, one card at a time - because it asks for real identity: Aadhar and the Academic Bank of Credits ID for students, department and post for teachers. The app itself is warmer and busier, led by a coral wordmark and a coral call to action, so posting a question or an answer always reads as the obvious next move.',
  ],
  sections: [
    {
      title: 'The front door',
      body: 'The login screen splits down the middle: a compact form on the left - email, password, keep-me-signed-in, forgot-password - and a full-bleed photograph of the Mugneeram Bangur Memorial campus on the right, flag and all. Anchoring sign-in to the actual building quietly tells a student this is their college\'s platform, not a generic forum, before they have typed a thing. A "not registered yet? create an account" line hands first-timers straight into onboarding.',
      figure: { id: 'FIG 9.1', caption: 'The login screen - a compact form beside a photo of the M.B.M. campus.', src: '/projects/menthub/login.png', alt: 'MentHub login screen with email and password fields next to a photograph of the M.B.M. University building' },
    },
    {
      title: 'A signup built around identity',
      body: 'Creating an account opens on a single choice - Student or Teacher - and the rest of the flow adapts to it. The student form leads with identity rather than vanity fields: full name, branch, and year, then an email, an Aadhar ID, and an ABC ID (the Academic Bank of Credits number every Indian student now carries). A confirmation checkbox - "the details provided are accurate and belong to me" - sits over the Register button, setting the tone that this is a real-name campus space.',
      figure: { id: 'FIG 9.2', caption: 'The student registration form - branch, year, Aadhar ID, and ABC ID.', src: '/projects/menthub/register-student.png', alt: 'MentHub student registration form with full name, branch, year, email, Aadhar ID and ABC ID fields' },
    },
    {
      title: 'A parallel path for teachers',
      body: 'Teachers get their own form, not the student one with fields greyed out. It asks for department, position, and an official email instead of Aadhar and ABC ID - the things that actually establish a staff member - so one flow verifies two very different kinds of user without feeling like a compromise between them.',
      figure: { id: 'FIG 9.3', caption: 'The teacher registration form - department, position, and an official email.', src: '/projects/menthub/register-teacher.png', alt: 'MentHub teacher registration form with full name, department, position and official email fields' },
    },
    {
      title: 'Verify, then secure',
      body: 'Both paths converge on a one-time-password step: the OTP goes to the registered mobile (shown masked, "ending XX09"), with a 60-second resend timer and a "you adhere to the rules and regulation of the platform" agreement gate. Only once the number checks out does the final card invite a password, with a live strength meter - so the account is verified before it is created, not after.',
      figure: { id: 'FIG 9.4', caption: 'OTP verification - masked number, resend timer, and a rules agreement gate.', src: '/projects/menthub/verify.png', alt: 'MentHub OTP verification screen with a masked mobile number, a 60-second resend timer and a rules checkbox' },
    },
    {
      title: 'The home feed',
      body: 'Home is a ranked question feed with a heavy filter rail. Each row leads with its signal - upvotes, how long ago, answer count - then the question in brand blue, a two-line preview, the asker, and topic tags. The left rail filters by tag, department (CSE, EE, ECE, IT ...), academic year, and subject, with Apply and Clear, while the top bar keeps search and a coral "Add question" button in reach. Paging runs to dozens of pages, because the design assumes a feed that fills up.',
      figure: { id: 'FIG 9.5', caption: 'The home feed - upvote-ranked questions beside a department and year filter rail.', src: '/projects/menthub/home.png', alt: 'MentHub home page with a ranked question feed and a left filter rail for tags, department, academic year and subject' },
    },
    {
      title: 'Inside a question',
      body: 'Opening a question gives it room: the title, who asked and when, the upvote count, the full body, any attached media, and the related tags up top, with a clear action row - Upvote, Bookmark, Answer Question, and Report a problem. Answers stack below with their own up and down votes, a Sort by control, per-answer attachments, and a "read more" fold, so a long thread stays skimmable.',
      figure: { id: 'FIG 9.6', caption: 'A question detail - body and media up top, sortable answers with votes below.', src: '/projects/menthub/question.png', alt: 'MentHub question detail page with the question body, attached media, tags and a list of answers with vote counts' },
    },
    {
      title: 'Composing, with the build baked in',
      body: 'Asking and answering share one composer: a focused modal with a tag field, a rich-text body, media and file attachments capped at three each, and a character budget on the title. The mockup even pins its intended implementation in place of lorem - a Quill rich-text editor for the body, shadcn components for the controls - so the design hands the front-end a brief, not just a vibe.',
      figure: { id: 'FIG 9.7', caption: 'The add-a-question composer - tags, a rich-text body, and capped attachments.', src: '/projects/menthub/ask.png', alt: 'MentHub add-a-question modal with a tag field, a rich-text editor area and media and file attachment slots' },
    },
    {
      title: 'A shared resource shelf',
      body: 'Resources is where notes outlive a single thread. A short modal - title, a shareable Drive link, and tags - pins a set of notes or a question bank onto the same filterable, paginated grid the questions use. Keeping a resource to a link plus metadata is deliberate: no file hosting to police, just a curated, taggable index of what is already on Drive.',
      figure: { id: 'FIG 9.8', caption: 'The add-a-resource modal - a title, a Drive link, and tags over the resource grid.', src: '/projects/menthub/resources.png', alt: 'MentHub resources page with an add-a-resource modal asking for a title, a shareable Drive link and tags' },
    },
    {
      title: 'Campus events',
      body: 'The events board carries what a Q&A feed cannot - the annual fest, workshop weeks, results. Each event reads like a feed item but with its own date range and a Follow control in place of an answer count, so students track "Encarta, the MBM event" the same way they track a question. It is the social, time-bound half of the same community.',
      figure: { id: 'FIG 9.9', caption: 'The events board - feed-style cards with date ranges and a follow control.', src: '/projects/menthub/events.png', alt: 'MentHub events page listing campus events as feed cards with date ranges and follow buttons' },
    },
  ],
  conclusion: [
    'MentHub is a study in two moods serving one community: a careful, identity-verified blue onboarding that earns trust, and a warm coral app that spends it on participation. Designing the auth flow as its own quiet system - one card at a time on a soft grid - is what lets the busy, tag-heavy feed feel safe rather than chaotic.',
    'The whole thing is drawn to be built: real Indian student identifiers, a role-aware signup, a filterable feed with proper paging, and composer mockups that name their own Quill-and-shadcn implementation. It is a design file that reads like a spec.',
  ],
  figma: {
    id: 'FIG 9.10',
    caption: 'The onboarding flow on one board - login, account type, student details, OTP, and set-password.',
    src: '/projects/menthub/flow-auth.png',
    alt: 'MentHub onboarding flow board showing login, account-type select, student details, OTP and set-password screens laid out together',
  },
  links: [
    { label: 'Figma', href: 'https://www.figma.com/design/H0HkxwayiDiKUKMn6mvmEt/Mentor-Hub?node-id=0-1' },
  ],
};
