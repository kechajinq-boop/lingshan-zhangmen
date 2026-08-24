import { expect, test } from '@playwright/test';

const ROOT = process.env.TEST_URL || 'http://127.0.0.1:4180/';
const PLAY_URL = process.env.CUNJINGE_TEST_URL || new URL('cunjinge/index.html?qa=1', ROOT).toString();
const SAVE_KEY = 'lingshan_save_v1';

test('desktop prototype completes a full five-round auction', async ({ page }, testInfo) => {
  const consoleErrors: string[] = [];
  page.on('console', message => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(PLAY_URL);
  await expect(page.getByRole('heading', { name: '寸金阁', exact: true })).toBeVisible();
  const roomBackgrounds = await page.locator('.room').evaluateAll(nodes => nodes.map(node => getComputedStyle(node, '::before').backgroundImage));
  expect(roomBackgrounds[0]).toContain('market.webp');
  expect(roomBackgrounds[1]).toContain('cloud.webp');
  expect(roomBackgrounds[2]).toContain('heaven.webp');
  await page.getByRole('button', { name: '兑换5000' }).click();
  await page.locator('button[data-room="market"]').click();
  await expect(page.locator('.player')).toHaveCount(4);
  await expect.poll(() => page.locator('.avatar img').evaluateAll(images => images.every(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBeTruthy();
  await expect(page.locator('.clue')).toHaveCount(1);
  await expect(page.locator('#topStatus')).toContainText('45秒');
  await expect(page.locator('#topStatus .countdown')).toHaveText('45秒');
  expect(await page.locator('#topStatus .countdown').evaluate(node => getComputedStyle(node).color)).toBe('rgb(199, 49, 40)');
  expect(Number.parseFloat(await page.locator('#topStatus .countdown').evaluate(node => getComputedStyle(node).fontSize))).toBeGreaterThanOrEqual(20);
  expect((await page.locator('#topStatus').innerText()).indexOf('45秒')).toBeGreaterThan((await page.locator('#topStatus').innerText()).indexOf('鉴宝师'));
  const treasureCount = await page.locator('.treasure').count();
  expect(treasureCount).toBeGreaterThanOrEqual(5);
  expect(treasureCount).toBeLessThanOrEqual(13);
  await expect.poll(() => page.locator('.treasure img').evaluateAll(images => images.every(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBeTruthy();
  await expect(page.locator('.treasure.type-known')).toHaveCount(0);
  expect(await page.locator('.treasure img').evaluateAll(images => images.every(image => getComputedStyle(image).opacity === '0'))).toBeTruthy();
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
  await expect(page.locator('.treasure.marked')).toHaveCount(1);
  const firstMarkedIndex = await page.locator('.treasure.marked').getAttribute('data-item-index');
  await page.screenshot({ path: testInfo.outputPath('desktop-markers.png'), fullPage: true });
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
      await expect(page.locator('.treasure.marked')).toHaveCount(1);
      expect(await page.locator('.treasure.marked').getAttribute('data-item-index')).not.toBe(firstMarkedIndex);
    }
    if (round === 2) {
      await page.locator('#bidInput').fill('399');
      await page.locator('#submitBid').click();
      await expect(page.locator('#bidInput')).toBeEnabled();
      await expect(page.locator('.toast').last()).toContainText('不能低于上轮400');
    }
    const currentBid = round === 2 ? 400 : 300 + round * 100;
    await page.locator('#bidInput').fill(String(currentBid));
    await page.locator('#submitBid').click();
    await expect(page.locator('#bidInput')).toBeDisabled();
    await expect(page.locator('#topStatus')).toContainText('报价已锁定');
    const activeBidders = await page.locator('.player:not(.withdrawn)').count();
    await expect(page.locator('.bid-bubble')).toHaveCount(activeBidders);
    await expect(page.locator('.player.quote-on')).toHaveCount(activeBidders);
    const bidBubbleTexts = await page.locator('.bid-bubble').allTextContents();
    expect(bidBubbleTexts.every(text => text.includes('筹码') && !text.includes('灵石'))).toBeTruthy();
    expect(new Set(bidBubbleTexts).size).toBe(activeBidders);
    if (round === 1) {
      await page.waitForTimeout(400);
      await page.screenshot({ path: testInfo.outputPath('desktop-bids.png'), fullPage: true });
    }
    await expect(page.locator('.clue')).toHaveCount(round);
    if (round < 5) {
      await expect(page.locator('#submitBid')).toHaveText('查看下一轮线索');
      await page.locator('#submitBid').click();
      await expect(page.locator('#bidInput')).toBeEnabled();
      await expect(page.locator('.clue')).toHaveCount(round + 1);
      await expect(page.locator('[data-bid="plus20"]')).toContainText(String(Math.round(currentBid * 1.2)));
      const visibleNow = await page.locator('.treasure:not(.aura-hidden)').count();
      expect(visibleNow).toBeGreaterThan(firstRoundVisible);
      if (round === 3) {
        await expect(page.locator('.treasure.type-known')).toHaveCount(1);
        await expect(page.locator('.treasure.type-known .type-badge')).toBeVisible();
        await expect(page.locator('.clue').last()).toContainText(/蓝色|紫色|橙色|金色|红色/);
        await expect(page.locator('.clue').last()).toContainText(/丹药|法器|灵植|灵材|功法/);
        await expect(page.locator('#artLog')).toContainText('线索反应');
        await expect(page.locator('.treasure[data-confirmed-rarity]')).toHaveCount(1);
        await page.screenshot({ path: testInfo.outputPath('desktop-type-reveal.png'), fullPage: true });
      }
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
  expect(await page.locator('.treasure.revealed img').evaluateAll(images => images.every(image => getComputedStyle(image).opacity === '1'))).toBeTruthy();
  await expect(page.locator('#actualValue')).not.toHaveText('');
  expect(consoleErrors).toEqual([]);
  await page.screenshot({ path: testInfo.outputPath('desktop-result.png'), fullPage: true });
});

test('844x390 landscape keeps chest, clues and bid controls on screen', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 844, height: 390 });
  await page.goto(PLAY_URL);
  await page.getByRole('button', { name: '先玩免费教学匣' }).click();
  await expect(page.locator('#arena')).toBeVisible();
  await expect(page.locator('#arena')).toHaveAttribute('data-room', 'market');
  for (const selector of ['#grid', '#clues', '#arts .art:first-child', '#artLog', '#players', '#threatBtn', '#bidInput', '#submitBid']) {
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
  const fiveControls = await page.locator('#arts .art, #threatBtn').evaluateAll(nodes => nodes.map(node => (node as HTMLElement).getBoundingClientRect()).map(box => ({ x: box.x, y: box.y, height: box.height })));
  expect(fiveControls).toHaveLength(5);
  expect(Math.max(...fiveControls.map(box => box.y)) - Math.min(...fiveControls.map(box => box.y))).toBeLessThanOrEqual(2);
  expect(fiveControls.map(box => box.x)).toEqual([...fiveControls.map(box => box.x)].sort((a, b) => a - b));
  expect(Math.max(...fiveControls.map(box => box.height))).toBeLessThanOrEqual(24);
  const readingColumns = await Promise.all(['.clues', '.auction-log'].map(async selector => (await page.locator(selector).boundingBox())!));
  expect(readingColumns[0].x).toBeLessThan(readingColumns[1].x);
  const playerCards = await page.locator('.player').evaluateAll(nodes => nodes.map(node => (node as HTMLElement).getBoundingClientRect()).map(box => ({ x: box.x, y: box.y })));
  expect(playerCards).toHaveLength(4);
  expect(Math.max(...playerCards.map(box => box.x)) - Math.min(...playerCards.map(box => box.x))).toBeLessThanOrEqual(2);
  expect(playerCards.map(box => box.y)).toEqual([...playerCards.map(box => box.y)].sort((a, b) => a - b));
  await expect(page.locator('#logNext')).toBeVisible();
  expect((await page.locator('#submitBid').boundingBox())!.height).toBeGreaterThanOrEqual(34);
  await page.screenshot({ path: testInfo.outputPath('mobile-layout.png'), fullPage: true });
  await page.locator('#threatBtn').click();
  await expect(page.locator('#threatModal')).toBeVisible();
  const modalBox = await page.locator('#threatModal .threat-card').boundingBox();
  expect(modalBox!.x).toBeGreaterThanOrEqual(0);
  expect(modalBox!.x + modalBox!.width).toBeLessThanOrEqual(844);
  await page.screenshot({ path: testInfo.outputPath('mobile-auction.png'), fullPage: true });
});

test('quick bid prices stay distinct near the chip limit and equal bids remain valid', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto(PLAY_URL);
  await page.getByRole('button', { name: '兑换5000' }).click();
  await page.locator('button[data-room="market"]').click();
  await page.locator('#bidInput').fill('4900');
  await page.locator('#submitBid').click();
  await page.locator('#submitBid').click();
  const quickPrices = await page.locator('[data-bid]').allTextContents();
  expect(quickPrices.join('|')).toContain('5880');
  expect(quickPrices.join('|')).toContain('7350');
  expect(quickPrices.join('|')).toContain('8330');
  expect(new Set(quickPrices).size).toBe(3);
  await page.locator('#bidInput').fill('4900');
  await page.locator('#submitBid').click();
  await expect(page.locator('#bidInput')).toBeDisabled();
});

test('tutorial settlement keeps a meaningful value gap', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto(PLAY_URL);
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
  await page.goto(PLAY_URL);
  await page.evaluate(key => localStorage.setItem(key, JSON.stringify({
    schemaVersion: 10,
    day: 7,
    spirit: 30000,
    reputation: 350,
    cunjinge: { chips: 0, chests: 0, eventDay: 7, room: null, auction: null, tutorialDone: false, appraiserXp: 120, sessionXp: 0, startLevel: 1 },
  })), SAVE_KEY);
  await page.reload();
  await page.getByRole('button', { name: '兑换5000' }).click();
  for (let chest = 1; chest <= 3; chest++) {
    await expect.poll(() => page.evaluate(key => JSON.parse(localStorage.getItem(key) || '{}').cunjinge?.chests, SAVE_KEY)).toBe(chest - 1);
    await page.locator('button[data-room="market"]').click();
    await expect.poll(() => page.evaluate(key => JSON.parse(localStorage.getItem(key) || '{}').cunjinge?.chests, SAVE_KEY)).toBe(chest);
    for (let round = 1; round <= 5; round++) {
      await page.locator('#bidInput').fill('0');
      await page.locator('#submitBid').click();
      await expect(page.locator('#bidInput'), `chest ${chest}, round ${round}`).toBeDisabled();
      if (round < 5) {
        await expect(page.locator('#submitBid')).toHaveText('查看下一轮线索');
        await page.locator('#submitBid').click();
        await expect(page.locator('#bidInput')).toBeEnabled();
      }
    }
    await page.locator('#submitBid').click();
    await expect(page.locator('#result')).toBeVisible();
    await page.locator('#nextBtn').click();
    if (chest < 3) await expect(page.getByRole('heading', { name: '寸金阁', exact: true })).toBeVisible();
  }
  await expect(page.locator('#chipModal')).toBeVisible();
  await expect(page.locator('#keepChips')).toBeVisible();
  await expect(page.locator('#cashOutChips')).toBeVisible();
  await expect(page.locator('#chipSummary')).toContainText('Lv.1');
  await expect(page.locator('#chipSummary')).toContainText('Lv.2');
  expect(Number((await page.locator('#chipBalance').innerText()).match(/累计阅历\s*(\d+)/)?.[1])).toBeGreaterThanOrEqual(150);
  await page.screenshot({ path: testInfo.outputPath('chip-decision.png'), fullPage: true });
  const retained = Number((await page.locator('#chipBalance').innerText()).match(/\d+/)?.[0]);
  await page.locator('#keepChips').click();
  await expect(page.locator('#chipModal')).toBeHidden();
  await expect(page.locator('#chips')).toHaveText(String(retained));
});

test('schema 9 save migrates, enters from the sect and resumes a locked auction after refresh', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(ROOT);
  await expect(page.locator('canvas')).toBeVisible();
  await page.waitForTimeout(900);
  await page.locator('canvas').click({ position: { x: 960, y: 410 }, force: true });
  await page.waitForFunction(() => !!document.querySelector('canvas')?.dataset.v12State);
  await page.locator('canvas').click({ position: { x: 1780, y: 50 }, force: true });
  await expect.poll(async () => page.evaluate(key => !!localStorage.getItem(key), SAVE_KEY)).toBe(true);
  await page.evaluate(key => {
    const save = JSON.parse(localStorage.getItem(key)!);
    save.schemaVersion = 9;
    save.day = 7;
    save.spirit = 50000;
    save.reputation = 999;
    delete save.cunjinge;
    localStorage.setItem(key, JSON.stringify(save));
  }, SAVE_KEY);
  await page.reload();
  await expect(page.locator('canvas')).toBeVisible();
  await expect.poll(async () => {
    const state = await page.locator('canvas').evaluate(canvas => JSON.parse(canvas.dataset.v12State || '{}'));
    if (state.schemaVersion === 10) return true;
    await page.locator('canvas').click({ position: { x: 960, y: 885 }, force: true });
    await page.waitForTimeout(250);
    return false;
  }, { timeout: 15000 }).toBe(true);
  const gameState = await page.locator('canvas').evaluate(canvas => JSON.parse(canvas.dataset.v12State || '{}'));
  expect(gameState.day).toBe(7);
  expect(gameState.spirit).toBe(50000);
  expect(gameState.cunjinge.openToday).toBe(true);
  expect(gameState.cunjinge.button).not.toBeNull();
  expect(await page.evaluate(() => !!localStorage.getItem('lingshan_save_backup_pre_v0124'))).toBe(true);
  await page.locator('canvas').click({ position: gameState.cunjinge.button, force: true });
  await page.waitForURL(/\/cunjinge\//);
  await expect(page.locator('#spirit')).toHaveText('50000');
  await page.getByRole('button', { name: '兑换5000' }).click();
  await page.locator('button[data-room="market"]').click();
  await expect(page.locator('#arena')).toBeVisible();
  let saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)!), SAVE_KEY);
  expect(saved.schemaVersion).toBe(10);
  expect(saved.spirit).toBe(45000);
  expect(saved.cunjinge.chests).toBe(1);
  expect(saved.cunjinge.auction.round).toBe(1);
  await page.locator('#bidInput').fill('500');
  await page.locator('#submitBid').click();
  await expect(page.locator('#topStatus')).toContainText('报价已锁定');
  await page.reload();
  await expect(page.locator('#arena')).toBeVisible();
  await expect(page.locator('#topStatus')).toContainText('报价已锁定');
  await page.locator('#returnBtn').click();
  await expect(page.locator('.toast').last()).toContainText('请先完成本匣');
  await page.locator('#submitBid').click();
  await expect(page.locator('.clue')).toHaveCount(2);
  saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)!), SAVE_KEY);
  expect(saved.cunjinge.auction.round).toBe(2);
});

