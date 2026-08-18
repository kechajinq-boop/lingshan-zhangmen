import { expect, test, type Page } from '@playwright/test';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const URL = process.env.TEST_URL || 'http://127.0.0.1:4173/';
const SAVE_KEY = 'lingshan_save_v1';
const gamedata = JSON.parse(readFileSync(resolve(process.cwd(), 'src', 'data', 'gamedata.json'), 'utf8').replace(/^\uFEFF/, ''));
const decorManifest = JSON.parse(readFileSync(resolve(process.cwd(), 'public', 'assets', 'v12', 'decor', 'asset-manifest.json'), 'utf8'));
const decorationIds = [
  'decor-sakura', 'decor-sakura-large', 'decor-pine', 'decor-pine-large',
  'decor-flower', 'decor-spirit-blue', 'decor-bamboo', 'decor-bush',
  'decor-rock-small', 'decor-rock-large', 'decor-lantern', 'decor-lantern-2',
  'decor-incense', 'decor-crystal-lamp', 'decor-lotus', 'decor-reeds',
];

test.use({ viewport: { width: 1920, height: 1080 } });

function building(index: number, defId: string, overrides: Record<string, unknown> = {}) {
  return {
    uid: 22000 + index,
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
    ...overrides,
  };
}

function disciple(index: number, assignedTo: number | null) {
  return {
    id: `train-${index}`,
    name: `试炼弟子${index}`,
    level: 1,
    assignedTo,
    root: 'san',
    planting: 60,
    alchemy: 60,
    business: 60,
    talent: 60,
    maxLevel: 8,
    appearance: 'a',
    trainingProgress: 0,
  };
}

function schemaEightSave(overrides: Record<string, unknown> = {}) {
  return {
    schemaVersion: 8,
    faction: 'dan',
    spirit: 100000,
    herbs: 50,
    pills: { juling: 20, bigu: 10 },
    spiritOre: 50,
    azureEdgeSwords: 10,
    reputation: 999,
    day: 8,
    dayTime: 0,
    gridW: 26,
    gridH: 19,
    unlockedRecipes: ['juling', 'bigu'],
    disciples: [],
    buildings: [],
    visitors: [],
    activeCombos: [],
    expansionsUnlocked: 0,
    elders: [],
    totalEarned: 0,
    visitorsServed: 0,
    visitorsLost: 0,
    totalCrafted: 0,
    totalForged: 0,
    totalBreakthroughs: 0,
    dayEarned: 0,
    dayVisitorsServed: 0,
    recruitCandidates: [],
    recruitRefreshCount: 0,
    recruitNextDay: 0,
    commissionOffers: [],
    activeCommission: null,
    nextCommissionDay: 8,
    eventLog: [],
    firstSellDone: false,
    currentTitle: 't0',
    ...overrides,
  };
}

async function gameState(page: Page) {
  return page.locator('canvas').evaluate(canvas => JSON.parse(canvas.dataset.v12State || '{}'));
}

async function continueGame(page: Page, save: unknown, menuClick = { x: 960, y: 886 }) {
  await page.goto(URL);
  await page.evaluate(([key, value]) => localStorage.setItem(key, JSON.stringify(value)), [SAVE_KEY, save]);
  await page.reload();
  await expect(page.locator('canvas')).toBeVisible();
  await page.waitForTimeout(900);
  await page.locator('canvas').click({ position: menuClick, force: true });
  await expect.poll(async () => (await gameState(page)).schemaVersion).toBe(9);
}

async function clickAction(page: Page, action: string) {
  const button = await expect.poll(async () => {
    const state = await gameState(page);
    return state.uiButtons?.find((item: any) => item.action === action) || null;
  }).not.toBeNull();
  void button;
  const state = await gameState(page);
  const target = state.uiButtons.find((item: any) => item.action === action);
  await page.locator('canvas').click({ position: { x: target.x, y: target.y }, force: true });
}

async function clickBuildDefinition(page: Page, defId: string) {
  await expect.poll(async () => {
    const state = await gameState(page);
    return state.uiButtons?.find((item: any) => item.defId === defId) || null;
  }).not.toBeNull();
  const state = await gameState(page);
  const target = state.uiButtons.find((item: any) => item.defId === defId);
  await page.locator('canvas').click({ position: { x: target.x, y: target.y }, force: true });
}

test('schema 8 save migrates to schema 9 with safe defaults and backup', async ({ page }) => {
  await continueGame(page, schemaEightSave({ day: 12 }));
  const saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)!), SAVE_KEY);
  expect(saved.schemaVersion).toBe(9);
  expect(saved.completedResearch).toEqual([]);
  expect(saved.lastFlavorEventDay).toBe(12);
  expect(saved.recentFlavorEventIds).toEqual([]);
  expect(await page.evaluate(() => !!localStorage.getItem('lingshan_save_backup_pre_v0122a'))).toBe(true);
});

