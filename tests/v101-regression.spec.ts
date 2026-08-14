import { expect, test } from '@playwright/test';
import {
  V10_BUILD_SLOTS,
  V10_FIXED_OBJECTS,
  V10_GATE_POINT,
  V10_WALKABLE_POLYGONS,
  V10_WATER_POLYGON,
} from '../src/data/v10Map';
import { findVisitorPath } from '../src/systems/VisitorPath';

const URL = 'http://127.0.0.1:4173/';
const SAVE_KEY = 'lingshan_save_v1';

test.use({ viewport: { width: 1920, height: 1080 } });

function building(uid: number, defId: string, index: number) {
  return {
    uid,
    defId,
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
  };
}

function saveWith(buildings: unknown[], overrides: Record<string, unknown> = {}) {
  return {
    schemaVersion: 7,
    faction: 'dan', spirit: 5000, herbs: 0, pills: { juling: 0, bigu: 0 }, reputation: 500,
    day: 1, dayTime: 0, gridW: 26, gridH: 19, unlockedRecipes: ['juling', 'bigu'],
    disciples: [], buildings, visitors: [], activeCombos: [], expansionsUnlocked: 0, elders: [],
    totalEarned: 0, visitorsServed: 0, visitorsLost: 0, totalCrafted: 0, totalBreakthroughs: 0,
    dayEarned: 0, dayVisitorsServed: 0, recruitCandidates: [], recruitRefreshCount: 0,
    recruitNextDay: 0, commissionOffers: [], activeCommission: null, nextCommissionDay: 1,
    eventLog: [], firstSellDone: false, currentTitle: 't0', ...overrides,
  };
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
  ))).toBe(8);
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

test('stage one exposes and accepts the twentieth remaining slot', async ({ page }) => {
  const firstNineteen = Array.from({ length: 19 }, (_, index) => building(5000 + index, 'lingtian', index));
  await continueGame(page, saveWith(firstNineteen));

  await page.mouse.click(472, 1033);
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'deliverables/v101-qa/01-stage-one-last-green-slot.png', fullPage: true });

  const slotTwenty = await buildablePoint(page, 'slot-20');
  await page.mouse.click(slotTwenty.x, slotTwenty.y);
  await page.waitForTimeout(900);
  const state = await page.evaluate(key => JSON.parse(localStorage.getItem(key)!), SAVE_KEY);
  expect(state.buildings).toHaveLength(20);
  expect(state.buildings.some((item: { slotId?: string }) => item.slotId === 'slot-20')).toBe(true);
});

test('every unlocked shop slot has a safe route around fixed obstacles and water', () => {
  const fixed = V10_FIXED_OBJECTS
    .filter(object => object.id !== 'pond-lotus')
    .map(object => {
      const halfHeight = Math.max(12, object.height * 0.34);
      return {
        x: object.mapX,
        y: object.mapY - halfHeight,
        halfWidth: Math.max(12, object.width * 0.38),
        halfHeight,
      };
    });
  for (const slot of V10_BUILD_SLOTS) {
    const path = findVisitorPath(
      V10_GATE_POINT,
      { mapX: slot.mapX, mapY: slot.mapY + 44 },
      V10_WALKABLE_POLYGONS[Math.max(0, slot.stage)],
      V10_WATER_POLYGON,
      fixed,
    );
    expect(path, slot.id).not.toBeNull();
    expect(path!.length, slot.id).toBeGreaterThanOrEqual(2);
  }
});

test('far-side shop gives visitors a routed walking duration and completes the trip', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', error => errors.push(error.message));
  const westShop = { ...building(6100, 'danpu', 16), sellRecipe: 'juling' };
  await continueGame(page, saveWith([westShop], { pills: { juling: 20, bigu: 0 } }));

  await page.waitForTimeout(3900);
  await page.screenshot({ path: 'deliverables/v101-qa/02-visitor-routed-midway.png', fullPage: true });

  await page.waitForTimeout(9000);
  await page.screenshot({ path: 'deliverables/v101-qa/03-visitor-arrived.png', fullPage: true });
  await page.mouse.click(1793, 50);
  await page.waitForTimeout(150);
  const arrived = await page.evaluate(key => JSON.parse(localStorage.getItem(key)!), SAVE_KEY);
  expect(arrived.visitorsServed).toBeGreaterThan(0);
  expect(errors).toEqual([]);
});

test('four visitor variants complete the four-direction diagnostic without console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', error => errors.push(error.message));
  await continueGame(page, saveWith([]));
  await page.keyboard.press('v');
  await page.waitForTimeout(850);
  await page.screenshot({ path: 'deliverables/v101-qa/04-four-direction-check.png', fullPage: true });
  await page.waitForTimeout(2400);
  expect(errors).toEqual([]);
});
