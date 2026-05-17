import { motion } from 'framer-motion'

const TREE = `.git/
├─ HEAD
├─ index
├─ refs/
│  └─ heads/
│     └─ main
└─ objects/
   ├─ 8a/b6c5d…   blob
   ├─ a3/2f1e9…   tree
   └─ d0/47b3c…   commit`

const COMMANDS = [
  ['mygit init',                 "Lay down .git/, refs/heads, an empty index, HEAD pointing at refs/heads/main."],
  ['mygit hash-object -w README', 'Wrap content as `blob <len>\\0<bytes>`, SHA-1 it, gzip and store at .git/objects/<2>/<38>.'],
  ['mygit write-tree',            'Snapshot the index into nested tree objects. Each tree is a sorted list of mode + name + SHA.'],
  ['mygit commit-tree <tree> -m', 'Wrap a tree SHA + parent + author + message into a commit object, return its SHA.'],
  ['mygit ls-tree <sha>',         'Decode and pretty-print one tree, one entry per line: <mode> <type> <sha>\\t<name>.'],
  ['mygit cat-file -p <sha>',     'Resolve a SHA to its object file, decompress, strip the type/length header, print the body.'],
]

const SHA_DEMO = [
  ['Input',          'Hello, World!\\n'],
  ['Wrapped',        'blob 14\\0Hello, World!\\n'],
  ['SHA-1',          '8ab686eafeb1f44702738c8b0f24f2567c36da6d'],
  ['Stored at',      '.git/objects/8a/b686eafeb1f44702738c8b0f24f2567c36da6d'],
]

export default function GitInternals() {
  return (
    <div className="space-y-12">
      {/* The .git tree as ASCII */}
      <div className="grid grid-cols-12 gap-6 md:gap-8">
        <div className="col-span-12 md:col-span-5">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink/55 mb-3">
            On-disk layout
          </div>
          <pre className="bg-bone border border-ink/15 p-5 font-mono text-[12px] md:text-[13px] leading-relaxed text-ink/90 overflow-x-auto whitespace-pre">
{TREE}
          </pre>
          <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-ink/45">
            Three object types · SHA-1 addressed · zlib compressed
          </div>
        </div>

        <div className="col-span-12 md:col-span-7">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink/55 mb-3">
            SHA-1, by hand
          </div>
          <ul className="border-t border-ink/15">
            {SHA_DEMO.map(([k, v]) => (
              <li key={k} className="grid grid-cols-12 gap-3 items-baseline border-b border-ink/15 py-3">
                <span className="col-span-4 md:col-span-3 font-mono text-[10px] uppercase tracking-[0.22em] text-ink/55">{k}</span>
                <span className="col-span-8 md:col-span-9 font-mono text-[12px] md:text-[13px] text-ink/90 break-all">{v}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-ink/45">
            Native git can read what we write.
          </div>
        </div>
      </div>

      {/* Six plumbing commands */}
      <div>
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink/55 mb-3">
          Six plumbing commands
        </div>
        <ul className="border-t border-ink/15">
          {COMMANDS.map(([cmd, note], i) => (
            <motion.li
              key={cmd}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: i * 0.04, duration: 0.5 }}
              className="grid grid-cols-12 gap-3 items-baseline border-b border-ink/15 py-4"
            >
              <code className="col-span-12 md:col-span-5 font-mono text-[12px] md:text-[13px] text-ink bg-bone border border-ink/15 px-2 py-1 inline-block">
                {cmd}
              </code>
              <span className="col-span-12 md:col-span-7 text-ink/75 leading-relaxed text-[14px] md:text-[15px]">
                {note}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  )
}
