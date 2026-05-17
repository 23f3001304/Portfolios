const { chromium, devices } = require('playwright')
const path = require('path')
const fs = require('fs')

;(async () => {
  const outDir = path.resolve(__dirname, '..', '.research', 'mobile')
  fs.mkdirSync(outDir, { recursive: true })

  const browser = await chromium.launch({ headless: true })
  // iPhone 14 Pro - 393x852, 3x DPR. Common modern mobile baseline.
  const ctx = await browser.newContext({ ...devices['iPhone 14 Pro'] })
  const page = await ctx.newPage()

  page.on('pageerror', (err) => console.log('PAGE ERROR:', err.message))
  page.on('console', (msg) => {
    if (msg.type() === 'error') console.log('CONSOLE ERR:', msg.text())
  })

  async function shoot(routePath, name) {
    const url = `http://localhost:5173${routePath}`
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
    await page.waitForTimeout(2500)
    await page.reload({ waitUntil: 'networkidle', timeout: 30000 }) // Vite optimize warm-up
    await page.waitForTimeout(3500)
    await page.screenshot({ path: path.join(outDir, `${name}-fold.png`), fullPage: false })
    await page.screenshot({ path: path.join(outDir, `${name}-full.png`), fullPage: true })
    console.log('captured', name)
  }

  await shoot('/', 'landing')
  await shoot('/work/quizzy', 'quizzy')
  await shoot('/work/mentor-hub', 'mentor-hub')

  // Open the menu overlay and capture
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 30000 })
  await page.waitForTimeout(1500)
  // Look for the Index trigger button
  try {
    const trigger = await page.locator('button:has-text("Index")').first()
    if (await trigger.count()) {
      await trigger.click()
      await page.waitForTimeout(900)
      await page.screenshot({ path: path.join(outDir, 'menu-open.png'), fullPage: false })
      console.log('captured menu-open')
    }
  } catch (e) {
    console.log('menu open failed:', e.message)
  }

  await browser.close()
  console.log('done →', outDir)
})()
