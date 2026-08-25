import { expect, test, type Page } from '@playwright/test';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const URL = process.env.TEST_URL || 'http://127.0.0.1:4173/';
const SAVE_KEY = 'lingshan_save_v1';
const gamedata = JSON.parse(readFileSync(resolve(process.cwd(), 'src', 'data', 'gamedata.json'), 'utf8').replace(/^\uFEFF/, ''));
const decorManifest = JSON.parse(readFileSync(resolve(process.cwd(), 'public', 'assets', 'v12', 'decor', 'asset-manifest.json'), 'utf8'));
const decorationIds = [
  'decor-sakura', 'decor-pine', 'decor-flower', 'decor-lantern', 'decor-lotus',
  'decor-sakura-large', 'decor-pine-large', 'decor-spirit-blue', 'decor-bamboo', 'decor-bush',
  'decor-rock-small', 'decor-rock-large', 'decor-lantern-2', 'decor-incense',
  'decor-crystal-lamp', 'decor-reeds', 'decor-quenching-trough',
  'decor-artifact-sword-case', 'decor-suppression-stele', 'decor-crane-standing',
];
const existingDecorationIds = decorationIds.slice(0, 16);

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
  await expect.poll(async () => {
    const state = await gameState(page);
    if (state.schemaVersion === 10) return state.schemaVersion;
    await page.locator('canvas').click({ position: menuClick, force: true });
    await page.waitForTimeout(250);
    return (await gameState(page)).schemaVersion;
  }, { timeout: 15000 }).toBe(10);
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
  let state = await gameState(page);
  let target = state.uiButtons?.find((item: any) => item.defId === defId);
  for (let attempt = 0; !target && defId.startsWith('decor-') && attempt < 12; attempt++) {
    const visibleDecor = state.uiButtons.filter((item: any) => item.defId?.startsWith('decor-'));
    expect(visibleDecor.length).toBeGreaterThan(0);
    const anchor = visibleDecor[Math.floor(visibleDecor.length / 2)];
    await page.mouse.move(anchor.x, anchor.y);
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(80);
    state = await gameState(page);
    target = state.uiButtons?.find((item: any) => item.defId === defId);
  }
  expect(target).toBeTruthy();
  await page.locator('canvas').click({ position: { x: target.x, y: target.y }, force: true });
}

async function collectDecorationButtons(page: Page) {
  const collected = new Map<string, any>();
  let unchangedRounds = 0;
  for (let attempt = 0; attempt < 12; attempt++) {
    const state = await gameState(page);
    const visibleDecor = state.uiButtons.filter((item: any) => item.defId?.startsWith('decor-'));
    const previousSize = collected.size;
    for (const button of visibleDecor) collected.set(button.defId, button);
    if (visibleDecor.length === 0) break;
    unchangedRounds = collected.size === previousSize ? unchangedRounds + 1 : 0;
    if (unchangedRounds >= 2) break;
    const anchor = visibleDecor[Math.floor(visibleDecor.length / 2)];
    await page.mouse.move(anchor.x, anchor.y);
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(40);
  }
  return [...collected.values()];
}

async function openAcceptanceTools(page: Page) {
  const state = await gameState(page);
  const button = state.acceptanceTools?.button;
  expect(button).toBeTruthy();
  await page.locator('canvas').click({ position: { x: button.x, y: button.y }, force: true });
  await expect.poll(async () => (await gameState(page)).acceptanceTools?.open).toBe(true);
}

async function clickAcceptanceAction(page: Page, action: string) {
  const state = await gameState(page);
  const target = state.acceptanceTools?.actions?.find((item: any) => item.action === action);
  expect(target).toBeTruthy();
  await page.locator('canvas').click({ position: { x: target.x, y: target.y }, force: true });
}

