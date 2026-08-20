import { expect, test } from '@playwright/test';

const URL = process.env.CUNJINGE_TEST_URL || 'http://127.0.0.1:4180/deliverables/v0130-cunjinge-prototype/';

test('desktop prototype completes a full five-round auction', async ({ page }, testInfo) => {
  const consoleErrors: string[] = [];
  page.on('console', message => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(URL);
  await expect(page.getByText('万宝会今日开阁')).toBeVisible();
  await page.getByRole('button', { name: '兑换5000' }).click();
  await page.locator('[data-room="market"]').click();
  await expect(page.locator('.player')).toHaveCount(4);
  await expect(page.locator('.clue')).toHaveCount(1);
  await expect(page.locator('#topStatus')).toContainText('45秒');
  const treasureCount = await page.locator('.treasure').count();
  expect(treasureCount).toBeGreaterThanOrEqual(5);
  expect(treasureCount).toBeLessThanOrEqual(13);
  await expect(page.locator('.treasure[class*="aura-"]')).toHaveCount(treasureCount);
  const startingBid = Number(await page.locator('#bidInput').inputValue());
  await expect(page.locator('[data-bid="plus20"]')).toContainText(String(Math.round(startingBid * 1.2)));
  await page.locator('[data-art="price"]').click();
  await page.locator('[data-art="shape"]').click();
  await expect(page.locator('[data-art="aura"]')).toBeDisabled();
  await page.locator('#threatBtn').click();
  await expect(page.locator('#threatBtn')).toBeDisabled();
  await expect(page.locator('#topStatus')).toContainText('灵石24900');
  await expect(page.locator('#artLog')).not.toHaveText('');
  await page.locator('#bidInput').fill('400');
  for (let round = 1; round <= 5; round++) {
    await page.locator('#submitBid').click();
    await expect(page.locator('#bidInput')).toBeDisabled();
    await expect(page.locator('#topStatus')).toContainText('报价已锁定');
    await expect(page.locator('.clue')).toHaveCount(round);
    if (round < 5) {
      await expect(page.locator('#submitBid')).toHaveText('查看下一轮线索');
      await page.locator('#submitBid').click();
      await expect(page.locator('#bidInput')).toBeEnabled();
      await expect(page.locator('.clue')).toHaveCount(round + 1);
      await expect(page.locator('[data-bid="plus20"]')).toContainText('480');
    }
  }
  await expect(page.locator('#submitBid')).toHaveText('揭晓宝匣');
  await page.locator('#submitBid').click();
  await expect(page.locator('#result')).toBeVisible();
  await expect(page.locator('.treasure.revealed')).toHaveCount(treasureCount);
  await expect(page.locator('#actualValue')).not.toHaveText('');
  expect(consoleErrors).toEqual([]);
  await page.screenshot({ path: testInfo.outputPath('desktop-result.png'), fullPage: true });
});

test('844x390 landscape keeps chest, clues and bid controls on screen', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 844, height: 390 });
  await page.goto(URL);
  await page.getByRole('button', { name: '先玩免费教学匣' }).click();
  await expect(page.locator('#arena')).toBeVisible();
  for (const selector of ['#grid', '#clues', '#arts', '#threatTarget', '#threatBtn', '#bidInput', '#submitBid']) {
    const box = await page.locator(selector).boundingBox();
    expect(box, selector).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(844);
    expect(box!.y + box!.height).toBeLessThanOrEqual(390);
  }
  expect((await page.locator('#submitBid').boundingBox())!.height).toBeGreaterThanOrEqual(34);
  await page.screenshot({ path: testInfo.outputPath('mobile-auction.png'), fullPage: true });
});
