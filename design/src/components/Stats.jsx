import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DotGrid, Asterisk, Plus, TickRail } from './Ornaments.jsx'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { value: 8, suffix: '', label: 'Works', sub: '3 shipped · 5 drawn' },
  { value: 22, suffix: '/24', label: 'Quizzy evals', sub: '92 of 100 score' },
  { value: 1000, suffix: '+', label: 'Image pairs', sub: 'CycleGAN at DRDO' },
  { value: 2, suffix: '', label: 'Degrees', sub: 'MBM × IIT Madras' },
]

function Counter({ to, suffix }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obj = { v: 0 }
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          v: to,
          duration: 1.6,
          ease: 'power3.out',
          onUpdate: () => {
            el.textContent = Math.round(obj.v).toString() + suffix
          },
        })
      },
    })
    return () => trigger.kill()
  }, [to, suffix])
  return <span ref={ref}>0{suffix}</span>
}

export default function Stats() {
  return (
    <section className="relative px-6 md:px-10 py-20 md:py-28 border-b border-ink/15 overflow-hidden">
      {/* Faint dot grid texture */}
      <div className="text-ink/15">
        <DotGrid spacing={28} />
      </div>

      <div className="relative grid grid-cols-12 gap-6 mb-10">
        <div className="col-span-12 md:col-span-3 flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.22em] text-ink/50">
          <span className="text-rust">
            <Asterisk size={12} spinning />
          </span>
          <span>§01.5 / By the numbers</span>
        </div>
        <p className="col-span-12 md:col-span-7 font-display italic text-2xl md:text-4xl leading-[1.2] tracking-tight">
          A few quantities I'm fond of, in no particular order.
        </p>
      </div>

      <div className="relative grid grid-cols-2 md:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={[
              'relative pt-6 md:pt-8 pl-4 pb-8 md:pb-10 px-2 md:px-5 bg-paper/60 backdrop-blur-[1px]',
              i > 0 ? 'md:border-l border-ink/15' : '',
              i === 1 || i === 3 ? 'border-l border-ink/15 md:border-l' : '',
              i >= 2 ? 'border-t border-ink/15 md:border-t-0' : '',
            ].join(' ')}
          >
            {/* tiny plus at the inner-corner */}
            {i > 0 && (
              <span className="hidden md:block absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 text-ink/60 bg-paper px-0.5">
                <Plus size={10} />
              </span>
            )}
            <div className="flex items-baseline gap-2">
              <div className="font-display text-[clamp(3rem,9vw,9rem)] leading-[0.9] tracking-tightest tabular-nums">
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <span className="text-rust opacity-70">
                <Asterisk size={14} />
              </span>
            </div>
            <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/70">
              {s.label}
            </div>
            <div className="mt-1 text-sm text-ink/50">{s.sub}</div>
            <div className="mt-3 text-ink/40">
              <TickRail />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
