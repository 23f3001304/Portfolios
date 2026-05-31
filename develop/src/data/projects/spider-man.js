export const spiderMan = {
  id: 'PRJ-007',
  slug: 'spider-man',
  name: 'Spider-Man',
  tagline: 'A concept promo site for Spider-Man: Into the Spider-Verse - chromatic display type, a Marvel marquee, and glassmorphism over Miles Morales art. Designed in Figma.',
  when: '2025',
  status: 'DESIGN',
  stack: ['Figma', 'UI Design', 'Web Design', 'Glassmorphism'],
  metrics: [
    { value: '4', unit: '',  label: 'nav destinations' },
    { value: '4', unit: '',  label: 'reusable components' },
    { value: '3', unit: '',  label: 'holographic color stops' },
    { value: '1', unit: '',  label: 'shared design system' },
  ],
  sprite: '/oneko/oneko-maia.gif',
  accent: '#e23636',
  overview: [
    'Spider-Man is a concept landing site for Into the Spider-Verse, designed end to end in Figma. The brief I set myself: catch the film\'s comic-book energy without the layout turning into noise. The answer was a tight system - one loud red, a chromatic display face for the title, and clean glass panels that let the character art carry the page.',
    'The work spans a hero, a details view, and a shared asset board that pins down the marquee, the mini character card, the button, and the color tokens. Everything keys off a single palette, so the Home and Details screens read as one product rather than two posters.',
  ],
  sections: [
    {
      title: 'The hero',
      body: 'The landing page leads with the title set in a chromatic display face - a green-to-pink-to-blue split that mimics the 3D-glasses misregistration that is the film\'s signature look. A Marvel-and-Sony release badge sits above it, a Miles Morales render anchors the right, and a glass character card introduces him without crowding the art. Two calls to action, watch the trailer and book a ticket, keep the goal obvious.',
      figure: { id: 'FIG 7.1', caption: 'The landing hero - chromatic title, Miles Morales art, and the book-a-ticket call to action.', src: '/projects/spider-man/home.png', alt: 'Spider-Man Into the Spider-Verse concept landing hero with a holographic title and Miles Morales artwork' },
    },
    {
      title: 'Details and the multiverse',
      body: 'The details view trades the hero for content: a Marvel marquee runs across the top, and glassmorphism panels - blurred, semi-transparent, lightly bordered - float over a full-bleed Miles render. Each panel introduces a piece of the world, the Spider-Verse itself and the line-up of spiders, while the frosted surface keeps the text legible over a busy image.',
      figure: { id: 'FIG 7.2', caption: 'The details view - glass panels over full-bleed character art.', src: '/projects/spider-man/details.png', alt: 'Spider-Man details page with glassmorphism cards over Miles Morales artwork' },
    },
    {
      title: 'The asset board',
      body: 'Behind the screens is one asset board that keeps them consistent. It fixes the marquee, the mini character card, the button, and the body surface, and names the palette: a black button, a crimson body, and the green-pink-blue trio that drives the holographic type. Designing the system first meant the Home and Details screens could be assembled from the same parts rather than restyled one at a time.',
      figure: { id: 'FIG 7.3', caption: 'The asset board - marquee, character card, button, and the color tokens in one place.', src: '/projects/spider-man/assets.png', alt: 'Spider-Man design system board showing the marquee, character card, color palette and display type' },
    },
  ],
  conclusion: [
    'Spider-Man is a study in restraint over a loud theme: one red, one chromatic accent, and a glass surface that lets the character art do the shouting. Building the asset board before the pages is what kept a comic-book brief from turning into clutter.',
  ],
  figma: null,
  links: [
    { label: 'Figma', href: 'https://www.figma.com/design/Ya9h0EYaw4uVjQngBwD6dM/Spider-man?node-id=0-1' },
  ],
};
