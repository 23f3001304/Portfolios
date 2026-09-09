// Typographic posters for the projects that have no product shot.
//
// Four of the thirteen are a CLI, a library, an API service and an unreleased
// app - there is no screen to photograph, and a mocked-up one would be a lie.
// So they get a poster instead: the idea of the project set in type, in its own
// accent colour, at the same 3:2 the product shots use. Each poster says
// something true about the thing - the git one prints the real SHA-1 of a real
// blob, computed here the way git computes it.
//
// Out: scripts/.shots/poster/<id>--<feel>.png (raw, for card-thumbs.mjs)
//      public/projects/<id>/poster-<feel>.webp (2400w, the page hero)
// Run: node scripts/posters.mjs [project ...]
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const OUT = resolve('scripts/.shots/poster');
const W = 1200, H = 800, DSF = 2;

const NOISE = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`,
)}")`;

const rgba = (hex, a) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return `rgba(${r},${g},${b},${a})`;
};

/* Git addresses an object by the SHA-1 of "blob <bytes>\0<content>", so the
   poster prints the real id of a real blob rather than a plausible-looking
   string of hex. `git hash-object` on the same bytes returns this. */
const BLOB = 'hello world\n';
const OID = createHash('sha1')
  .update(`blob ${Buffer.byteLength(BLOB)}\0${BLOB}`)
  .digest('hex');

// ============================================================
// The four posters. Each returns the body of .pad for one feel.
// ============================================================

const quizzy = (t) => `
  <div class="eyebrow mono">Plan → Solve → Submit → Next</div>
  <div class="mid">
    <p class="ask">Which of these does the agent do unattended?</p>
    <ol class="opts">
      <li><i>A</i><span>read the page</span></li>
      <li><i>B</i><span>write the Python</span></li>
      <li><i>C</i><span>run it in a sandbox</span></li>
      <li class="on"><i>D</i><span>all of the above</span></li>
    </ol>
  </div>
  <div class="foot mono">90 tools · 2 agents · 1 sandbox · 92/100</div>
  <style>
    .ask{font-size:29px;letter-spacing:-.012em;color:${t.dim}}
    .opts{list-style:none;margin-top:40px;display:flex;flex-direction:column;gap:20px}
    .opts li{display:flex;align-items:center;gap:26px;font-size:54px;font-weight:600;
      letter-spacing:-.035em;color:${t.dim}}
    .opts i{flex:none;font-style:normal;font-family:var(--mono);font-size:22px;font-weight:500;
      width:60px;height:60px;border-radius:50%;border:1.5px solid ${t.line};
      display:flex;align-items:center;justify-content:center;color:${t.dim}}
    .opts .on{color:${t.ink}}
    .opts .on i{background:${t.accent};border-color:${t.accent};color:#fff}
  </style>`;

const animy = (t) => `
  <div class="eyebrow mono">Prompt → LLM → Manim → Render</div>
  <div class="mid echo">
    ${[5, 4, 3, 2, 1].map((k) => `<span style="--k:${k}">ANIMY</span>`).join('')}
    <span style="--k:0" class="lead">ANIMY</span>
  </div>
  <div class="foot mono">4 workers · a status map the browser polls · 30s ceiling</div>
  <style>
    /* Onion-skinning: the same word behind itself, the way a render preview
       shows the frames it has already drawn. */
    .echo{position:relative}
    /* Biased between the two centres: centring the front copy alone leaves the
       ghosts hanging off the left edge, centring the whole trail pushes the
       word that actually reads too far right. +25 splits the difference. */
    .echo span{position:absolute;left:50%;top:50%;white-space:nowrap;
      font-size:196px;font-weight:800;letter-spacing:-.055em;
      color:${t.accent};opacity:calc(0.46 - var(--k) * 0.075);
      transform:translate(-50%,-50%)
                translate(calc(var(--k) * -30px + 25px), calc(var(--k) * 11px - 9px))}
    .echo .lead{color:${t.ink};opacity:1}
  </style>`;

const git = (t) => `
  <div class="eyebrow mono">Content-addressed · Node built-ins only</div>
  <div class="mid">
    <div class="src mono">blob ${Buffer.byteLength(BLOB)}<em>\\0</em>hello world</div>
    <div class="oid mono"><b>${OID.slice(0, 2)}</b>${OID.slice(2, 20)}<br>${OID.slice(20)}</div>
    <div class="path mono">.git/objects/<b>${OID.slice(0, 2)}</b>/${OID.slice(2, 8)}…</div>
  </div>
  <div class="foot mono">blob · tree · commit · the real git can still read it</div>
  <style>
    .src{font-size:26px;color:${t.dim};letter-spacing:.01em}
    .src em{font-style:normal;color:${t.accent};opacity:.9}
    .oid{margin-top:26px;font-size:78px;font-weight:500;line-height:1.06;
      letter-spacing:-.028em;color:${t.ink}}
    .oid b{color:${t.accent}}
    .path{margin-top:30px;font-size:24px;color:${t.dim};letter-spacing:.02em}
    .path b{color:${t.accent}}
  </style>`;

