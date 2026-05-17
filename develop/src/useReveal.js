import { useEffect, useRef } from 'react';

/* IntersectionObserver-driven reveal. Adds [data-reveal="in"] when the
   element first crosses the viewport. CSS handles the transform+opacity. */
export function useReveal({ threshold = 0.1, once = true } = {}) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.setAttribute('data-reveal', 'in');
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          el.setAttribute('data-reveal', 'in');
          if (once) io.unobserve(el);
        } else if (!once) {
          el.setAttribute('data-reveal', 'out');
        }
      });
    }, { threshold, rootMargin: '0px 0px -40px 0px' });
    el.setAttribute('data-reveal', 'out');
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, once]);
  return ref;
}
