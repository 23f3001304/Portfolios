import { useState } from 'react'
import { Asterisk, Plus } from './Ornaments.jsx'

const items = [
  'FastAPI',
  'React',
  'CycleGAN',
  'CUDA',
  'Pydantic',
  'Node.js',
  'Next.js',
  'Python',
  'C++',
  'Linux',
  'Docker',
  'Figma',
  'POSIX',
  'SHA-1',
  'MongoDB',
  'Systems',
  'Tailwind',
  'Heroku',
]

export default function Marquee() {
  const [paused, setPaused] = useState(false)
  return (
    <section
      aria-hidden
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative border-y border-ink/15 bg-paper py-5 md:py-7 overflow-hidden"
    >
      {/* corner pluses */}
      <span className="absolute top-1.5 left-2 text-ink/40">
        <Plus size={10} />
      </span>
      <span className="absolute top-1.5 right-2 text-ink/40">
        <Plus size={10} />
      </span>
      <span className="absolute bottom-1.5 left-2 text-ink/40">
        <Plus size={10} />
      </span>
      <span className="absolute bottom-1.5 right-2 text-ink/40">
        <Plus size={10} />
      </span>

      <div
        className="flex marquee-track whitespace-nowrap"
        style={{ animationPlayState: paused ? 'paused' : 'running' }}
      >
        {[...items, ...items].map((it, i) => (
          <span
            key={i}
            className="flex items-center gap-7 mx-7 font-display text-3xl md:text-6xl leading-none tracking-tight"
          >
            {it}
            <span className={i % 2 === 0 ? 'text-rust' : 'text-ink/50'} aria-hidden>
              <Asterisk size={i % 2 === 0 ? 22 : 16} />
            </span>
          </span>
        ))}
      </div>
    </section>
  )
}
