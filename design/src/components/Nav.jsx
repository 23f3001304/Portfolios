import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { profile } from '../data/projects.js'
import {  } from './Ornaments.jsx'

function useClock() {
  const [time, setTime] = useState(() => formatJodhpur(new Date()))
  useEffect(() => {
    const id = setInterval(() => setTime(formatJodhpur(new Date())), 1000 * 30)
    return () => clearInterval(id)
  }, [])
  return time
}
function formatJodhpur(d) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(d)
}

const links = [
  { num: '01', label: 'Selected Work', href: '#work' },
  { num: '02', label: 'About', href: '#about' },
  { num: '03', label: 'Contact', href: '#contact' },
  { num: '04', label: 'GitHub', href: profile.socials.github, external: true },
]

const overlay = {
  closed: { clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.55, ease: [0.86, 0, 0.07, 1] } },
  open:   { clipPath: 'inset(0 0 0% 0)',   transition: { duration: 0.65, ease: [0.86, 0, 0.07, 1] } },
}

const linkLine = {
  closed: { y: '110%', opacity: 0 },
  open: (i) => ({
    y: 0,
    opacity: 1,
    transition: { delay: 0.18 + i * 0.06, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function Nav() {
  const time = useClock()
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(null)
  const triggerRef = useRef(null)

  // Close on Escape, restore focus to trigger
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape' && open) {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  // Lock scroll while overlay is open
  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
    return () => { document.documentElement.style.overflow = '' }
  }, [open])

  function handleLinkClick(href, external) {
    setOpen(false)
    if (external) return
    setTimeout(() => {
      const target = document.querySelector(href)
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 250)
  }

  return (
    <>
      {/* Corner mark + trigger only. Two anchors. No clutter. */}
      <header className="fixed top-0 left-0 right-0 z-40 px-4 md:px-8 py-4 pointer-events-none">
        <div className="flex items-center justify-between rounded-full border border-ink/10 bg-bone/75 px-4 md:px-5 py-3 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl">
        <Link
            to="/"
            className="pointer-events-auto font-mono text-[11px] uppercase tracking-[0.2em] hover:opacity-70 transition-opacity"
          >
            HC <span className="opacity-50">/ '26</span>
          </Link>
          <button
            ref={triggerRef}
            onClick={() => setOpen(true)}
            aria-controls="primary-menu"
            aria-expanded={open}
            className="pointer-events-auto group flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink/85 hover:text-ink transition-colors"
          >
            <span className="hidden sm:inline opacity-60 group-hover:opacity-100 transition-opacity">
              JDH · {time}
            </span>
            <span className="relative flex items-center gap-2 rounded-full border border-ink/12 bg-paper/85 px-3 py-1 text-ink shadow-[0_6px_16px_-12px_rgba(0,0,0,0.85)]">
              <span>Index</span>
              <span className="block w-3 h-px bg-current" />
            </span>
          </button>
        </div>
      </header>

      {/* Immersive overlay menu */}
      <AnimatePresence>
        {open && (
          <motion.nav
            id="primary-menu"
            variants={overlay}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 z-50 bg-paper text-ink grain"
          >
            {/* Close + brand row */}
            <div className="px-6 md:px-10 py-6 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em]">
              <span>{profile.short || profile.name} <span className="opacity-50">/ Index</span></span>
              <button
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 hover:text-rust transition-colors"
                aria-label="Close menu"
              >
                <span>Close</span>
                <span aria-hidden className="block w-4 h-px bg-current rotate-45 absolute" />
                <span aria-hidden className="block w-4 h-px bg-current relative">
                  <span className="absolute inset-0 rotate-45 bg-current" />
                  <span className="absolute inset-0 -rotate-45 bg-current" />
                </span>
              </button>
            </div>

            <div className="grid grid-cols-12 gap-6 px-6 md:px-10 pt-12 md:pt-20 h-[calc(100%-72px)]">
              {/* Left: link list */}
              <ul className="col-span-12 md:col-span-7 lg:col-span-8 self-start">
                {links.map((l, i) => (
                  <li
                    key={l.label}
                    className="overflow-hidden border-b border-paper/15"
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <motion.div custom={i} variants={linkLine} initial="closed" animate="open" exit="closed">
                      {l.external ? (
                        <a
                          href={l.href}
                          target="_blank"
                          rel="noreferrer"
                          className="group flex items-baseline gap-6 py-4 md:py-6 transition-colors hover:text-rust"
                        >
                          <span className="font-mono text-xs opacity-50 tabular-nums w-10">{l.num}</span>
                          <span className="font-display italic text-[clamp(2.75rem,9vw,8rem)] leading-[0.95] tracking-tight">
                            {l.label}
                          </span>
                          <span className="ml-auto font-mono text-[11px] uppercase tracking-[0.18em] opacity-50 group-hover:opacity-100 transition-opacity">
                            ↗ External
                          </span>
                        </a>
                      ) : (
                        <button
                          onClick={() => handleLinkClick(l.href, l.external)}
                          className="group w-full text-left flex items-baseline gap-6 py-4 md:py-6 transition-colors hover:text-rust"
                        >
                          <span className="font-mono text-xs opacity-50 tabular-nums w-10">{l.num}</span>
                          <span className="font-display italic text-[clamp(2.75rem,9vw,8rem)] leading-[0.95] tracking-tight">
                            {l.label}
                          </span>
                        </button>
                      )}
                    </motion.div>
                  </li>
                ))}
              </ul>

              {/* Right: meta panel that morphs on hover */}
              <aside className="hidden md:flex flex-col justify-between col-span-5 lg:col-span-4 border-l border-paper/15 pl-8 pb-12">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] opacity-50 mb-3">
                    Currently
                  </div>
                  <p className="font-display italic text-2xl leading-snug">
                    {hovered === null
                      ? 'Shipping Quizzy. Reviewing CycleGAN runs from DRDO.'
                      : links[hovered].label === 'Selected Work'
                      ? '8 works. 3 shipped, 5 drawn.'
                      : links[hovered].label === 'About'
                      ? 'Two degrees in parallel. MBM Jodhpur and IIT Madras.'
                      : links[hovered].label === 'Contact'
                      ? 'Open to Summer 2026 internships and brief commissions.'
                      : 'Source. Builds, drafts, and the occasional broken thing.'}
                  </p>
                </div>

                <div className="space-y-4 font-mono text-[11px] uppercase tracking-[0.18em]">
                  <div>
                    <div className="opacity-50">Email</div>
                    <a href={`mailto:${profile.email}`} className="hover:text-rust transition-colors">
                      {profile.email}
                    </a>
                  </div>
                  <div>
                    <div className="opacity-50">Located</div>
                    <div>Jodhpur, IN</div>
                  </div>
                  <div>
                    <div className="opacity-50">Status</div>
                    <div className="flex items-center gap-2">
                      <span className="ticker-dot" />
                      <span>Open · Summer 2026</span>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}
