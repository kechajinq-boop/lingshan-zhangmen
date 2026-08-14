import { expect, test } from '@playwright/test';
import {
  V12_BRIDGES,
  V12_BUILD_SLOTS,
  V12_MAP_STAGES,
  V12_ROAD_NODES,
  v12RoadPath,
  v12SlotsAreAdjacent,
} from '../src/data/v12Map';

const URL = 'http://127.0.0.1:4173/';
const SAVE_KEY = 'lingshan_save_v1';

test.use({ viewport: { width: 1920, height: 1080 } });

function makeBuilding(index: number, defId: string) {
  return {
    uid: 12000 + index,
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

function schemaSevenSave(buildings: ReturnType<typeof makeBuilding>[] = [], expansionsUnlocked = 0) {
  return {
    schemaVersion: 7,
    faction: 'dan', spirit: 5000, herbs: 12, pills: { juling: 4, bigu: 2 }, reputation: 500,
    day: 6, dayTime: 0.2, gridW: 26, gridH: 19, unlockedRecipes: ['juling', 'bigu'],
    disciples: [], buildings, visitors: [], activeCombos: [], expansionsUnlocked, elders: [],
    totalEarned: 360, visitorsServed: 6, visitorsLost: 1, totalCrafted: 9, totalBreakthroughs: 0,
    dayEarned: 60, dayVisitorsServed: 2, recruitCandidates: [], recruitRefreshCount: 0,
    recruitNextDay: 0, commissionOffers: [], activeCommission: null, nextCommissionDay: 8,
    eventLog: [], firstSellDone: true, currentTitle: 't0',
  };
}

async function continueGame(page: import('@playwright/test').Page, state: unknown, buttonPosition = { x: 960, y: 886 }) {
  await page.goto(URL);
  await page.evaluate(([key, value]) => localStorage.setItem(key, JSON.stringify(value)), [SAVE_KEY, state]);
  await page.reload();
  await expect(page.locator('canvas')).toBeVisible();
  await page.waitForTimeout(900);
  await page.locator('canvas').click({ position: buttonPosition, force: true });
  await expect.poll(async () => page.evaluate(key => {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw).schemaVersion : 0;
  }, SAVE_KEY)).toBe(8);
  await page.waitForTimeout(250);
}

test('single approved map exposes cumulative 20/32/48 stable slots', () => {
  expect(V12_MAP_STAGES.map(stage => stage.texture)).toEqual(['v12-map-base', 'v12-map-base', 'v12-map-base']);
  expect(V12_BUILD_SLOTS).toHaveLength(48);
  expect(new Set(V12_BUILD_SLOTS.map(slot => slot.id)).size).toBe(48);
  expect(V12_BUILD_SLOTS.filter(slot => slot.stage <= 0)).toHaveLength(20);
  expect(V12_BUILD_SLOTS.filter(slot => slot.stage <= 1)).toHaveLength(32);
  expect(V12_BUILD_SLOTS.filter(slot => slot.stage <= 2)).toHaveLength(48);
  expect(V12_BRIDGES).toHaveLength(3);
  expect(V12_ROAD_NODES.some(node => node.id === 'gate')).toBe(true);
  expect(v12SlotsAreAdjacent('slot-01', 'slot-02')).toBe(true);
  for (const zone of ['zone-01', 'zone-02', 'zone-03', 'zone-04', 'zone-05', 'zone-06']) {
    const path = v12RoadPath('gate', zone);
    expect(path, `gate should reach ${zone}`).not.toBeNull();
    expect(path![0].id).toBe('gate');
    expect(path!.at(-1)?.id).toBe(zone);
  }
  expect(v12RoadPath('gate', 'zone-02')!.some(node => node.id === 'bridge-north')).toBe(true);
  expect(v12RoadPath('gate', 'zone-04')!.some(node => node.id === 'bridge-middle')).toBe(true);
  expect(v12RoadPath('gate', 'zone-06')!.some(node => node.id === 'bridge-south')).toBe(true);
});

test('schema-seven save migrates to schema eight without changing old resources or buildings', async ({ page }) => {
  const old = schemaSevenSave([makeBuilding(0, 'lingtian'), makeBuilding(1, 'danfang')]);
  await continueGame(page, old);
  await page.mouse.click(1793, 50);
  await page.waitForTimeout(250);
  const saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)!), SAVE_KEY);
  expect(saved.schemaVersion).toBe(8);
  expect(saved.spirit).toBe(old.spirit);
  expect(saved.herbs).toBe(old.herbs);
  expect(saved.pills).toEqual(old.pills);
  expect(saved.spiritOre).toBe(0);
  expect(saved.azureEdgeSwords).toBe(0);
  expect(saved.totalForged).toBe(0);
  expect(saved.buildings.map((building: { uid: number; slotId: string }) => [building.uid, building.slotId]))
    .toEqual(old.buildings.map(building => [building.uid, building.slotId]));
});

