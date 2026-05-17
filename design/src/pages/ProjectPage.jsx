import { useEffect, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { projects } from '../data/projects.js'
import { Plus, Bracket, Divider, ArrowDoodle, Asterisk } from '../components/Ornaments.jsx'
import EngineeredCase from '../components/cases/EngineeredCase.jsx'
import DesignedCase from '../components/cases/DesignedCase.jsx'
import useLenis from '../hooks/useLenis.js'
import { getLenis } from '../hooks/lenisStore.js'
import useGsapReveal from '../hooks/useGsapReveal.js'

const easeOut = [0.22, 1, 0.36, 1]

export default function ProjectPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  useLenis()

  // Subpages don't have a loader, so release Lenis as soon as it exists.
  useEffect(() => {
    getLenis()?.start()
    // Ensure Lenis or window scroll is at top when changing project pages.
    if (getLenis()?.scrollTo) {
      try { getLenis().scrollTo(0, { duration: 0 }) } catch (e) { window.scrollTo(0, 0) }
    } else {
      window.scrollTo(0, 0)
    }
    // Some content (images/iframes) may load after route change and Lenis
    // may not emit an immediate scroll event. Dispatch a resync so the
    // scrollbar recomputes limits/progress for the new page.
    setTimeout(() => {
      try { window.dispatchEvent(new Event('lenis:resync')) } catch (e) { /* ignore */ }
    }, 60)
  }, [slug])

  // GSAP reveals: wait for the transition curtain to finish, then animate
  // content. Also wires scroll-trigger reveals for elements with
  // `gsap-on-scroll`.
  useGsapReveal({ rootSelector: '.gsap-page', revealSelector: '.gsap-reveal', revealOnScroll: '.gsap-on-scroll' })

  const idx = projects.findIndex((p) => p.slug === slug)
  const project = idx >= 0 ? projects[idx] : null
  const prev = useMemo(() => (idx > 0 ? projects[idx - 1] : projects[projects.length - 1]), [idx])
  const next = useMemo(() => (idx < projects.length - 1 ? projects[idx + 1] : projects[0]), [idx])

  if (!project) {
    // The route catches /work/:slug; if slug doesn't resolve, push to NotFound.
    setTimeout(() => navigate('/404', { replace: true }), 0)
    return null
  }

  const isDesign = project.kind === 'Design'

  return (
    
    <motion.main
      key={slug}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: easeOut }}
      className="relative grain bg-paper text-ink min-h-screen gsap-page"
    >
      
      {/* Top mini-nav */}
      <header className="fixed top-0 left-0 right-0 z-40 px-4 md:px-8 py-4 pointer-events-none gsap-reveal">
        <div className="flex items-center justify-between rounded-full border border-ink/10 bg-bone/75 px-4 md:px-5 py-3 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          <Link
            to="/"
            className="pointer-events-auto group flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink/85 hover:text-ink transition-colors"
          >
            <span className="inline-block transition-transform group-hover:-translate-x-0.5">←</span>
            <span>Index</span>
          </Link>
          <div className="pointer-events-auto font-mono text-[11px] uppercase tracking-[0.2em] text-ink/55 truncate">
            <span className="text-ink/40">Folio /</span> {project.index}
            <span className="hidden md:inline">
              {' / '}<span className="text-ink">{project.title}</span>
            </span>
          </div>
        </div>
      </header>

      {/* Project header */}
      <section className="relative px-6 md:px-10 pt-32 md:pt-40 pb-16 md:pb-24 overflow-hidden gsap-reveal">
        <div className="grid grid-cols-12 gap-6 mb-10">
          <div className="col-span-12 md:col-span-3 flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.22em] text-ink/55">
            <span className="text-ink/60"><Bracket side="left" /></span>
            <span>§ {project.index} / {project.kind}</span>
            <span className="text-ink/60"><Bracket side="right" /></span>
          </div>
          <div className="col-span-12 md:col-span-9 font-mono text-[11px] uppercase tracking-[0.22em] text-ink/45 flex items-center gap-3 flex-wrap">
            <span className="text-ink/65">{project.role}</span>
            <span className="text-ink/30">·</span>
            <span className="text-ink/65">{project.period}</span>
            <span className="text-ink/30">·</span>
            <span className="text-ink/65">{project.year}</span>
          </div>
        </div>

        <h1 className="font-display text-[clamp(3rem,11vw,11rem)] leading-[0.92] tracking-[-0.025em] text-ink gsap-reveal">
          {project.title}
        </h1>

        {/* Stack chips */}
        <div className="mt-10 grid grid-cols-12 gap-6 items-center gsap-on-scroll">
          <div className="col-span-12 md:col-span-3 text-[11px] font-mono uppercase tracking-[0.22em] text-ink/40">
            Stack
          </div>
          <div className="col-span-12 md:col-span-9 flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-2 px-3 py-1 border border-ink/15 text-[11px] font-mono uppercase tracking-[0.18em] text-ink/85"
              >
                <span className="text-rust"><Plus size={8} /></span>
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Brief */}
      <section className="relative px-6 md:px-10 pb-16 md:pb-24 gsap-reveal">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-3 text-[11px] font-mono uppercase tracking-[0.22em] text-ink/40">
            Brief
          </div>
          <p className="col-span-12 md:col-span-9 font-display text-[clamp(1.5rem,2.6vw,2.6rem)] leading-[1.2] tracking-tight text-ink/90 max-w-[44ch] gsap-reveal">
            {project.blurb}
          </p>
        </div>
      </section>

      <div className="px-6 md:px-10 text-ink/40 gsap-reveal">
        <Divider />
      </div>

      {/* Body — kind-specific */}
      {isDesign ? <DesignedCase project={project} /> : <EngineeredCase project={project} />}

      {/* Pull-quote / spacer with one ornament */}
      <section className="relative px-6 md:px-10 py-24 md:py-32 flex items-center justify-center">
        <div className="text-rust opacity-80">
          <Asterisk size={56} spinning />
        </div>
      </section>

      {/* Prev / next */}
      <section className="relative px-6 md:px-10 pb-24 md:pb-32 border-t border-ink/15 pt-10">
        <div className="grid grid-cols-12 gap-6 items-end">
          <Link
            to={`/work/${prev.slug}`}
            className="group col-span-12 md:col-span-6 block"
          >
            <div className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink/40 mb-2 flex items-center gap-3">
              <span className="inline-block transition-transform group-hover:-translate-x-1">←</span>
              <span>Previous · {prev.index}</span>
            </div>
            <div className="font-display text-3xl md:text-5xl leading-[0.95] tracking-tight text-ink/85 group-hover:text-rust transition-colors">
              {prev.title}
            </div>
            <div className="mt-1 text-[11px] font-mono uppercase tracking-[0.22em] text-ink/40">
              {prev.kind}
            </div>
          </Link>

          <Link
            to={`/work/${next.slug}`}
            className="group col-span-12 md:col-span-6 md:text-right block"
          >
            <div className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink/40 mb-2 flex md:justify-end items-center gap-3">
              <span>Next · {next.index}</span>
              <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </div>
            <div className="font-display text-3xl md:text-5xl leading-[0.95] tracking-tight text-ink/85 group-hover:text-rust transition-colors">
              {next.title}
            </div>
            <div className="mt-1 text-[11px] font-mono uppercase tracking-[0.22em] text-ink/40">
              {next.kind}
            </div>
          </Link>
        </div>

        <div className="mt-12 flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.22em] text-ink/40">
          <Link to="/" className="flex items-center gap-3 hover:text-ink transition-colors">
            <span>Back to index</span>
            <ArrowDoodle className="text-rust -scale-x-100" />
          </Link>
          <span>HC / Folio '26</span>
        </div>
      </section>
    </motion.main>
  )
}
