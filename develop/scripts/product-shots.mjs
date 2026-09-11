// Product photos: app screenshots framed in a Safari-style window on styled backdrops.
// Two styles per project (flat, tilt) x two feels (light, dark) -> scripts/.shots/product/.
// Run: node scripts/product-shots.mjs [project ...]
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const OUT = resolve('scripts/.shots/product');
const W = 1440, H = 960, DSF = 2;

const PROJECTS = {
  'spider-man': {
    app: true,
    noInvert: true,
    // A Figma concept, never deployed - so no browser bar claiming it was.
    file: 'public/projects/spider-man/home.png',
    chromeLight: '#f6efee',
    light: {
      bg: 'linear-gradient(118deg,#ffe3e0 0%,#ffbdb6 36%,#ff8f86 72%,#e2534a 100%)',
      wash: 'radial-gradient(115% 85% at 26% 10%, rgba(255,248,247,.86) 0%, rgba(255,248,247,0) 55%)',
    },
    dark: {
      bg: 'linear-gradient(118deg,#180f0f 0%,#0c0808 55%,#12090b 100%)',
      wash: 'radial-gradient(95% 80% at 78% -10%, rgba(226,54,54,.26) 0%, rgba(226,54,54,0) 60%), radial-gradient(70% 60% at 8% 108%, rgba(45,86,196,.16) 0%, rgba(45,86,196,0) 60%)',
    },
    ring: ['#e23636', '#f4645b', '#ffb0a6', '#2d56c4'],
    glow: 'rgba(226,54,54,.16)',
  },
  menthub: {
    app: true,
    noInvert: true,
    // Figma work shown as designed - no chrome, no inversion.
    file: 'public/projects/menthub/home.png',
    shotIsLight: true,
    chromeLight: '#f7f0f0',
    light: {
      bg: 'linear-gradient(118deg,#ffe7e7 0%,#ffc6c6 36%,#ff9d9d 72%,#f56b6b 100%)',
      wash: 'radial-gradient(115% 85% at 26% 10%, rgba(255,250,250,.88) 0%, rgba(255,250,250,0) 55%)',
    },
    dark: {
      bg: 'linear-gradient(118deg,#181011 0%,#0d0809 55%,#130a0c 100%)',
      wash: 'radial-gradient(95% 80% at 78% -10%, rgba(253,85,85,.26) 0%, rgba(253,85,85,0) 60%), radial-gradient(70% 60% at 8% 108%, rgba(255,170,120,.16) 0%, rgba(255,170,120,0) 60%)',
    },
    ring: ['#fd5555', '#ff8080', '#ffc0c0', '#ffaa78'],
    glow: 'rgba(253,85,85,.16)',
  },
  stic: {
    app: true,
    noInvert: true,
    // A brand/landing design at 7680 wide, so the frame downsamples.
    file: 'public/projects/stic/hero.jpg',
    shotIsLight: true,
    chromeLight: '#f5eeec',
    light: {
      bg: 'linear-gradient(118deg,#ffe8e2 0%,#ffcabd 36%,#f0a292 72%,#c0463a 100%)',
      wash: 'radial-gradient(115% 85% at 26% 10%, rgba(255,250,248,.86) 0%, rgba(255,250,248,0) 55%)',
    },
    dark: {
      bg: 'linear-gradient(118deg,#171010 0%,#0c0807 55%,#110a09 100%)',
      wash: 'radial-gradient(95% 80% at 78% -10%, rgba(192,70,58,.26) 0%, rgba(192,70,58,0) 60%), radial-gradient(70% 60% at 8% 108%, rgba(233,180,76,.16) 0%, rgba(233,180,76,0) 60%)',
    },
    ring: ['#c0463a', '#d9705f', '#f0b3a3', '#e9b44c'],
    glow: 'rgba(192,70,58,.16)',
  },
  tcursor: {
    // A desktop app, not a site: `app` drops the whole window bar, because the
    // screenshot already contains TCursor's own titlebar - a second one reads as
    // a browser wrapped around something that never had a URL. `noRing` drops the
    // conic donut, leaving only the soft blobs.
    file: 'public/projects/tcursor/editor.png',
    app: true,
    noRing: true,
    chromeLight: '#f4efec',
    light: {
      bg: 'linear-gradient(118deg,#ffe6e0 0%,#ffc7bd 34%,#ff9f92 70%,#f5766a 100%)',
      wash: 'radial-gradient(115% 85% at 26% 10%, rgba(255,250,248,.86) 0%, rgba(255,250,248,0) 55%)',
    },
    dark: {
      bg: 'linear-gradient(118deg,#17100f 0%,#0d0a0a 55%,#120b0d 100%)',
      wash: 'radial-gradient(95% 80% at 78% -10%, rgba(239,68,68,.26) 0%, rgba(239,68,68,0) 60%), radial-gradient(70% 60% at 8% 108%, rgba(139,92,246,.16) 0%, rgba(139,92,246,0) 60%)',
    },
    ring: ['#ef4444', '#f97362', '#ffb4a2', '#8b5cf6'],
    glow: 'rgba(239,68,68,.16)',
  },
  livon: {
    // A desktop app like TCursor, so no window bar. Livon ships its own light
    // feel rather than an inverted dark one, so each backdrop gets the real
    // screen for its theme through `fileLight`, and `noInvert` keeps either
    // from being flipped. The two screens are inputs here and figures nowhere, so
    // they live beside the other raw captures rather than shipping in public/.
    file: 'scripts/.shots/source/livon-today-dark.png',
    fileLight: 'scripts/.shots/source/livon-today-light.png',
    noInvert: true,
    app: true,
    noRing: true,
    chromeLight: '#f3f1e8',
    light: {
      bg: 'linear-gradient(118deg,#f1f8dc 0%,#dcefa9 34%,#bfe070 70%,#9ccb3c 100%)',
      wash: 'radial-gradient(115% 85% at 26% 10%, rgba(252,252,244,.86) 0%, rgba(252,252,244,0) 55%)',
    },
    dark: {
      bg: 'linear-gradient(118deg,#101410 0%,#090b09 55%,#0b100c 100%)',
      wash: 'radial-gradient(95% 80% at 78% -10%, rgba(132,204,22,.24) 0%, rgba(132,204,22,0) 60%), radial-gradient(70% 60% at 8% 108%, rgba(45,212,191,.14) 0%, rgba(45,212,191,0) 60%)',
    },
    ring: ['#84cc16', '#a3e635', '#d9f99d', '#2dd4bf'],
    glow: 'rgba(132,204,22,.16)',
  },
  saathi: {
    // The chat landing. Saathi is not deployed - it is a stack you run - so the
    // chrome carries the local origin the README actually tells you to open.
    file: 'public/projects/saathi/chat.png',
    shotIsLight: true,
    noRing: true,
    domain: 'localhost:5173',
    chromeLight: '#f5f1e9',
    light: {
      bg: 'linear-gradient(118deg,#e4f4f4 0%,#bae4e7 32%,#84d0d6 68%,#52bcc4 100%)',
      wash: 'radial-gradient(100% 75% at 28% 8%, rgba(251,250,246,.74) 0%, rgba(251,250,246,0) 55%)',
    },
    dark: {
      bg: 'linear-gradient(118deg,#0f1617 0%,#0a0e0f 55%,#081113 100%)',
      wash: 'radial-gradient(95% 80% at 78% -10%, rgba(16,152,173,.25) 0%, rgba(16,152,173,0) 60%), radial-gradient(70% 60% at 8% 108%, rgba(232,131,58,.15) 0%, rgba(232,131,58,0) 60%)',
    },
    ring: ['#0b7285', '#1098ad', '#63e6be', '#e8833a'],
    glow: 'rgba(16,152,173,.16)',
  },
  typereal: {
    // The stats dashboard, both feels - the themes editor pairs hex labels
    // with swatches, which the light-feel inversion would falsify.
    file: 'public/projects/typereal/dashboard.png',
    domain: 'typereal.coehemang.dev',
    chromeLight: '#f6f0ea',
    light: {
      bg: 'linear-gradient(118deg,#ffe9da 0%,#ffd2ba 38%,#ffb692 72%,#ff9d77 100%)',
      wash: 'radial-gradient(120% 90% at 24% 12%, rgba(255,250,244,.9) 0%, rgba(255,250,244,0) 55%)',
    },
    dark: {
      bg: 'linear-gradient(118deg,#181513 0%,#0e0c0b 55%,#120d0a 100%)',
      wash: 'radial-gradient(95% 80% at 78% -10%, rgba(255,107,53,.26) 0%, rgba(255,107,53,0) 60%), radial-gradient(70% 60% at 8% 108%, rgba(255,61,90,.16) 0%, rgba(255,61,90,0) 60%)',
    },
    ring: ['#ff3d00', '#ff8a3c', '#ffc46b', '#ff5d8f'],
    glow: 'rgba(255,107,53,.16)',
  },
  adarag: {
    file: 'public/projects/adarag/overview.png',
    domain: 'adarag.coehemang.dev',
    chromeLight: '#f4f2e6',
    light: {
      bg: 'linear-gradient(118deg,#edecd0 0%,#d8e0a8 32%,#b3cc78 68%,#8fb648 100%)',
      wash: 'radial-gradient(100% 75% at 28% 8%, rgba(253,252,243,.68) 0%, rgba(253,252,243,0) 55%)',
    },
    dark: {
      bg: 'linear-gradient(118deg,#151510 0%,#0d0d09 55%,#10120a 100%)',
      wash: 'radial-gradient(95% 80% at 78% -10%, rgba(111,174,15,.24) 0%, rgba(111,174,15,0) 60%), radial-gradient(70% 60% at 8% 108%, rgba(213,90,30,.15) 0%, rgba(213,90,30,0) 60%)',
    },
    ring: ['#558b00', '#8bc34a', '#d9e85c', '#2f9e44'],
    glow: 'rgba(139,195,74,.15)',
  },
  formdash: {
    file: 'public/projects/formdash/editor-build.png',
    domain: 'formdash.coehemang.dev',
    chromeLight: '#eef4ee',
    light: {
      bg: 'linear-gradient(118deg,#ddf1e2 0%,#b8e2c6 32%,#8bd0a2 68%,#5fbd80 100%)',
      wash: 'radial-gradient(100% 75% at 28% 8%, rgba(248,253,249,.7) 0%, rgba(248,253,249,0) 55%)',
    },
    dark: {
      bg: 'linear-gradient(118deg,#111512 0%,#0b0e0c 55%,#0a120d 100%)',
      wash: 'radial-gradient(95% 80% at 78% -10%, rgba(74,222,128,.22) 0%, rgba(74,222,128,0) 60%), radial-gradient(70% 60% at 8% 108%, rgba(0,191,165,.14) 0%, rgba(0,191,165,0) 60%)',
    },
    ring: ['#00b050', '#4ade80', '#a7f3d0', '#0d9488'],
    glow: 'rgba(74,222,128,.15)',
  },
  'contrib-console': {
    file: 'public/projects/contrib-console/discover.png',
    domain: 'contrib.coehemang.dev',
    chromeLight: '#f7f1e3',
    light: {
      bg: 'linear-gradient(118deg,#fdf2dd 0%,#fbe2b6 40%,#f3c87e 75%,#edb55f 100%)',
      wash: 'radial-gradient(120% 90% at 24% 12%, rgba(255,251,242,.92) 0%, rgba(255,251,242,0) 55%)',
    },
    dark: {
      bg: 'linear-gradient(118deg,#171310 0%,#0d0b08 55%,#140e06 100%)',
      wash: 'radial-gradient(95% 80% at 78% -10%, rgba(224,125,26,.24) 0%, rgba(224,125,26,0) 60%), radial-gradient(70% 60% at 8% 108%, rgba(255,196,0,.14) 0%, rgba(255,196,0,0) 60%)',
    },
    ring: ['#ff8f00', '#ffc400', '#ffe082', '#f4511e'],
    glow: 'rgba(224,125,26,.16)',
  },
};

