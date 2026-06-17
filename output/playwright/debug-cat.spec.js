const { test } = require('@playwright/test');

test('debug cat', async ({ page }) => {
  page.on('console', msg => console.log('console', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('pageerror', err.message));
  await page.goto('http://localhost:5177');
  await page.waitForTimeout(5000);
  const debug = await page.evaluate(() => window.__LEIDER_CAT_DEBUG__ || null);
  console.log('DEBUG_CAT', JSON.stringify(debug));
});
