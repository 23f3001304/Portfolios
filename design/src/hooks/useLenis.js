import { useEffect } from 'react'
import Lenis from 'lenis'
import { setLenis } from './lenisStore.js'

// Lenis 1.x. Uses the current API: `orientation`, `gestureOrientation`, `syncTouch`.
// Pick `lerp` OR `duration+easing` - not both. We pick `lerp` for tighter feel.
export default function useLenis() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const lenis = new Lenis({
      lerp: 0.085,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.4,
      wheelMultiplier: 1,
      autoResize: true,
      prevent: (node) => Boolean(node?.classList?.contains?.('no-lenis')),
    })

    // Start paused. The loader will release it.
    lenis.stop()
    setLenis(lenis)

    let rafId = 0
    function raf(time) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      setLenis(null)
    }
  }, [])
}
