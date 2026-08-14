import { expect, test } from '@playwright/test';
import {
  V12_BRIDGES,
  V12_BUILD_SLOTS,
  V12_GATE_COLLISIONS,
  V12_GATE_PORTAL,
  V12_MAIN_HALL_COLLISION,
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

test('every gate route avoids the full main-hall collision area', () => {
  const hitsHall = (from: { mapX: number; mapY: number }, to: { mapX: number; mapY: number }) => {
    const distance = Math.hypot(to.mapX - from.mapX, to.mapY - from.mapY);
    const samples = Math.max(1, Math.ceil(distance / 4));
    for (let index = 0; index <= samples; index++) {
      const t = index / samples;
      const x = from.mapX + (to.mapX - from.mapX) * t;
      const y = from.mapY + (to.mapY - from.mapY) * t;
      if (
        Math.abs(x - V12_MAIN_HALL_COLLISION.x) <= V12_MAIN_HALL_COLLISION.halfWidth
        && Math.abs(y - V12_MAIN_HALL_COLLISION.y) <= V12_MAIN_HALL_COLLISION.halfHeight
      ) return true;
    }
    return false;
  };

  for (const zone of ['zone-01', 'zone-02', 'zone-03', 'zone-04', 'zone-05', 'zone-06']) {
    const path = v12RoadPath('gate', zone)!;
    for (let index = 1; index < path.length; index++) {
      expect(hitsHall(path[index - 1], path[index]), `${zone}: ${path[index - 1].id} -> ${path[index].id}`).toBe(false);
    }
  }
  expect(v12RoadPath('gate', 'zone-01')!.map(node => node.id)).toContain('hall-west');
});

test('gate route uses only the open portal and never crosses the gate base sides', () => {
  const path = v12RoadPath('gate', 'zone-05')!;
  const from = path[0];
  const to = path[1];
  for (let index = 0; index <= 30; index++) {
    const t = index / 30;
    const x = from.mapX + (to.mapX - from.mapX) * t;
    const y = from.mapY + (to.mapY - from.mapY) * t;
    if (y >= V12_GATE_PORTAL.northY && y <= V12_GATE_PORTAL.southY) {
      expect(Math.abs(x - V12_GATE_PORTAL.x)).toBeLessThanOrEqual(V12_GATE_PORTAL.halfWidth);
    }
    expect(V12_GATE_COLLISIONS.some(obstacle => (
      Math.abs(x - obstacle.x) <= obstacle.halfWidth
      && Math.abs(y - obstacle.y) <= obstacle.halfHeight
    ))).toBe(false);
  }
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

test('continuing an old save clears stale visitor models and rebuilds shop queues safely', async ({ page }) => {
  const old = {
    ...schemaSevenSave([
      { ...makeBuilding(0, 'danpu'), queue: 3, progress: 0.75, assigned: ['old-shopkeeper-a'] },
      { ...makeBuilding(1, 'faqipu'), queue: 2, progress: 0.5, assigned: ['old-shopkeeper-b'] },
    ]),
    schemaVersion: 8,
    spiritOre: 4,
    azureEdgeSwords: 2,
    visitors: [
      { id: 91, state: 'buying', targetUid: 12000, patience: 10, happy: false, sprite: { scale: 0.25 } },
      { id: 92, state: 'walking', targetUid: 12001, patience: 10, happy: false, walkTimer: 3 },
    ],
  };
  await continueGame(page, old);
  const saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)!), SAVE_KEY);
  const live = await page.locator('canvas').evaluate(canvas => JSON.parse(canvas.dataset.v12State || '{}'));
  expect(saved.visitors).toEqual([]);
  expect(saved.buildings.map((building: { queue: number }) => building.queue)).toEqual([0, 0]);
  expect(saved.spiritOre).toBe(old.spiritOre);
  expect(saved.azureEdgeSwords).toBe(old.azureEdgeSwords);
  expect(live.visitors).toEqual([]);
  expect(live.visitorVisuals).toEqual([]);
  expect(live.buildingVisuals.every((building: { workerVisible: boolean }) => !building.workerVisible)).toBe(true);

  await page.reload();
  await expect(page.locator('canvas')).toBeVisible();
  await page.waitForTimeout(900);
  await page.locator('canvas').click({ position: { x: 960, y: 886 }, force: true });
  await page.waitForTimeout(400);
  const repeated = await page.locator('canvas').evaluate(canvas => JSON.parse(canvas.dataset.v12State || '{}'));
  expect(repeated.visitors).toEqual([]);
  expect(repeated.visitorVisuals).toEqual([]);
  expect(repeated.buildingVisuals.every((building: { workerVisible: boolean }) => !building.workerVisible)).toBe(true);
  await page.screenshot({ path: 'deliverables/v121-qa/old-save-clean.png', fullPage: true });
});

