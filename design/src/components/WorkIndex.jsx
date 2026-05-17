import { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { Link } from 'react-router-dom'
import { projects } from '../data/projects.js'
import { ArrowDoodle } from './Ornaments.jsx'

// Picks the best available visual: explicit image > YouTube thumbnail > typographic fallback.
const DEFAULT_ASPECT = 320 / 210
const PRELOADED_SOURCES = new Set()

function getProjectVisualSrc(project) {
  const yt = project.visual?.kind === 'youtube' ? project.visual.videos[0] : null
  return project.image || (yt ? `https://i.ytimg.com/vi/${yt.id}/hqdefault.jpg` : null)
}

function preloadImage(src) {
  if (!src || PRELOADED_SOURCES.has(src)) return

  const img = new Image()
  img.decoding = 'async'
  img.onload = () => PRELOADED_SOURCES.add(src)
  img.onerror = () => {
    /* ignore errors for preload */
  }
  img.src = src
}

function ProjectTile({ project }) {
  if (!project) return null
  const imgSrc = getProjectVisualSrc(project)
  const hasImage = Boolean(imgSrc)
  const [displaySrc, setDisplaySrc] = useState(imgSrc)

  const aspect = project.aspect || DEFAULT_ASPECT

  useEffect(() => {
    if (!imgSrc) {
      setDisplaySrc(null)
      return undefined
    }

    let cancelled = false

    if (PRELOADED_SOURCES.has(imgSrc)) {
      setDisplaySrc(imgSrc)
      return undefined
    }

    const img = new Image()
    img.decoding = 'async'
    img.src = imgSrc

    if (img.complete) {
      PRELOADED_SOURCES.add(imgSrc)
      setDisplaySrc(imgSrc)
      return undefined
    }

    img.onload = () => {
      if (cancelled) return
      PRELOADED_SOURCES.add(imgSrc)
      setDisplaySrc(imgSrc)
    }

    img.onerror = () => {
      if (cancelled) return
      setDisplaySrc(null)
    }

    return () => {
      cancelled = true
    }
  }, [imgSrc])

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        background: project.accent || '#171A21',
        aspectRatio: aspect,
        // aspect-ratio is animatable in CSS; use the site's default ease so the
        // tile glides between project sizes instead of popping on hover swap.
        transition: 'aspect-ratio 450ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      {hasImage && displaySrc && (
        <img
          src={displaySrc}
          srcSet={`${displaySrc}?w=320 320w, ${displaySrc}?w=640 640w`}
          sizes="(max-width: 768px) 100vw, 50vw"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: project.imagePosition || 'center', willChange: 'opacity, transform' }}
          loading="lazy"
          decoding="async"
          width={320}
          height={Math.round(320 / aspect)}
        />
      )}

      {/*
        Notes: For even faster previews consider adding a low-res `preview`
        field to `projects` (or generating thumbnails) and using that here as
        the immediate src while the full image loads in the background.
      */}
      {/* Dark scrim so the light corner labels stay readable on top of any
          image. Uses `paper` (dark) - the previous version used `ink` which
          flipped to cream when the theme went dark, washing the image out. */}
      {hasImage && <div className="absolute inset-0 bg-gradient-to-t from-paper/80 via-paper/10 to-paper/55" />}
      <div className="absolute inset-0 flex flex-col justify-between p-5 text-ink">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] opacity-90">
          {project.index} / {project.kind}
        </div>
        <div className="font-display  text-3xl leading-[0.95] tracking-tight">
          {project.title}
        </div>
      </div>
    </div>
  )
}

