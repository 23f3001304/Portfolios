import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { profile } from '../data/projects.js'
import { Asterisk } from './Ornaments.jsx'

function MagneticEmail({ href, label }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 14, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 200, damping: 14, mass: 0.5 })

  function onMove(e) {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    // pull toward cursor, capped
    const dx = (e.clientX - cx) * 0.18
    const dy = (e.clientY - cy) * 0.25
    x.set(dx)
    y.set(dy)
  }
  function onLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <a
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      data-cursor="hover"
      className="group block mt-16 md:mt-24 border-t border-paper/20 pt-6 relative"
    >
      <div className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink/50 mb-4">
        Primary contact ↗
      </div>
      <motion.div
        style={{ x: sx, y: sy }}
        className="font-display italic text-[clamp(2rem,8.5vw,9.5rem)] leading-[1.02] tracking-tight text-ink group-hover:text-rust transition-colors break-words sm:break-all"
      >
        {label}
      </motion.div>
    </a>
  )
}

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative bg-paper text-ink px-6 md:px-10 py-28 md:py-40 overflow-hidden"
    >
      {/* Corner crosshairs
      <Crosshair className="absolute top-6 left-3 text-ink/30" />
      <Crosshair className="absolute top-6 right-3 text-ink/30" />
      <Crosshair className="absolute bottom-6 left-3 text-ink/30" />
      <Crosshair className="absolute bottom-6 right-3 text-ink/30" /> */}

      {/* Big outlined asterisk floating in negative space */}
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 28, ease: 'linear' }}
        className="absolute -top-10 right-6 md:right-16 text-rust pointer-events-none opacity-90 hidden md:block"
        aria-hidden
      >
        <Asterisk size={160} />
      </motion.div>

      {/* Big quote */}
      <div className="relative grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-3 text-[11px] font-mono uppercase tracking-[0.22em] text-ink/50">
          §04 / Contact
        </div>
        <div className="col-span-12 md:col-span-9">
          <h3 className="font-display text-[clamp(2.5rem,7vw,7rem)] leading-[0.96] tracking-tightest">
            Have a problem worth
            <br />
            <em className="text-rust">solving?</em> Let's talk.
          </h3>
        </div>
      </div>

      <MagneticEmail href={`mailto:${profile.email}`} label={profile.email} />

      {/* Footer grid */}
      <div className="mt-20 md:mt-28 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-12 md:gap-y-10 gap-x-6 border-t border-paper/15 pt-10 text-sm md:text-base">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50 mb-3">
            Alt
          </div>
          <a
            href={`mailto:${profile.email2}`}
            className="block leading-relaxed hover:text-rust transition-colors"
          >
            {profile.email2}
          </a>
          <div className="text-ink/60">{profile.phone}</div>
        </div>

        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50 mb-3">
            Elsewhere
          </div>
          <ul className="space-y-1.5">
            <li>
              <a
                href={profile.socials.github}
                className="hover:text-rust transition-colors"
                target="_blank"
                rel="noreferrer"
              >
                github.com/coehemang ↗
              </a>
            </li>
            <li>
              <a
                href={profile.socials.linkedin}
                className="hover:text-rust transition-colors"
                target="_blank"
                rel="noreferrer"
              >
                linkedin.com/in/coehemang ↗
              </a>
            </li>
          </ul>
        </div>

        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50 mb-3">
            Located
          </div>
          <div>Jodhpur, Rajasthan</div>
          <div className="text-ink/60">India · IST (UTC +5:30)</div>
        </div>

        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50 mb-3">
            Status
          </div>
          <div className="flex items-center gap-2">
            <span className="ticker-dot" />
            <span>Open · Summer 2026</span>
          </div>
          <div className="text-ink/60 mt-1">Internships, research, briefs.</div>
        </div>
      </div>

    </section>
  )
}
