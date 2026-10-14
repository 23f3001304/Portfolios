export const spiderMan = {
  id: 'PRJ-007',
  slug: 'spider-man',
  name: 'Spider-Man',
  tagline: 'A concept promo site for Spider-Man: Into the Spider-Verse, with chromatic title type and glass panels over Miles Morales art. Designed in Figma.',
  when: '2025',
  status: 'DESIGN',
  stack: ['Figma', 'UI Design', 'Web Design', 'Glassmorphism'],
  metrics: [
    { value: '2', unit: '',  label: 'screens, Home and Details' },
    { value: '4', unit: '',  label: 'reusable components' },
    { value: '3', unit: '',  label: 'colours in the chromatic title' },
    { value: '1', unit: '',  label: 'asset board both screens use' },
  ],
  sprite: '/oneko/oneko-maia.gif',
  accent: '#e23636',
  hero: {
    light: '/projects/spider-man/product-tilt-light.webp',
    dark: '/projects/spider-man/product-tilt-dark.webp',
  },
  overview: [
    'This is a concept landing site for Into the Spider-Verse that I designed end to end in Figma. The brief I gave myself: catch the film\'s comic-book energy without the page turning into noise.',
    'So I kept the system tight: one loud red, a chromatic display face for the title, and clean glass panels that let the character art carry the page. There is a hero, a details view, and one asset board that pins down the marquee, the character card, the button and the colours. Both screens are built from that board, so they read as one product and not two separate posters.',
  ],
  sections: [
    {
      title: 'The hero',
      body: [
        'The title is set in a chromatic display face, split into green, pink and blue to copy the 3D-glasses misregistration that is the film\'s signature look. A Marvel and Sony release badge sits above it, a Miles Morales render anchors the right side, and a glass character card introduces him without crowding the art.',
        'There are only two calls to action, watch the trailer and book a ticket, so the goal of the page is obvious.',
      ],
      figure: { id: 'FIG 7.1', caption: 'The landing hero: chromatic title, Miles Morales art and the book-a-ticket button.', src: '/projects/spider-man/home.png', alt: 'Spider-Man Into the Spider-Verse concept landing hero with a holographic title and Miles Morales artwork' },
    },
    {
      title: 'Details and the multiverse',
      body: 'The details view swaps the hero for content. A Marvel marquee runs across the top, and glass panels (blurred, semi-transparent, with a light border) float over a full-bleed Miles render. Each panel introduces part of the world, like the Spider-Verse itself and the line-up of spiders. The frosted surface keeps the text readable over a busy image.',
      figure: { id: 'FIG 7.2', caption: 'The details view: glass panels over full-bleed character art.', src: '/projects/spider-man/details.png', alt: 'Spider-Man details page with glassmorphism cards over Miles Morales artwork' },
    },
    {
      title: 'The asset board',
      body: [
        'Behind both screens is one asset board. It fixes the marquee, the mini character card, the button and the body surface, and it names the palette: a black button, a crimson body, and the green, pink and blue trio for the title.',
        'I designed this board before the pages. That meant Home and Details could be put together from the same parts instead of being styled one at a time.',
      ],
      figure: { id: 'FIG 7.3', caption: 'The asset board: marquee, character card, button and colours in one place.', src: '/projects/spider-man/assets.png', alt: 'Spider-Man design system board showing the marquee, character card, color palette and display type' },
    },
  ],
  conclusion: [
    'The lesson here was restraint. The theme is loud, so the system had to stay quiet: one red, one chromatic accent, and a glass surface that keeps the focus on the art. Making the asset board first is what stopped it from turning into clutter.',
  ],
  figma: null,
  links: [
    { label: 'Figma', href: 'https://www.figma.com/design/Ya9h0EYaw4uVjQngBwD6dM/Spider-man?node-id=0-1' },
  ],
};