export default function WorkIndex() {
  const [hoverIndex, setHoverIndex] = useState(null)
  const wrapRef = useRef(null)

  useEffect(() => {
    projects.forEach((project) => {
      preloadImage(getProjectVisualSrc(project))
    })
  }, [])

  // Cursor-follow tile, springed
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 300, damping: 32, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 300, damping: 32, mass: 0.5 })
  const flipX = useMotionValue(0)
  const sFlipX = useSpring(flipX, { stiffness: 280, damping: 40, mass: 0.6 })

  function handleMove(e) {
    const rect = wrapRef.current?.getBoundingClientRect()
    if (!rect) return
    
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    
    // Check if we're near the right edge (tile is 320px wide)
    const tileWidth = 400
    const buffer = 140
    const spaceFromRight = rect.width - mouseX
    
    // If near right edge, position tile to the left of cursor (negative)
    // Otherwise position to the right of cursor (positive)
    // Reduced gap from 200/160 to 140/100 for closer positioning
    if (spaceFromRight < tileWidth / 2 + buffer) {
      flipX.set(-440) // Position left of cursor with smaller gap
    } else {
      flipX.set(50) // Position right of cursor with smaller gap
    }
    
    x.set(mouseX)
    y.set(mouseY)
  }

  // `displayed` is the project visible in the tile. It mirrors the hovered project
  // when one is hovered, but stays put when the user moves out of the section so the
  // tile fades out gracefully instead of blanking before fading.
  const [displayed, setDisplayed] = useState(projects[0])
  useEffect(() => {
    if (hoverIndex !== null) setDisplayed(projects[hoverIndex])
  }, [hoverIndex])

  return (
    <section
      id="work"
      className="relative px-6 md:px-10 py-28 md:py-40  "
      ref={wrapRef}
      onMouseMove={handleMove}
      onMouseLeave={() => setHoverIndex(null)}
    >
      {/* Corner crosshairs */}
      {/* <Crosshair className="absolute top-6 left-3 text-ink/25" />
      <Crosshair className="absolute top-6 right-3 text-ink/25" />
      <Crosshair className="absolute bottom-6 left-3 text-ink/25" />
      <Crosshair className="absolute bottom-6 right-3 text-ink/25" /> */}

      <div className="grid grid-cols-12 gap-6 mb-14 md:mb-20">
        <div className="col-span-12 md:col-span-3 text-[11px] font-mono uppercase tracking-[0.22em] text-ink/50">
          §02 / Selected Works
        </div>
        <h2 className="col-span-12 md:col-span-9 font-display text-[clamp(2.5rem,6.5vw,6.5rem)] leading-[1.06] tracking-[0.01em] pb-2">
          Eight things I'm <em className="text-rust">proud</em> of.
          <br />
          Three shipped, five drawn.
        </h2>
      </div>

      {/* Floating cursor-follow tile. One persistent DOM node.
          Show/hide via opacity. Project content swaps in place (no remount, no flicker).
          We keep the last hovered project as `displayed` so the tile fades out gracefully
          on mouse leave without first blanking. */}
      <motion.div
        aria-hidden
        style={{ x: sx, y: sy, translateX: sFlipX }}
        className="pointer-events-none hidden md:block absolute top-0 left-0 z-10 -translate-y-1/2"
      >
        <motion.div
          animate={{
            opacity: hoverIndex !== null ? 1 : 0,
            scale: hoverIndex !== null ? 1 : 0.92,
          }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="w-[320px] shadow-[0_30px_60px_-30px_rgba(14,14,12,0.5)] overflow-hidden"
        >
          <ProjectTile project={displayed} />
        </motion.div>
      </motion.div>

      <div className="border-t border-ink/15">
        {projects.map((p, i) => {
          const otherHovered = hoverIndex !== null && hoverIndex !== i
          return (
            <Link
              key={p.slug}
              to={`/work/${p.slug}`}
              onMouseEnter={() => {
                setHoverIndex(i)
                preloadImage(getProjectVisualSrc(p))
              }}
              onFocus={() => {
                setHoverIndex(i)
                preloadImage(getProjectVisualSrc(p))
              }}
              data-cursor="hover"
              className="group relative grid grid-cols-12 gap-3 md:gap-4 items-baseline border-b border-ink/15 py-6 md:py-9 transition-[opacity,color] duration-300 will-change-transform overflow-hidden"
              style={{ opacity: otherHovered ? 0.32 : 1 }}
            >
              <span className="col-span-2 md:col-span-1 font-mono text-[10px] md:text-sm tabular-nums text-ink/50">
                {p.index}
              </span>
              <span
                className="col-span-7 md:col-span-5 font-display text-[clamp(1.45rem,7vw,5.5rem)] leading-[0.92] tracking-tighter inline-block transition-[transform,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-3 group-hover:text-rust"
              >
                {p.title}
              </span>
              <span className="hidden md:block col-span-2 font-mono text-xs uppercase tracking-[0.18em] text-ink/60">
                {p.kind}
              </span>
              <span className="hidden md:block col-span-2 font-mono text-xs uppercase tracking-[0.18em] text-ink/60">
                {p.role}
              </span>
              <span className="col-span-3 md:col-span-2 text-right font-mono text-[10px] md:text-xs tabular-nums text-ink/60">
                {p.year}
                <span className="ml-2 md:ml-3 inline-block transition-transform duration-500 group-hover:translate-x-2 group-hover:text-rust">
                  ↗
                </span>
              </span>
            </Link>
          )
        })}
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center text-[11px] font-mono uppercase tracking-[0.18em] text-ink/50">
        <div className="md:col-span-3">3 × engineered · 5 × designed</div>
        <div className="hidden md:flex col-span-6 items-center justify-center gap-3 text-ink/40">
          <span>move cursor</span>
          <ArrowDoodle className="text-rust" />
          <span>for preview</span>
        </div>
        <div className="md:col-span-3 md:text-right">
          {projects.length} works · 2024 / 2026
        </div>
      </div>
    </section>
  )
}
