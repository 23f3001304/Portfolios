import { useEffect, useRef, useState, useCallback } from 'react'
import { getLenis, subscribeLenisInstance } from '../hooks/lenisStore.js'

// In-page scrollbar.
// - Hairline track on the right gutter, with marker ticks at 0/25/50/75/100%.
// - Rust thumb with a live mono percentage readout (matches the loader / nav language).
// - Click anywhere on the track to seek; drag the thumb to scrub.
// - Subscribes to the shared Lenis instance, so it cannot drift from real scroll.
export default function Scrollbar() {
  const [progress, setProgress] = useState(0)
  const [active, setActive] = useState(false)
  const [ready, setReady] = useState(false)
  const trackRef = useRef(null)
  const thumbRef = useRef(null)
  const idleTimer = useRef(null)
  const draggingRef = useRef(false)
  const thumbDraggingRef = useRef(false)
  const dragOffsetRef = useRef(0)

  useEffect(() => {
    let attached = null

    function onScroll(l) {
      // Compute both Lenis-derived progress and DOM-derived progress and
      // prefer the DOM measurement when they diverge significantly. This
      // handles cases where Lenis hasn't updated limits yet or virtual
      // scroll smoothing causes temporary mismatches.
      let next = 0
      const lenis = getLenis()

      // Lenis payload values (if present)
      const lenisScroll = typeof l?.scroll === 'number' ? l.scroll : (lenis?.scroll ?? undefined)
      const lenisLimit = typeof l?.limit === 'number' ? l.limit : (lenis?.limit ?? undefined)

      // DOM-based measurements
      const doc = document.scrollingElement || document.documentElement
      const docScroll = (doc && typeof doc.scrollTop === 'number') ? doc.scrollTop : (window.scrollY || 0)
      const docLimit = Math.max(0, (doc && doc.scrollHeight) ? doc.scrollHeight - window.innerHeight : document.documentElement.scrollHeight - window.innerHeight)
      const docProgress = docLimit > 0 ? docScroll / docLimit : 0

      // Prefer Lenis' explicit progress if provided
      if (typeof l?.progress === 'number') {
        next = l.progress
      } else if (typeof lenisScroll === 'number' && typeof lenisLimit === 'number' && lenisLimit > 0) {
        next = lenisScroll / lenisLimit
      } else {
        next = docProgress
      }

      // If Lenis-derived and DOM-derived differ a lot, prefer DOM which
      // reflects the real document layout.
      if (typeof lenisScroll === 'number' && typeof lenisLimit === 'number') {
        const fromLenis = lenisLimit > 0 ? lenisScroll / lenisLimit : 0
        if (Math.abs(fromLenis - docProgress) > 0.25) next = docProgress
      }

      // Snap small values and clamp
      if (next < 0.005) next = 0
      if (next > 0.995) next = 1
      setProgress(Number.isFinite(next) ? Math.max(0, Math.min(1, next)) : 0)
      setActive(true)
      clearTimeout(idleTimer.current)
      idleTimer.current = setTimeout(() => {
        if (!draggingRef.current) setActive(false)
      }, 1100)
    }

    const unsub = subscribeLenisInstance((l) => {
      if (attached) attached.off?.('scroll', onScroll)
      attached = l
      if (l) {
        l.on('scroll', onScroll)
        setReady(true)
        // Seed initial progress.
        onScroll(l)
      } else {
        setReady(false)
      }
    })

    return () => {
      unsub()
      attached?.off?.('scroll', onScroll)
      clearTimeout(idleTimer.current)
    }
  }, [])

  // Watch for document height changes (e.g. when navigating between project
  // pages or when images/iframes load). Some page updates don't emit a Lenis
  // scroll event, so observe DOM mutations and recompute progress when the
  // document height changes.
  useEffect(() => {
    if (typeof window === 'undefined') return
    let prevHeight = document.documentElement.scrollHeight
    let timeout = null

    function recompute() {
      const lenis = getLenis()
      const doc = document.scrollingElement || document.documentElement
      const docScroll = (doc && typeof doc.scrollTop === 'number') ? doc.scrollTop : (window.scrollY || 0)
      const docLimit = Math.max(0, (doc && doc.scrollHeight) ? doc.scrollHeight - window.innerHeight : document.documentElement.scrollHeight - window.innerHeight)

      // Prefer DOM-based measurement since it represents real layout.
      let next = docLimit > 0 ? docScroll / docLimit : 0

      // If DOM doesn't provide meaningful values, fall back to Lenis
      if ((!docLimit || docLimit === 0) && lenis && typeof lenis.scroll === 'number' && typeof lenis.limit === 'number') {
        next = lenis.limit > 0 ? lenis.scroll / lenis.limit : 0
      }

      if (next > 0.995) next = 1
      if (next < 0.005) next = 0
      setProgress(Number.isFinite(next) ? Math.max(0, Math.min(1, next)) : 0)
    }

    // Aggressive resync polling: run recompute repeatedly (and call lenis.update
    // if available) until progress stabilizes or a timeout elapses. This helps
    // when Lenis smoothing or late-loading media cause timing races.
    function startPollingRecompute() {
      const lenis = getLenis()
      let last = -1
      let stableCount = 0
      const start = Date.now()
      const maxDuration = 1600
      const interval = 80
      const id = setInterval(() => {
        // If Lenis exposes update/resize methods, ask it to refresh internal limits.
        try {
          if (lenis && typeof lenis.update === 'function') lenis.update()
          if (lenis && typeof lenis.resize === 'function') lenis.resize()
        } catch (e) {
          // ignore
        }
        recompute()
        const current = progress
        // If progress hasn't changed much, count as stable.
        if (Math.abs(current - last) < 0.006) {
          stableCount += 1
        } else {
          stableCount = 0
        }
        last = current
        if (stableCount >= 3 || Date.now() - start > maxDuration) {
          clearInterval(id)
        }
      }, interval)
      // Also ensure we stop after the maxDuration in case setInterval fails to clear.
      setTimeout(() => clearInterval(id), maxDuration + 200)
    }

    const observer = new MutationObserver(() => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        const h = document.documentElement.scrollHeight
        if (h !== prevHeight) {
          prevHeight = h
          recompute()
        }
      }, 120)
    })

    // Observe only the root container to reduce performance overhead
    const rootEl = document.getElementById('root') || document.documentElement
    observer.observe(rootEl, { childList: true, subtree: true })

    // Also recalc on window resize (layout changes)
    const onResize = () => {
      clearTimeout(timeout)
      timeout = setTimeout(() => recompute(), 120)
    }
    window.addEventListener('resize', onResize)

    // Allow other parts of the app to request an explicit resync (e.g.
    // after client-side navigation). Dispatch a `lenis:resync` event to
    // force a recalculation of progress/limit.
    const onResync = () => {
      clearTimeout(timeout)
      recompute()
      const delays = [60, 180, 360, 700]
      delays.forEach((d) => setTimeout(recompute, d))
      // Defer polling to requestIdleCallback to avoid blocking interactions
      if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(() => startPollingRecompute(), { timeout: 200 })
      } else {
        setTimeout(startPollingRecompute, 100)
      }
    }
    window.addEventListener('lenis:resync', onResync)

    return () => {
      observer.disconnect()
      clearTimeout(timeout)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('lenis:resync', onResync)
    }
  }, [])

  // Seek from pointer. `offsetNorm` is an optional normalized offset (0..1)
  // representing the distance from the track start to the pointer relative to
  // the thumb position. This keeps the thumb from jumping when grabbed.
  const seekFromPointer = useCallback((e, offsetNorm = 0) => {
    const lenis = getLenis()
    const track = trackRef.current
    if (!lenis || !track) return
    const rect = track.getBoundingClientRect()
    const norm = (e.clientY - rect.top) / rect.height
    const p = Math.max(0, Math.min(1, norm - (offsetNorm || 0)))
    // Prefer Lenis' reported limit if available; otherwise fall back to
    // document measurements. Some Lenis builds expose different properties
    // so check multiple locations defensively.
    const limit = (typeof lenis.limit === 'number' && lenis.limit > 0)
      ? lenis.limit
      : Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
    const target = p * limit
    // Use lenis.scrollTo when possible; fall back to window.scrollTo if it fails.
    try {
      lenis.scrollTo(target, { immediate: true, force: true, lock: true })
    } catch (err) {
      window.scrollTo({ top: target })
    }
  }, [])

  const onPointerDown = useCallback((e) => {
    // Prevent text selection and other default pointer behaviours
    e.preventDefault()

    draggingRef.current = true
    setActive(true)
    trackRef.current?.setPointerCapture?.(e.pointerId)

    // Detect whether the user clicked the thumb or the track.
    const thumbEl = thumbRef.current
    const track = trackRef.current
    if (thumbEl && thumbEl.contains(e.target) && track) {
      // Start dragging the thumb without jumping: record normalized offset
      // between the pointer position and the current progress. This prevents
      // pixel rounding differences and keeps the thumb stable under the pointer.
      thumbDraggingRef.current = true
      const rect = track.getBoundingClientRect()
      const pointerNorm = (e.clientY - rect.top) / rect.height
      dragOffsetRef.current = pointerNorm - progress
      // Do not call seekFromPointer here (prevents immediate jump).
    } else if (track) {
      // Clicked on track — seek immediately to that position.
      thumbDraggingRef.current = false
      dragOffsetRef.current = 0
      seekFromPointer(e, 0)
    }
  }, [seekFromPointer, progress])

  const onPointerMove = useCallback((e) => {
    if (!draggingRef.current) return
    // If the drag started on the thumb, respect the initial offset so the
    // thumb doesn't jump to center under the pointer.
    if (thumbDraggingRef.current) {
      seekFromPointer(e, dragOffsetRef.current)
    } else {
      seekFromPointer(e, 0)
    }
  }, [seekFromPointer])

  const onPointerUp = useCallback((e) => {
    draggingRef.current = false
    thumbDraggingRef.current = false
    dragOffsetRef.current = 0
    trackRef.current?.releasePointerCapture?.(e.pointerId)
    clearTimeout(idleTimer.current)
    idleTimer.current = setTimeout(() => setActive(false), 600)
  }, [])

  if (!ready) return null

  const pct = Math.round(progress * 100)
  const ticks = [0, 25, 50, 75, 100]
  // The fixed nav bar lives at the top-right (≈ y 0-72). The track starts at
  // y 40 (my-10), so when progress is near 0 the thumb readout collides with
  // the nav pill. Hide the readout box in that band - the small rust square
  // tick on the rail still indicates position.
  const overlapsNav = progress < 0.05

  return (
    <div
      ref={trackRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      aria-hidden
      data-cursor="scroll"
      className="no-lenis fixed right-0 top-0 bottom-0 z-100 hidden md:flex w-8 cursor-ns-resize select-none items-stretch justify-end pr-3"
      style={{ touchAction: 'none', pointerEvents: 'auto' }}
    >
      <div className="relative my-10 w-px bg-ink/15">
        {ticks.map((t) => (
          <span
            key={t}
            className={`absolute -left-[3px] block h-px ${t === 0 || t === 100 ? 'w-2 bg-ink/45' : 'w-1.5 bg-ink/25'}`}
            style={{ top: `${t}%` }}
          />
        ))}

        {/* Range cap labels - only the ends, kept tight */}
        <span className="absolute -left-7 -top-5 font-mono text-[9px] uppercase tracking-[0.22em] text-ink/40 tabular-nums">
          00
        </span>
        <span className="absolute -left-7 -bottom-5 font-mono text-[9px] uppercase tracking-[0.22em] text-ink/40 tabular-nums">
          ff
        </span>

        {/* Thumb */}
        <div
          ref={thumbRef}
           data-cursor="scroll-thumb"
          className="absolute right-0 -translate-y-1/2 transition-[opacity] duration-300"
          style={{ top: `${progress * 100}%`, opacity: active ? 1 : 0.55 }}
        >
          {/* Readout pill - bg rectangle so the label + thumb read as one
              unit against any content underneath. Hidden when it would collide
              with the fixed top nav. */}
          <div
            className="flex items-center gap-2 -mr-1 border border-ink/15 bg-paper/85 backdrop-blur-md  transition-opacity duration-200"
          // style={{ opacity: overlapsNav ? 0 : 1 ,  }}
          >
            {!overlapsNav && active && (
              <span className="font-mono text-[9px] uppercase tracking-[0.22em] pl-2 py-1 text-ink/70 tabular-nums whitespace-nowrap">
                {pct.toString().padStart(2, '0')} / 100
              </span>
            )}
            <span className="relative block">
              {/* Outline halo when active */}
              <span
                className="absolute -inset-1 border border-rust/40 transition-opacity duration-200"
                style={{ opacity: active ? 1 : 0 }}
              />
              <span className="block w-[10px] h-[14px] bg-rust" />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
