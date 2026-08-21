import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import {
  V10_BUILD_SLOTS,
  V10_FIXED_OBJECTS,
  V10_GATE_POINT,
  V10_GRID_BASIS,
  V10_WALKABLE_POLYGONS,
  V10_WATER_POLYGON,
  v10SlotsAreAdjacent,
} from '../src/data/v10Map';
import { findVisitorPath } from '../src/systems/VisitorPath';

const URL = process.env.TEST_URL || 'http://127.0.0.1:4173/';
const SAVE_KEY = 'lingshan_save_v1';

test.use({ viewport: { width: 1920, height: 1080 } });

interface ManifestZone {
  id: string;
  origin: { x: number; y: number };
  columns: number;
  rows: number;
  firstCellId: number;
}

interface PreviewManifest {
  buildingVisualScale: number;
  gridSpacingScale: number;
  cellBasis: typeof V10_GRID_BASIS;
  stages: Array<{ stage: number; zones: ManifestZone[] }>;
}

function makeBuilding(index: number, overrides: Record<string, unknown> = {}) {
  return {
    uid: 8000 + index,
    defId: ['lingtian', 'danfang', 'danpu', 'liangong', 'xiangfang'][index % 5],
    gx: (index % 12) * 2,
    gy: Math.floor(index / 12) * 2,
    slotId: `slot-${String(index + 1).padStart(2, '0')}`,
    progress: index / 100,
    level: 1 + index % 5,
    craftRecipe: index % 5 === 1 ? 'juling' : null,
    sellRecipe: index % 5 === 2 ? 'juling' : null,
    assigned: index === 0 ? [701] : [],
    queue: 0,
    comboBonus: 0,
    stock: index,
    ...overrides,
  };
}

function makeSave(buildingCount: number, expansionsUnlocked: number) {
  return {
    schemaVersion: 7,
    faction: 'dan', spirit: 5000, herbs: 18, pills: { juling: 7, bigu: 2 }, reputation: 500,
    day: 6, dayTime: 0.35, gridW: 26, gridH: 19, unlockedRecipes: ['juling', 'bigu'],
    disciples: [{ id: 701, name: '清玄', level: 3, exp: 12, element: 'fire', assignment: 8000 }],
    buildings: Array.from({ length: buildingCount }, (_, index) => makeBuilding(index)),
    visitors: [], activeCombos: [], expansionsUnlocked, elders: [],
    totalEarned: 360, visitorsServed: 6, visitorsLost: 1, totalCrafted: 9, totalBreakthroughs: 0,
    dayEarned: 60, dayVisitorsServed: 2, recruitCandidates: [], recruitRefreshCount: 0,
    recruitNextDay: 0, commissionOffers: [], activeCommission: null, nextCommissionDay: 8,
    eventLog: [], firstSellDone: true, currentTitle: 't0',
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
  ))).toBe(10);
}

async function selectFirstBuilding(page: import('@playwright/test').Page) {
  await page.mouse.click(472, 1033);
  await expect.poll(() => page.locator('canvas').evaluate(canvas => (
    JSON.parse(canvas.dataset.buildableSlotIds || '[]') as string[]
  ).length)).toBeGreaterThan(0);
}

test('runtime slots exactly match the approved 68-percent and 108-percent manifest', () => {
  const manifest = JSON.parse(readFileSync(
    'tests/fixtures/v102-grid-manifest.json',
    'utf8',
  )) as PreviewManifest;
  expect(manifest.buildingVisualScale).toBe(0.68);
  expect(manifest.gridSpacingScale).toBe(1.08);
  expect(manifest.cellBasis.column.x).toBeCloseTo(V10_GRID_BASIS.column.x, 5);
  expect(manifest.cellBasis.column.y).toBeCloseTo(V10_GRID_BASIS.column.y, 5);
  expect(manifest.cellBasis.row.x).toBeCloseTo(V10_GRID_BASIS.row.x, 5);
  expect(manifest.cellBasis.row.y).toBeCloseTo(V10_GRID_BASIS.row.y, 5);

  const finalZones = manifest.stages.find(stage => stage.stage === 3)!.zones;
  const expected = finalZones.flatMap(zone => {
    const result: Array<{ id: string; zone: string; mapX: number; mapY: number }> = [];
    let number = zone.firstCellId;
    for (let row = 0; row < zone.rows; row++) {
      for (let column = 0; column < zone.columns; column++) {
        result.push({
          id: `slot-${String(number++).padStart(2, '0')}`,
          zone: zone.id,
          mapX: Number((zone.origin.x + column * manifest.cellBasis.column.x + row * manifest.cellBasis.row.x
            + (manifest.cellBasis.column.x + manifest.cellBasis.row.x) / 2).toFixed(2)),
          mapY: Number((zone.origin.y + column * manifest.cellBasis.column.y + row * manifest.cellBasis.row.y
            + (manifest.cellBasis.column.y + manifest.cellBasis.row.y) / 2).toFixed(2)),
        });
      }
    }
    return result;
  }).sort((a, b) => a.id.localeCompare(b.id));

  expect(V10_BUILD_SLOTS).toHaveLength(48);
  expect(new Set(V10_BUILD_SLOTS.map(slot => slot.id)).size).toBe(48);
  expect(V10_BUILD_SLOTS.map(slot => ({
    id: slot.id, zone: slot.zone, mapX: slot.mapX, mapY: slot.mapY,
  }))).toEqual(expected);
});