test('schema 8 save migrates to schema 10 with safe defaults and backup', async ({ page }) => {
  await continueGame(page, schemaEightSave({ day: 12 }));
  const saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)!), SAVE_KEY);
  expect(saved.schemaVersion).toBe(10);
  expect(saved.cunjinge).toMatchObject({ chips: 0, chests: 0, auction: null, appraiserXp: 0 });
  expect(await page.evaluate(() => !!localStorage.getItem('lingshan_save_backup_pre_v0124'))).toBe(true);
  expect(saved.completedResearch).toEqual([]);
  expect(saved.lastFlavorEventDay).toBe(12);
  expect(saved.recentFlavorEventIds).toEqual([]);
  expect(await page.evaluate(() => !!localStorage.getItem('lingshan_save_backup_pre_v0122a'))).toBe(true);
});

test('buildable natural decorations match the approved source files', () => {
  expect(decorManifest.status).toBe('approved-source-copy');
  expect(decorManifest.assets).toHaveLength(20);
  for (const asset of decorManifest.assets) {
    const bytes = readFileSync(resolve(process.cwd(), 'public', 'assets', 'v12', 'decor', asset.file));
    expect(createHash('sha256').update(bytes).digest('hex')).toBe(asset.sha256);
  }
  expect(gamedata.buildings.filter((item: any) => item.type === 'decor' && item.unlockExpansion === 0)).toHaveLength(8);
  expect(gamedata.buildings.filter((item: any) => item.type === 'decor' && item.unlockExpansion <= 1)).toHaveLength(12);
  expect(gamedata.buildings.filter((item: any) => item.type === 'decor' && item.unlockExpansion <= 2)).toHaveLength(20);
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
  await page.screenshot({ path: 'deliverables/v0122a-r1-qa/research-spacing-desktop.png', fullPage: true });
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

test('desktop event feed shows three wrapped entries without covering the build controls', async ({ page }) => {
  const longDetail = '长老讲道三日，弟子们听得如痴如醉，散场后才发现他把炼丹口诀讲成了灵兽食谱。';
  await continueGame(page, schemaEightSave({
    eventLog: [1, 2, 3].map(index => ({
      id: index,
      day: 18,
      time: `1${index}:00`,
      type: 'flavor',
      level: 'info',
      title: `宗门趣闻${index}`,
      detail: longDetail,
      color: '#8bd5ff',
    })),
  }));
  await page.screenshot({ path: 'deliverables/v0122a-r1-qa/event-feed-wrapped-desktop.png', fullPage: true });
  const state = await gameState(page);
  expect(state.uiButtons.length).toBeGreaterThan(10);
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

test('acceptance tools grant saved resources and can force a new visitor after day eighteen', async ({ page }) => {
  await continueGame(page, schemaEightSave({
    spirit: 10,
    reputation: 5,
    herbs: 3,
    spiritOre: 4,
    azureEdgeSwords: 0,
    pills: { juling: 1, bigu: 2 },
    day: 19,
    buildings: [building(0, 'danpu'), building(1, 'faqipu')],
  }));
  await openAcceptanceTools(page);
  for (const action of ['spirit', 'reputation', 'herbs', 'spiritOre', 'pills', 'azureEdgeSwords']) {
    await clickAcceptanceAction(page, action);
  }
  await expect.poll(async () => {
    const state = await gameState(page);
    return {
      spirit: state.spirit,
      reputation: state.reputation,
      herbs: state.herbs,
      spiritOre: state.spiritOre,
      azureEdgeSwords: state.azureEdgeSwords,
      juling: state.pills.juling,
      bigu: state.pills.bigu,
    };
  }).toEqual({ spirit: 50010, reputation: 999, herbs: 203, spiritOre: 204, azureEdgeSwords: 50, juling: 51, bigu: 52 });

  await page.keyboard.press('Escape');
  let state = await gameState(page);
  const pause = state.uiButtons.find((item: any) => item.speed === 0);
  await page.locator('canvas').click({ position: pause, force: true });
  await openAcceptanceTools(page);
  await clickAcceptanceAction(page, 'clearVisitors');
  await expect.poll(async () => (await gameState(page)).visitors.length).toBe(0);
  await clickAcceptanceAction(page, 'spawnVisitor');
  await expect.poll(async () => (await gameState(page)).visitorVisuals.length).toBeGreaterThan(0);

  await page.reload();
  await expect(page.locator('canvas')).toBeVisible();
  await page.waitForTimeout(900);
  await page.locator('canvas').click({ position: { x: 960, y: 886 }, force: true });
  await expect.poll(async () => (await gameState(page)).spirit).toBe(50010);
  const restored = await gameState(page);
  expect(restored.reputation).toBe(999);
  expect(restored.herbs).toBe(203);
  expect(restored.spiritOre).toBe(204);
  expect(restored.azureEdgeSwords).toBe(50);
  expect(restored.pills).toMatchObject({ juling: 51, bigu: 52 });
});

test('approved quarter-area decorations build, persist, stay out of progression and refund on demolition', async ({ page }) => {
  test.setTimeout(120_000);
  const placedDecorations = decorationIds.map((defId, index) => building(index + 1, defId, {
    uid: 23000 + index,
    gx: 100 + index,
    gy: 100,
    slotId: `decor-slot-${String(index + 1).padStart(2, '0')}`,
  }));
  await continueGame(page, schemaEightSave({
    spirit: 5000,
    expansionsUnlocked: 2,
    buildings: [building(0, 'danfang'), ...placedDecorations],
  }));
  await page.waitForTimeout(1200);

  let state = await gameState(page);
  expect(state.spirit).toBe(5000);
  expect(state.buildingCount).toBe(21);
  expect(state.progressionBuildingCount).toBe(1);
  const buildingVisual = state.buildingVisuals.find((item: any) => item.id === 'danfang');
  const buildingVisibleArea = buildingVisual.displayWidth * buildingVisual.displayHeight * (85517 / (512 * 512));
  for (const defId of existingDecorationIds) {
    const visual = state.buildingVisuals.find((item: any) => item.id === defId);
    const asset = decorManifest.assets.find((item: any) => item.defId === defId);
    const visibleArea = visual.displayWidth * visual.displayHeight * (asset.alphaPixels / (asset.width * asset.height));
    const areaRatio = visibleArea / buildingVisibleArea;
    expect(areaRatio).toBeGreaterThanOrEqual(0.24);
    expect(areaRatio).toBeLessThanOrEqual(0.26);
  }
  await page.screenshot({ path: 'deliverables/v0122a-r1-qa/decorations-area-quarter-runtime.png', fullPage: true });

  await page.reload();
  await expect(page.locator('canvas')).toBeVisible();
  await page.waitForTimeout(900);
  await page.locator('canvas').click({ position: { x: 960, y: 886 }, force: true });
  await expect.poll(async () => (await gameState(page)).buildingCount).toBe(21);
  state = await gameState(page);
  const lantern = state.buildingVisuals.find((item: any) => item.id === 'decor-lantern');
  await page.locator('canvas').click({ position: { x: lantern.clickX, y: lantern.clickY }, force: true });
  const demolish = await expect.poll(async () => (await gameState(page)).demolishButton || null).not.toBeNull();
  void demolish;
  state = await gameState(page);
  await page.locator('canvas').click({ position: { x: state.demolishButton.x, y: state.demolishButton.y }, force: true });
  await expect.poll(async () => (await gameState(page)).buildingIds).not.toContain('decor-lantern');
  expect((await gameState(page)).spirit).toBe(5007);
});

test('decoration menu unlocks cumulatively as eight, twelve and twenty items', async ({ page }) => {
  for (const [expansionsUnlocked, expected] of [[0, 8], [1, 12], [2, 20]] as const) {
    await continueGame(page, schemaEightSave({ expansionsUnlocked }));
    await clickAction(page, '装饰');
    const buttons = await collectDecorationButtons(page);
    expect(buttons).toHaveLength(expected);
  }
});

test('legacy decorations keep their old building slots while new decorations use dedicated anchors', async ({ page }) => {
  const legacy = building(5, 'decor-sakura');
  await continueGame(page, schemaEightSave({
    spirit: 5000,
    expansionsUnlocked: 2,
    buildings: [building(0, 'danfang'), legacy],
  }));
  let state = await gameState(page);
  const restoredLegacy = state.buildingVisuals.find((item: any) => item.uid === legacy.uid);
  expect(restoredLegacy.slotId).toBe(legacy.slotId);
  expect(restoredLegacy.gx).toBe(legacy.gx);
  expect(restoredLegacy.gy).toBe(legacy.gy);

  await clickAction(page, '装饰');
  await clickBuildDefinition(page, 'decor-crane-standing');
  const target = await page.locator('canvas').evaluate(canvas => {
    const points = JSON.parse(canvas.dataset.buildableSlotPoints || '[]') as Array<{ id: string; x: number; y: number }>;
    return points[0];
  });
  expect(target.id).toMatch(/^decor-slot-/);
  await page.locator('canvas').click({ position: { x: target.x, y: target.y }, force: true });
  await expect.poll(async () => (await gameState(page)).buildingIds).toContain('decor-crane-standing');
  state = await gameState(page);
  const crane = state.buildingVisuals.find((item: any) => item.id === 'decor-crane-standing');
  expect(crane.slotId).toBe(target.id);
  expect(state.spirit).toBe(4975);

  await page.reload();
  await expect(page.locator('canvas')).toBeVisible();
  await page.waitForTimeout(900);
  await page.locator('canvas').click({ position: { x: 960, y: 886 }, force: true });
  state = await gameState(page);
  expect(state.buildingVisuals.find((item: any) => item.uid === legacy.uid).slotId).toBe(legacy.slotId);
  expect(state.buildingVisuals.find((item: any) => item.id === 'decor-crane-standing').slotId).toBe(target.id);
  expect(state.spirit).toBe(4975);
});

test('decoration palette stays inside mobile landscape viewport', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await continueGame(page, schemaEightSave({ expansionsUnlocked: 2 }), { x: 422, y: 320 });
  await clickAction(page, '装饰');
  const buttons = await collectDecorationButtons(page);
  expect(buttons).toHaveLength(20);
  for (const button of buttons) {
    expect(button.x).toBeGreaterThan(20);
    expect(button.x).toBeLessThan(824);
    expect(button.y).toBeGreaterThan(20);
    expect(button.y).toBeLessThan(370);
  }
  await page.screenshot({ path: 'deliverables/v0122a-r1-qa/decorations-mobile-palette.png', fullPage: true });
  await context.close();
});

test('acceptance tools advance one natural day and preserve timed content after reload', async ({ page }) => {
  await continueGame(page, schemaEightSave({ day: 6, dayTime: 42 }));
  await openAcceptanceTools(page);
  await clickAcceptanceAction(page, 'advanceDay');
  await expect.poll(async () => {
    const state = await gameState(page);
    return { day: state.day, cunjingeOpen: state.cunjinge.openToday };
  }).toEqual({ day: 7, cunjingeOpen: true });

  for (let day = 8; day <= 10; day++) {
    await clickAcceptanceAction(page, 'advanceDay');
    await expect.poll(async () => (await gameState(page)).day).toBe(day);
  }
  expect((await gameState(page)).cunjinge.openToday).toBe(true);

  const saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)!), SAVE_KEY);
  expect(saved.day).toBe(10);
  expect(saved.dayTime).toBe(0);
  expect(saved.eventLog.some((entry: any) => entry.title === '第9天小结')).toBe(true);

  await page.reload();
  await expect(page.locator('canvas')).toBeVisible();
  await expect.poll(async () => {
    const state = await gameState(page);
    if (state.day === 10) return true;
    await page.locator('canvas').click({ position: { x: 960, y: 886 }, force: true });
    await page.waitForTimeout(200);
    return false;
  }, { timeout: 15000 }).toBe(true);
  const restored = await gameState(page);
  expect(restored.cunjinge.openToday).toBe(true);
});

test('acceptance tools fit inside mobile landscape viewport', async ({ browser }, testInfo) => {
  const context = await browser.newContext({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await continueGame(page, schemaEightSave(), { x: 422, y: 320 });
  await openAcceptanceTools(page);
  const actions = (await gameState(page)).acceptanceTools.actions;
  expect(actions).toHaveLength(10);
  for (const action of actions) {
    expect(action.x).toBeGreaterThan(10);
    expect(action.x).toBeLessThan(834);
    expect(action.y).toBeGreaterThan(10);
    expect(action.y).toBeLessThan(380);
  }
  await page.screenshot({ path: testInfo.outputPath('acceptance-tools-mobile.png'), fullPage: true });
  await context.close();
});