test('buildable natural decorations match the approved source files', () => {
  expect(decorManifest.status).toBe('approved-source-copy');
  expect(decorManifest.assets).toHaveLength(16);
  for (const asset of decorManifest.assets) {
    const bytes = readFileSync(resolve(process.cwd(), 'public', 'assets', 'v12', 'decor', asset.file));
    expect(createHash('sha256').update(bytes).digest('hex')).toBe(asset.sha256);
  }
});

test('confirmed research and elder costs are data-driven and forging bonuses apply', async ({ page }) => {
  expect(gamedata.recipes.filter((item: any) => item.unlock === 'research').map((item: any) => item.research.spirit)).toEqual([1500, 4500, 12000]);
  expect(gamedata.researches.map((item: any) => item.cost)).toEqual([2500, 7000, 16000]);
  expect(gamedata.elders.map((item: any) => item.cost)).toEqual([3500, 6000, 8000, 9000, 12000]);
  const finalTitle = gamedata.titles.find((item: any) => item.id === 't5');
  expect(finalTitle.conds.find((item: any) => item.type === 'research').value).toBe(6);
  expect(finalTitle.conds.find((item: any) => item.type === 'elders').value).toBe(5);

  await continueGame(page, schemaEightSave({ buildings: [building(0, 'lianqi')] }));
  await clickAction(page, '研发');
  await expect.poll(async () => (await gameState(page)).researchRows?.length || 0).toBe(6);
  let state = await gameState(page);
  const research = state.researchRows.find((row: any) => row.projectId === 'forge-temper');
  await page.locator('canvas').click({ position: { x: research.x, y: research.y }, force: true });
  await expect.poll(async () => (await gameState(page)).completedResearch).toContain('forge-temper');
  state = await gameState(page);
  expect(state.spirit).toBe(97500);
  expect(state.buildingVisuals.find((item: any) => item.id === 'lianqi').efficiency).toBeCloseTo(1.15, 5);

  await clickAction(page, '长老');
  await expect.poll(async () => (await gameState(page)).elderRows?.length || 0).toBe(5);
  state = await gameState(page);
  const elder = state.elderRows.find((row: any) => row.id === 'luhuo');
  await page.locator('canvas').click({ position: { x: elder.x, y: elder.y }, force: true });
  await expect.poll(async () => {
    const saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)!), SAVE_KEY);
    return saved.elders;
  }).toContain('luhuo');
  state = await gameState(page);
  expect(state.spirit).toBe(88500);
  expect(state.buildingVisuals.find((item: any) => item.id === 'lianqi').efficiency).toBeCloseTo(1.55, 5);
});

test('level one training hall trains two disciples and leaves overflow waiting', async ({ page }) => {
  const hallUid = 22000;
  await continueGame(page, schemaEightSave({
    spirit: 0,
    disciples: [disciple(1, hallUid), disciple(2, hallUid), disciple(3, hallUid)],
    buildings: [building(0, 'liangong', { assigned: ['train-1', 'train-2', 'train-3'] })],
  }));
  await page.waitForTimeout(1400);
  const state = await gameState(page);
  expect(state.training[0]).toMatchObject({ level: 1, capacity: 2, assigned: 3, waiting: 1 });
  expect(state.disciples.find((item: any) => item.id === 'train-1').trainingProgress).toBeGreaterThan(0);
  expect(state.disciples.find((item: any) => item.id === 'train-2').trainingProgress).toBeGreaterThan(0);
  expect(state.disciples.find((item: any) => item.id === 'train-3').trainingProgress).toBe(0);
});

test('each new game day creates one or two flavor events without duplicate day refresh', async ({ page }) => {
  await continueGame(page, schemaEightSave({ day: 20, dayTime: 59.4 }));
  await expect.poll(async () => (await gameState(page)).day).toBe(21);
  const first = await gameState(page);
  expect(first.flavorEventsToday).toBeGreaterThanOrEqual(1);
  expect(first.flavorEventsToday).toBeLessThanOrEqual(2);
  await page.waitForTimeout(1200);
  expect((await gameState(page)).flavorEventsToday).toBe(first.flavorEventsToday);
});

