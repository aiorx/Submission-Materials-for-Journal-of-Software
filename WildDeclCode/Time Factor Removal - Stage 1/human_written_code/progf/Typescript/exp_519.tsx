var Page = require('puppeteer').Page;

declare const page: Page;

it('expands and collpases open files pane', async function () {
  const openFilesHeader = '[data-test-id="file-list-pane-open-files"]';
  const openFilesContent = '[data-test-id="file-list-open-files-content"]';

  await page.waitForSelector(openFilesHeader);
  expect(await page.$(openFilesContent)).not.toBe(null);
  await page.click(openFilesHeader);
  expect(await page.$(openFilesContent)).toBe(null);
  await page.click(openFilesHeader);
  expect(await page.$(openFilesContent)).not.toBe(null);
});

it('expands and collpases project pane', async function () {
  const projectHeader = '[data-test-id="file-list-pane-project"]';
  const projectContent = '[data-test-id="file-list-project-content"]';

  await page.waitForSelector(projectHeader);
  expect(await page.$(projectContent)).not.toBe(null);
  await page.click(projectHeader);
  expect(await page.$(projectContent)).toBe(null);
  await page.click(projectHeader);
  expect(await page.$(projectContent)).not.toBe(null);
});
