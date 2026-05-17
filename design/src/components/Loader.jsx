import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { getLenis } from '../hooks/lenisStore.js'

// Compass loader.
//
// SVG composition: a muted accent ring draws clockwise from 12, an outer tick
// frame rotates beneath it, and a mono glyph-scramble inside resolves into a
// target string as progress climbs. Everything is geometric / typographic - no
// decorative widgets. Slides up to reveal the page.

const TARGET = 'FOLIO · 2026'
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#%&*+×=◎◇⌘∞'

const STAGES = [
  'Wiring the grid',
  'Compiling assets',
  'Composing the page',
  'Ready',
]

export default function Loader({ onComplete }) {
  const containerRef = useRef(null)
  const ringRef = useRef(null)
  const ticksRef = useRef(null)
  const ticksCounterRef = useRef(null)
  const innerTextRef = useRef(null)
  const subTextRef = useRef(null)
  const fillRef = useRef(null)
  const baseRuleRef = useRef(null)
  const topFrameRef = useRef(null)
  const botFrameRef = useRef(null)
  const percentRef = useRef(null)
  const progressRef = useRef(0)
  const [stageIdx, setStageIdx] = useState(0)

  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      const t = setTimeout(() => onComplete?.(), 50)
      return () => clearTimeout(t)
    }

    const ring = ringRef.current
    const r = parseFloat(ring.getAttribute('r'))
    const circ = 2 * Math.PI * r

    gsap.set(ring, { strokeDasharray: circ, strokeDashoffset: circ })
    gsap.set([topFrameRef.current, botFrameRef.current], { opacity: 0, y: -6 })
    gsap.set(baseRuleRef.current, { scaleX: 0, transformOrigin: 'left center' })
    gsap.set(fillRef.current, { scaleX: 0, transformOrigin: 'left center' })
    gsap.set(ticksRef.current,        { opacity: 0, scale: 0.85, svgOrigin: '0 0' })
    gsap.set(ticksCounterRef.current, { opacity: 0, scale: 1.18, svgOrigin: '0 0' })
    gsap.set(innerTextRef.current,    { opacity: 0 })
    gsap.set(subTextRef.current,      { opacity: 0 })

    const tl = gsap.timeline({
      onComplete: () => {
        getLenis()?.start()
        onComplete?.()
      },
    })

    // Frame settles in.
    tl.to([topFrameRef.current, botFrameRef.current],
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out' })
    tl.to(baseRuleRef.current, { scaleX: 1, duration: 0.7, ease: 'expo.out' }, '<0.05')

    // Tick frame and inner text fade in.
    tl.to(ticksRef.current,        { opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.5)' }, '<0.05')
    tl.to(ticksCounterRef.current, { opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.5)' }, '<0.04')
    tl.to(innerTextRef.current,    { opacity: 1, duration: 0.4, ease: 'power2.out' }, '<0.15')
    tl.to(subTextRef.current,      { opacity: 0.55, duration: 0.4, ease: 'power2.out' }, '<0.05')

    const PROG_DUR = 2.2
    const obj = { v: 0 }

    tl.to(obj, {
      v: 100,
      duration: PROG_DUR,
      ease: 'power2.inOut',
      onUpdate: () => {
        progressRef.current = obj.v / 100
        if (percentRef.current) {
          percentRef.current.textContent = Math.round(obj.v).toString().padStart(3, '0')
        }
        const next = Math.min(STAGES.length - 1, Math.floor(obj.v / 25))
        setStageIdx((prev) => (prev === next ? prev : next))
      },
    }, '+=0.05')

    // Ring draws in step with progress.
    tl.to(ring, { strokeDashoffset: 0, duration: PROG_DUR, ease: 'power2.inOut' }, '<')
    // Hairline progress bar matches.
    tl.to(fillRef.current, { scaleX: 1, duration: PROG_DUR, ease: 'power2.inOut' }, '<')
    // Tick frames rotate counter to each other for a "compass" feel.
    tl.to(ticksRef.current,        { rotation:  360, duration: PROG_DUR + 0.8, ease: 'none', svgOrigin: '0 0' }, '<-0.5')
    tl.to(ticksCounterRef.current, { rotation: -360, duration: PROG_DUR + 0.8, ease: 'none', svgOrigin: '0 0' }, '<')

    // Resolved beat - small inhale.
    tl.to(innerTextRef.current, { scale: 1.04, duration: 0.18, ease: 'power2.out', transformOrigin: 'center' }, '+=0.1')
    tl.to(innerTextRef.current, { scale: 1,    duration: 0.55, ease: 'power3.out' })

    // Exit.
    tl.to([ticksRef.current, ticksCounterRef.current, ring, innerTextRef.current, subTextRef.current],
      { opacity: 0, duration: 0.4, ease: 'power2.in', stagger: 0.02 }, '+=0.2')
    tl.to(containerRef.current,
      { yPercent: -100, duration: 0.95, ease: 'expo.inOut' }, '-=0.2')

    return () => tl.kill()
  }, [onComplete])

  // Glyph scramble. Runs independently from the GSAP timeline; reads progress
  // from a ref. Letters resolve left-to-right as progress climbs; the rest
  // cycle random characters every frame.
  useEffect(() => {
    let raf
    let last = 0
    const tick = (t) => {
      raf = requestAnimationFrame(tick)
      if (t - last < 55) return
      last = t
      const p = progressRef.current
      const revealed = Math.floor(p * TARGET.length)
      let out = ''
      for (let i = 0; i < TARGET.length; i++) {
        const ch = TARGET[i]
        if (ch === ' ' || ch === '·') { out += ch; continue }
        if (i < revealed) out += ch
        else out += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
      }
      if (innerTextRef.current) innerTextRef.current.textContent = out
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-paper grain"
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
    >
      {/* Top frame */}
      <div
        ref={topFrameRef}
        className="absolute top-6 left-6 right-6 md:top-8 md:left-10 md:right-10 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.22em] text-ink/60"
      >
        <span className="flex items-center gap-3">
          <span className="ticker-dot" />
          HC / Folio '26
        </span>
        <span className="hidden sm:inline opacity-70">Initializing</span>
        <span className="tabular-nums">
          <span ref={percentRef}>000</span>
          <span className="opacity-50">%</span>
        </span>
      </div>

      {/* Center compass */}
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <svg
          viewBox="-180 -180 360 360"
          className="w-[min(86vw,460px)] h-auto"
          aria-hidden
        >
          {/* Outer rotating tick frame - 48 marks, every 6th is a long mark */}
          <g ref={ticksRef}>
            {Array.from({ length: 48 }).map((_, i) => {
              const angle = (i / 48) * 360
              const long = i % 6 === 0
              return (
                <line
                  key={i}
                  x1={0}
                  y1={-160}
                  x2={0}
                  y2={long ? -144 : -152}
                  stroke="#EDE7DC"
                  strokeWidth={long ? 1.4 : 0.7}
                  opacity={long ? 0.6 : 0.22}
                  strokeLinecap="round"
                  transform={`rotate(${angle})`}
                />
              )
            })}
            {/* Cardinal accent dots */}
            {[0, 90, 180, 270].map((a) => (
              <circle key={a} cx={0} cy={-160} r={2.4} fill="#A98B69" transform={`rotate(${a})`} />
            ))}
          </g>

          {/* Inner counter-rotating frame - 8 short marks */}
          <g ref={ticksCounterRef}>
            {Array.from({ length: 16 }).map((_, i) => {
              const angle = (i / 16) * 360 + 11.25
              return (
                <line
                  key={i}
                  x1={0}
                  y1={-104}
                  x2={0}
                  y2={-96}
                  stroke="#EDE7DC"
                  strokeWidth={0.9}
                  opacity={0.4}
                  strokeLinecap="round"
                  transform={`rotate(${angle})`}
                />
              )
            })}
          </g>

          {/* Faint base ring */}
          <circle cx={0} cy={0} r={130} fill="none" stroke="#EDE7DC" strokeWidth={1} opacity={0.1} />

          {/* Drawn accent ring - rotated -90 in markup so the dasharray begins at 12 o'clock */}
          <g transform="rotate(-90)">
            <circle
              ref={ringRef}
              cx={0}
              cy={0}
              r={130}
              fill="none"
              stroke="#A98B69"
              strokeWidth={2.4}
              strokeLinecap="round"
            />
          </g>

          {/* Cross-hair */}
          <line x1={-12} y1={0} x2={12} y2={0} stroke="#EDE7DC" strokeWidth={0.8} opacity={0.35} />
          <line x1={0} y1={-12} x2={0} y2={12} stroke="#EDE7DC" strokeWidth={0.8} opacity={0.35} />

          {/* Scramble text */}
          <text
            ref={innerTextRef}
            x={0}
            y={-30}
            textAnchor="middle"
            fontFamily="'JetBrains Mono', ui-monospace, monospace"
            fontSize={22}
            fill="#EDE7DC"
            letterSpacing="2"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            FOLIO · 2026
          </text>
          <text
            ref={subTextRef}
            x={0}
            y={50}
            textAnchor="middle"
            fontFamily="'JetBrains Mono', ui-monospace, monospace"
            fontSize={9}
            fill="#EDE7DC"
            letterSpacing="3"
          >
            BEARING · 026°
          </text>
        </svg>
      </div>

      {/* Bottom frame: hairline progress + stage line */}
      <div
        ref={botFrameRef}
        className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10"
      >
        <div className="relative h-px w-full bg-ink/15 overflow-hidden">
          <div ref={baseRuleRef} className="absolute inset-0 bg-ink/30" />
          <div ref={fillRef} className="absolute inset-0 bg-rust" />
        </div>
        <div className="mt-4 flex items-center justify-between font-mono text-[10px] md:text-[11px] uppercase tracking-[0.28em]">
          <span className="text-ink/70">{STAGES[stageIdx]}</span>
          <span className="text-ink/40 tabular-nums">
            {String(stageIdx + 1).padStart(2, '0')} / {String(STAGES.length).padStart(2, '0')}
          </span>
        </div>
      </div>
    </div>
  )
}
