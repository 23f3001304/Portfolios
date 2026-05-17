// Single source of truth for all projects.
// Code projects extracted from the resume. Figma projects from the user's links.
// `slug` is used for /work/:slug routes.

import { image } from "framer-motion/client"

export const projects = [
  {
    slug: 'quizzy',
    index: '01',
    title: 'Quizzy',
    kind: 'Engineering',
    role: 'Backend, Agents',
    year: '2025',
    period: 'Nov 2025 - Dec 2025',
    stack: ['FastAPI', 'Pydantic', 'Heroku', 'Docker'],
    blurb:
      'Agentic FastAPI backend with 3+ agent-tool pipelines, 50+ custom tools, and queue-based background execution. Scored 92/100 on 24 adversarial backend evaluations.',
    accent: '#A98B69',
    visual: { kind: 'github', url: 'https://github.com/coehemang' },
    links: { github: 'https://github.com/coehemang' },
  },
  {
    slug: 'animy',
    index: '02',
    title: 'ANIMY',
    kind: 'Engineering',
    role: 'Full-stack, Video',
    year: '2025',
    period: 'Feb 2025 - Aug 2025',
    stack: ['React', 'Node.js', 'Python', 'Rendering'],
    blurb:
      'Prompt-driven video generator. Three-tier system: frontend, API, render backend. 4 parallel render threads pushing 10+ videos/hour. Two real-time strategies evaluated, WebSockets cut after architectural cost analysis.',
    accent: '#A98B69',
    visual: {
      kind: 'youtube',
      videos: [
        { id: 'zYsFwM4dH2A', label: 'Intro' },
        { id: 'eylqHhzs-7Q', label: 'Generation 1' },
        { id: '3WA5Cck6mv4', label: 'Generation 2' },
      ],
    },
    links: {
      website: 'https://animy.example',
      videos: [
        'https://www.youtube.com/watch?v=zYsFwM4dH2A',
        'https://www.youtube.com/watch?v=eylqHhzs-7Q',
        'https://www.youtube.com/watch?v=3WA5Cck6mv4',
      ],
    },
  },
  {
    slug: 'build-my-own-git',
    index: '03',
    title: 'Build My Own Git',
    kind: 'Systems',
    role: 'Implementation',
    year: '2025',
    period: 'Dec 2024 - Feb 2025',
    stack: ['Node.js', 'SHA-1', 'POSIX'],
    blurb:
      'Reimplementation of Git from first principles. 6 plumbing commands (init, hash-object, write-tree, commit-tree, ls-tree, cat-file). SHA-1 content addressing, three object types, persistent .git layout.',
    accent: '#151A21',
    visual: { kind: 'github', url: 'https://github.com/coehemang' },
    links: { github: 'https://github.com/coehemang' },
  },
  {
    slug: 'stic-website',
    index: '04',
    title: 'STIC Website',
    kind: 'Design',
    role: 'Product Design',
    year: '2024',
    period: 'Figma',
    stack: ['Figma', 'Web'],
    blurb:
      'End-to-end website system: marketing, sections, components. Built in Figma with a structured page hierarchy.',
    accent: '#24342E',
    image: '/figma/STIC/Head.jpg',
    visual: { kind: 'figma' },
    links: {
      figma:
        'https://www.figma.com/design/pZahn4aJCTORKyNVwbLMk3/STIC_WEBSITE?node-id=150-2',
    },
  },
  {
    slug: 'mentor-hub',
    index: '05',
    title: 'Mentor Hub',
    kind: 'Design',
    role: 'Product Design',
    year: '2024',
    period: 'Figma',
    stack: ['Figma', 'Mentorship platform'],
    blurb: 'Mentorship platform interface. Flows, screens, and component system.',
    accent: '#A98B69',
    image: '/figma/Mentor-Hub/Head.png',
    visual: { kind: 'figma' },
    links: {
      figma:
        'https://www.figma.com/design/H0HkxwayiDiKUKMn6mvmEt/Mentor-Hub?node-id=10387-2',
    },
  },
  {
    slug: 'untitled-explorations',
    index: '06',
    title: 'Untitled Explorations',
    kind: 'Design',
    role: 'Visual Design',
    year: '2024',
    period: 'Figma',
    stack: ['Figma'],
    blurb: 'A loose set of visual explorations. Typography, layout, motion studies.',
    accent: '#151A21',
    visual: { kind: 'figma', placeholder: true },
    links: {
      figma:
        'https://www.figma.com/design/YmDeUgb2hCZzv4tqTinOTg/Untitled?node-id=0-1',
    },
  },
  {
    slug: 'spider-man',
    index: '07',
    title: 'Spider-Man',
    kind: 'Design',
    role: 'Concept',
    year: '2024',
    image: '/figma/Spider-man/Head.png',
    period: 'Figma',
    stack: ['Figma', 'Concept'],
    blurb: 'Concept design. A Spider-Man themed interface study.',
    accent: '#A98B69',
    visual: { kind: 'figma', placeholder: true },
    links: {
      figma:
        'https://www.figma.com/design/Ya9h0EYaw4uVjQngBwD6dM/Spider-man?node-id=0-1',
    },
  },
  {
    slug: 'stdlib-girish',
    index: '08',
    title: 'Stdlib Girish',
    kind: 'Design',
    role: 'Visual Design',
    year: '2024',
    period: 'Figma',
    stack: ['Figma'],
    image: '/figma/Stdlib-Girish/Head.png',
    aspect: '1.78 / 1',
    blurb: 'Visual identity / interface explorations.',
    accent: '#24342E',
    visual: { kind: 'figma', placeholder: true },
    links: {
      figma:
        'https://www.figma.com/design/XVuH6QypsEZIk4p4KemgU1/Stdlib_Girsh?node-id=0-1',
    },
  },
]

