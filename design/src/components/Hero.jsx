import React, { useEffect, useRef, lazy, Suspense } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import gsap from 'gsap'
import { Asterisk, Annotation, Orbit, TickRail   } from './Ornaments.jsx'
const AuroraShader = lazy(() => import('./AuroraShader.jsx'))

const lineVariants = {
  hidden: { y: '130%' },
  visible: (i = 0) => ({
    y: 0,
    transition: { delay: 0.2 + i * 0.08, duration: 1, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function Hero() {
  const heroRef = useRef(null)
  const underlineRef = useRef(null)

  // Underline draw on the surname after the type settles
  useEffect(() => {
    const el = underlineRef.current
    if (!el) return
    // Defer to requestIdleCallback to avoid blocking FCP
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(() => {
        gsap.fromTo(
          el,
          { scaleX: 0, transformOrigin: 'left center' },
          { scaleX: 1, duration: 1.4, delay: 1.4, ease: 'expo.inOut' },
        )
      }, { timeout: 3000 })
    } else {
      setTimeout(() => {
        gsap.fromTo(
          el,
          { scaleX: 0, transformOrigin: 'left center' },
          { scaleX: 1, duration: 1.4, delay: 1.4, ease: 'expo.inOut' },
        )
      }, 100)
    }
  }, [])

  // Subtle parallax on the meta strip
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const metaY = useTransform(scrollYProgress, [0, 1], [0, -60])
  const taglineY = useTransform(scrollYProgress, [0, 1], [0, -20])

  return (
    <section
      ref={heroRef}
      className="relative min-h-[100svh] px-6 md:px-10 pt-24 md:pt-28 pb-16 md:pb-10 overflow-hidden flex flex-col cloud-bg"
    >
      {/* Aurora gradient field - sits behind everything in the hero. The grain
          and content layers stack on top. */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <Suspense fallback={null}>
          <AuroraShader intensity={1.0} />
        </Suspense>
      </div>

      {/* Faint orbit pattern - hangs out in the right gutter */}

      {/* Slowly-spinning asterisk floating in the negative space */}
      <motion.div
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-1/2 right-12 md:right-24 -translate-y-1/2 text-rust pointer-events-none hidden md:block"
      >
        <Asterisk size={72} spinning />
      </motion.div>

      {/* Tick rail under nothing in particular - editorial chrome */}
      <div className="absolute top-20 left-6 md:left-10 text-ink/35 hidden md:block">
        <TickRail />
      </div>

      {/* Top meta strip - sits below the fixed corner mark */}
      <motion.div
        style={{ y: metaY }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.7 }}
        className="relative z-10 grid grid-cols-12 gap-4 md:gap-6 text-[10px] md:text-[11px] uppercase tracking-[0.18em] font-mono text-ink/60 border-t border-ink/15 pt-5 md:pt-6 mt-12 md:mt-16"
      >
        <div className="col-span-6 md:col-span-3">
          <div className="text-ink/40 mb-1">Folio</div>
          <div className="text-ink">No. 01 / 2026</div>
        </div>
        <div className="col-span-6 md:col-span-3">
          <div className="text-ink/40 mb-1">Located</div>
          <div className="text-ink">Jodhpur, IN · 26.29° N</div>
        </div>
        <div className="col-span-6 md:col-span-3">
          <div className="text-ink/40 mb-1">Concurrently</div>
          <div className="text-ink">MBM × IIT Madras</div>
        </div>
        <div className="col-span-6 md:hidden">
          <div className="text-ink/40 mb-1">Status</div>
          <div className="flex items-center gap-2 text-ink">
            <span className="text-rust">
              <Asterisk size={10} spinning />
            </span>
            <span>Summer 2026</span>
          </div>
        </div>
        <div className="hidden md:block col-span-3">
          <div className="text-ink/40 mb-1">Open</div>
          <div className="flex items-center gap-2 text-ink">
            <span className="text-rust">
              <Asterisk size={11} spinning />
            </span>
            <span>Summer 2026</span>
          </div>
        </div>
      </motion.div>

      {/* Massive name - generous top space, balanced line-height */}
      <div className="relative z-10 mt-auto pt-20 md:pt-32">
        <h1 className="font-display tracking-tightest text-ink select-none">
          <span className="block overflow-hidden leading-[1.0] md:leading-[0.92]">
            <motion.span
              custom={0}
              variants={lineVariants}
              initial="hidden"
              animate="visible"
              className="block text-[clamp(4.5rem,16vw,17rem)]"
            >
              Hemang
            </motion.span>
          </span>
          <span className="block overflow-hidden leading-[1.1] md:leading-[0.92] -mt-3 md:-mt-3">
            <motion.span
              custom={1}
              variants={lineVariants}
              initial="hidden"
              animate="visible"
              className="relative inline-block text-[clamp(3.8rem,13vw,15rem)] md:text-[clamp(4.5rem,16vw,17rem)] italic"
            >
              Choudhary
              {/* deliberate underline drawn on load - replaces the typewriter cursor */}
              <span
                ref={underlineRef}
                aria-hidden
                className="absolute left-0 right-0 -bottom-1 h-[6px] md:h-[10px] origin-left cloud-bg"
                style={{ transform: 'scaleX(0)', backgroundColor: '#7BA4C7' }}
              />
            </motion.span>
          </span>
        </h1>

        {/* Annotation arrow pointing at the surname */}
        {/* <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="hidden md:flex absolute -bottom-6 left-[calc(min(40vw,520px))] text-rust"
        >
          <Annotation>surname, italic by choice</Annotation>
        </motion.div> */}
      </div>

      {/* Sub-hero grid - tagline + now/recent */}
      <motion.div
        style={{ y: taglineY }}
        className="relative z-10 mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10"
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.7 }}
          className="col-span-1 md:col-span-6 lg:col-span-5 text-base md:text-lg lg:text-xl leading-[1.5] md:leading-[1.45] text-ink max-w-xl"
        >
          A 20-year-old <em className="font-display text-rust">builder</em> running two
          undergraduate degrees in parallel. IT at MBM Jodhpur, Data Science & AI at IIT
          Madras. I write backends, train models at DRDO, and design the interfaces in
          between.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.35, duration: 0.7 }}
          className="col-span-1 md:col-span-6 lg:col-span-7 lg:col-start-7 grid grid-cols-1 md:grid-cols-2 gap-6 self-end"
        >
          <div className="border-t border-ink/20 pt-4">
            <div className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] text-ink/50 mb-2">
              Now / Q2 2026
            </div>
            <div className="font-display text-lg md:text-xl lg:text-[1.6rem] leading-[1.3] md:leading-[1.25]">
              Shipping <em>Quizzy</em>, an agentic FastAPI scoring 22/24 on evals.
            </div>
          </div>
          <div className="border-t border-ink/20 pt-4">
            <div className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] text-ink/50 mb-2">
              Recent
            </div>
            <div className="font-display text-lg md:text-xl lg:text-[1.6rem]  leading-[1.3] md:leading-[1.25]">
              CycleGAN at <em>DRDO</em>. Image-to-image, CUDA, 1k+ pairs.
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="relative z-10 mt-10 md:mt-14 flex items-end justify-between text-[11px] font-mono uppercase tracking-[0.22em] text-ink/50"
      >
        <span>Scroll · Selected works</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          aria-hidden
        >
          ↓
        </motion.span>
        <span className="hidden md:inline">8 works / 17 tools</span>
      </motion.div>
    </section>
  )
}
