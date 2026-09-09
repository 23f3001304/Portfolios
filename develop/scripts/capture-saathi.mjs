// Saathi app screenshot -> public/projects/saathi/chat.png, at the same
// 1440x900 @2x the other project shots use. One frame: the chat landing.
//
// Needs the covenant stack running locally (gateway 8787, agent-host in
// scripted mode on 8788, audit-ui on 5175). Scripted mode matters: it drives a
// deterministic session with no model spend.
//
// Run: node scripts/capture-saathi.mjs
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import puppeteer from 'puppeteer-core';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const APP = process.env.SAATHI_URL || 'http://localhost:5175/';
const OUT = resolve('public/projects/saathi');
const W = 1440, H = 900, DSF = 2;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function locate(page, re) {
  return page.evaluate((src) => {
    const rx = new RegExp(src, 'i');
    const el = [...document.querySelectorAll('button,[role="button"],a')]
      .find((e) => rx.test(e.textContent || ''));
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }, re.source ?? re);
}

// The signing affordance is press-and-hold, not click - the point is that a
// key ceremony needs a deliberate gesture. Hold the mouse down in place.
async function hold(page, re, ms = 1600) {
  const box = await locate(page, re);
  if (!box) throw new Error(`hold target not found: ${re}`);
  await page.mouse.move(box.x, box.y);
  await page.mouse.down();
  await sleep(ms);
  await page.mouse.up();
}

async function click(page, re) {
  const box = await locate(page, re);
  if (!box) throw new Error(`click target not found: ${re}`);
  await page.mouse.click(box.x, box.y);
}

mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--hide-scrollbars', '--force-color-profile=srgb', '--disable-lcd-text', '--font-render-hinting=none'],
});
const page = await browser.newPage();
await page.setViewport({ width: W, height: H, deviceScaleFactor: DSF });

// The app holds an open beat stream, so the network never goes idle.
await page.goto(APP, { waitUntil: 'domcontentloaded' });
await sleep(1200);

// Identity, then the key ceremony. Both are demo-local: no account, no rail.
await click(page, /continue as a demo user/);
await sleep(1500);
await hold(page, /hold to sign/);
await sleep(3000);

await page.screenshot({ path: `${OUT}/chat.png` });
console.log('shot chat.png');

await browser.close();
