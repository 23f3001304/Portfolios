const { chromium, devices } = require('playwright')
const path = require('path')
const fs = require('fs')

;(async () => {
  const outDir = path.resolve(__dirname, '..', '.research', 'mobile')
  fs.mkdirSync(outDir, { recursive: true })

  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext({ ...devices['iPhone 14 Pro'] })
  const page = await ctx.newPage()

  const slugs = ['build-my-own-git', 'untitled-explorations', 'mentor-hub']
  for (const slug of slugs) {
    await page.goto(`http://localhost:5173/work/${slug}`, { waitUntil: 'networkidle', timeout: 30000 })
    await page.waitForTimeout(2000)
    await page.reload({ waitUntil: 'networkidle' })
    await page.waitForTimeout(3000)
    await page.screenshot({ path: path.join(outDir, `proj-${slug}-fold.png`), fullPage: false })
    console.log('captured', slug)
  }
  await browser.close()
})()
