import { expect, test } from '@playwright/test';

const URL = process.env.TEST_URL || 'http://127.0.0.1:4173/';
const SAVE_KEY = 'lingshan_save_v1';

test.use({ viewport: { width: 1920, height: 1080 } });

function makeBuilding(uid: number, defId: string, index: number, overrides: Record<string, unknown> = {}) {
  return {
    uid, defId, gx: (index % 12) * 2, gy: Math.floor(index / 12) * 2,
    progress: 0, level: 1, craftRecipe: null, sellRecipe: null,
    assigned: [], queue: 0, comboBonus: 0, stock: 0, ...overrides,
  };
}

function makeSave(buildings: unknown[] = [], overrides: Record<string, unknown> = {}) {
  return {
    schemaVersion: 6,
    faction: 'dan', spirit: 300, herbs: 0, pills: { juling: 0, bigu: 0 }, reputation: 10,
    day: 1, dayTime: 0, gridW: 26, gridH: 19, unlockedRecipes: ['juling', 'bigu'],
    disciples: [], buildings, visitors: [], activeCombos: [], expansionsUnlocked: 0, elders: [],
    totalEarned: 0, visitorsServed: 0, visitorsLost: 0, totalCrafted: 0, totalBreakthroughs: 0,
    dayEarned: 0, dayVisitorsServed: 0, recruitCandidates: [], recruitRefreshCount: 0,
    recruitNextDay: 0, commissionOffers: [], activeCommission: null, nextCommissionDay: 1,
    eventLog: [], firstSellDone: false, currentTitle: 't0', ...overrides,
  };
}

async function enterNewGame(page: import('@playwright/test').Page) {
  await page.goto(URL);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await expect(page.locator('canvas')).toBeVisible();
  await page.waitForTimeout(900);
  await page.locator('canvas').click({ position: { x: 960, y: 410 } });
  await expect.poll(() => page.locator('canvas').evaluate(canvas => !!canvas.dataset.v12State)).toBe(true);
}

async function continueGame(page: import('@playwright/test').Page, state: unknown) {
  await page.goto(URL);
  await page.evaluate(([key, value]) => localStorage.setItem(key, JSON.stringify(value)), [SAVE_KEY, state]);
  await page.reload();
  await expect(page.locator('canvas')).toBeVisible();
  await page.waitForTimeout(900);
  await page.locator('canvas').click({ position: { x: 960, y: 886 } });
  await expect.poll(() => page.locator('canvas').evaluate(canvas => (
    JSON.parse(canvas.dataset.v12State || '{}').schemaVersion || 0
  ))).toBe(10);
}

async function readSave(page: import('@playwright/test').Page) {
  return page.evaluate(key => JSON.parse(localStorage.getItem(key)!), SAVE_KEY);
}

async function buildableIds(page: import('@playwright/test').Page) {
  return page.locator('canvas').evaluate(canvas => (
    JSON.parse(canvas.dataset.buildableSlotIds || '[]') as string[]
  ));
}

async function buildablePoint(page: import('@playwright/test').Page, slotId: string) {
  await expect.poll(async () => page.locator('canvas').evaluate((canvas, id) => (
    (JSON.parse(canvas.dataset.buildableSlotPoints || '[]') as Array<{ id: string }>).some(point => point.id === id)
  ), slotId)).toBe(true);
  return page.locator('canvas').evaluate((canvas, id) => {
    const points = JSON.parse(canvas.dataset.buildableSlotPoints || '[]') as Array<{ id: string; x: number; y: number }>;
    return points.find(point => point.id === id)!;
  }, slotId);
}

async function dragFirstBuilding(page: import('@playwright/test').Page, slotId: string) {
  await page.mouse.move(472, 1033);
  await page.mouse.down();
  const point = await buildablePoint(page, slotId);
  await page.mouse.move(point.x, point.y, { steps: 12 });
  await page.mouse.up();
  await page.waitForTimeout(500);
}

test('stage-two and stage-three slots unlock only after their matching expansion', async ({ page }) => {
  const failed: string[] = [];
  let mapResponse = 0;
  page.on('response', response => {
    if (response.status() >= 400) failed.push(`${response.status()} ${response.url()}`);
    if (response.url().endsWith('/assets/v12/map/map_base.png')) mapResponse = response.status();
  });
  await continueGame(page, makeSave([], { schemaVersion: 7, spirit: 5000, reputation: 500 }));

  await page.mouse.click(472, 1033);
  expect(await buildableIds(page)).not.toContain('slot-21');
  let state = await readSave(page);
  expect(state.buildings).toHaveLength(0);
  expect(state.spirit).toBe(5000);

  await page.mouse.click(1122, 1033);
  await page.waitForTimeout(500);
  await dragFirstBuilding(page, 'slot-21');
  state = await readSave(page);
  expect(state.expansionsUnlocked).toBe(1);
  expect(state.buildings[0].slotId).toBe('slot-21');

  await page.mouse.click(1122, 1033);
  await page.waitForTimeout(500);
  await dragFirstBuilding(page, 'slot-33');
  state = await readSave(page);
  expect(state.expansionsUnlocked).toBe(2);
  expect(state.buildings.map((building: { slotId: string }) => building.slotId)).toEqual(['slot-21', 'slot-33']);
  expect(failed).toEqual([]);
  expect(mapResponse).toBe(200);
});

