import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Simple hook to reveal page/content elements using GSAP. It listens for the
// global `routeTransitionEnd` event so pages can wait for the curtain before
// animating content in. It also wires ScrollTrigger-based reveals for any
// children matching `revealOnScroll`.
export default function useGsapReveal({
  rootSelector = '.gsap-page',
  revealSelector = '.gsap-reveal',
  revealOnScroll = '.gsap-on-scroll',
  stagger = 0.08,
  duration = 0.6,
} = {}) {
  const playedRef = useRef(false)

  useEffect(() => {
    const root = document.querySelector(rootSelector)
    if (!root) return

    // Prepare elements
    const elems = Array.from(root.querySelectorAll(revealSelector))
    if (elems.length) {
      gsap.set(elems, { autoAlpha: 0, y: 16 })
    }

    // Scroll-triggered reveals
    const scrollElems = Array.from(root.querySelectorAll(revealOnScroll))
    scrollElems.forEach((el) => {
      gsap.set(el, { autoAlpha: 0, y: 24 })
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        onEnter: () => gsap.to(el, { autoAlpha: 1, y: 0, duration: 0.66, ease: 'power3.out' }),
        once: true,
      })
    })

    function playReveal() {
      if (playedRef.current) return
      playedRef.current = true
      if (elems.length) {
        gsap.to(elems, {
          autoAlpha: 1,
          y: 0,
          duration,
          ease: 'power3.out',
          stagger,
        })
      } else {
        // Fallback: fade in the root
        gsap.fromTo(root, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 })
      }
    }

    // If a transition is in-flight, wait for it to finish. Otherwise play
    // after a short idle to avoid jank on first load.
    function onEnd(e) {
      // Slight small delay so animation doesn't feel abrupt.
      setTimeout(playReveal, 40)
    }

    window.addEventListener('routeTransitionEnd', onEnd)

    // If no transition fires within 120ms, play anyway (handles direct loads).
    const fallback = setTimeout(() => playReveal(), 120)

    return () => {
      window.removeEventListener('routeTransitionEnd', onEnd)
      clearTimeout(fallback)
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [rootSelector, revealSelector, revealOnScroll, stagger, duration])
}
