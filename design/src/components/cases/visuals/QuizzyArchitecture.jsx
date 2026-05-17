import { motion } from 'framer-motion'

// A schematic diagram of the four-layer Quizzy architecture.
// SVG-only, currentColor-aware, no images.

const LAYERS = [
  {
    id: 'agents',
    label: 'Agents',
    sub: 'Routers · pipelines · orchestration',
    items: ['agent.run', 'agent.compose', 'agent.fallback'],
  },
  {
    id: 'tools',
    label: 'Tools',
    sub: '50+ Pydantic-typed tools',
    items: ['search()', 'sql()', 'rank()', 'extract()', '+46'],
  },
  {
    id: 'models',
    label: 'Models',
    sub: 'Pydantic schemas · IO contracts',
    items: ['Question', 'Answer', 'Trace', 'EvalScore'],
  },
  {
    id: 'core',
    label: 'Core',
    sub: 'Queue · storage · auth · clients',
    items: ['queue', 'storage', 'auth', 'http'],
  },
]

const flow = {
  hidden: { opacity: 0, y: 8 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function QuizzyArchitecture() {
  return (
    <div className="relative">
      {/* Header strip - input flow */}
      <div className="grid grid-cols-12 gap-4 items-center mb-6 font-mono text-[11px] uppercase tracking-[0.2em] text-ink/55">
        <div className="col-span-12 md:col-span-3 text-ink/85">HTTP request →</div>
        <div className="hidden md:block col-span-9 h-px bg-ink/20" />
      </div>

      {/* Layer stack */}
      <div className="grid grid-cols-12 gap-3 md:gap-5">
        {LAYERS.map((layer, i) => (
          <motion.div
            key={layer.id}
            custom={i}
            variants={flow}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="col-span-12 md:col-span-3 relative border border-ink/15 bg-bone/40 p-5 backdrop-blur-[1px]"
          >
            {/* Index pin */}
            <div className="absolute -top-2 left-3 px-1.5 bg-paper text-rust font-mono text-[10px] tracking-[0.18em]">
              0{i + 1}
            </div>

            <div className="flex items-baseline justify-between mb-1">
              <h4 className="font-display text-2xl md:text-3xl tracking-tight text-ink">
                {layer.label}
              </h4>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/40">
                Layer
              </span>
            </div>
            <div className="text-[12px] text-ink/55 leading-snug mb-4">{layer.sub}</div>

            <ul className="space-y-1.5 font-mono text-[11px] text-ink/80">
              {layer.items.map((it) => (
                <li key={it} className="flex items-center gap-2">
                  <span className="block w-1.5 h-1.5 rounded-full bg-rust" />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Footer strip - output flow */}
      <div className="grid grid-cols-12 gap-4 items-center mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-ink/55">
        <div className="hidden md:block col-span-9 h-px bg-ink/20" />
        <div className="col-span-12 md:col-span-3 text-ink/85 md:text-right">→ Background queue</div>
      </div>

      {/* Numerical callouts */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-ink/15 pt-6">
        {[
          ['3+', 'agent-tool pipelines'],
          ['50+', 'custom tools'],
          ['22 / 24', 'eval scenarios'],
          ['92 / 100', 'final score'],
        ].map(([n, l]) => (
          <div key={l}>
            <div className="font-display text-3xl md:text-5xl leading-[0.95] tracking-tight tabular-nums text-ink">
              {n}
            </div>
            <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/55">
              {l}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
