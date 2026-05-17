import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Asterisk, TickRail } from './Ornaments.jsx'

// Route-change curtain. A porcelain panel wipes up from the bottom, holds at
// full cover for a beat (long enough that the route swap happens behind it
// uninterrupted), then slides off the top. High-contrast against the dark
// page so the wipe is actually visible.
//
// Skipped on the very first render so it doesn't fight the loader on initial
// load. Each navigation gets a fresh key so AnimatePresence remounts.

// Slower, more deliberate timings so the wipe feels weighty and avoids
// appearing rushed. TOTAL is the overall animation length (seconds). COVER_DOWN
// and HOLD_END are normalized positions (0..1) used by the timing array so
// the wipe covers, holds, then exits.
const COVER_DOWN = 0.40   // 0.00 .. 0.40
const HOLD_END   = 0.82   // hold from 0.40 .. 0.82 (long full cover)
const TOTAL      = 2.0

// Normalised four-value insets so every browser parses them the same way.
const HIDDEN_BOTTOM = 'inset(100% 0% 0% 0%)'   // collapsed at the bottom edge
const FULL          = 'inset(0% 0% 0% 0%)'      // covers the viewport
const HIDDEN_TOP    = 'inset(0% 0% 100% 0%)'    // collapsed at the top edge

function labelFor(pathname) {
  if (pathname === '/') return '/ Index'
  if (pathname.startsWith('/work/')) return pathname
  return pathname
}

export default function PageTransition() {
  const { pathname } = useLocation()
  const [activeKey, setActiveKey] = useState(null)
  const [destPath, setDestPath] = useState(pathname)
  const firstRender = useRef(true)
  const curtainRef = useRef(null)
  const grainRef = useRef(null)
  const tlRef = useRef(null)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    setDestPath(pathname)
    setActiveKey(`${pathname}-${Date.now()}`)
    // Dispatch a global event so pages can time their reveal animations to
    // the curtain lifecycle (avoids flashing content before the wipe finishes).
    window.dispatchEvent(new CustomEvent('routeTransitionStart', { detail: { pathname } }))
    const t = setTimeout(() => {
      setActiveKey(null)
      window.dispatchEvent(new CustomEvent('routeTransitionEnd', { detail: { pathname } }))
    }, TOTAL * 1000 + 60)
    return () => clearTimeout(t)
  }, [pathname])

  // Animate the grain layer while the curtain is active.
  useEffect(() => {
    // If no curtain element or grain, nothing to animate.
    const curtain = curtainRef.current
    const grain = grainRef.current
    if (!grain || !curtain) return

    // Stop animating — keep grain static. Just ensure it has the intended
    // visible opacity/position while the curtain is present and reset when
    // the curtain is removed.
    tlRef.current?.kill?.()
    if (!activeKey) {
      gsap.set(grain, { y: 0, opacity: 0.18 })
      gsap.set(curtain, { clearProps: 'filter' })
      return
    }

    // Set static appearance while active (no timeline / animation).
    gsap.set(grain, { y: 0, opacity: 0.18 })
    gsap.set(curtain, { clearProps: 'filter' })
    return
  }, [activeKey])

  return (
    <AnimatePresence>
      {activeKey && (
        <motion.div
          key={activeKey}
          aria-hidden
          ref={curtainRef}
          className="fixed inset-0 z-[80] text-paper pointer-events-none will-change-[clip-path] h-screen grain"
          style={{ background: 'linear-gradient(135deg, var(--ink) 0%, var(--rust) 60%, var(--bone) 100%)' }}
          initial={{ clipPath: HIDDEN_BOTTOM }}
          animate={{
            clipPath: [HIDDEN_BOTTOM, FULL, FULL, HIDDEN_TOP],
            transition: {
              duration: TOTAL,
              times: [0, COVER_DOWN, HOLD_END, 1],
                // Softer cubic-bezier for a smoother, less abrupt motion.
                ease: [0.2, 0.9, 0.3, 1],
            },
          }}
        >
          {/* Hold-beat content. Opacity is sequenced to be visible only while the
              panel covers the viewport, so it doesn't flash during the wipe. */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0, 1, 1, 0, 0],
              transition: {
                duration: TOTAL,
                times: [0, COVER_DOWN - 0.02, COVER_DOWN + 0.02, HOLD_END - 0.02, HOLD_END + 0.02, 1],
              },
            }}
            className="absolute inset-0"
          >
            {/* Animated grain layer (film-like). GSAP drives small vertical pan +
              subtle flicker while the curtain is active. */}
            <div ref={grainRef} className="curtain-grain" aria-hidden />
            {/* Top frame */}
            <div className="absolute top-6 left-6 right-6 md:top-8 md:left-10 md:right-10 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.22em]">
              <span className="flex items-center gap-3">
                <span className="block w-1.5 h-1.5 rounded-full bg-rust" />
                HC / Folio '26
              </span>
              <span className="opacity-60">Routing</span>
            </div>

            {/* Center — asterisk + destination */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <span className="text-paper">
                <Asterisk size={48} spinning />
              </span>
              <div className="font-mono text-[11px] uppercase tracking-[0.28em] opacity-70">
                {labelFor(destPath)}
              </div>
            </div>

            {/* Bottom frame */}
            <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-10 md:right-10 flex items-end justify-between font-mono text-[10px] uppercase tracking-[0.22em] opacity-50">
              <span>Transition / 0.{Math.round(TOTAL * 10)}s</span>
              <TickRail className="opacity-70" />
              <span>Wipe · porcelain</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
