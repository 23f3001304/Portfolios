// Tiny shared store so the scrollbar / cursor / any component can read the same
// Lenis instance that `useLenis` initializes. Avoids prop-drilling and avoids
// instantiating Lenis twice.

let _lenis = null
const listeners = new Set()

export function setLenis(l) {
  _lenis = l
  listeners.forEach((fn) => fn(l))
}

export function getLenis() {
  return _lenis
}

export function subscribeLenisInstance(fn) {
  listeners.add(fn)
  // Fire once with the current value so late subscribers don't miss it.
  fn(_lenis)
  return () => listeners.delete(fn)
}