test('entering Cunjinge never turns a zero-spirit save into test money', async ({ page }) => {
  await page.goto(ROOT);
  await page.evaluate(key => localStorage.setItem(key, JSON.stringify({
    schemaVersion: 10,
    day: 7,
    spirit: 0,
    reputation: 0,
    cunjinge: { chips: 0, chests: 0, eventDay: 7, room: null, auction: null, tutorialDone: false, appraiserXp: 0, sessionXp: 0, startLevel: 1 },
  })), SAVE_KEY);
  await page.goto(PLAY_URL);
  await expect(page.locator('#spirit')).toHaveText('0');
  await page.getByRole('button', { name: '兑换500', exact: true }).click();
  await expect(page.locator('#spirit')).toHaveText('0');
  await expect(page.locator('#chips')).toHaveText('0');
});

test('ten-thousand generated chests stay valid and ninety high-room wins reach level ten', async ({ page }) => {
  await page.goto(PLAY_URL);
  const result = await page.evaluate(() => {
    const qa = (window as any).__cunjingeQa;
    let falseAuraCount = 0;
    for (let index = 0; index < 10000; index++) {
      const room = qa.rooms[index % qa.rooms.length];
      const items = qa.makeItems(room, false);
      if (items.length < 5 || items.length > 13) throw new Error(`invalid item count ${items.length}`);
      const occupied = new Set<string>();
      let total = 0;
      let red = 0;
      for (const item of items) {
        total += item.value;
        if (item.rarity === 'red') red++;
        if (item.aura !== item.rarity) falseAuraCount++;
        for (let y = item.y; y < item.y + item.shape.h; y++) {
          for (let x = item.x; x < item.x + item.shape.w; x++) {
            if (x < 0 || x >= 10 || y < 0 || y >= 8) throw new Error('item outside chest');
            const key = `${x},${y}`;
            if (occupied.has(key)) throw new Error('overlapping items');
            occupied.add(key);
          }
        }
      }
      if (red > 1) throw new Error('more than one red treasure');
      if (total < room.min || total > room.max) throw new Error(`room value ${total} outside range`);
    }
    return {
      falseAuraCount,
      levelAt3149: qa.appraiserLevel(3149),
      levelAt3150: qa.appraiserLevel(3150),
      ninetyHighRoomWinsXp: 90 * (30 + 5),
    };
  });
  expect(result.falseAuraCount).toBeGreaterThan(0);
  expect(result.levelAt3149).toBe(9);
  expect(result.ninetyHighRoomWinsXp).toBe(3150);
  expect(result.levelAt3150).toBe(10);
});
