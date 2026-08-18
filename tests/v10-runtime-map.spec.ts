import { expect, test } from '@playwright/test';

const URL = process.env.TEST_URL || 'http://127.0.0.1:4173/';

const SAVE_KEY = 'lingshan_save_v1';

test.use({ viewport: { width: 1920, height: 1080 } });

async function enterNewGame(page: import('@playwright/test').Page) {
  await page.goto(URL);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await expect(page.locator('canvas')).toBeVisible();
  await page.waitForTimeout(900);
  await page.locator('canvas').click({ position: { x: 960, y: 410 } });
  await expect.poll(() => page.locator('canvas').evaluate(canvas => !!canvas.dataset.v12State)).toBe(true);
}

async function savedState(page: import('@playwright/test').Page) {
  return page.evaluate(key => {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  }, SAVE_KEY);
}

async function buildablePoint(page: import('@playwright/test').Page, slotId: string) {
  await expect.poll(async () => page.locator('canvas').evaluate((canvas, id) => (
    JSON.parse(canvas.dataset.buildableSlotPoints || '[]') as Array<{ id: string; x: number; y: number }>
  ).some(point => point.id === id), slotId)).toBe(true);
  return page.locator('canvas').evaluate((canvas, id) => {
    const points = JSON.parse(canvas.dataset.buildableSlotPoints || '[]') as Array<{ id: string; x: number; y: number }>;
    return points.find(point => point.id === id)!;
  }, slotId);
}

async function dragFirstBuildingToSlot(
  page: import('@playwright/test').Page,
  slotId: string,
  button = { x: 472, y: 1033 },
) {
  await page.mouse.move(button.x, button.y);
  await page.mouse.down();
  const point = await buildablePoint(page, slotId);
  await page.mouse.move(point.x, point.y, { steps: 12 });
  await page.mouse.up();
  await page.waitForTimeout(500);
}

test('dragging a building highlights slots and places only on an eligible slot', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', error => errors.push(error.message));
  await enterNewGame(page);

  await page.mouse.move(472, 1033);
  await page.mouse.down();
  const slotOne = await buildablePoint(page, 'slot-01');
  await page.mouse.move(slotOne.x, slotOne.y, { steps: 12 });
  await page.waitForTimeout(250);
  await page.screenshot({
    path: 'deliverables/v10-runtime-map/01-drag-green-slots.png',
    fullPage: true,
  });
  await page.mouse.up();
  await page.waitForTimeout(1000);

  let state = await savedState(page);
  expect(state.buildings).toHaveLength(1);
  expect(state.buildings[0].slotId).toBe('slot-01');
  expect(state.spirit).toBe(250);

  await page.mouse.move(472, 1033);
  await page.mouse.down();
  await page.mouse.move(1760, 520, { steps: 12 });
  await page.mouse.up();
  await page.waitForTimeout(300);
  state = await savedState(page);
  expect(state.buildings).toHaveLength(1);
  expect(state.spirit).toBe(250);
  expect(errors).toEqual([]);
});

test('two expansions switch stages and preserve existing building slots', async ({ page }) => {
  await enterNewGame(page);
  await dragFirstBuildingToSlot(page, 'slot-01');
  const before = await savedState(page);
  expect(before.buildings).toHaveLength(1);

  await page.evaluate(key => {
    const state = JSON.parse(localStorage.getItem(key)!);
    state.spirit = 5000;
    state.reputation = 500;
    localStorage.setItem(key, JSON.stringify(state));
  }, SAVE_KEY);
  await page.reload();
  await page.waitForTimeout(500);
  await page.waitForTimeout(400);
  await page.locator('canvas').click({ position: { x: 960, y: 886 } });
  await expect.poll(() => page.locator('canvas').evaluate(canvas => (
    JSON.parse(canvas.dataset.v12State || '{}').schemaVersion || 0
  ))).toBe(9);

  await page.mouse.click(1122, 1033);
  await page.waitForTimeout(500);
  let state = await savedState(page);
  expect(state.expansionsUnlocked).toBe(1);
  expect(state.buildings[0].uid).toBe(before.buildings[0].uid);
  expect(state.buildings[0].slotId).toBe(before.buildings[0].slotId);
  await page.screenshot({ path: 'deliverables/v10-runtime-map/02-stage-two.png', fullPage: true });

  await page.mouse.click(1122, 1033);
  await page.waitForTimeout(500);
  state = await savedState(page);
  expect(state.expansionsUnlocked).toBe(2);
  expect(state.buildings[0].uid).toBe(before.buildings[0].uid);
  expect(state.buildings[0].slotId).toBe(before.buildings[0].slotId);
  await page.screenshot({ path: 'deliverables/v10-runtime-map/03-stage-three.png', fullPage: true });
});