test('legacy production effects only appear while the three buildings are working', async ({ page }) => {
  await continueGame(page, schemaEightSave({
    buildings: [building(0, 'lingtian'), building(1, 'danfang'), building(2, 'danpu')],
  }));
  await expect.poll(async () => {
    const state = await gameState(page);
    return state.buildingVisuals.find((item: any) => item.id === 'lingtian')?.productionFxVisible;
  }).toBe(true);
  await expect.poll(async () => {
    const state = await gameState(page);
    return state.buildingVisuals.find((item: any) => item.id === 'danfang')?.productionFxVisible;
  }).toBe(true);
  await expect.poll(async () => {
    const state = await gameState(page);
    return state.buildingVisuals.find((item: any) => item.id === 'danpu')?.productionFxVisible;
  }, { timeout: 12000 }).toBe(true);
});

test('approved quarter-area decorations build, persist, stay out of progression and refund on demolition', async ({ page }) => {
  test.setTimeout(120_000);
  await continueGame(page, schemaEightSave({ spirit: 5000, buildings: [building(0, 'danfang')] }));
  await clickAction(page, '装饰');
  await expect.poll(async () => {
    const state = await gameState(page);
    return state.uiButtons?.filter((item: any) => decorationIds.includes(item.defId)).length || 0;
  }).toBe(16);

  for (const defId of decorationIds) {
    await clickBuildDefinition(page, defId);
    const point = await expect.poll(async () => page.locator('canvas').evaluate(canvas => {
      const points = JSON.parse(canvas.dataset.buildableSlotPoints || '[]') as Array<{ x: number; y: number }>;
      return points[0] || null;
    })).not.toBeNull();
    void point;
    const target = await page.locator('canvas').evaluate(canvas => {
      const points = JSON.parse(canvas.dataset.buildableSlotPoints || '[]') as Array<{ x: number; y: number }>;
      return points[0];
    });
    await page.locator('canvas').click({ position: { x: target.x, y: target.y }, force: true });
    await expect.poll(async () => (await gameState(page)).buildingIds.filter((id: string) => id === defId).length).toBe(1);
  }
  await page.waitForTimeout(1200);

  let state = await gameState(page);
  const totalDecorationCost = gamedata.buildings
    .filter((item: any) => decorationIds.includes(item.id))
    .reduce((sum: number, item: any) => sum + item.cost, 0);
  expect(state.spirit).toBe(5000 - totalDecorationCost);
  expect(state.buildingCount).toBe(17);
  expect(state.progressionBuildingCount).toBe(1);
  const buildingVisual = state.buildingVisuals.find((item: any) => item.id === 'danfang');
  const buildingVisibleArea = buildingVisual.displayWidth * buildingVisual.displayHeight * (85517 / (512 * 512));
  for (const defId of decorationIds) {
    const visual = state.buildingVisuals.find((item: any) => item.id === defId);
    const asset = decorManifest.assets.find((item: any) => item.defId === defId);
    const visibleArea = visual.displayWidth * visual.displayHeight * (asset.alphaPixels / (asset.width * asset.height));
    const areaRatio = visibleArea / buildingVisibleArea;
    expect(areaRatio).toBeGreaterThanOrEqual(0.24);
    expect(areaRatio).toBeLessThanOrEqual(0.26);
  }
  await page.screenshot({ path: 'deliverables/v0122a-qa/decorations-area-quarter-runtime.png', fullPage: true });

  await page.reload();
  await expect(page.locator('canvas')).toBeVisible();
  await page.waitForTimeout(900);
  await page.locator('canvas').click({ position: { x: 960, y: 886 }, force: true });
  await expect.poll(async () => (await gameState(page)).buildingCount).toBe(17);
  state = await gameState(page);
  const lantern = state.buildingVisuals.find((item: any) => item.id === 'decor-lantern');
  await page.locator('canvas').click({ position: { x: lantern.clickX, y: lantern.clickY }, force: true });
  const demolish = await expect.poll(async () => (await gameState(page)).demolishButton || null).not.toBeNull();
  void demolish;
  state = await gameState(page);
  await page.locator('canvas').click({ position: { x: state.demolishButton.x, y: state.demolishButton.y }, force: true });
  await expect.poll(async () => (await gameState(page)).buildingIds).not.toContain('decor-lantern');
  expect((await gameState(page)).spirit).toBe(5000 - totalDecorationCost + 7);
});

test('decoration palette stays inside mobile landscape viewport', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await continueGame(page, schemaEightSave(), { x: 422, y: 320 });
  await clickAction(page, '装饰');
  const state = await gameState(page);
  const buttons = state.uiButtons.filter((item: any) => item.defId?.startsWith('decor-'));
  expect(buttons).toHaveLength(16);
  for (const button of buttons) {
    expect(button.x).toBeGreaterThan(20);
    expect(button.x).toBeLessThan(824);
    expect(button.y).toBeGreaterThan(20);
    expect(button.y).toBeLessThan(370);
  }
  await page.screenshot({ path: 'deliverables/v0122a-qa/decorations-mobile-palette.png', fullPage: true });
  await context.close();
});