for (const count of [20, 32, 48]) {
  test(`schema-six save with ${count} buildings migrates without data loss`, async ({ page }) => {
    const defs = ['lingtian', 'danfang', 'danpu', 'liangong', 'xiangfang'];
    const buildings = Array.from({ length: count }, (_, index) => makeBuilding(
      2000 + index,
      defs[index % defs.length],
      index,
      { level: 1 + index % 5, craftRecipe: index % 5 === 1 ? 'juling' : null },
    ));
    await continueGame(page, makeSave(buildings));
    const state = await readSave(page);
    expect(state.buildings).toHaveLength(count);
    expect(new Set(state.buildings.map((building: { uid: number }) => building.uid)).size).toBe(count);
    expect(new Set(state.buildings.map((building: { slotId: string }) => building.slotId)).size).toBe(count);
    expect(state.buildings.every((building: { slotId?: string }) => !!building.slotId)).toBe(true);
    expect(state.buildings.map((building: { level: number }) => building.level)).toEqual(buildings.map(building => building.level));
  });
}

test('saving during a sale clears transient visitors and shop queue without losing production progress', async ({ page }) => {
  const original = makeSave([
    makeBuilding(1, 'lingtian', 0, { progress: 0.55 }),
    makeBuilding(2, 'danpu', 1, { progress: 0.8, queue: 2 }),
  ], {
    pills: {},
    visitors: [{ id: 9, state: 'buying', targetUid: 2, patience: 10, happy: false }],
  });
  await continueGame(page, original);
  const values = await page.evaluate(([key, backupKey]) => ({
    state: JSON.parse(localStorage.getItem(key)!),
    backup: localStorage.getItem(backupKey),
  }), [SAVE_KEY, 'lingshan_save_backup_pre_v10']);
  expect(values.state.visitors).toEqual([]);
  expect(values.state.buildings.find((building: { uid: number }) => building.uid === 2)).toMatchObject({ queue: 0, progress: 0 });
  expect(values.state.buildings.find((building: { uid: number }) => building.uid === 1).progress).toBeCloseTo(0.55, 2);
  expect(values.state.pills).toMatchObject({ juling: 0, bigu: 0 });
  expect(JSON.parse(values.backup!)).toMatchObject({ schemaVersion: 6 });
});

test('corrupt save is preserved before a fresh session can overwrite it', async ({ page }) => {
  await page.goto(URL);
  await page.evaluate(key => localStorage.setItem(key, '{broken-save'), SAVE_KEY);
  await page.reload();
  await page.waitForTimeout(900);
  await page.locator('canvas').click({ position: { x: 960, y: 886 } });
  await expect.poll(() => page.evaluate(() => localStorage.getItem('lingshan_save_backup_corrupt'))).toBe('{broken-save');
});

test('a cancelled touch-style pointer cannot place a building after interruption', async ({ page }) => {
  await enterNewGame(page);
  await page.mouse.move(472, 1033);
  await page.mouse.down();
  await page.mouse.move(800, 600, { steps: 6 });
  await page.locator('canvas').dispatchEvent('pointercancel', { pointerId: 1, pointerType: 'touch' });
  await page.mouse.move(964, 517);
  await page.mouse.up();
  await page.waitForTimeout(500);
  await page.mouse.click(1793, 50);
  await page.waitForTimeout(200);
  const state = await readSave(page);
  expect(state.buildings).toHaveLength(0);
  expect(state.spirit).toBe(300);
});

test('production, alchemy and visitor purchase continue as one playable loop', async ({ page }) => {
  await continueGame(page, makeSave([
    makeBuilding(11, 'lingtian', 0, { progress: 0.9 }),
    makeBuilding(12, 'danfang', 1, { progress: 0.9, craftRecipe: 'juling' }),
    makeBuilding(13, 'danpu', 2),
  ], {
    spirit: 300, herbs: 5, pills: { juling: 2, bigu: 0 }, reputation: 500,
  }));
  await page.mouse.click(1447, 1033);
  await page.waitForTimeout(12_000);
  await page.mouse.click(1793, 50);
  await page.waitForTimeout(300);
  const state = await readSave(page);
  expect(state.totalCrafted).toBeGreaterThan(0);
  expect(state.visitorsServed).toBeGreaterThan(0);
  expect(state.totalEarned).toBeGreaterThan(0);
  expect(state.firstSellDone).toBe(true);
  expect(Number.isFinite(state.spirit)).toBe(true);
  expect(Number.isFinite(state.herbs)).toBe(true);
  expect(Object.values(state.pills).every(Number.isFinite)).toBe(true);
});

test('pause freezes production and two-times speed resumes it', async ({ page }) => {
  await continueGame(page, makeSave([
    makeBuilding(21, 'lingtian', 0, { progress: 0.2 }),
  ], { schemaVersion: 7 }));
  await page.mouse.click(1317, 1033);
  await page.mouse.click(1793, 50);
  await page.waitForTimeout(200);
  const pausedStart = await readSave(page);
  await page.waitForTimeout(3_000);
  await page.mouse.click(1793, 50);
  await page.waitForTimeout(200);
  const pausedEnd = await readSave(page);
  expect(pausedEnd.dayTime).toBeCloseTo(pausedStart.dayTime, 2);
  expect(pausedEnd.buildings[0].progress).toBeCloseTo(pausedStart.buildings[0].progress, 2);

  await page.mouse.click(1447, 1033);
  await page.waitForTimeout(4_000);
  await page.mouse.click(1793, 50);
  await page.waitForTimeout(200);
  const resumed = await readSave(page);
  expect(resumed.dayTime).toBeGreaterThan(pausedEnd.dayTime + 4.5);
  expect(resumed.herbs > pausedEnd.herbs || resumed.buildings[0].progress > pausedEnd.buildings[0].progress).toBe(true);
});
