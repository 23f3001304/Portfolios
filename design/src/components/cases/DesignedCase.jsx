import { motion } from 'framer-motion'
import { Plus } from '../Ornaments.jsx'

// Long-form copy + section breakdowns per design project.
// For STIC and Mentor Hub we have a hero image already; the other three are
// rate-limited on Figma MCP and will be filled in next session (see PROGRESS.md).

const COPY = {
  'stic-website': {
    paragraphs: [
      "An end-to-end website system designed in Figma. The work covers the marketing surface end-to-end - hero, sections, components - structured as a single page hierarchy that makes the parts findable for engineering hand-off.",
      "Type and grid were locked early so each section reads as a continuation of the last. The component library carries the heavier lifts: cards, lists, embedded forms, footers.",
    ],
    sections: [
      ['Hero',        'Headline · supporting line · primary action.'],
      ['Sections',    'Marketing blocks for features, value props, social proof.'],
      ['Components',  'Cards, lists, forms, footer, dividers.'],
      ['Type & grid', 'A shared type scale and 12-column grid binds the page together.'],
    ],
    notes: [
      ['Type',     'Display + workhorse text face. Mono used as meta only.'],
      ['Palette',  'Single accent applied to actions and emphasis. Neutrals carry the rest.'],
      ['Spacing',  'Section vertical rhythm holds across breakpoints.'],
    ],
  },

  'mentor-hub': {
    paragraphs: [
      "Mentor Hub is a mentorship-platform interface explored as a mobile-first set of flows. The frame in view is one of several screens that move the user from sign-in through profile through booking.",
      "The visual system favors generous whitespace, a quiet neutral palette, and a single accent that signals action. State is communicated by hierarchy and motion rather than chrome.",
    ],
    sections: [
      ['Auth',        'Sign-in, sign-up, recovery.'],
      ['Discovery',   'Browse mentors by topic, availability, rate.'],
      ['Profile',     'Mentor detail page - bio, sessions, reviews.'],
      ['Booking',     'Time-slot picker, confirmation, calendar handoff.'],
      ['Sessions',    'Upcoming, history, notes.'],
    ],
    notes: [
      ['Mobile-first',  'Designed for small screens; desktop is a layout response, not a separate brief.'],
      ['Single accent', 'One color carries primary action across the whole platform.'],
      ['Hierarchy',     'Type scale and weight do most of the work; chrome stays out of the way.'],
    ],
  },

  'untitled-explorations': {
    paragraphs: [
      "A loose set of visual explorations - typography, layout, and a few motion studies. The file is intentionally less structured than a delivered product; it is a sketchbook.",
      "Pulling individual frames into this case page is on the next-session list - the Figma MCP rate-limited before the full extraction completed.",
    ],
    sections: [
      ['Studies',  'Type-led layouts at extreme scale.'],
      ['Motion',   'Short loops exploring rhythm and rest.'],
      ['Misc',     'Scratch frames, color tests, palette dumps.'],
    ],
    notes: [
      ['Loose',     'Sketchbook posture - less polish, more range.'],
      ['Type-led',  'Most frames begin with a sentence and a scale ratio.'],
    ],
  },

  'spider-man': {
    paragraphs: [
      "A thematic concept piece - a Spider-Man-themed interface study. The brief was self-set: take a strong visual IP, design an interface that lives in its world without dressing up as fan art.",
      "Frames will be pulled in once the Figma MCP quota resets.",
    ],
    sections: [
      ['Concept',  'A single thematic premise that constrains every other decision.'],
      ['Frames',   'Detail screens, transitions, motion notes.'],
    ],
    notes: [
      ['Theme as constraint', 'The IP narrows the palette and motion vocabulary; that constraint is the design.'],
      ['Restraint',           'No fan-art crutches. The design has to stand on its own typographic and layout choices.'],
    ],
  },

  'stdlib-girsh': {
    paragraphs: [
      "Visual identity and interface explorations under the working title `stdlib_girsh`. A loose body of work - mostly type and layout studies - waiting on extraction.",
      "Frames will be pulled in once the Figma MCP quota resets.",
    ],
    sections: [
      ['Identity', 'Wordmark, lockups, color tests.'],
      ['Frames',   'Sample interface compositions.'],
    ],
    notes: [
      ['Working title', 'The name is provisional. The system is what is being built, not the brand surface.'],
    ],
  },
}