test('default desktop camera keeps all four map corners inside the HUD-safe viewport', async ({ page }) => {
  await continueGame(page, schemaSevenSave([], 0));
  const camera = await page.locator('canvas').evaluate(canvas => JSON.parse(canvas.dataset.v12Camera || '{}'));
  expect(camera.map.left).toBeGreaterThanOrEqual(camera.safe.left - 1);
  expect(camera.map.right).toBeLessThanOrEqual(camera.safe.right + 1);
  expect(camera.map.top).toBeGreaterThanOrEqual(camera.safe.top - 1);
  expect(camera.map.bottom).toBeLessThanOrEqual(camera.safe.bottom + 1);
  expect(camera.maxScale).toBeGreaterThan(camera.minScale);
  await page.mouse.move(960, 520);
  for (let index = 0; index < 4; index++) await page.mouse.wheel(0, -100);
  await page.waitForTimeout(100);
  const zoomed = await page.locator('canvas').evaluate(canvas => JSON.parse(canvas.dataset.v12Camera || '{}'));
  expect(zoomed.scale).toBeGreaterThan(camera.scale);
  await page.mouse.move(960, 520);
  await page.mouse.down();
  await page.mouse.move(1060, 570, { steps: 5 });
  await page.mouse.up();
  const panned = await page.locator('canvas').evaluate(canvas => JSON.parse(canvas.dataset.v12Camera || '{}'));
  expect(panned.map.left).not.toBe(zoomed.map.left);
  for (let index = 0; index < 8; index++) await page.mouse.wheel(0, 100);
  await page.waitForTimeout(100);
  const reset = await page.locator('canvas').evaluate(canvas => JSON.parse(canvas.dataset.v12Camera || '{}'));
  expect(reset.scale).toBeCloseTo(reset.minScale, 3);
  expect(reset.map.left).toBeGreaterThanOrEqual(reset.safe.left - 1);
  expect(reset.map.right).toBeLessThanOrEqual(reset.safe.right + 1);
  expect(reset.map.top).toBeGreaterThanOrEqual(reset.safe.top - 1);
  expect(reset.map.bottom).toBeLessThanOrEqual(reset.safe.bottom + 1);
});

test('live visitors keep full size, face each route segment and stay outside the main hall', async ({ page }) => {
  const shop = { ...makeBuilding(0, 'danpu'), sellRecipe: 'juling' };
  await continueGame(page, { ...schemaSevenSave([shop], 0), pills: { juling: 30, bigu: 0 } });
  await page.waitForTimeout(3600);
  const samples: Array<{
    mapX: number; mapY: number; directionX: number; directionY: number;
    facingBack: boolean; movingRight: boolean; visualFacingRight: boolean;
    displayWidth: number; displayHeight: number;
  }> = [];
  let buyingBeforeArrival = false;
  for (let index = 0; index < 32; index++) {
    const state = await page.locator('canvas').evaluate(canvas => JSON.parse(canvas.dataset.v12State || '{}'));
    samples.push(...(state.visitorVisuals || []));
    if ((state.visitors || []).some((visitor: { state: string; walkTimer: number }) => (
      visitor.state === 'buying' && visitor.walkTimer > 0.01
    ))) buyingBeforeArrival = true;
    await page.waitForTimeout(250);
  }
  expect(samples.length).toBeGreaterThan(8);
  expect(samples.every(sample => (
    Math.abs(sample.mapX - V12_MAIN_HALL_COLLISION.x) > V12_MAIN_HALL_COLLISION.halfWidth
    || Math.abs(sample.mapY - V12_MAIN_HALL_COLLISION.y) > V12_MAIN_HALL_COLLISION.halfHeight
  ))).toBe(true);
  expect(samples.every(sample => sample.displayWidth === 18 && sample.displayHeight === 26)).toBe(true);
  expect(samples.filter(sample => sample.directionY !== 0).every(sample => (
    sample.facingBack === (sample.directionY < 0)
  ))).toBe(true);
  expect(samples.filter(sample => sample.directionX !== 0).every(sample => (
    sample.movingRight === (sample.directionX > 0)
    && sample.visualFacingRight === (sample.directionX > 0)
  ))).toBe(true);
  expect(buyingBeforeArrival).toBe(false);
  await page.screenshot({ path: 'deliverables/v121-qa/visitor-route.png', fullPage: true });
});

