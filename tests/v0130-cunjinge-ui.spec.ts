import { expect, test } from '@playwright/test';

const URL = 'http://127.0.0.1:4180/';
const SAVE_KEY = 'lingshan_save_v1';

test.use({ viewport: { width: 1920, height: 1080 } });

test('schema 9 save opens the Cunjinge greybox without changing the public game flow', async ({ page }) => {
  await page.goto(URL);
  await expect(page.locator('canvas')).toBeVisible();
  await page.waitForTimeout(900);
  await page.locator('canvas').click({ position: { x: 960, y: 410 }, force: true });
  await page.waitForFunction(() => !!document.querySelector('canvas')?.dataset.v12State);
  await page.waitForFunction((key) => !!localStorage.getItem(key), SAVE_KEY, { timeout: 15000 });
  await page.evaluate((key) => {
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
  await page.waitForTimeout(900);
  await page.locator('canvas').click({ position: { x: 960, y: 885 }, force: true });
  await page.waitForFunction(() => !!document.querySelector('canvas')?.dataset.v12State);
  const gameState = await page.evaluate(() => JSON.parse(document.querySelector('canvas')!.dataset.v12State!));
  expect(gameState.schemaVersion).toBe(10);
  expect(gameState.day).toBe(7);
  expect(gameState.spirit).toBe(50000);
  expect(gameState.cunjinge.button).not.toBeNull();
  await page.mouse.click(gameState.cunjinge.button.x, gameState.cunjinge.button.y);
  await page.waitForFunction(() => !!document.querySelector('canvas')?.dataset.cunjingeState);
  const lobby = await page.evaluate(() => JSON.parse(document.querySelector('canvas')!.dataset.cunjingeState!));
  expect(lobby.day).toBe(7);
  expect(lobby.state.chestsStarted).toBe(0);
  expect(lobby.state.activeAuction).toBeNull();
  await page.mouse.click(347, 134);
  await page.mouse.click(183, 364);
  await page.waitForFunction(() => JSON.parse(document.querySelector('canvas')!.dataset.cunjingeState!).state.activeAuction !== null);
  const auction = await page.evaluate(() => JSON.parse(document.querySelector('canvas')!.dataset.cunjingeState!));
  expect(auction.state.chips).toBe(5000);
  expect(auction.state.chestsStarted).toBe(1);
  expect(auction.state.activeAuction.round).toBe(1);
  expect(auction.state.activeAuction.items.length).toBeGreaterThanOrEqual(8);
});
