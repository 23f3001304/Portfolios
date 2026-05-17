import { motion } from 'framer-motion'
import { Plus, TickRail } from '../Ornaments.jsx'
import QuizzyArchitecture from './visuals/QuizzyArchitecture.jsx'
import AnimyVideos from './visuals/AnimyVideos.jsx'
import GitInternals from './visuals/GitInternals.jsx'

// Long-form copy expanded from the resume bullets, per project.
// Kept here (not in projects.js) so projects.js stays a tight catalog.
const COPY = {
  quizzy: {
    paragraphs: [
      "A FastAPI backend that treats agents as a first-class architectural layer. The system is partitioned into four concerns - agents, models, tools, and core - so each can change without dragging the others along.",
      "Pipelines compose 50+ custom Pydantic-typed tools. Long-running work is routed onto a background queue rather than holding HTTP connections; the frontend polls a small status endpoint instead. The whole service is a single Docker image deployable to Heroku in one push.",
      "It was graded against a 24-scenario adversarial battery covering prompt injection, tool selection edge cases, partial failures, and degenerate inputs. 22 of 24 passed; final score 92 / 100.",
    ],
    quote: '92 / 100 on adversarial evals. 22 of 24 scenarios passed.',
    decisions: [
      ['FastAPI', 'Type-driven contracts and async-first request handling. Pydantic everywhere keeps the agent <-> tool boundary honest.'],
      ['Background queue', 'Long jobs do not occupy a request lifecycle. The client polls a status endpoint instead of holding a socket open.'],
      ['Docker, single image', 'One artifact, one push. Heroku is target zero so we kept the container small and the entrypoint stupid.'],
      ['No streaming SSE', 'Considered for status updates - rejected. The polling cost is negligible at our request rate and the failure modes are easier to reason about.'],
    ],
  },

  animy: {
    paragraphs: [
      "ANIMY converts a written prompt into an animated short. It is split into three tiers so each can scale independently: a React frontend collects the prompt and shows progress, an API backend handles auth and queueing, and a Python render backend executes generation jobs.",
      "Render throughput climbed from a single-thread baseline to ~10 videos / hour by running four parallel render threads. The bottleneck shifted from compute to disk I/O; the next move is a shared cache layer.",
      "Two real-time update strategies were prototyped. WebSockets won on perceived latency but lost on operational complexity (reconnect storms, sticky-session requirements, idle-connection costs). We shipped polling and revisited the trade-off later.",
    ],
    quote: '10 videos / hour. WebSockets cut after architectural cost analysis.',
    decisions: [
      ['Three-tier split', 'The render backend is the only stateful piece. Keeping it isolated means the API can be redeployed without touching jobs in flight.'],
      ['4 parallel threads', 'Tuned to the host CPU. Beyond 4, contention costs wiped out gains - the bottleneck moves to disk.'],
      ['Polling > WebSockets', 'Reconnect storms and sticky-session ops were not worth the perceived latency win. Polling is boring and boring scaled.'],
    ],
  },

  'build-my-own-git': {
    paragraphs: [
      "A re-implementation of Git's plumbing in Node.js, written to demystify what `git` actually does on disk. The goal was not a library - it was understanding.",
      "Six commands are implemented end-to-end: init, hash-object, write-tree, commit-tree, ls-tree, cat-file. They cover the loop of staging content, hashing it into a content-addressed object store, and walking trees back out.",
      "Three object types are persisted: blobs, trees, commits. SHA-1 is computed by hand (Node crypto under the hood) and used to address every object. The `.git` layout matches native Git closely enough that the official client can read what we write.",
    ],
    quote: 'Recreated `.git`. SHA-1, three object types, six plumbing commands.',
    decisions: [
      ['Node.js, no deps', 'Stdlib only. The point was to write the bytes ourselves, not lean on a library that already does it.'],
      ['Plumbing first', 'No porcelain commands. If you understand init / hash-object / write-tree / commit-tree, the rest is sugar.'],
      ['Persistent .git layout', 'Official Git reads our objects. That was the test for "did we get the format right".'],
    ],
  },
}