const shell = (t) => `
  <div class="eyebrow mono">Read → Parse → Decide → Exec</div>
  <div class="mid">
    <div class="prompt"><span class="mono">$</span><i></i></div>
    <div class="calls mono">fork(2)&nbsp;&nbsp;&nbsp;execve(2)&nbsp;&nbsp;&nbsp;waitpid(2)&nbsp;&nbsp;&nbsp;dup2(2)</div>
  </div>
  <div class="foot mono">A POSIX shell in C++ · built from the syscalls up</div>
  <style>
    .prompt{display:flex;align-items:center;justify-content:center;gap:44px}
    .prompt span{font-size:300px;font-weight:500;line-height:.8;color:${t.ink}}
    .prompt i{width:112px;height:216px;border-radius:8px;background:${t.accent};
      box-shadow:0 0 90px ${rgba(t.accent, 0.45)}}
    .calls{margin-top:56px;text-align:center;font-size:25px;letter-spacing:.13em;color:${t.dim}}
  </style>`;

const POSTERS = {
  quizzy:               { accent: '#ff5e00', art: quizzy },
  animy:                { accent: '#8a5cff', art: animy },
  'build-my-own-git':   { accent: '#10a37f', art: git },
  'build-my-own-shell': { accent: '#e0a106', art: shell },
};

// ============================================================

function html(p, feel) {
  const dark = feel === 'dark';
  const t = {
    accent: p.accent,
    feel,
    ink: dark ? '#f6f7f9' : '#101114',
    dim: dark ? 'rgba(246,247,249,.44)' : 'rgba(16,17,20,.46)',
    line: dark ? 'rgba(246,247,249,.16)' : 'rgba(16,17,20,.16)',
  };
  const ground = dark
    ? `radial-gradient(125% 105% at 14% -12%, ${rgba(p.accent, 0.17)} 0%, transparent 56%),
       linear-gradient(158deg,#16181d 0%,#0e1014 58%,#0a0b0e 100%)`
    : `radial-gradient(125% 105% at 14% -12%, ${rgba(p.accent, 0.2)} 0%, transparent 56%),
       linear-gradient(158deg,#ffffff 0%,#f7f7f9 56%,#eff0f2 100%)`;

  return `<!doctype html><html><head><meta charset="utf-8">
  <link rel="stylesheet" href="https://rsms.me/inter/inter.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600&display=swap">
  <style>
  *{margin:0;padding:0;box-sizing:border-box}
  :root{--mono:'Geist Mono','Cascadia Code',Consolas,monospace}
  .canvas{position:relative;width:${W}px;height:${H}px;overflow:hidden;background:${ground};
    color:${t.ink};font-family:'Inter var','Inter',system-ui,sans-serif;
    -webkit-font-smoothing:antialiased;font-feature-settings:'ss01','cv05'}
  /* A faint plotting grid - it reads as drafting paper, and gives the type
     something to sit on without competing with it. */
  .grid{position:absolute;inset:0;opacity:${dark ? '.055' : '.05'};
    background-image:linear-gradient(${t.ink} 1px,transparent 1px),
                     linear-gradient(90deg,${t.ink} 1px,transparent 1px);
    background-size:60px 60px;
    -webkit-mask:radial-gradient(90% 80% at 50% 45%,#000 20%,transparent 78%)}
  .blob{position:absolute;border-radius:50%;filter:blur(110px) saturate(1.3);
    opacity:${dark ? '.4' : '.34'};background:radial-gradient(circle,${p.accent} 0%,transparent 64%)}
  .noise{position:absolute;inset:0;background-image:${NOISE};background-size:240px;
    opacity:${dark ? '.055' : '.04'};mix-blend-mode:overlay}
  /* Bottom padding is deeper than the top: on the index card the picture
     dissolves into the card body over its last tenth, and the footer line has
     to clear that. */
  .pad{position:absolute;inset:66px 74px 100px;display:flex;flex-direction:column}
  .mid{flex:1;display:flex;flex-direction:column;justify-content:center}
  .mono{font-family:var(--mono)}
  .eyebrow{font-size:17px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;
    color:${t.dim}}
  .foot{font-size:17px;letter-spacing:.09em;color:${t.dim}}
  </style></head><body><div class="canvas">
    <div class="blob" style="left:-190px;top:-230px;width:660px;height:660px"></div>
    <div class="blob" style="right:-230px;bottom:-260px;width:620px;height:620px;opacity:${dark ? '.26' : '.22'}"></div>
    <div class="grid"></div>
    <div class="pad">${p.art(t)}</div>
    <div class="noise"></div>
  </div></body></html>`;
}

const only = process.argv.slice(2);
const ids = only.length ? only : Object.keys(POSTERS);
mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--hide-scrollbars', '--force-color-profile=srgb', '--font-render-hinting=none'],
});
const page = await browser.newPage();
await page.setViewport({ width: W, height: H, deviceScaleFactor: DSF });

for (const id of ids) {
  const p = POSTERS[id];
  if (!p) { console.error('unknown poster:', id); continue; }
  for (const feel of ['light', 'dark']) {
    const tmp = `${OUT}/_tmp.html`;
    writeFileSync(tmp, html(p, feel));
    await page.goto(pathToFileURL(tmp).href, { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.fonts.ready);
    const out = `${OUT}/${id}--${feel}.png`;
    await page.screenshot({ path: out });
    await sharp(out)
      .resize(2400)
      .webp({ quality: 88 })
      .toFile(resolve(`public/projects/${id}/poster-${feel}.webp`));
    console.log('done', `${id}--${feel}`);
  }
}
await browser.close();
rmSync(`${OUT}/_tmp.html`, { force: true });
console.log('\ngit blob id:', OID);
