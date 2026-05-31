/*
 * Capture logged-in pages of TypeReal / Formdash for the portfolio.
 * Reads session cookies from ../.auth/cookies.json (local, gitignored-by-intent)
 * and reuses them in headless Chrome - no automated login, just your session.
 *
 *   NODE_PATH=".../FormCraft/node_modules" node scripts/capture-auth.cjs
 *
 * An app with no cookie value is skipped. If a page redirects to /login the
 * cookie is missing or expired - the script logs AUTH? and moves on.
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const ROOT = path.resolve(__dirname, '..', 'develop'); // scripts live in ../tools, the app in ../develop
const COOKIES = path.join(ROOT, '.auth', 'cookies.json');
const OUT = path.join(ROOT, 'public', 'projects');

const TARGETS = [
  {
    slug: 'typereal',
    origin: 'https://typereal.coehemang.dev',
    // The SPA calls its API at backend.typereal.coehemang.dev, so the session
    // cookie must cover both the apex and that subdomain.
    cookieDomain: '.typereal.coehemang.dev',
    pages: [
      { path: '/dashboard',      file: 'dashboard.png' },
      { path: '/history',        file: 'history.png' },
      { path: '/themes',         file: 'themes.png' },
      { path: '/themes/editor',  file: 'themes-editor.png' },
      { path: '/duel',           file: 'duel.png' },
    ],
  },
  {
    slug: 'formdash',
    origin: 'https://formdash.coehemang.dev',
    pages: [
      { path: '/dashboard', file: 'dashboard-live.png' },
    ],
  },
];

(async () => {
  const map = JSON.parse(fs.readFileSync(COOKIES, 'utf8'));
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  try {
    for (const t of TARGETS) {
      const creds = (map[t.slug] || []).filter((c) => c && c.name && c.value);
      if (!creds.length) { console.log(`SKIP ${t.slug} (no cookie set)`); continue; }
      const host = new URL(t.origin).hostname;
      const page = await browser.newPage();
      await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
      await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }]);
      await page.setCookie(...creds.map((c) => ({
        name: c.name, value: c.value, domain: t.cookieDomain || host, path: '/', secure: true, httpOnly: true, sameSite: 'None',
      })));
      const dir = path.join(OUT, t.slug);
      fs.mkdirSync(dir, { recursive: true });
      for (const pg of t.pages) {
        try {
          await page.goto(t.origin + pg.path, { waitUntil: 'networkidle2', timeout: 45000 });
          await new Promise((r) => setTimeout(r, 3000));
          const finalUrl = page.url();
          if (/\/login|\/signin|\/auth/i.test(finalUrl)) {
            console.log(`AUTH? ${t.slug}${pg.path} -> redirected to ${finalUrl} (cookie missing/expired)`);
            continue;
          }
          await page.screenshot({ path: path.join(dir, pg.file) });
          console.log(`OK    ${t.slug}${pg.path} -> ${pg.file}`);
        } catch (e) {
          console.log(`FAIL  ${t.slug}${pg.path} - ${e.message}`);
        }
      }
      await page.close();
    }
  } finally {
    await browser.close();
  }
})();
