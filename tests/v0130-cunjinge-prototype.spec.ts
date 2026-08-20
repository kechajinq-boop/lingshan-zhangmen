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
  const firstRoundVisible = await page.locator('.treasure:not(.aura-hidden)').count();
  expect(firstRoundVisible).toBeGreaterThan(0);
  expect(firstRoundVisible).toBeLessThan(treasureCount);
  await expect(page.locator('#bidInput')).toHaveValue('0');
  await expect(page.locator('[data-bid="plus20"]')).toBeDisabled();
  await expect(page.locator('[data-bid="plus20"]')).toContainText('首轮手填');
  const publicClues = await page.locator('#clues').innerText();
  expect(publicClues).not.toMatch(/估值|行价|真实品质|重宝脚点|最低价/);
  await page.locator('[data-art="price"]').click();
  await expect(page.locator('#uses')).toContainText('本轮已用');
  expect(await page.locator('[data-art]').evaluateAll(buttons => buttons.every(button => (button as HTMLButtonElement).disabled))).toBeTruthy();
  await expect(page.locator('[data-art="aura"]')).toBeDisabled();
  await page.locator('#threatBtn').click();
  await expect(page.locator('#threatModal')).toBeVisible();
  await page.locator('[data-threat-target]').first().click();
  await page.locator('#threatConfirm').click();
  await expect(page.locator('#threatOutcome')).toBeVisible();
  await page.locator('#threatCancel').click();
  await expect(page.locator('#threatModal')).toBeHidden();
  await expect(page.locator('#threatBtn')).toBeDisabled();
  await expect(page.locator('#topStatus')).toContainText('灵石24900');
  await expect(page.locator('#artLog')).not.toHaveText('');
  const journalBox = await page.locator('#artLog').boundingBox();
  expect(journalBox!.height).toBeGreaterThan(80);
  for (let round = 1; round <= 5; round++) {
    if (round === 2) {
      await expect(page.locator('[data-art="shape"]')).toBeEnabled();
      await expect(page.locator('[data-art="price"]')).toBeDisabled();
      await page.locator('[data-art="shape"]').click();
      expect(await page.locator('[data-art]').evaluateAll(buttons => buttons.every(button => (button as HTMLButtonElement).disabled))).toBeTruthy();
    }
    if (round === 2) {
      await page.locator('#bidInput').fill('399');
      await page.locator('#submitBid').click();
      await expect(page.locator('#bidInput')).toBeEnabled();
      await expect(page.locator('.toast').last()).toContainText('必须高于上轮400');
    }
    await page.locator('#bidInput').fill(String(300 + round * 100));
    await page.locator('#submitBid').click();
    await expect(page.locator('#bidInput')).toBeDisabled();
    await expect(page.locator('#topStatus')).toContainText('报价已锁定');
    await expect(page.locator('.clue')).toHaveCount(round);
    if (round < 5) {
      await expect(page.locator('#submitBid')).toHaveText('查看下一轮线索');
      await page.locator('#submitBid').click();
      await expect(page.locator('#bidInput')).toBeEnabled();
      await expect(page.locator('.clue')).toHaveCount(round + 1);
      await expect(page.locator('[data-bid="plus20"]')).toContainText(String(Math.round((300 + round * 100) * 1.2)));
      const visibleNow = await page.locator('.treasure:not(.aura-hidden)').count();
      expect(visibleNow).toBeGreaterThan(firstRoundVisible);
    }
  }
  await expect(page.locator('.treasure:not(.aura-hidden)')).toHaveCount(treasureCount);
  const allClues = await page.locator('#clues').innerText();
  expect(allClues).toMatch(/丹药|法器|灵植|灵材|功法/);
  expect(allClues).toContain('预估价');
  expect(allClues).toMatch(/蓝色|紫色|橙色|金色|红色/);
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
  for (const selector of ['#grid', '#clues', '#arts .art:first-child', '#artLog', '#threatBtn', '#bidInput', '#submitBid']) {
    const box = await page.locator(selector).boundingBox();
    expect(box, selector).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(844);
    expect(box!.y + box!.height).toBeLessThanOrEqual(390);
  }
  const allowedShapes = new Set(['1x1', '1x2', '1x4', '2x1', '2x2', '2x3', '2x4', '3x3', '4x2', '4x4']);
  const shapes = await page.locator('.treasure').evaluateAll(nodes => nodes.map(node => `${(node as HTMLElement).dataset.w}x${(node as HTMLElement).dataset.h}`));
  expect(shapes.every(shape => allowedShapes.has(shape))).toBeTruthy();
  expect(shapes.some(shape => ['2x3', '2x4', '3x3', '4x2', '4x4'].includes(shape))).toBeTruthy();
  const fiveControls = await page.locator('#arts .art, #threatBtn').evaluateAll(nodes => nodes.map(node => (node as HTMLElement).getBoundingClientRect()).map(box => ({ x: box.x, y: box.y })));
  expect(fiveControls).toHaveLength(5);
  expect(Math.max(...fiveControls.map(box => box.y)) - Math.min(...fiveControls.map(box => box.y))).toBeLessThanOrEqual(2);
  expect(fiveControls.map(box => box.x)).toEqual([...fiveControls.map(box => box.x)].sort((a, b) => a - b));
  expect((await page.locator('#submitBid').boundingBox())!.height).toBeGreaterThanOrEqual(34);
  await page.locator('#threatBtn').click();
  await expect(page.locator('#threatModal')).toBeVisible();
  const modalBox = await page.locator('#threatModal .threat-card').boundingBox();
  expect(modalBox!.x).toBeGreaterThanOrEqual(0);
  expect(modalBox!.x + modalBox!.width).toBeLessThanOrEqual(844);
  await page.screenshot({ path: testInfo.outputPath('mobile-auction.png'), fullPage: true });
});

