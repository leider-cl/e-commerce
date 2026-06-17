const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  page.on('console', msg => console.log('console', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('pageerror', err.message));
  await page.goto('http://localhost:5177', { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000);
  const debug = await page.evaluate(() => window.__LEIDER_CAT_DEBUG__ || null);
  console.log(JSON.stringify(debug, null, 2));
  await browser.close();
})();
