// The social share card - what Facebook, LinkedIn, WhatsApp, Discord and X
// show when someone pastes the site's URL.
//
// Laid out like a business card, because that is what a share preview is: the
// identity handed over before anyone has opened the page. But it is drawn
// full-bleed, not as a card-on-a-table: most previews are seen at 300-500px
// wide, so the name is set at 90px and the mark sits large on an accent panel.
// Anything smaller than that is allowed to be illegible in a thumbnail - it
// is there for the people who click through. Same tokens as styles/tokens.css,
// same Inter + Geist Mono, so the preview and the page read as one thing.
//
// Out: public/og.jpg (1200x630 - the Open Graph size every platform accepts)
// Run: node scripts/og.mjs
import { writeFileSync, rmSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';
import { profile } from '../src/data/profile.js';
import { markSvg } from './favicon.mjs';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const OUT = resolve('scripts/.shots/og');
const W = 1200, H = 630, DSF = 2;

// tokens.css, light
const t = {
  surface: '#ffffff',
  fg: '#0a0a0a',
  gray: '#6b6b6b',
  line: '#e4e4e4',
  accent: '#ff5e00',
};

// Paper grain, the same feTurbulence the posters use.
const NOISE = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`,
)}")`;

const strip = (href) => href.replace(/^https?:\/\/(www\.)?/, '');
const handle = strip(profile.links.find((l) => l.label === 'GitHub')?.href ?? '');
const linkedin = strip(profile.links.find((l) => l.label === 'LinkedIn')?.href ?? '');

function html() {
  return `<!doctype html><html><head><meta charset="utf-8">
  <link rel="stylesheet" href="https://rsms.me/inter/inter.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500&display=swap">
  <style>
  *{margin:0;padding:0;box-sizing:border-box}
  :root{--mono:'Geist Mono','SF Mono',Menlo,Consolas,monospace}
  .canvas{position:relative;width:${W}px;height:${H}px;overflow:hidden;background:${t.surface};
    color:${t.fg};font-family:'Inter var','Inter',system-ui,sans-serif;display:flex;
    -webkit-font-smoothing:antialiased;font-feature-settings:'ss01','cv05'}
  .noise{position:absolute;inset:0;background-image:${NOISE};background-size:240px;
    opacity:.045;mix-blend-mode:multiply;pointer-events:none}

  /* The card face: meta on top, the name low and large, contacts on the rule. */
  .face{flex:1;padding:64px 64px 56px 72px;display:flex;flex-direction:column}
  .meta{display:flex;justify-content:space-between;font-family:var(--mono);font-size:17px;
    letter-spacing:.14em;text-transform:uppercase;color:${t.gray}}
  .meta b{font-weight:500;color:${t.fg}}
  .mid{flex:1;display:flex;flex-direction:column;justify-content:flex-end;padding-bottom:36px}
  h1{font-size:92px;font-weight:600;letter-spacing:-.04em;line-height:.96}
  .role{margin-top:26px;font-size:24px;color:${t.gray};letter-spacing:-.01em;
    display:flex;align-items:center;gap:16px}
  .role i{display:inline-block;width:6px;height:6px;background:${t.accent};border-radius:1.5px}
  .foot{padding-top:26px;border-top:1.5px solid ${t.line};display:flex;gap:36px;
    font-family:var(--mono);font-size:19px;color:${t.gray};letter-spacing:.01em}
  .foot b{font-weight:500;color:${t.fg}}

  /* The accent panel, folded in from the card's back: the mark, large. */
  .panel{width:330px;background:${t.accent};display:flex;align-items:center;justify-content:center;
    box-shadow:inset 8px 0 24px rgba(0,0,0,.06)}
  .panel svg{width:236px;height:236px;filter:drop-shadow(0 12px 28px rgba(0,0,0,.14))}
  </style></head><body><div class="canvas">
    <div class="face">
      <div class="meta"><span>${profile.location}</span><span><b>developer.coehemang.dev</b></span></div>
      <div class="mid">
        <h1>${profile.name.replace(' ', '<br>')}</h1>
        <p class="role">${profile.role.split(' · ').map((s) => `<span>${s}</span>`).join('<i></i>')}</p>
      </div>
      <div class="foot">
        <span><b>${profile.email}</b></span>
        <span>${handle}</span>
        <span>${linkedin}</span>
      </div>
    </div>
    <div class="panel">${markSvg({ size: 236, ink: '#ffffff', accent: t.fg, attrs: ' aria-hidden="true"' })}</div>
    <div class="noise"></div>
  </div></body></html>`;
}

mkdirSync(OUT, { recursive: true });
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--hide-scrollbars', '--force-color-profile=srgb', '--font-render-hinting=none'],
});
const page = await browser.newPage();
await page.setViewport({ width: W, height: H, deviceScaleFactor: DSF });

const tmp = `${OUT}/_tmp.html`;
writeFileSync(tmp, html());
await page.goto(pathToFileURL(tmp).href, { waitUntil: 'networkidle0' });
await page.evaluate(() => document.fonts.ready);
const raw = `${OUT}/og@2x.png`;
await page.screenshot({ path: raw });
await browser.close();
rmSync(tmp, { force: true });

// Rendered at 2x for crisp type, then downsampled to the exact OG size.
await sharp(raw)
  .resize(W, H, { kernel: 'lanczos3' })
  .jpeg({ quality: 92, chromaSubsampling: '4:4:4', mozjpeg: true })
  .toFile(resolve('public/og.jpg'));
console.log('done public/og.jpg');
