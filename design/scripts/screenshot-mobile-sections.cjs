const { chromium, devices } = require('playwright')
const path = require('path')
const fs = require('fs')

;(async () => {
  const outDir = path.resolve(__dirname, '..', '.research', 'mobile')
  fs.mkdirSync(outDir, { recursive: true })

  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext({ ...devices['iPhone 14 Pro'] })
  const page = await ctx.newPage()
  page.on('pageerror', (err) => console.log('PAGE ERROR:', err.message))

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 30000 })
  await page.waitForTimeout(2000)
  await page.reload({ waitUntil: 'networkidle' })
  await page.waitForTimeout(3500)

  // Disable smooth scroll for faster captures, then scroll to each landmark.
  // The site uses Lenis - do raw window.scrollTo so we can freeze frames.
  const sections = [
    { name: 'hero', y: 0 },
    { name: 'marquee', y: 900 },
    { name: 'stats', y: 1200 },
    { name: 'work-1', y: 1700 },
    { name: 'work-2', y: 2400 },
    { name: 'about', y: 3300 },
    { name: 'contact', y: 4100 },
  ]
  for (const s of sections) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), s.y)
    await page.waitForTimeout(700)
    await page.screenshot({ path: path.join(outDir, `section-${s.name}.png`), fullPage: false })
    console.log('captured', s.name)
  }

  await browser.close()
})()
