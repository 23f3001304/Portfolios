export const stic = {
  id: 'PRJ-008',
  slug: 'stic',
  name: 'STIC',
  tagline: 'Brand and landing page design for the Student Tech Innovation Council, with a red-and-cream editorial system and a social media kit. Designed in Figma.',
  when: '2025',
  status: 'DESIGN',
  stack: ['Figma', 'Branding', 'Design System', 'Web Design'],
  metrics: [
    { value: '500', unit: '+', label: 'council members' },
    { value: '8',   unit: '',  label: 'landing page sections' },
    { value: '2',   unit: '',  label: 'cohorts' },
    { value: '3',   unit: '',  label: 'launch tracks' },
  ],
  sprite: '/oneko/oneko-classic.gif',
  accent: '#c0463a',
  hero: {
    light: '/projects/stic/product-tilt-light.webp',
    dark: '/projects/stic/product-tilt-dark.webp',
  },
  overview: [
    'STIC is the brand and website design for the Student Tech Innovation Council at M.B.M. University, Jodhpur. It was a reboot: a clearer identity, a warm red-on-cream palette and a confident wordmark. The goal was to make a new student council look like it had been around for years.',
    'The main piece is a long landing page laid out like an editorial spread, with large roman numerals for each section: the vision, the cohorts, the projects and the resources. Alongside it is a kit of social templates for events, announcements and milestones, so every post stays on brand.',
  ],
  sections: [
    {
      title: 'The opening screen',
      body: [
        'The page opens on one line that does the whole pitch: "Empowering you [to] become a better developer". The square and angle brackets are borrowed from code, so a tech audience gets it at a glance, and the last word lands in the brand red.',
        'Learn more and join now sit in the corners, a checkerboard pattern frames the cream background, and a member marquee runs along the bottom. It says what STIC is for before any section has to explain it.',
      ],
      figure: { id: 'FIG 8.1', caption: 'The opening screen: a code-styled headline, two calls to action and the member marquee.', src: '/projects/stic/hero.jpg', alt: 'STIC landing hero with the headline empowering you to become a better developer and learn more and join now buttons' },
    },
    {
      title: 'The landing page',
      body: [
        'A marquee across the top shows the council\'s scale: 500+ members, the next cohort and the live event. Below it, large roman numerals walk through the story: the vision, the cohorts, the gauntlet, the network, the projects, the workshops and the resources.',
        'The red-and-cream grid and the oversized section numbers give a young council the weight of an established one.',
      ],
      figure: { id: 'FIG 8.2', caption: 'The landing page: a numbered editorial grid from the vision to the resources.', src: '/projects/stic/landing.jpg', alt: 'STIC landing page with a member marquee and a numbered editorial section grid' },
    },
    {
      title: 'Insights and footer',
      body: 'Lower down, a dark band breaks up the red with quotes from the team. Then the footer does the practical work: a newsletter signup, a contact block with the council\'s email and campus address, and the STIC wordmark above the navigation. The page ends on the identity instead of trailing off.',
      figure: { id: 'FIG 8.3', caption: 'Team insights, newsletter signup and the contact footer.', src: '/projects/stic/landing-2.jpg', alt: 'STIC landing page footer with team insights, a newsletter signup and contact details' },
    },
    {
      title: 'The social media kit',
      body: 'The brand goes beyond the site into a kit of social templates: event announcements for the workshop tracks, logo lockups in every arrangement the wordmark needs, and status cards for updates, response times and seat alerts. The checkerboard and the red-on-cream palette carry through all of them, so a feed of STIC posts looks like one identity.',
      figure: { id: 'FIG 8.4', caption: 'The social kit: event cards, announcements and logo lockups.', src: '/projects/stic/assets.png', alt: 'STIC social media asset kit with event cards, announcements and logo lockups' },
    },
  ],
  conclusion: [
    'STIC was as much identity work as layout. The same red-and-cream system holds from the full landing page down to a single announcement card, and together they make a brand-new council look settled and credible.',
  ],
  figma: null,
  links: [
    { label: 'Figma', href: 'https://www.figma.com/design/pZahn4aJCTORKyNVwbLMk3/STIC_WEBSITE?node-id=215-2' },
  ],
};