test('combo adjacency follows shared staggered-isometric edges only', () => {
  expect(v10SlotsAreAdjacent('slot-01', 'slot-02')).toBe(true);
  expect(v10SlotsAreAdjacent('slot-01', 'slot-05')).toBe(true);
  expect(v10SlotsAreAdjacent('slot-01', 'slot-03')).toBe(false);
  expect(v10SlotsAreAdjacent('slot-01', 'slot-09')).toBe(false);
});

for (const [buildingCount, expansionsUnlocked, expectedFree] of [
  [0, 0, 20],
  [20, 1, 12],
  [32, 2, 16],
] as const) {
  test(`build mode exposes exactly ${expectedFree} free legal slots after ${buildingCount} buildings`, async ({ page }) => {
    await continueGame(page, makeSave(buildingCount, expansionsUnlocked));
    await selectFirstBuilding(page);
    const ids = await page.locator('canvas').evaluate(canvas => (
      JSON.parse(canvas.dataset.buildableSlotIds || '[]') as string[]
    ));
    expect(ids).toHaveLength(expectedFree);
    expect(new Set(ids).size).toBe(expectedFree);
    await page.screenshot({
      path: `deliverables/v102-runtime-check/formal-stage-${expansionsUnlocked + 1}-free-slots.png`,
      fullPage: true,
    });
  });
}

test('schema-seven save migrates to ten while keeping stable building identity and production fields', async ({ page }) => {
  const original = makeSave(32, 2);
  await continueGame(page, original);
  await page.mouse.click(1793, 50);
  await page.waitForTimeout(200);
  const loaded = await page.evaluate(key => JSON.parse(localStorage.getItem(key)!), SAVE_KEY);
  expect(loaded.schemaVersion).toBe(10);
  expect(loaded.expansionsUnlocked).toBe(2);
  expect(loaded.buildings.map((item: Record<string, unknown>) => ({
    uid: item.uid,
    slotId: item.slotId,
    level: item.level,
    assigned: item.assigned,
    stock: item.stock,
    craftRecipe: item.craftRecipe,
    sellRecipe: item.sellRecipe,
  }))).toEqual(original.buildings.map(item => ({
    uid: item.uid,
    slotId: item.slotId,
    level: item.level,
    assigned: item.assigned,
    stock: item.stock,
    craftRecipe: item.craftRecipe,
    sellRecipe: item.sellRecipe,
  })));
});

test('every shop slot remains reachable without disabling building obstacles', () => {
  const fixed = V10_FIXED_OBJECTS
    .filter(object => object.id !== 'pond-lotus')
    .map(object => ({
      x: object.mapX,
      y: object.mapY - Math.max(12, object.height * 0.34),
      halfWidth: Math.max(12, object.width * 0.38),
      halfHeight: Math.max(12, object.height * 0.34),
    }));

  for (const target of V10_BUILD_SLOTS) {
    const otherBuildings = V10_BUILD_SLOTS
      .filter(slot => slot.stage <= target.stage && slot.id !== target.id)
      .map(slot => ({ x: slot.mapX, y: slot.mapY + 8, halfWidth: 26, halfHeight: 18 }));
    const path = findVisitorPath(
      V10_GATE_POINT,
      { mapX: target.mapX, mapY: target.mapY + 44 },
      V10_WALKABLE_POLYGONS[target.stage],
      V10_WATER_POLYGON,
      [...fixed, ...otherBuildings],
    );
    expect(path, target.id).not.toBeNull();
    expect(path!.length, target.id).toBeGreaterThanOrEqual(2);
  }
});