test('visitors keep correct facing across pill and artifact shops in all six regions', async ({ page }) => {
  const chosenSlots = ['zone-01', 'zone-02', 'zone-03', 'zone-04', 'zone-05', 'zone-06']
    .map(zone => V12_BUILD_SLOTS.find(slot => slot.zone === zone)!);
  const shops = chosenSlots.map((slot, index) => ({
    ...makeBuilding(V12_BUILD_SLOTS.indexOf(slot), index % 2 === 0 ? 'danpu' : 'faqipu'),
    sellRecipe: index % 2 === 0 ? 'juling' : null,
  }));
  await continueGame(page, {
    ...schemaSevenSave(shops, 2),
    pills: { juling: 60, bigu: 0 },
    azureEdgeSwords: 60,
  });
  await page.waitForTimeout(4000);
  const samples: Array<{
    directionX: number; directionY: number; movingRight: boolean;
    visualFacingRight: boolean; facingBack: boolean; displayWidth: number; displayHeight: number;
  }> = [];
  const targets = new Set<number>();
  for (let index = 0; index < 36; index++) {
    const live = await page.locator('canvas').evaluate(canvas => JSON.parse(canvas.dataset.v12State || '{}'));
    samples.push(...live.visitorVisuals);
    for (const visitor of live.visitors) targets.add(visitor.targetUid);
    await page.waitForTimeout(180);
  }
  expect(targets.size).toBeGreaterThanOrEqual(4);
  expect(samples.length).toBeGreaterThan(20);
  expect(samples.every(sample => sample.displayWidth === 18 && sample.displayHeight === 26)).toBe(true);
  expect(samples.filter(sample => sample.directionX !== 0).every(sample => (
    sample.movingRight === (sample.directionX > 0)
    && sample.visualFacingRight === (sample.directionX > 0)
  ))).toBe(true);
  expect(samples.filter(sample => sample.directionY !== 0).every(sample => (
    sample.facingBack === (sample.directionY < 0)
  ))).toBe(true);
  await page.screenshot({ path: 'deliverables/v121-qa/multi-shop-directions.png', fullPage: true });
});

test('old and new building families use the calibrated runtime size band', async ({ page }) => {
  const ids = ['lingtian', 'danfang', 'danpu', 'liangong', 'xiangfang', 'lingkuang', 'lianqi', 'faqipu'];
  const assignedBuildings = ids.map((id, index) => ({
    ...makeBuilding(index, id),
    assigned: [`restored-worker-${index}`],
  }));
  await continueGame(page, schemaSevenSave(assignedBuildings, 0));
  const visuals = await page.locator('canvas').evaluate(canvas => (
    JSON.parse(canvas.dataset.v12State || '{}').buildingVisuals as Array<{
      id: string; displayWidth: number; displayHeight: number; workerVisible: boolean;
    }>
  ));
  expect(visuals).toHaveLength(ids.length);
  expect(visuals.every(visual => visual.displayWidth > 0 && visual.displayHeight > 0)).toBe(true);
  expect(visuals.every(visual => !visual.workerVisible)).toBe(true);
  const oldWidths = visuals.filter(visual => !['lingkuang', 'lianqi', 'faqipu'].includes(visual.id)).map(visual => visual.displayWidth);
  const newWidths = visuals.filter(visual => ['lingkuang', 'lianqi', 'faqipu'].includes(visual.id)).map(visual => visual.displayWidth);
  expect(Math.max(...newWidths)).toBeLessThanOrEqual(Math.max(...oldWidths) * 1.02);
  expect(Math.min(...newWidths)).toBeGreaterThanOrEqual(Math.min(...oldWidths) * 0.85);
  expect(Math.min(...oldWidths)).toBeGreaterThanOrEqual(89);
  expect(Math.min(...newWidths)).toBeGreaterThanOrEqual(79);
  await page.waitForTimeout(1600);
  await page.screenshot({ path: 'deliverables/v121-qa/building-scale-band.png', fullPage: true });
});

