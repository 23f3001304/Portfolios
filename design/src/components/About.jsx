import { motion } from 'framer-motion'
import { profile } from '../data/projects.js'
import { Bracket, Divider, Plus } from './Ornaments.jsx'

export default function About() {
  return (
    <section id="about" className="relative px-6 md:px-10 py-28 md:py-40 bg-bone">
      {/* Corner crosshairs */}
      {/* <Crosshair className="absolute top-6 left-3 text-ink/30" />
      <Crosshair className="absolute top-6 right-3 text-ink/30" />
      <Crosshair className="absolute bottom-6 left-3 text-ink/30" />
      <Crosshair className="absolute bottom-6 right-3 text-ink/30" /> */}

      <div className="grid grid-cols-12 gap-6 mb-16 md:mb-24">
        <div className="col-span-12 md:col-span-3 flex items-start gap-2 text-[11px] font-mono uppercase tracking-[0.22em] text-ink/55">
          <span className="text-ink/60">
            <Bracket side="left" />
          </span>
          <span>§03 / About</span>
          <span className="text-ink/60">
            <Bracket side="right" />
          </span>
        </div>
        <div className="col-span-12 md:col-span-9">
          <p className="font-display text-[clamp(1.45rem,6vw,4rem)] leading-[1.12] tracking-tight">
            I'm interested in the seam between <em className="text-rust">systems</em> and{' '}
            <em className="text-rust">stories</em>: how an agent decomposes a problem, why
            a render pipeline blocks at thread N+1, where a CycleGAN starts to hallucinate.
            I write code that respects the machine and interfaces that respect the reader.
          </p>
        </div>
      </div>

      {/* Education + Experience grid */}
      <div className="grid grid-cols-12 gap-6 mt-16 md:mt-24 border-t border-ink/15 pt-10">
        <div className="col-span-12 md:col-span-2 text-[11px] font-mono uppercase tracking-[0.22em] text-ink/50">
          Education
        </div>
        <div className="col-span-12 md:col-span-10 space-y-6">
          {profile.education.map((e, i) => (
            <motion.div
              key={e.degree}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              className="grid grid-cols-12 gap-3 md:gap-4 items-start md:items-baseline pb-6 border-b border-ink/10"
            >
              <div className="col-span-12 md:col-span-7 font-display text-[clamp(1.6rem,6.5vw,2.2rem)] md:text-4xl leading-[1.02] md:leading-tight tracking-tight">
                {e.degree}
              </div>
              <div className="col-span-12 md:col-span-5 grid grid-cols-2 gap-x-4 gap-y-2 md:grid-cols-5 md:items-baseline">
                <div className="col-span-2 md:col-span-3 font-mono text-xs md:text-sm uppercase tracking-[0.14em] text-ink/70">
                  {e.school}
                </div>
                <div className="col-span-1 md:col-span-1 font-mono text-xs md:text-sm tabular-nums text-ink/70">
                  {e.grade}
                </div>
                <div className="col-span-1 md:col-span-1 font-mono text-xs tabular-nums text-right text-ink/60 md:text-left md:text-right">
                  {e.year}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="text-ink/60 my-12">
        <Divider />
      </div>
      <div className="grid grid-cols-12 gap-6 border-t border-ink/15 pt-10">
        <div className="col-span-12 md:col-span-2 text-[11px] font-mono uppercase tracking-[0.22em] text-ink/50">
          Experience
        </div>
        <div className="col-span-12 md:col-span-10 space-y-8">
          {profile.experience.map((x) => (
            <div key={x.role} className="grid grid-cols-12 gap-4 pb-6 border-b border-ink/10">
              <div className="col-span-12 md:col-span-8">
                <div className="font-display text-[clamp(1.6rem,6.5vw,2.2rem)] md:text-4xl leading-[1.05] md:leading-tight tracking-tight">
                  {x.role} <span className="text-ink/40">/</span>{' '}
                  <em className="text-rust">{x.org.split('/')[0].trim()}</em>
                </div>
                <ul className="mt-4 space-y-2 max-w-2xl text-ink/80 leading-relaxed">
                  {x.notes.map((n) => (
                    <li key={n} className="flex gap-3">
                      <span className="mt-2 w-2 h-px bg-rust shrink-0" />
                      <span>{n}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-span-12 md:col-span-4 md:text-right font-mono text-xs uppercase tracking-[0.16em] text-ink/60">
                <div className="flex items-center h-full justify-between md:flex-col md:items-end">
                  <div className='w-auto' >{x.year}</div>
                  <div className="md:mt-1  md:text-right">{x.where}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="text-ink/60 my-12">
        <Divider />
      </div>
      <div className="grid grid-cols-12 gap-6 border-t border-ink/15 pt-10">
        <div className="col-span-12 md:col-span-2 text-[11px] font-mono uppercase tracking-[0.22em] text-ink/50">
          Stack
        </div>
        <div className="col-span-12 md:col-span-10 space-y-4">
          {Object.entries(profile.skills).map(([cat, items]) => (
            <div
              key={cat}
              className="grid grid-cols-12 gap-4 items-start md:items-baseline border-b border-ink/10 pb-3"
            >
                <div className="col-span-12 md:col-span-2 font-mono text-xs uppercase tracking-[0.14em] text-ink/60">
                {cat}
              </div>
                <div className="col-span-12 md:col-span-10 flex flex-wrap gap-x-3 gap-y-1 font-display text-lg md:text-2xl leading-tight">
                {items.map((it, i) => (
                  <span key={it}>
                    {it}
                    {i < items.length - 1 && (
                      <span className="text-ink/30 ml-4" aria-hidden>
                        /
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