export const profile = {
  name: 'Hemang Choudhary',
  short: 'Hemang',
  handle: 'coehemang',
  role: 'Builder · Researcher · Designer',
  bio:
    'IT undergrad at MBM University, Jodhpur, simultaneously studying Data Science & AI at IIT Madras. I build backends and agentic systems, train models, and design interfaces.',
  location: 'Jodhpur, IN',
  status: 'Open to Summer 2026 internships',
  email: 'hemangc37@gmail.com',
  email2: 'coehemang@gmail.com',
  phone: '+91 8302465967',
  portrait: '/portrait.jpg',
  socials: {
    github: 'https://github.com/coehemang',
    linkedin: 'https://linkedin.com/in/coehemang',
  },
  education: [
    {
      degree: 'B.Tech, Information Technology',
      school: 'MBM University, Jodhpur',
      grade: '7.8 / 10',
      year: '2023 - Present',
    },
    {
      degree: 'B.S, Data Science & AI',
      school: 'IIT Madras',
      grade: '8.0 / 10',
      year: '2023 - Present',
    },
  ],
  experience: [
    {
      role: 'Research Intern',
      org: 'DRDO / Defence Research & Development Organisation',
      where: 'Jodhpur',
      year: 'May - Jul 2025',
      notes: [
        'Trained CycleGAN for image-to-image translation, 50 epochs/experiment on 1,000+ paired & unpaired images using CUDA-accelerated GPU.',
        'Evaluated outputs every 5 epochs via qualitative comparisons, fine-tuned parameters against artifacts and trends.',
      ],
    },
  ],
  skills: {
    Languages: ['Python', 'C', 'C++', 'Java', 'JavaScript', 'SQL', 'Kotlin'],
    Web: ['React', 'Next.js', 'Node.js', 'Flask', 'Tailwind', 'HTML / CSS / JS'],
    Data: ['SQLite', 'MySQL', 'MongoDB'],
    Systems: ['Linux', 'Git', 'POSIX', 'Docker', 'Heroku'],
    Design: ['Figma'],
  },
}
