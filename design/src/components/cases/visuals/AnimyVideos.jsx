import { useState } from 'react'
import { motion } from 'framer-motion'

// Three video embeds with their generation prompts. The prompt copy below is
// approximated from the YouTube descriptions of each video; replace with the
// exact text once Hemang confirms (see PROGRESS.md "Open questions").

const PROMPTS = {
  zYsFwM4dH2A: {
    label: 'Intro',
    note: 'Walkthrough of the system - frontend, API, render backend.',
    prompt:
      'A short showcase of the ANIMY pipeline. The video introduces the three components and shows a sample render end-to-end.',
  },
  'eylqHhzs-7Q': {
    label: 'Generation 1',
    note: 'First public generation - prompt taken from YouTube description.',
    prompt:
      'Generation 1 prompt is documented in the YouTube description. Confirm exact wording before publishing.',
  },
  '3WA5Cck6mv4': {
    label: 'Generation 2',
    note: 'Second generation iteration with a refined prompt.',
    prompt:
      'Generation 2 prompt is documented in the YouTube description. Confirm exact wording before publishing.',
  },
}

function VideoCard({ video, idx, accent }) {
  const meta = PROMPTS[video.id] || { label: video.label, note: '', prompt: '' }
  const [loaded, setLoaded] = useState(false)

  return (
    <motion.figure
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay: idx * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      {/* Frame label */}
      <div className="flex items-baseline justify-between mb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ink/55">
        <span className="text-ink">
          <span className="text-rust">●</span> Reel {String(idx + 1).padStart(2, '0')}
        </span>
        <span>{meta.label}</span>
      </div>

      {/* Embed */}
      <div className="relative aspect-video bg-bone border border-ink/15 overflow-hidden">
        {!loaded && (
          <button
            type="button"
            onClick={() => setLoaded(true)}
            className="absolute inset-0 flex items-center justify-center group/play"
            aria-label={`Play ${meta.label}`}
          >
            <img
              src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover/play:opacity-100 transition-opacity"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-paper/70 via-paper/10 to-paper/0" />
            <div className="relative z-[1] flex items-center gap-3 px-4 py-2 bg-paper/85 border border-ink/20 backdrop-blur-sm font-mono text-[11px] uppercase tracking-[0.22em] text-ink">
              <span className="block w-0 h-0 border-y-[6px] border-y-transparent border-l-[10px] border-l-rust" />
              Play
            </div>
          </button>
        )}
        {loaded && (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
            title={meta.label}
            className="absolute inset-0 w-full h-full"
            loading="lazy"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>

      {/* Caption + prompt */}
      <figcaption className="mt-4">
        <div className="text-[12px] text-ink/65 leading-snug">{meta.note}</div>
        {meta.prompt && (
          <details className="mt-3 group/d">
            <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-[0.22em] text-ink/55 hover:text-rust transition-colors">
              Prompt ↗
            </summary>
            <pre className="mt-2 p-3 bg-bone border border-ink/15 font-mono text-[11px] leading-relaxed text-ink/85 whitespace-pre-wrap">
{meta.prompt}
            </pre>
          </details>
        )}
        <a
          href={`https://www.youtube.com/watch?v=${video.id}`}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-block font-mono text-[11px] uppercase tracking-[0.22em] text-ink/55 hover:text-rust transition-colors"
        >
          Open on YouTube ↗
        </a>
      </figcaption>
    </motion.figure>
  )
}

export default function AnimyVideos({ project }) {
  const videos = project?.visual?.videos || []
  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {videos.map((v, i) => (
          <VideoCard key={v.id} video={v} idx={i} accent={project.accent} />
        ))}
      </div>

      {/* Throughput callouts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-ink/15 pt-6">
        {[
          ['3', 'tier system'],
          ['4', 'parallel render threads'],
          ['10+', 'videos / hour'],
          ['2', 'real-time strategies tested'],
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