test('tutorial settlement keeps a meaningful value gap', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto(URL);
  await page.getByRole('button', { name: '先玩免费教学匣' }).click();
  for (let round = 1; round <= 5; round++) {
    await page.locator('#bidInput').fill(String(50 + round * 50));
    await page.locator('#submitBid').click();
    if (round < 5) await page.locator('#submitBid').click();
  }
  await page.locator('#submitBid').click();
  await expect(page.locator('#result')).toBeVisible();
  const deal = Number(await page.locator('#dealValue').innerText());
  const actual = Number(await page.locator('#actualValue').innerText());
  expect(actual / Math.max(1, deal)).toBeGreaterThanOrEqual(1.25);
});

test('ending the third chest asks whether to retain or cash out chips', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto(URL);
  await page.getByRole('button', { name: '兑换5000' }).click();
  for (let chest = 1; chest <= 3; chest++) {
    await page.locator('[data-room="market"]').click();
    for (let round = 1; round <= 5; round++) {
      await page.locator('#bidInput').fill(String(round * 100));
      await page.locator('#submitBid').click();
      if (round < 5) await page.locator('#submitBid').click();
    }
    await page.locator('#submitBid').click();
    await expect(page.locator('#result')).toBeVisible();
    await page.locator('#nextBtn').click();
    if (chest < 3) await expect(page.getByText('万宝会今日开阁')).toBeVisible();
  }
  await expect(page.locator('#chipModal')).toBeVisible();
  await expect(page.locator('#keepChips')).toBeVisible();
  await expect(page.locator('#cashOutChips')).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('chip-decision.png'), fullPage: true });
  const retained = Number((await page.locator('#chipBalance').innerText()).match(/\d+/)?.[0]);
  await page.locator('#keepChips').click();
  await expect(page.locator('#chipModal')).toBeHidden();
  await expect(page.locator('#chips')).toHaveText(String(retained));
});
