export const buildMyOwnGit = {
  id: 'PRJ-003',
  slug: 'build-my-own-git',
  name: 'Build My Own Git',
  tagline: 'Git\'s internals rebuilt with only Node built-ins: a content-addressed object store that real git can still read.',
  when: 'Dec 2024 → Feb 2025',
  status: 'ARCHIVED',
  stack: ['Node.js', 'SHA-1', 'zlib', 'Buffer'],
  metrics: [
    { value: '0',  unit: '', label: 'runtime dependencies' },
    { value: '3',  unit: '', label: 'object types rebuilt' },
    { value: '40', unit: '', label: 'hex characters per address' },
    { value: '8',  unit: '', label: 'plumbing commands' },
  ],
  sprite: '/oneko/oneko-dog.gif',
  accent: '#10a37f',
  // No product shot to take - so a typographic poster instead
  // (scripts/posters.mjs), drawn in this project's own accent.
  hero: {
    light: '/projects/build-my-own-git/poster-light.webp',
    dark: '/projects/build-my-own-git/poster-dark.webp',
  },
  heroAlt: 'Poster: the real SHA-1 of a git blob, and the .git/objects path it is stored at',
  overview: [
    'This is the Build Your Own Git challenge, done at the plumbing level. It is not a wrapper around the `git` binary. It re-implements what sits underneath it: the content-addressed object store. Every file, directory and commit becomes an object named by the SHA-1 of its own contents, and is written zlib-compressed under `.git/objects`.',
    'It uses only Node built-ins (`crypto` for SHA-1, `zlib` for compression and `fs` for the store), and it follows the real format closely enough that `git cat-file` can read back the blobs, trees and commits it writes. A small CLI sends each command to its own class.',
  ],
  sections: [
    {
      title: 'Every object is named by its own hash',
      body: [
        'This is the idea everything else depends on: an object\'s name is the SHA-1 of its content.',
        'Git frames each object as a type, a byte length, a NUL byte and then the raw body. It hashes that whole envelope and writes it, compressed, to `.git/objects/<first two hex>/<remaining 38>`. The two-character folder spreads objects out, so a repository never puts a million files in one directory.',
        '`hash-object` is the smallest command that runs this whole loop, and every other write command reuses it.',
      ],
      blocks: [
        { kind: 'diagram', id: 'content-address', caption: 'How a blob\'s bytes become an address and a path on disk.' },
        { kind: 'code', lang: 'js', caption: 'hash-write.js', code: [
          '// blob = a type, a byte length, a NUL, then the raw file',
          'const content = `blob ${size}\\0${fs.readFileSync(file)}`;',
          'const sha = crypto.createHash("sha1").update(content).digest("hex");',
          '',
          '// fan-out: .git/objects/<first 2>/<remaining 38>, stored deflated',
          'const dir = `.git/objects/${sha.slice(0, 2)}`;',
          'fs.mkdirSync(dir, { recursive: true });',
          'fs.writeFileSync(`${dir}/${sha.slice(2)}`, zlib.deflateSync(content));',
        ] },
      ],
    },
    {
      title: 'A directory becomes a Merkle tree',
      body: [
        '`write-tree` walks the working directory depth first. Files become blobs and directories become tree objects. Each tree entry is `<mode> <name>\\0` followed by the child\'s hash as 20 raw bytes, not the 40 hex characters you usually see.',
        'Because a tree\'s hash depends on its children\'s hashes, a snapshot is a Merkle tree. Change one byte in one file, and every hash from that file up to the root changes too. The walk has to be post-order, because a parent cannot name a child it has not hashed yet.',
      ],
      blocks: [
        { kind: 'diagram', id: 'merkle', caption: 'A commit points at a tree that names blobs and sub-trees by hash.' },
        { kind: 'code', lang: 'js', caption: 'write-tree.js (condensed)', code: [
          'function walk(dir) {',
          '  const entries = [];',
          '  for (const name of fs.readdirSync(dir)) {',
          '    if (name === ".git") continue;',
          '    const full = path.join(dir, name);',
          '    if (fs.statSync(full).isDirectory()) {',
          '      entries.push({ mode: "40000",  name, sha: walk(full) });       // sub-tree',
          '    } else {',
          '      entries.push({ mode: "100644", name, sha: writeBlob(full) });  // blob',
          '    }',
          '  }',
          '  // each entry: "<mode> <name>\\0" + the child hash as 20 raw bytes',
          '  const body = entries.reduce((buf, e) => Buffer.concat([',
          '    buf, Buffer.from(`${e.mode} ${e.name}\\0`), Buffer.from(e.sha, "hex"),',
          '  ]), Buffer.alloc(0));',
          '  return writeObject("tree", body);   // hash + deflate + store',
          '}',
        ] },
      ],
    },
    {
      title: 'A commit is a snapshot in a chain',
      body: [
        'A commit is not special. It is just another object under the same rule. Its body names one tree (the snapshot), one parent commit, an author line and a committer line with a Unix timestamp, a blank line, and then the message. Wrap that in a `commit <size>\\0` header and it gets a SHA-1 like every blob and tree.',
        'The parent pointer is the whole trick behind history. Each commit names the one before it, so a stack of snapshots that never change reads as a timeline.',
      ],
      blocks: [
        { kind: 'diagram', id: 'commit-chain', caption: 'HEAD points to a branch ref, which points to a chain of commits, each naming its parent.' },
        { kind: 'code', lang: 'js', caption: 'commit-tree.js', code: [
          'const body = Buffer.concat([',
          '  Buffer.from(`tree ${treeSha}\\n`),',
          '  Buffer.from(`parent ${parentSha}\\n`),',
          '  Buffer.from(`author ${name} <${email}> ${Date.now()} +0000\\n`),',
          '  Buffer.from(`committer ${name} <${email}> ${Date.now()} +0000\\n\\n`),',
          '  Buffer.from(`${message}\\n`),',
          ']);',
          'const sha = writeObject("commit", body);   // same envelope, same hashing',
        ] },
      ],
    },
    {
      title: 'Reading objects back',
      body: [
        'Reading is storing in reverse. Each command reads the object file, inflates it with `zlib`, and splits on the NUL byte between the header and the body. `cat-file -p` prints the body. `ls-tree --name-only` reduces a tree\'s entries to plain filenames.',
        '`log` resolves HEAD to its branch ref, inflates the commit there, pulls the parent hash out with a regular expression, and walks back through history one commit at a time, the same way Git\'s own log does.',
      ],
      blocks: [
        { kind: 'code', lang: 'js', caption: 'cat-file.js + log-file.js (the read path)', code: [
          '// cat-file -p: inflate, then drop the "blob <size>\\0" header at the NUL',
          'const raw = zlib.inflateSync(fs.readFileSync(objectPath));',
          'process.stdout.write(raw.toString().split("\\0")[1]);',
          '',
          '// log: resolve HEAD to a commit, inflate it, follow the parent line back',
          'const commit = zlib.inflateSync(fs.readFileSync(objectPath)).toString();',
          'const parent = commit.match(/parent (?<sha>[0-9a-f]{40})/)?.groups.sha;',
        ] },
      ],
    },
    {
      title: 'One class per command, and two shortcuts',
      body: [
        '`main.js` reads `process.argv`, creates the command object for that verb and passes it to a `GitClient`, whose only job is to call `run()` on it. Every command is its own class behind that one method, and nothing is imported from npm.',
        'Two gaps are worth being upfront about. `add` hashes a blob instead of keeping a real staging index, and `clone` is the one place where the project shells out to the system `git` instead of speaking the pack protocol itself.',
      ],
      blocks: [
        { kind: 'diagram', id: 'dispatch', caption: 'argv picks a command class, and a four-line client runs it.' },
        { kind: 'code', lang: 'js', caption: 'client.js + main.js (dispatch)', code: [
          'class GitClient {',
          '  run(command) { command.run(); }   // the entire dispatcher',
          '}',
          '',
          'switch (process.argv[2]) {',
          '  case "hash-object": client.run(new HashWrite(file));               break;',
          '  case "write-tree":  client.run(new WriteTree());                   break;',
          '  case "commit-tree": client.run(new CommitTree(tree, parent, msg)); break;',
          '  case "log":         client.run(new Log());                         break;',
          '  // ...one case, one class, per verb',
          '}',
        ] },
      ],
    },
  ],
  conclusion: [
    'This project was less about the tool and more about the idea underneath it: a store where an object\'s name is a hash of what it holds. Once `hash-object`, `write-tree` and `commit-tree` agree on one envelope (type, size, NUL, body, compressed), blobs, trees and commits stop being three features. They become one operation on different bytes.',
    'What is here is the plumbing: real objects that the official `git` reads back, and a Merkle structure where any change shows up. The next layer would be the porcelain, meaning a staging index, branch management and the pack protocol a real clone uses. It would sit on top of the same object store.',
  ],
  figma: null,
  links: [
    { label: 'GitHub', href: 'https://github.com/23f3001304' },
  ],
};
