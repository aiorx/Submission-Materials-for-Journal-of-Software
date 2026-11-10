var test = require('@playwright/test').test;
var expect = require('@playwright/test').expect;

test('basic test', async function ({ page }) {
  await page.goto('https://playwright.dev/');
  await page.locator('text=Get started').click();
  await expect(page).toHaveTitle(/Getting started/);
});
