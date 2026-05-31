/*
 * One-off: capture live screenshots of typereal.coehemang.dev for the
 * portfolio case study. Reuses the Puppeteer + Chromium already installed
 * in the FormCraft repo (run with NODE_PATH pointed at its node_modules).
 *
 *   NODE_PATH=".../FormCraft/node_modules" node scripts/capture-typereal.cjs <outDir>
 */
const path = require('path');
const puppeteer = require('puppeteer');

const OUT = process.argv[2] || '.';
const shots = [
  { url: 'https://typereal.coehemang.dev/',     file: 'landing.png' },
  { url: 'https://typereal.coehemang.dev/test', file: 'test.png', skipTutorial: true },
];

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }]);
    for (const s of shots) {
      try {
        await page.goto(s.url, { waitUntil: 'networkidle2', timeout: 45000 });
        await new Promise((r) => setTimeout(r, 3500)); // let intro animations settle
        if (s.skipTutorial) {
          await page.evaluate(() => {
            const els = [...document.querySelectorAll('button, a, [role="button"]')];
            const el = els.find((e) => e.textContent.trim().toLowerCase() === 'skip tutorial');
            if (el) el.click();
          });
          await new Promise((r) => setTimeout(r, 1500));
        }
        await page.screenshot({ path: path.join(OUT, s.file) });
        console.log('OK  ', s.file);
      } catch (e) {
        console.log('FAIL', s.file, '-', e.message);
      }
    }
  } finally {
    await browser.close();
  }
})();
