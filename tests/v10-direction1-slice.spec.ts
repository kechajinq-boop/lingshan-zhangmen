import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 1920, height: 1080 } });

test('v0.10 direction-one visual slice', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', error => errors.push(error.message));

  await page.goto('http://127.0.0.1:4173/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await expect(page.locator('canvas')).toBeVisible();
  await page.locator('canvas').click({ position: { x: 960, y: 410 } });
  await page.waitForTimeout(1200);
  await page.screenshot({
    path: 'deliverables/v10-direction1-slice/01-empty-map.png',
    fullPage: true,
  });

  await page.mouse.click(570, 1033);
  await page.mouse.click(964, 517);
  await page.waitForTimeout(1000);
  await page.mouse.click(635, 1033);
  await page.mouse.click(848, 517);
  await page.waitForTimeout(1000);
  await page.mouse.click(700, 1033);
  await page.mouse.click(906, 442);
  await page.waitForTimeout(1400);
  await page.screenshot({
    path: 'deliverables/v10-direction1-slice/02-core-buildings.png',
    fullPage: true,
  });

  const savedBuildingCount = await page.evaluate(() => {
    const save = localStorage.getItem('lingshan_save_v1');
    return save ? JSON.parse(save).buildings.length : 0;
  });
  expect(savedBuildingCount).toBe(3);

  await page.reload();
  await page.waitForTimeout(700);
  await page.locator('canvas').click({ position: { x: 960, y: 886 } });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: 'deliverables/v10-direction1-slice/03-continued-save.png',
    fullPage: true,
  });

  expect(errors).toEqual([]);
});

test('v0.10 direction-one mobile landscape opens', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', error => errors.push(error.message));

  await page.setViewportSize({ width: 844, height: 390 });
  await page.goto('http://127.0.0.1:4173/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await expect(page.locator('canvas')).toBeVisible();
  await page.waitForTimeout(1200);
  await page.locator('canvas').click({ position: { x: 422, y: 148 } });
  await page.waitForTimeout(1400);
  await page.screenshot({
    path: 'deliverables/v10-direction1-slice/04-mobile-landscape.png',
    fullPage: true,
  });

  expect(errors).toEqual([]);
});