export default function DesignedCase({ project }) {
  const copy = COPY[project.slug] || { paragraphs: [project.blurb], sections: [], notes: [] }
  const hasImage = Boolean(project.image)

  return (
    <>
      {/* Long blurb */}
      <section className="relative px-6 md:px-10 py-16 md:py-24">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-3 text-[11px] font-mono uppercase tracking-[0.22em] text-ink/40">
            Brief
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

      {/* Hero frame - either real image or a placeholder treatment */}
      <section className="relative px-6 md:px-10 py-12 md:py-20 border-t border-ink/15">
        <div className="grid grid-cols-12 gap-6 mb-8">
          <div className="col-span-12 md:col-span-3 text-[11px] font-mono uppercase tracking-[0.22em] text-ink/40">
            Frame
          </div>
          <div className="col-span-12 md:col-span-9 font-mono text-[11px] uppercase tracking-[0.22em] text-ink/55 flex items-center gap-3">
            <span>{project.title}</span>
            <span className="text-ink/30">·</span>
            <span>Figma export</span>
          </div>
        </div>

        {hasImage ? (
          <motion.figure
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative border border-ink/15 bg-bone overflow-hidden"
          >
            <img
              src={project.image}
              alt={`${project.title} preview frame`}
              className="block w-full h-auto"
              loading="lazy"
            />
            {/* Frame label tag */}
            <figcaption className="absolute top-3 left-3 px-2 py-1 bg-paper/85 backdrop-blur-sm border border-ink/15 font-mono text-[10px] uppercase tracking-[0.22em] text-ink/85">
              {project.title} · 1 of n
            </figcaption>
          </motion.figure>
        ) : (
          <PlaceholderFrame project={project} />
        )}
      </section>

      {/* Section / page index */}
      {copy.sections.length > 0 && (
        <section className="relative px-6 md:px-10 py-16 md:py-24 border-t border-ink/15">
          <div className="grid grid-cols-12 gap-6 mb-8">
            <div className="col-span-12 md:col-span-3 text-[11px] font-mono uppercase tracking-[0.22em] text-ink/40">
              Sections
            </div>
            <h3 className="col-span-12 md:col-span-9 font-display text-3xl md:text-5xl leading-[1.05] tracking-tight max-w-[28ch]">
              The spine of the file, section by section.
            </h3>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="hidden md:block md:col-span-3" />
            <ul className="col-span-12 md:col-span-9 border-t border-ink/15">
              {copy.sections.map(([label, note], i) => (
                <motion.li
                  key={label}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ delay: i * 0.04, duration: 0.5 }}
                  className="grid grid-cols-12 gap-4 items-baseline border-b border-ink/15 py-5"
                >
                  <span className="col-span-2 md:col-span-1 font-mono text-[11px] tabular-nums text-ink/45">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="col-span-10 md:col-span-3 font-display text-xl md:text-2xl tracking-tight text-ink">
                    {label}
                  </span>
                  <span className="col-span-12 md:col-span-8 text-ink/70 leading-relaxed">
                    {note}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Process notes */}
      {copy.notes.length > 0 && (
        <section className="relative px-6 md:px-10 py-16 md:py-24 border-t border-ink/15">
          <div className="grid grid-cols-12 gap-6 mb-8">
            <div className="col-span-12 md:col-span-3 text-[11px] font-mono uppercase tracking-[0.22em] text-ink/40">
              Process
            </div>
            <h3 className="col-span-12 md:col-span-9 font-display text-3xl md:text-5xl leading-[1.05] tracking-tight max-w-[28ch]">
              How the work was made.
            </h3>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="hidden md:block md:col-span-3" />
            <ul className="col-span-12 md:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-4">
              {copy.notes.map(([label, body]) => (
                <li
                  key={label}
                  className="border border-ink/15 bg-bone/40 p-5"
                >
                  <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ink/65 mb-2">
                    <span className="text-rust"><Plus size={9} /></span>
                    {label}
                  </div>
                  <p className="text-ink/80 leading-relaxed text-[14px]">{body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* External link */}
      <section className="relative px-6 md:px-10 py-16 md:py-20 border-t border-ink/15">
        <div className="grid grid-cols-12 gap-6 items-center">
          <div className="col-span-12 md:col-span-3 text-[11px] font-mono uppercase tracking-[0.22em] text-ink/40">
            File
          </div>
          <div className="col-span-12 md:col-span-9">
            {project.links?.figma ? (
              <a
                href={project.links.figma}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-baseline gap-2 font-display text-2xl md:text-4xl text-ink hover:text-rust transition-colors"
              >
                Open in Figma
                <span className="inline-block transition-transform group-hover:translate-x-1 text-rust">↗</span>
              </a>
            ) : (
              <span className="text-ink/55 font-mono text-[11px] uppercase tracking-[0.22em]">
                File link pending
              </span>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

// Used when we don't yet have an exported frame for the project. Renders a
// typographic stand-in that respects the dark palette, with the project's
// accent and a status note explaining why.
function PlaceholderFrame({ project }) {
  return (
    <div className="relative aspect-[16/9] border border-ink/15 overflow-hidden bg-bone">
      {/* Tinted wash from the project's accent */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(120% 80% at 30% 30%, ${project.accent}40, transparent 60%)`,
        }}
      />
      {/* Diagonal hatch */}
      <svg className="absolute inset-0 w-full h-full opacity-15 text-ink" aria-hidden>
        <defs>
          <pattern id={`hatch-${project.slug}`} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="14" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#hatch-${project.slug})`} />
      </svg>

      <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-10 text-ink">
        <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.22em] text-ink/65">
          <span>Frame · pending</span>
          <span>{project.index} / {project.kind}</span>
        </div>

        <div>
          <div className="font-display text-3xl md:text-6xl leading-[0.95] tracking-tight">
            {project.title}
          </div>
          <div className="mt-3 max-w-[44ch] text-[12px] md:text-[13px] text-ink/70 leading-relaxed">
            Figma frame export is pending - the MCP quota rate-limited mid-extraction.
            Drop a 2x PNG into <code className="font-mono">public/figma/{project.slug}.png</code> and
            wire it via the <code className="font-mono">image</code> field in <code className="font-mono">projects.js</code>.
          </div>
        </div>
      </div>
    </div>
  )
}
