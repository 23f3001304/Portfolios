import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Asterisk } from '../components/Ornaments.jsx'

export default function NotFound() {
  return (
    <main className="relative grain bg-paper text-ink min-h-screen flex items-center px-6 md:px-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="grid grid-cols-12 gap-6 w-full"
      >
        <div className="col-span-12 md:col-span-3 flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.22em] text-ink/55">
          <span className="text-rust">
            <Asterisk size={12} spinning />
          </span>
          <span>§ 404 / Off the map</span>
        </div>

        <div className="col-span-12 md:col-span-9">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink/45 mb-4">
            HC / Folio '26 · Routing error
          </div>
          <h1 className="font-display text-[clamp(3rem,11vw,11rem)] leading-[0.92] tracking-[-0.025em] text-ink">
            Wrong <em className="text-rust">turn</em>.
          </h1>
          <p className="mt-6 max-w-[44ch] text-ink/75 leading-relaxed">
            That URL does not resolve to a project, an essay, or a corner of this folio.
            The block in the loader had an easier time than you did.
          </p>

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 font-mono text-[11px] uppercase tracking-[0.22em]">
            <Link to="/" className="group inline-flex items-center gap-2 text-ink hover:text-rust transition-colors">
              <span className="inline-block transition-transform group-hover:-translate-x-0.5">←</span>
              Back to index
            </Link>
            <Link to="/work/quizzy" className="text-ink/60 hover:text-rust transition-colors">
              ↗ Quizzy
            </Link>
            <Link to="/work/animy" className="text-ink/60 hover:text-rust transition-colors">
              ↗ ANIMY
            </Link>
            <Link to="/work/build-my-own-git" className="text-ink/60 hover:text-rust transition-colors">
              ↗ Build My Own Git
            </Link>
          </div>
        </div>
      </motion.div>
    </main>
  )
}