test('building selection remains accurate after zooming and panning', async ({ page }) => {
  await continueGame(page, schemaSevenSave([makeBuilding(0, 'danfang')], 0));
  const clickBuilding = async () => {
    const visual = await page.locator('canvas').evaluate(canvas => (
      JSON.parse(canvas.dataset.v12State || '{}').buildingVisuals[0]
    ));
    await page.mouse.click(visual.clickX, visual.clickY);
    await expect.poll(async () => page.locator('canvas').evaluate(canvas => (
      JSON.parse(canvas.dataset.v12State || '{}').selectedBuildingUid
    ))).toBe(12000);
  };

  await clickBuilding();
  await page.mouse.click(1880, 700);
  await page.mouse.move(960, 520);
  for (let index = 0; index < 4; index++) await page.mouse.wheel(0, -100);
  await page.mouse.down();
  await page.mouse.move(1060, 575, { steps: 6 });
  await page.mouse.up();
  await clickBuilding();
});

test('visitors turn around from their current position when a shop is demolished', async ({ page }) => {
  const shop = { ...makeBuilding(0, 'danpu'), sellRecipe: 'juling' };
  await continueGame(page, { ...schemaSevenSave([shop], 0), pills: { juling: 30, bigu: 0 } });
  await expect.poll(async () => page.locator('canvas').evaluate(canvas => {
    const visuals = JSON.parse(canvas.dataset.v12State || '{}').visitorVisuals as Array<{ mapY: number }>;
    return visuals.some(visual => visual.mapY < 760);
  }), { timeout: 15000 }).toBe(true);
  const visual = await page.locator('canvas').evaluate(canvas => (
    JSON.parse(canvas.dataset.v12State || '{}').buildingVisuals[0]
  ));
  await page.mouse.click(visual.clickX, visual.clickY);
  const button = await page.locator('canvas').evaluate(canvas => (
    JSON.parse(canvas.dataset.v12State || '{}').demolishButton
  ));
  await page.mouse.click(button.x, button.y);
  await expect.poll(async () => page.locator('canvas').evaluate(canvas => (
    JSON.parse(canvas.dataset.v12State || '{}').buildingCount
  ))).toBe(0);

  const samples: Array<{ directionX: number; directionY: number; movingRight: boolean; visualFacingRight: boolean; facingBack: boolean }> = [];
  for (let index = 0; index < 30; index++) {
    const live = await page.locator('canvas').evaluate(canvas => JSON.parse(canvas.dataset.v12State || '{}'));
    samples.push(...live.visitorVisuals);
    await page.waitForTimeout(100);
  }
  expect(samples.length).toBeGreaterThan(5);
  expect(samples.filter(sample => sample.directionX !== 0).every(sample => (
    sample.movingRight === (sample.directionX > 0)
    && sample.visualFacingRight === (sample.directionX > 0)
  ))).toBe(true);
  expect(samples.filter(sample => sample.directionY !== 0).every(sample => (
    sample.facingBack === (sample.directionY < 0)
  ))).toBe(true);
});

test('full 48-slot mixed layout stays inside the approved map', async ({ page }) => {
  const ids = ['lingtian', 'danfang', 'danpu', 'liangong', 'xiangfang', 'lingkuang', 'lianqi', 'faqipu'];
  const buildings = Array.from({ length: 48 }, (_, index) => makeBuilding(index, ids[index % ids.length]));
  await continueGame(page, schemaSevenSave(buildings, 2));
  const live = await page.locator('canvas').evaluate(canvas => JSON.parse(canvas.dataset.v12State || '{}'));
  expect(live.buildingVisuals).toHaveLength(48);
  expect(live.buildingVisuals.every((visual: { clickX: number; clickY: number }) => (
    visual.clickX >= 0 && visual.clickX <= 1920 && visual.clickY >= 0 && visual.clickY <= 1080
  ))).toBe(true);
  await page.screenshot({ path: 'deliverables/v121-qa/full-48-buildings.png', fullPage: true });
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
  const camera = await page.locator('canvas').evaluate(canvas => JSON.parse(canvas.dataset.v12Camera || '{}'));
  expect(camera.map.left).toBeGreaterThanOrEqual(camera.safe.left - 1);
  expect(camera.map.right).toBeLessThanOrEqual(camera.safe.right + 1);
  expect(camera.map.top).toBeGreaterThanOrEqual(camera.safe.top - 1);
  expect(camera.map.bottom).toBeLessThanOrEqual(camera.safe.bottom + 1);
  expect(errors).toEqual([]);
  await page.screenshot({ path: 'deliverables/v12-runtime/mobile-landscape.png', fullPage: true });
  await context.close();
});
