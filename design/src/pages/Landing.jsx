import { useEffect, useState } from 'react'
import Nav from '../components/Nav.jsx'
import Hero from '../components/Hero.jsx'
import Marquee from '../components/Marquee.jsx'
import Stats from '../components/Stats.jsx'
import WorkIndex from '../components/WorkIndex.jsx'
import About from '../components/About.jsx'
import Contact from '../components/Contact.jsx'
import useLenis from '../hooks/useLenis.js'
import { getLenis } from '../hooks/lenisStore.js'

const LOADER_FLAG = 'hc:seen-loader'

function readLoaderSeen() {
  try {
    return typeof window !== 'undefined' && window.sessionStorage.getItem(LOADER_FLAG) === '1'
  } catch {
    return false
  }
}
function writeLoaderSeen() {
  try {
    window.sessionStorage.setItem(LOADER_FLAG, '1')
  } catch {
    /* private mode / disabled storage - ignore */
  }
}

export default function Landing() {
  useLenis()

  useEffect(() => {
    const lenis = getLenis()
    lenis?.start()
  }, [])

  return (
    <>
      {/* Page is mounted from t=0 and sits beneath the loader. The loader's
          final slide-up reveals real content rather than a blank frame. */}
      <main className="relative grain bg-paper text-ink">
        <Nav />
        <Hero />
        <Marquee />
        <Stats />
        <WorkIndex />
        <About />
        <Contact />
      </main>

      {/* Cursor + scrollbar mount is handled globally in `main.jsx`. */}
    </>
  )
}
