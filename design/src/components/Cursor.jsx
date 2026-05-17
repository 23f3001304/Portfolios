import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue } from 'framer-motion'

export default function Cursor() {
  const [enabled, setEnabled] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [label, setLabel] = useState('')
  const [pressed, setPressed] = useState(false)
  const [nearScrollbar, setNearScrollbar] = useState(false)

  // Raw motion values - no spring. The custom cursor IS the visible pointer
  // (default is hidden via .cursor-hidden), so any easing reads as lag.
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const xLabelRef = useRef(null)
  const yLabelRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const fine = window.matchMedia('(pointer: fine)')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setEnabled(fine.matches && !reduce.matches)
    update()
    fine.addEventListener?.('change', update)
    reduce.addEventListener?.('change', update)
    return () => {
      fine.removeEventListener?.('change', update)
      reduce.removeEventListener?.('change', update)
    }
  }, [])

  useEffect(() => {
    if (!enabled) return
    const root = document.documentElement
    root.classList.add('cursor-hidden')

    function inferLabel(el) {
      const explicit = el.getAttribute('data-cursor-label')
      if (explicit) return explicit.toUpperCase()
      if (el.tagName === 'A') {
        const href = el.getAttribute('href') || ''
        if (href.startsWith('mailto:')) return 'MAIL'
        if (href.startsWith('tel:')) return 'CALL'
        try {
          if (el.host && el.host !== window.location.host) return 'OPEN ↗'
        } catch (_) { /* ignore */ }
        return 'VIEW'
      }
      if (el.tagName === 'BUTTON') return 'CLICK'
      return 'HOVER'
    }

    function move(e) {
      x.set(e.clientX)
      y.set(e.clientY)

      // Update coordinate readout
      const xs = Math.round(e.clientX).toString().padStart(4, '0')
      const ys = Math.round(e.clientY).toString().padStart(4, '0')
      if (xLabelRef.current) xLabelRef.current.textContent = xs
      if (yLabelRef.current) yLabelRef.current.textContent = ys

      const target = e.target instanceof Element ? e.target : null

      // Detect zones
      const thumb = target?.closest('[data-cursor="scroll-thumb"]')
      const scrollbar = target?.closest('[data-cursor="scroll"]')
      const interactive = target?.closest(
        'a, button, [role="button"], [data-cursor="hover"]'
      )

      // Detect if near right edge (for label flipping)
      const isNearRightEdge = e.clientX > window.innerWidth - 80
      setNearScrollbar(isNearRightEdge)

      // Priority: thumb > scrollbar > interactive > default
      if (thumb) {
        setHovered(true)
        setLabel(pressed ? 'SCROLLING' : 'SCROLL')
      } else if (scrollbar) {
        setHovered(true)
        setLabel(pressed ? 'SCROLLING' : 'SCROLL')
      } else if (interactive) {
        setHovered(true)
        setLabel(inferLabel(interactive))
      } else {
        setHovered(false)
        setLabel('')
      }
    }

    function down() { setPressed(true) }
    function up() { setPressed(false) }
    function leave() { x.set(-200); y.set(-200); setHovered(false); setNearScrollbar(false) }

    window.addEventListener('mousemove', move, { passive: true })
    // Also listen for pointer events so the cursor keeps updating when other
    // elements (like the custom scrollbar) call setPointerCapture. Pointer
    // capture directs pointermove events to the captured element and may stop
    // mousemove from firing on window; listening to pointermove makes the
    // cursor robust in that scenario.
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)

    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup', up)
    window.addEventListener('mouseleave', leave)

    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
      window.removeEventListener('mouseleave', leave)
      root.classList.remove('cursor-hidden')
    }
  }, [enabled, x, y])

  if (!enabled) return null

  const baseEase = [0.22, 1, 0.36, 1]

  return (
    <>
      {/* Full-viewport crosshair axes. They cross at the cursor tip so the
          pointer position is unambiguous - the default cursor is hidden, so
          this is the user's actual "you are here" indicator.
          Faded out when over interactive elements (preview tiles, links) so
          they don't draw lines through hovered content. */}
      <motion.div
        aria-hidden
        style={{ y }}
        animate={{ opacity: hovered ? 0 : 1 }}
        transition={{ duration: 0.18 }}
        className="fixed top-0 left-0 w-screen h-px bg-ink/15 z-[60] pointer-events-none"
      />
      <motion.div
        aria-hidden
        style={{ x }}
        animate={{ opacity: hovered ? 0 : 1 }}
        transition={{ duration: 0.18 }}
        className="fixed top-0 left-0 w-px h-screen bg-ink/15 z-[60] pointer-events-none"
      />

      {/* Reticle - rendered as SVG with a paper halo behind every ink/rust stroke
          so the mark is always legible. No blend mode here. Position is raw
          (no spring) so the hairline sits exactly on the pointer.
          Outer div applies the cursor position via Framer's transform; inner
          div centres the SVG on that point via a separate translate (different
          element, no transform conflict). */}
      <motion.div
        aria-hidden
        style={{ x, y }}
        className="fixed top-0 left-0 z-[61] pointer-events-none"
      >
       <div className="-translate-x-1/2 -translate-y-1/2 relative">
        <motion.svg
          width="48"
          height="48"
          viewBox="-24 -24 48 48"
          style={{ overflow: 'visible' }}
          animate={{ scale: pressed ? 0.82 : 1 }}
          transition={{ duration: 0.12, ease: baseEase }}
        >
          {/* Idle reticle - NSEW ticks. Paper halo (wider) under ink stroke. */}
          {[
            { x1: 0,   y1: -16, x2: 0,   y2: -10 },
            { x1: 0,   y1:  10, x2: 0,   y2:  16 },
            { x1: -16, y1: 0,   x2: -10, y2: 0   },
            { x1: 10,  y1: 0,   x2: 16,  y2: 0   },
          ].map((t, i) => (
            <motion.g
              key={i}
              animate={{ opacity: hovered ? 0 : 1 }}
              transition={{ duration: 0.18 }}
            >
              <line {...t} stroke="#0A0D12" strokeWidth="2.4" strokeLinecap="round" opacity="0.9" />
              <line {...t} stroke="#EDE7DC" strokeWidth="1" strokeLinecap="round" />
            </motion.g>
          ))}

          {/* Idle center dot - ink with paper halo */}
          <motion.g
            animate={{ opacity: hovered ? 0 : 1, scale: hovered ? 0.4 : 1 }}
            transition={{ duration: 0.18 }}
          >
            <circle cx="0" cy="0" r="3.5" fill="#0A0D12" />
            <circle cx="0" cy="0" r="2.2" fill="#EDE7DC" />
          </motion.g>

          {/* Hover reticle - accent square with paper outline so it pops on every bg */}
          <motion.g
            animate={{
              scale: hovered ? 1 : 0.5,
              opacity: hovered ? 1 : 0,
              rotate: hovered ? 45 : 0,
            }}
            transition={{ duration: 0.28, ease: baseEase }}
            style={{ transformOrigin: 'center' }}
          >
            <rect x="-14" y="-14" width="28" height="28" fill="none" stroke="#0A0D12" strokeWidth="3" />
            <rect x="-14" y="-14" width="28" height="28" fill="none" stroke="#A98B69" strokeWidth="1.4" />
            <circle cx="0" cy="0" r="2.6" fill="#A98B69" />
          </motion.g>
        </motion.svg>


        <div
          aria-hidden
          className="absolute font-mono text-[10px] uppercase tracking-[0.2em] whitespace-nowrap leading-none"
          style={{left: nearScrollbar ? '-50px' : '42px', top: '34px' }}
        >
          {hovered ? (
            <span className="inline-flex items-center bg-rust text-paper px-2 py-1">
              {label}
            </span>
          ) : (
            <span className="inline-flex items-center bg-bone text-ink/85 px-2 py-1 border border-ink/15">
              <span ref={xLabelRef} className="tabular-nums">0000</span>
              <span className="opacity-40 mx-1">·</span>
              <span ref={yLabelRef} className="tabular-nums">0000</span>
            </span>
          )}
        </div>
       </div>
      </motion.div>
    </>
  )
}