const svg = (body, size = 17) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
const ICONS = {
  sidebar: svg('<rect x="3" y="4.5" width="18" height="15" rx="2.5"/><line x1="9.2" y1="4.5" x2="9.2" y2="19.5"/>'),
  back: svg('<polyline points="14.5 5.5 8.5 12 14.5 18.5"/>'),
  fwd: svg('<polyline points="9.5 5.5 15.5 12 9.5 18.5"/>'),
  shield: svg('<path d="M12 3.2 19 5.6v5.1c0 4.6-2.9 7.6-7 9.1-4.1-1.5-7-4.5-7-9.1V5.6Z"/>'),
  lock: svg('<rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>', 12),
  reload: svg('<path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3"/><polyline points="19.7 3.4 19.7 7.4 15.7 7.4"/>', 14),
  plus: svg('<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>'),
  grid: svg('<rect x="4" y="4" width="7" height="7" rx="1.6"/><rect x="13" y="4" width="7" height="7" rx="1.6"/><rect x="4" y="13" width="7" height="7" rx="1.6"/><rect x="13" y="13" width="7" height="7" rx="1.6"/>'),
};

const NOISE = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`
)}")`;

function html(p, style, feel) {
  const dark = feel === 'dark';
  const chromeBg = dark ? '#212124' : p.chromeLight;
  const pillBg = dark ? 'rgba(255,255,255,.07)' : 'rgba(24,14,4,.055)';
  const txt = dark ? '#d4d4d8' : '#46413a';
  const icon = dark ? '#86868d' : '#9a9384';
  const winBorder = dark ? 'rgba(255,255,255,.14)' : 'rgba(0,0,0,.05)';
  const shadow = dark
    ? `0 30px 70px rgba(0,0,0,.55), 0 36px 90px -18px rgba(0,0,0,.78), 0 0 150px ${p.glow}`
    : '0 30px 80px -22px rgba(56,28,10,.5), 0 90px 180px -40px rgba(56,28,10,.32)';
  // The window deliberately runs off the right edge and sits big in the frame -
  // the composition continues past the crop rather than posing inside it.
  const place =
    style === 'tilt'
      ? 'left:150px;top:270px;width:1720px;transform:rotate(-8deg);transform-origin:0 0;border-radius:18px;'
      : 'left:230px;top:175px;width:1330px;';
  const [, c2, , c4] = p.ring;
  const invertShot = p.noInvert ? false : (p.shotIsLight ? dark : !dark);
  // Soft blobs only. The conic donut this used to draw behind the tilt was
  // removed by request - it read as a decorative ring nobody asked for and
  // pulled the eye off the product. `noRing` is now the only behaviour, so
  // entries that still set it are simply agreeing with the default.
  const blobsOnly = (screen) =>
    `<div class="blob" style="--b:70px;--o:${screen ? '.5' : '.55'};${screen ? '--m:screen;' : ''}left:-200px;top:-240px;width:680px;height:680px;background:radial-gradient(circle,${c2} 0%,transparent 62%)"></div>
     <div class="blob" style="--b:70px;--o:.5;${screen ? '--m:screen;' : ''}left:-160px;bottom:-240px;width:560px;height:560px;background:radial-gradient(circle,${c4} 0%,transparent 60%)"></div>`;
  const rings = blobsOnly(dark);
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  *{margin:0;padding:0;box-sizing:border-box}
  .canvas{position:relative;width:${W}px;height:${H}px;overflow:hidden;background:${p[feel].bg}}
  .wash{position:absolute;inset:0;background:${p[feel].wash}}
  .ring{position:absolute;border-radius:50%;-webkit-mask:radial-gradient(closest-side,transparent 52%,#000 53.5%);filter:blur(var(--b,26px)) saturate(1.25);opacity:var(--o,.85);mix-blend-mode:var(--m,normal)}
  .blob{position:absolute;border-radius:50%;filter:blur(var(--b,54px)) saturate(1.2);opacity:var(--o,.7);mix-blend-mode:var(--m,normal)}
  .noise{position:absolute;inset:0;background-image:${NOISE};background-size:240px;opacity:${dark ? '.06' : '.045'};mix-blend-mode:overlay}
  .win{position:absolute;${place}border-radius:16px;overflow:hidden;box-shadow:${shadow};border:1px solid ${winBorder};background:${chromeBg}}
  .bar{height:52px;display:flex;align-items:center;gap:10px;padding:0 16px;background:${chromeBg};color:${icon};border-bottom:1px solid ${dark ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.06)'};${dark ? 'box-shadow:inset 0 1px 0 rgba(255,255,255,.07);' : ''}}
  .lights{display:flex;gap:8px;margin-right:6px}
  .lights i{width:12px;height:12px;border-radius:50%}
  .ic{display:flex;align-items:center;justify-content:center;width:30px;height:30px}
  .mid{flex:1;display:flex;align-items:center;justify-content:center;gap:10px;min-width:0}
  .pill{position:relative;display:flex;align-items:center;justify-content:center;gap:8px;width:430px;height:34px;border-radius:9px;background:${pillBg};color:${txt};font:14px/1 'Cascadia Code',Consolas,monospace;letter-spacing:.2px}
  .pill .re{position:absolute;right:11px;top:50%;transform:translateY(-50%);color:${icon};display:flex}
  /* Inverting the shot fakes the opposite feel. Dark-themed apps get it in
     the light composition; a light-themed app (shotIsLight) gets it in the
     dark one, so each feel reads the way its backdrop does. */
  .shot{display:block;width:100%;${invertShot ? 'filter:invert(1) hue-rotate(180deg);' : ''}}
  </style></head><body><div class="canvas">
    <div class="wash"></div>
    ${rings}
    <div class="win">
      ${p.app ? '' : `<div class="bar">
        <div class="lights"><i style="background:#ff5f57"></i><i style="background:#febc2e"></i><i style="background:#28c840"></i></div>
        <span class="ic">${ICONS.sidebar}</span>
        <span class="ic">${ICONS.back}</span>
        <span class="ic" style="opacity:.45">${ICONS.fwd}</span>
        <div class="mid">
          <span class="ic">${ICONS.shield}</span>
          <div class="pill"><span style="display:flex;opacity:.7">${ICONS.lock}</span>${p.domain}<span class="re">${ICONS.reload}</span></div>
        </div>
        <span class="ic">${ICONS.plus}</span>
        <span class="ic">${ICONS.grid}</span>
      </div>`}
      <img class="shot" src="${pathToFileURL(resolve(!dark && p.fileLight ? p.fileLight : p.file)).href}">
    </div>
    <div class="noise"></div>
  </div></body></html>`;
}

const only = process.argv.slice(2);
const ids = only.length ? only : Object.keys(PROJECTS);
mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--hide-scrollbars', '--force-color-profile=srgb', '--disable-lcd-text', '--font-render-hinting=none'],
});
const page = await browser.newPage();
await page.setViewport({ width: W, height: H, deviceScaleFactor: DSF });

for (const id of ids) {
  const p = PROJECTS[id];
  if (!p) { console.error('unknown project:', id); continue; }
  for (const style of ['flat', 'tilt']) {
    for (const feel of ['light', 'dark']) {
      const tmp = `${OUT}/_tmp.html`;
      writeFileSync(tmp, html(p, style, feel));
      await page.goto(pathToFileURL(tmp).href, { waitUntil: 'networkidle0' });
      await page.evaluate(() => Promise.all([...document.images].map(i => i.decode())));
      const out = `${OUT}/${id}--${style}-${feel}.png`;
      await page.screenshot({ path: out });
      // Both compositions double as site heroes - ship lighter webps into public/.
      await sharp(out)
        .resize(2400)
        .webp({ quality: 86 })
        .toFile(resolve(`public/projects/${id}/product-${style}-${feel}.webp`));
      console.log('done', `${id}--${style}-${feel}.png`);
    }
  }
}
await browser.close();
rmSync(`${OUT}/_tmp.html`, { force: true });