test('schema 6 save migrates to slots without losing buildings', async ({ page }) => {
  await page.goto(URL);
  await page.evaluate(key => {
    localStorage.setItem(key, JSON.stringify({
      schemaVersion: 6,
      faction: 'dan', spirit: 300, herbs: 0, pills: { juling: 0, bigu: 0 }, reputation: 10,
      day: 1, dayTime: 0, gridW: 26, gridH: 19, unlockedRecipes: ['juling', 'bigu'],
      disciples: [],
      buildings: [
        { uid: 101, defId: 'lingtian', gx: 5, gy: 4, progress: 0, level: 1, craftRecipe: null, sellRecipe: null, assigned: [], queue: 0, comboBonus: 0, stock: 0 },
        { uid: 102, defId: 'danfang', gx: 8, gy: 5, progress: 0, level: 1, craftRecipe: null, sellRecipe: null, assigned: [], queue: 0, comboBonus: 0, stock: 0 },
      ],
      visitors: [], activeCombos: [], expansionsUnlocked: 0, elders: [], totalEarned: 0,
      visitorsServed: 0, visitorsLost: 0, totalCrafted: 0, totalBreakthroughs: 0,
      dayEarned: 0, dayVisitorsServed: 0, recruitCandidates: [], recruitRefreshCount: 0,
      recruitNextDay: 0, commissionOffers: [], activeCommission: null, nextCommissionDay: 1,
      eventLog: [], firstSellDone: false, currentTitle: 't0',
    }));
  }, SAVE_KEY);
  await page.reload();
  await expect(page.locator('canvas')).toBeVisible();
  await page.waitForTimeout(900);
  await page.locator('canvas').click({ position: { x: 960, y: 886 } });
  await expect.poll(() => page.locator('canvas').evaluate(canvas => (
    JSON.parse(canvas.dataset.v12State || '{}').schemaVersion || 0
  ))).toBe(9);
  const state = await savedState(page);
  expect(state.buildings).toHaveLength(2);
  expect(state.buildings.every((building: { slotId?: string }) => !!building.slotId)).toBe(true);
  expect(new Set(state.buildings.map((building: { uid: number }) => building.uid))).toEqual(new Set([101, 102]));
});

test('all twenty stage-one slots remain usable together', async ({ page }) => {
  await enterNewGame(page);
  await dragFirstBuildingToSlot(page, 'slot-01');
  await page.evaluate(key => {
    const state = JSON.parse(localStorage.getItem(key)!);
    const defs = ['lingtian', 'danfang', 'danpu', 'liangong', 'xiangfang'];
    state.buildings = Array.from({ length: 20 }, (_, index) => ({
      uid: 1000 + index,
      defId: defs[index % defs.length],
      gx: (index % 12) * 2,
      gy: Math.floor(index / 12) * 2,
      slotId: `slot-${String(index + 1).padStart(2, '0')}`,
      progress: 0,
      level: 1,
      craftRecipe: null,
      sellRecipe: null,
      assigned: [],
      queue: 0,
      comboBonus: 0,
      stock: 0,
    }));
    localStorage.setItem(key, JSON.stringify(state));
  }, SAVE_KEY);
  await page.reload();
  await page.waitForTimeout(900);
  await page.locator('canvas').click({ position: { x: 960, y: 886 } });
  await expect.poll(() => page.locator('canvas').evaluate(canvas => (
    JSON.parse(canvas.dataset.v12State || '{}').schemaVersion || 0
  ))).toBe(9);
  const state = await savedState(page);
  expect(state.buildings).toHaveLength(20);
  expect(new Set(state.buildings.map((building: { slotId: string }) => building.slotId)).size).toBe(20);
  await page.screenshot({ path: 'deliverables/v10-runtime-map/04-stage-one-full-capacity.png', fullPage: true });
});

test('mobile landscape can drag a building onto a green slot', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: 844, height: 390 });
  await page.goto(URL);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await expect(page.locator('canvas')).toBeVisible();
  await page.waitForTimeout(1200);
  await page.locator('canvas').click({ position: { x: 422, y: 148 } });
  await page.waitForTimeout(1400);

  const danpuButton = await expect.poll(async () => page.locator('canvas').evaluate(canvas => {
    const state = JSON.parse(canvas.dataset.v12State || '{}');
    return state.uiButtons?.find((item: { defId: string }) => item.defId === 'danpu') || null;
  })).not.toBeNull();
  void danpuButton;
  const mobileBuildButton = await page.locator('canvas').evaluate(canvas => {
    const state = JSON.parse(canvas.dataset.v12State || '{}');
    return state.uiButtons.find((item: { defId: string }) => item.defId === 'danpu');
  });
  await page.mouse.move(mobileBuildButton.x, mobileBuildButton.y);
  await page.mouse.down();
  const mobileSlot = await expect.poll(async () => page.locator('canvas').evaluate(canvas => {
    const points = JSON.parse(canvas.dataset.buildableSlotPoints || '[]') as Array<{ id: string; x: number; y: number }>;
    return points.find(point => point.x >= 120 && point.x <= 724 && point.y >= 112 && point.y <= 286) || null;
  })).not.toBeNull();
  void mobileSlot;
  const visibleSlot = await page.locator('canvas').evaluate(canvas => {
    const points = JSON.parse(canvas.dataset.buildableSlotPoints || '[]') as Array<{ id: string; x: number; y: number }>;
    return points.find(point => point.x >= 120 && point.x <= 724 && point.y >= 112 && point.y <= 286)!;
  });
  await page.mouse.move(visibleSlot.x, visibleSlot.y, { steps: 12 });
  await page.waitForTimeout(250);
  await page.screenshot({ path: 'deliverables/v10-runtime-map/05-mobile-drag-green-slots.png', fullPage: true });
  await page.mouse.up();
  await page.waitForTimeout(700);

  const state = await savedState(page);
  expect(state.buildings).toHaveLength(1);
  expect(state.buildings[0].slotId).toBe(visibleSlot.id);
  expect(state.buildings[0].defId).toBe('danpu');
  expect(state.spirit).toBe(200);
  expect(errors).toEqual([]);
});