for (const [occupied, stage, expected] of [[0, 0, 20], [20, 1, 12], [32, 2, 16]] as const) {
  test(`build mode shows ${expected} legal green slots at stage ${stage + 1}`, async ({ page }) => {
    const buildings = Array.from({ length: occupied }, (_, index) => makeBuilding(index, 'lingtian'));
    await continueGame(page, schemaSevenSave(buildings, stage));
    await page.mouse.click(472, 1033);
    await page.waitForTimeout(250);
    const slotIds = await expect.poll(async () => page.locator('canvas').evaluate(canvas => (
      JSON.parse(canvas.dataset.buildableSlotIds || '[]') as string[]
    ))).toHaveLength(expected);
    void slotIds;
    await page.screenshot({ path: `deliverables/v12-runtime/stage-${stage + 1}-green-slots.png`, fullPage: true });
  });
}

test('mine and forge complete the new resource loop and shop consumes only swords', async ({ page }) => {
  const save = {
    ...schemaSevenSave([
      makeBuilding(0, 'lingkuang'),
      makeBuilding(1, 'lianqi'),
      makeBuilding(2, 'faqipu'),
    ]),
    schemaVersion: 8,
    spiritOre: 3,
    azureEdgeSwords: 1,
    totalForged: 0,
  };
  await continueGame(page, save);
  await expect.poll(async () => page.locator('canvas').evaluate(canvas => {
    const live = JSON.parse(canvas.dataset.v12State || '{}');
    return live.totalForged || 0;
  }), { timeout: 18000 }).toBeGreaterThanOrEqual(1);
  await page.mouse.click(1793, 50);
  const state = await page.evaluate(key => JSON.parse(localStorage.getItem(key)!), SAVE_KEY);
  expect(state.totalForged).toBeGreaterThanOrEqual(1);
  expect(state.spiritOre).toBeGreaterThanOrEqual(1);
  expect(state.pills).toEqual(save.pills);
  expect(state.totalEarned).toBeGreaterThanOrEqual(save.totalEarned);
  await page.screenshot({ path: 'deliverables/v12-runtime/production-chain.png', fullPage: true });
});

test('new building art, icons and effects load in the production build', async ({ page, request }) => {
  const assets = [
    'assets/v12/map/map_base.png',
    'assets/v12/buildings/building-lingkuang.png',
    'assets/v12/buildings/building-lianqi.png',
    'assets/v12/buildings/building-faqipu.png',
    'assets/v12/icons/icon-build-lingkuang.png',
    'assets/v12/icons/icon-build-lianqi.png',
    'assets/v12/icons/icon-build-faqipu.png',
    'assets/v12/icons/icon-spirit-ore.png',
    'assets/v12/icons/icon-azure-edge-sword.png',
    'assets/v12/fx/fx-da-geng-sword-array.png',
    'assets/v12/fx/fx-mine-glow.png',
    'assets/v12/fx/fx-forge-sparks.png',
  ];
  for (const asset of assets) {
    const response = await request.get(URL + asset);
    expect(response.ok(), `${asset} should load`).toBe(true);
  }
  await page.goto(URL);
  await expect(page.locator('canvas')).toBeVisible();
});

test('three new buildings can be placed on highlighted legal slots and deduct exact costs', async ({ page }) => {
  await continueGame(page, schemaSevenSave([], 0));
  const menuX: Record<string, number> = { lingkuang: 797, lianqi: 862, faqipu: 927 };
  const cost: Record<string, number> = { lingkuang: 90, lianqi: 180, faqipu: 160 };
  let expectedSpirit = 5000;
  for (const id of ['lingkuang', 'lianqi', 'faqipu']) {
    await page.mouse.click(menuX[id], 1033);
    const point = await expect.poll(async () => page.locator('canvas').evaluate(canvas => {
      const points = JSON.parse(canvas.dataset.buildableSlotPoints || '[]') as Array<{ x: number; y: number }>;
      return points[0] || null;
    })).not.toBeNull();
    void point;
    const target = await page.locator('canvas').evaluate(canvas => {
      const points = JSON.parse(canvas.dataset.buildableSlotPoints || '[]') as Array<{ x: number; y: number }>;
      return points[0];
    });
    await page.mouse.click(target.x, target.y);
    expectedSpirit -= cost[id];
    await expect.poll(async () => page.locator('canvas').evaluate((canvas, defId) => {
      const live = JSON.parse(canvas.dataset.v12State || '{}');
      return (live.buildingIds || []).filter((value: string) => value === defId).length;
    }, id)).toBe(1);
  }
  const live = await page.locator('canvas').evaluate(canvas => JSON.parse(canvas.dataset.v12State || '{}'));
  expect(live.buildingCount).toBe(3);
  expect(live.spirit).toBe(expectedSpirit);
  await page.screenshot({ path: 'deliverables/v12-runtime/three-new-buildings.png', fullPage: true });
});

test('mobile landscape opens migrated save without page or console errors', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await continueGame(page, schemaSevenSave([], 0), { x: 422, y: 320 });
  await expect(page.locator('canvas')).toBeVisible();
  await page.waitForTimeout(1200);
  expect(errors).toEqual([]);
  await page.screenshot({ path: 'deliverables/v12-runtime/mobile-landscape.png', fullPage: true });
  await context.close();
});
