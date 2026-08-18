import { expect, test } from '@playwright/test';

const URL = process.env.TEST_URL || 'http://127.0.0.1:4173/';

test.use({ viewport: { width: 1920, height: 1080 } });

async function placeSelectedBuilding(page: import('@playwright/test').Page, buttonX: number, slotId: string) {
  await page.mouse.click(buttonX, 1033);
  await expect.poll(async () => page.locator('canvas').evaluate((canvas, id) => (
    (JSON.parse(canvas.dataset.buildableSlotPoints || '[]') as Array<{ id: string }>).some(point => point.id === id)
  ), slotId)).toBe(true);
  const point = await page.locator('canvas').evaluate((canvas, id) => {
    const points = JSON.parse(canvas.dataset.buildableSlotPoints || '[]') as Array<{ id: string; x: number; y: number }>;
    return points.find(item => item.id === id)!;
  }, slotId);
  await page.mouse.click(point.x, point.y);
  await page.waitForTimeout(800);
}

test('v0.10 direction-one visual slice', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', error => errors.push(error.message));

  await page.goto(URL);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await expect(page.locator('canvas')).toBeVisible();
  await page.waitForTimeout(900);
  await page.locator('canvas').click({ position: { x: 960, y: 410 } });
  await expect.poll(() => page.locator('canvas').evaluate(canvas => !!canvas.dataset.v12State)).toBe(true);
  await page.screenshot({
    path: 'deliverables/v10-direction1-slice/01-empty-map.png',
    fullPage: true,
  });

  await placeSelectedBuilding(page, 472, 'slot-01');
  await placeSelectedBuilding(page, 537, 'slot-02');
  await placeSelectedBuilding(page, 602, 'slot-03');
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
  await expect.poll(() => page.locator('canvas').evaluate(canvas => (
    JSON.parse(canvas.dataset.v12State || '{}').schemaVersion || 0
  ))).toBe(9);
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
  await page.goto(URL);
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
