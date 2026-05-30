// One-off: capture authenticated TypeReal screenshots for the portfolio.
// Headless system Chrome via puppeteer-core, tr_session cookie set directly.
// Output: scripts/.shots/*.png at 1440x900 @2x (=2880x1800), matching existing.
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dir = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dir, '.shots');
mkdirSync(OUT, { recursive: true });

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ORIGIN = 'https://typereal.coehemang.dev';
const TR_SESSION = process.env.TR_SESSION;
if (!TR_SESSION) { console.error('Missing TR_SESSION env'); process.exit(1); }

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Each gets its own page capture. name = output filename (no ext).
const ROUTES = [
  { name: 'dashboard',     path: '/dashboard' },
  { name: 'duel',          path: '/duel' },
  { name: 'ghost',         path: '/ghost' },
  { name: 'friends',       path: '/friends' },
  { name: 'history',       path: '/history' },
  { name: 'themes-editor', path: '/themes' },
];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
  args: ['--hide-scrollbars', '--force-color-profile=srgb', '--window-size=1440,900'],
});

const page = await browser.newPage();
// The SPA (typereal.coehemang.dev) authenticates against the backend subdomain
// (backend.typereal.coehemang.dev/api/auth/me). A domain cookie on the apex
// covers both hosts so the backend actually receives the session.
await page.setCookie({
  name: 'tr_session',
  value: TR_SESSION,
  domain: '.typereal.coehemang.dev',
  path: '/',
  httpOnly: true,
  secure: true,
  sameSite: 'Lax',
});

const report = [];

// socket.io keeps the connection live, so networkidle never fires - wait on the
// app shell instead.
async function gotoPage(path) {
  await page.goto(ORIGIN + path, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForSelector('header', { timeout: 20000 }).catch(() => {});
}

async function tutorialPresent() {
  return page.evaluate(() =>
    !![...document.querySelectorAll('button, a')].find((e) => /skip tutorial/i.test(e.textContent || '')));
}

async function clickByText(needle) {
  return page.evaluate((needle) => {
    const el = [...document.querySelectorAll('button, a')]
      .find((e) => (e.textContent || '').toLowerCase().includes(needle));
    if (el) { el.click(); return (el.textContent || '').trim().slice(0, 30); }
    return null;
  }, needle);
}

// Force any GSAP reveal target (inline opacity/transform) to its settled state
// so the still frame is crisp even if the entrance hasn't finished.
async function forceReveal() {
  await page.evaluate(() => {
    document.querySelectorAll('*').forEach((el) => {
      const s = el.style;
      if (s && s.opacity !== '' && parseFloat(s.opacity) < 1) {
        s.opacity = '1';
        if (/translate|matrix/i.test(s.transform)) s.transform = 'none';
      }
    });
  });
}

// 1) The onboarding tutorial auto-opens on a fresh browser. Capture its main
//    (welcome) screen first.
await gotoPage('/dashboard');
await sleep(2400);
const tutShown = await tutorialPresent();
await page.screenshot({ path: join(OUT, 'tutorial.png'), type: 'png' });
report.push({ name: 'tutorial', tutorialShown: tutShown, ok: true });
console.log('captured tutorial, shown=', tutShown);

// 2) Skip it so it stops covering the real pages (writes the seen-flag).
const skipped = await clickByText('skip tutorial');
await sleep(900);
console.log('skip tutorial clicked=', skipped);

// 3) Capture each page, dismissing the tutorial again if it re-appears.
for (const r of ROUTES) {
  try {
    await gotoPage(r.path);
    await sleep(700);
    if (await tutorialPresent()) { await clickByText('skip tutorial'); await sleep(600); }
    await sleep(3600);
    await forceReveal();
    await sleep(250);
    const finalUrl = page.url();
    await page.screenshot({ path: join(OUT, r.name + '.png'), type: 'png' });
    report.push({ name: r.name, finalUrl, ok: true });
    console.log('captured', r.name, '->', finalUrl);
  } catch (e) {
    report.push({ name: r.name, ok: false, err: String(e).slice(0, 140) });
    console.log('FAILED', r.name, String(e).slice(0, 140));
  }
}

console.log('\n=== REPORT ===');
console.log(JSON.stringify(report, null, 1));
await browser.close();