export default function EngineeredCase({ project }) {
  const copy = COPY[project.slug] || { paragraphs: [project.blurb], quote: '', decisions: [] }

  return (
    <>
      {/* Long-form blurb */}
      <section className="relative px-6 md:px-10 py-16 md:py-24">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-3 text-[11px] font-mono uppercase tracking-[0.22em] text-ink/40">
            Notes
          </div>
          <div className="col-span-12 md:col-span-9 max-w-[60ch] space-y-6 text-ink/85 leading-relaxed">
            {copy.paragraphs.map((p, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: i * 0.05, duration: 0.6 }}
                className="text-base md:text-lg"
              >
                {p}
              </motion.p>
            ))}
          </div>
        </div>
      </section>

      {/* Visual marker — the project's signature block */}
      <section className="relative px-6 md:px-10 py-16 md:py-24 border-t border-ink/15">
        <div className="grid grid-cols-12 gap-6 mb-10">
          <div className="col-span-12 md:col-span-3 text-[11px] font-mono uppercase tracking-[0.22em] text-ink/40">
            Visual
          </div>
          <div className="col-span-12 md:col-span-9 font-mono text-[11px] uppercase tracking-[0.22em] text-ink/55 flex items-center gap-3">
            <span>{project.title}</span>
            <TickRail className="text-ink/35" />
          </div>
        </div>

        {/* Project-specific visual */}
        {project.slug === 'quizzy' && <QuizzyArchitecture />}
        {project.slug === 'animy' && <AnimyVideos project={project} />}
        {project.slug === 'build-my-own-git' && <GitInternals />}
      </section>

      {/* Stack & decisions */}
      <section className="relative px-6 md:px-10 py-16 md:py-24 border-t border-ink/15">
        <div className="grid grid-cols-12 gap-6 mb-8">
          <div className="col-span-12 md:col-span-3 text-[11px] font-mono uppercase tracking-[0.22em] text-ink/40">
            Decisions
          </div>
          <h3 className="col-span-12 md:col-span-9 font-display text-3xl md:text-5xl leading-[1.05] tracking-tight max-w-[24ch]">
            What was used, and the trade-off behind each.
          </h3>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="hidden md:block md:col-span-3" />
          <ul className="col-span-12 md:col-span-9 border-t border-ink/15">
            {copy.decisions.map(([label, note], i) => (
              <motion.li
                key={label}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: i * 0.04, duration: 0.5 }}
                className="grid grid-cols-12 gap-4 items-baseline border-b border-ink/15 py-5"
              >
                <span className="col-span-12 md:col-span-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/85 flex items-center gap-2">
                  <span className="text-rust"><Plus size={9} /></span>
                  {label}
                </span>
                <span className="col-span-12 md:col-span-9 text-ink/75 leading-relaxed">{note}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* Pull quote */}
      {copy.quote && (
        <section className="relative px-6 md:px-10 py-20 md:py-28 border-t border-ink/15">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-3 text-[11px] font-mono uppercase tracking-[0.22em] text-ink/40">
              Outcome
            </div>
            <p className="col-span-12 md:col-span-9 font-display italic text-[clamp(1.75rem,4.5vw,4.5rem)] leading-[1.05] tracking-[-0.01em] text-ink max-w-[24ch]">
              <span className="text-rust">"</span>
              {copy.quote}
              <span className="text-rust">"</span>
            </p>
          </div>
        </section>
      )}

      {/* External link */}
      <section className="relative px-6 md:px-10 py-16 md:py-20 border-t border-ink/15">
        <div className="grid grid-cols-12 gap-6 items-center">
          <div className="col-span-12 md:col-span-3 text-[11px] font-mono uppercase tracking-[0.22em] text-ink/40">
            Source
          </div>
          <div className="col-span-12 md:col-span-9 flex flex-wrap gap-x-8 gap-y-3">
            {project.links?.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-baseline gap-2 font-display text-2xl md:text-4xl text-ink hover:text-rust transition-colors"
              >
                GitHub
                <span className="inline-block transition-transform group-hover:translate-x-1 text-rust">↗</span>
              </a>
            )}
            {project.links?.website && (
              <a
                href={project.links.website}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-baseline gap-2 font-display text-2xl md:text-4xl text-ink hover:text-rust transition-colors"
              >
                Live site
                <span className="inline-block transition-transform group-hover:translate-x-1 text-rust">↗</span>
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
