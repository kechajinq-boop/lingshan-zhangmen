import Phaser from 'phaser';
import { BuildingDef, CommissionDef, GameState, PlacedBuilding, RecruitCandidate, Visitor } from '../state';
import {
  V12_BUILD_SLOTS as V10_BUILD_SLOTS,
  V12_DECORATION_SLOTS,
  V12_FIXED_OBJECTS as V10_FIXED_OBJECTS,
  V12_GATE_POINT as V10_GATE_POINT,
  V12_GRID_BASIS as V10_GRID_BASIS,
  V12_MAP_STAGES as V10_MAP_STAGES,
  V12_WALKABLE_POLYGONS as V10_WALKABLE_POLYGONS,
  V12_WATER_POLYGON as V10_WATER_POLYGON,
  V12_MAIN_HALL_COLLISION,
  V12_GATE_COLLISIONS,
  V12_GATE_PORTAL,
  V12_ROAD_NODES,
  v12RoadPath,
  V12BuildSlot as V10BuildSlot,
  V12MapPoint as V10MapPoint,
  v12StageForBuildingCount as v10StageForBuildingCount,
} from '../data/v12Map';
import { TILE_W, TILE_H } from '../systems/IsoGrid';
import { findVisitorPath, VisitorObstacle } from '../systems/VisitorPath';

interface BuildGhost { gx: number; gy: number; slotId?: string; ok: boolean; gfx?: Phaser.GameObjects.Container; }
interface BuildingRenderConfig {
  width: number;
  height: number;
  offsetX: number;
  anchorOffsetY: number;
  collisionHalfWidth: number;
  collisionHalfHeight: number;
  collisionOffsetY: number;
}
type VisitorVariant = 'a' | 'b' | 'c' | 'd';

const FONT = '"Microsoft YaHei", "PingFang SC", "Noto Sans CJK SC", sans-serif';
const FACILITY_DEPTH_LAYER = 20;
const NPC_DEPTH_LAYER = 30;
const DEFAULT_BUILDING_SCALE = 1.2;
const VISITOR_SPEED = 220;
const GATE_GRID_X = 16;
const FIXED_MAP_ART = {
  x: 84,
  y: 258,
  width: 1184,
  height: 666,
  sourceWidth: 1672,
  sourceHeight: 941,
};
const MAP_ART_SCALE_X = FIXED_MAP_ART.width / FIXED_MAP_ART.sourceWidth;
const MAP_ART_SCALE_Y = FIXED_MAP_ART.height / FIXED_MAP_ART.sourceHeight;
const DEFAULT_BUILDING_RENDER: BuildingRenderConfig = {
  width: 105,
  height: 105,
  offsetX: 0,
  anchorOffsetY: 36,
  collisionHalfWidth: 48,
  collisionHalfHeight: 34,
  collisionOffsetY: 8,
};
const BUILDING_RENDER: Record<string, BuildingRenderConfig> = {
  lingtian: { width: 105, height: 105, offsetX: 0, anchorOffsetY: 44, collisionHalfWidth: 58, collisionHalfHeight: 41, collisionOffsetY: 8 },
  danfang: { width: 108, height: 101, offsetX: 0, anchorOffsetY: 36, collisionHalfWidth: 58, collisionHalfHeight: 41, collisionOffsetY: 8 },
  danpu: { width: 107, height: 107, offsetX: 0, anchorOffsetY: 36, collisionHalfWidth: 58, collisionHalfHeight: 41, collisionOffsetY: 8 },
  liangong: { width: 107, height: 107, offsetX: 0, anchorOffsetY: 36, collisionHalfWidth: 58, collisionHalfHeight: 41, collisionOffsetY: 8 },
  xiangfang: { width: 105, height: 105, offsetX: 0, anchorOffsetY: 36, collisionHalfWidth: 58, collisionHalfHeight: 41, collisionOffsetY: 8 },
  lingkuang: { width: 108, height: 108, offsetX: 0, anchorOffsetY: 40, collisionHalfWidth: 58, collisionHalfHeight: 41, collisionOffsetY: 8 },
  lianqi: { width: 104, height: 104, offsetX: 0, anchorOffsetY: 40, collisionHalfWidth: 53, collisionHalfHeight: 41, collisionOffsetY: 8 },
  faqipu: { width: 94, height: 94, offsetX: 0, anchorOffsetY: 40, collisionHalfWidth: 50, collisionHalfHeight: 38, collisionOffsetY: 8 },
  'decor-sakura': { width: 73, height: 73, offsetX: 0, anchorOffsetY: 36, collisionHalfWidth: 18, collisionHalfHeight: 15, collisionOffsetY: 4 },
  'decor-sakura-large': { width: 57, height: 57, offsetX: 0, anchorOffsetY: 36, collisionHalfWidth: 18, collisionHalfHeight: 15, collisionOffsetY: 4 },
  'decor-pine': { width: 66, height: 66, offsetX: 2, anchorOffsetY: 36, collisionHalfWidth: 18, collisionHalfHeight: 15, collisionOffsetY: 4 },
  'decor-pine-large': { width: 56, height: 56, offsetX: 2, anchorOffsetY: 36, collisionHalfWidth: 18, collisionHalfHeight: 15, collisionOffsetY: 4 },
  'decor-flower': { width: 56, height: 56, offsetX: 0, anchorOffsetY: 36, collisionHalfWidth: 18, collisionHalfHeight: 13, collisionOffsetY: 3 },
  'decor-spirit-blue': { width: 62, height: 62, offsetX: 0, anchorOffsetY: 36, collisionHalfWidth: 18, collisionHalfHeight: 13, collisionOffsetY: 3 },
  'decor-bamboo': { width: 47, height: 63, offsetX: 0, anchorOffsetY: 36, collisionHalfWidth: 15, collisionHalfHeight: 13, collisionOffsetY: 3 },
  'decor-bush': { width: 62, height: 62, offsetX: 0, anchorOffsetY: 36, collisionHalfWidth: 18, collisionHalfHeight: 13, collisionOffsetY: 3 },
  'decor-rock-small': { width: 78, height: 78, offsetX: 0, anchorOffsetY: 36, collisionHalfWidth: 18, collisionHalfHeight: 13, collisionOffsetY: 3 },
  'decor-rock-large': { width: 60, height: 60, offsetX: 0, anchorOffsetY: 36, collisionHalfWidth: 19, collisionHalfHeight: 14, collisionOffsetY: 3 },
  'decor-lantern': { width: 50, height: 67, offsetX: 0, anchorOffsetY: 36, collisionHalfWidth: 12, collisionHalfHeight: 14, collisionOffsetY: 4 },
  'decor-lantern-2': { width: 51, height: 69, offsetX: 0, anchorOffsetY: 36, collisionHalfWidth: 12, collisionHalfHeight: 14, collisionOffsetY: 4 },
  'decor-incense': { width: 50, height: 67, offsetX: 0, anchorOffsetY: 36, collisionHalfWidth: 12, collisionHalfHeight: 14, collisionOffsetY: 4 },
  'decor-crystal-lamp': { width: 59, height: 80, offsetX: 0, anchorOffsetY: 36, collisionHalfWidth: 12, collisionHalfHeight: 14, collisionOffsetY: 4 },
  'decor-lotus': { width: 68, height: 51, offsetX: -3, anchorOffsetY: 36, collisionHalfWidth: 20, collisionHalfHeight: 10, collisionOffsetY: 2 },
  'decor-reeds': { width: 61, height: 61, offsetX: 0, anchorOffsetY: 36, collisionHalfWidth: 18, collisionHalfHeight: 11, collisionOffsetY: 2 },
  'decor-quenching-trough': { width: 66, height: 51, offsetX: 0, anchorOffsetY: 36, collisionHalfWidth: 20, collisionHalfHeight: 11, collisionOffsetY: 2 },
  'decor-artifact-sword-case': { width: 68, height: 61, offsetX: 0, anchorOffsetY: 36, collisionHalfWidth: 19, collisionHalfHeight: 13, collisionOffsetY: 3 },
  'decor-suppression-stele': { width: 42, height: 63, offsetX: 0, anchorOffsetY: 36, collisionHalfWidth: 13, collisionHalfHeight: 14, collisionOffsetY: 4 },
  'decor-crane-standing': { width: 36, height: 65, offsetX: 0, anchorOffsetY: 36, collisionHalfWidth: 10, collisionHalfHeight: 12, collisionOffsetY: 3 },
};
const VISITOR_NATIVE_RIGHT: Record<VisitorVariant, { front: boolean; back: boolean }> = {
  a: { front: false, back: true },
  b: { front: false, back: true },
  c: { front: false, back: true },
  d: { front: false, back: true },
};

export class GameScene extends Phaser.Scene {
  gs!: GameState;
  originX = 0; originY = 0;
  board!: Phaser.GameObjects.Container;
  groundLayer!: Phaser.GameObjects.Container;
  placementLayer!: Phaser.GameObjects.Container;
  entityLayer!: Phaser.GameObjects.Container;
  overlayLayer!: Phaser.GameObjects.Container;
  hudLayer!: Phaser.GameObjects.Container;
  hud!: Phaser.GameObjects.Text;
  timeText!: Phaser.GameObjects.Text;
  eventFeed!: Phaser.GameObjects.Container;
  eventHistoryPanel?: Phaser.GameObjects.Container;
  eventHistoryOpen = false;
  eventFeedCollapsed = false;
  eventHistoryPage = 0;
  infoPanel!: Phaser.GameObjects.Container;
  buildMenu!: Phaser.GameObjects.Container;
  researchPanel!: Phaser.GameObjects.Container;
  researchOpen = false;
  titlePanelOpen = false;
  titlePanel?: Phaser.GameObjects.Container;
  titleCheckTimer = 0;
  titleAdvanceRunning = false;
  commissionRefreshTimer = 0;
  titleBannerQueue: string[] = [];
  titleBannerShowing = false;
  elderPanel!: Phaser.GameObjects.Container;
  elderOpen = false;
  recruitPanel!: Phaser.GameObjects.Container;
  recruitOpen = false;
  recruitAbandonArmed = false;
  commissionPanel!: Phaser.GameObjects.Container;
  commissionOpen = false;
  selectedBuild: string | null = null;
  decorMenuOpen = false;
  ghost: BuildGhost | null = null;
  selectedBuilding: PlacedBuilding | null = null;
  visitorSprites = new Map<number, Phaser.GameObjects.Container>();
  floatTexts: Phaser.GameObjects.Text[] = [];
  mapBase?: Phaser.GameObjects.Image;
  gridTiles = new Map<string, Phaser.GameObjects.Graphics>();
  gridTileKeys = new Set<string>();
  stageDecor: Phaser.GameObjects.Image[] = [];
  eventEntries: { text: string; color: string }[] = [];
  gameSpeed = 1;
  directionCheckRunning = false;
  npcDebugEnabled = false;
  npcDebugButton?: Phaser.GameObjects.Rectangle;
  acceptanceToolsOpen = false;
  acceptanceToolsPanel?: Phaser.GameObjects.Container;
  acceptanceToolsButton?: Phaser.GameObjects.Rectangle;
  cunjingeButton?: Phaser.GameObjects.Rectangle;
  keysBound = false;
  saveTimer = 0;
  minBoardScale = 1;
  maxBoardScale = 2;
  panPointerId: number | null = null;
  panLastX = 0;
  panLastY = 0;
  panDistance = 0;
  buildDragPointerId: number | null = null;
  buildDragStartX = 0;
  buildDragStartY = 0;
  buildDragDistance = 0;
  buildDragWasSelected = false;

  constructor() { super('Game'); }

  create(data: { faction?: string; load?: boolean }): void {
    this.purgeVisitorVisuals();
    const raw: any = this.cache.json.get('gamedata');
    let restored = null;
    if (data.load) {
      const tmp = new GameState(this, raw, 'dan');
      restored = tmp.save.load();
    }
    this.gs = new GameState(this, raw, (data.faction as any) || (restored ? restored.faction : 'dan'), restored || undefined);
    if (!this.gs.data.expansionsUnlocked) this.gs.data.expansionsUnlocked = 0;
    if (restored) {
      this.gs.data.expansionsUnlocked = Math.max(
        this.gs.data.expansionsUnlocked,
        v10StageForBuildingCount(this.gs.progressionBuildingCount()),
      );
      this.alignRestoredBuildingsToSlots();
      this.gs.save.save();
    }
    this.originX = 0;
    this.originY = 0;

    this.cameras.main.setBackgroundColor(0x8edcf2);
    this.board = this.add.container(0, 0);
    this.groundLayer = this.add.container(0, 0);
    this.placementLayer = this.add.container(0, 0);
    this.entityLayer = this.add.container(0, 0);
    this.overlayLayer = this.add.container(0, 0);
    this.board.add([this.groundLayer, this.placementLayer, this.entityLayer, this.overlayLayer]);
    this.drawGrid();
    if (restored) {
      if (!this.gs.data.elders) this.gs.data.elders = [];
      for (const b of this.gs.data.buildings) {
        if (!b.level) b.level = 1;
        if (b.craftRecipe === undefined) b.craftRecipe = null;
        if (b.sellRecipe === undefined) b.sellRecipe = null;
        this.drawBuilding(b);
      }
    }
    this.gs.combo.recalc();

    this.createHUD();
    this.createEventFeed();
    this.createBuildMenu();
    this.createInfoPanel();
    this.createResearchPanel();
    this.elderPanel = this.add.container(this.scale.width / 2, this.scale.height / 2).setDepth(81);
    this.recruitPanel = this.add.container(this.scale.width / 2, this.scale.height / 2).setDepth(84);
    this.commissionPanel = this.add.container(this.scale.width / 2, this.scale.height / 2).setDepth(83);
    this.layoutBoard();

    this.input.on('pointermove', (p: Phaser.Input.Pointer) => this.onMove(p));
    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => this.onDown(p));
    this.input.on('pointerup', (p: Phaser.Input.Pointer) => this.onPointerUp(p));
    this.input.on('pointerupoutside', (p: Phaser.Input.Pointer) => this.onPointerUp(p));
    this.input.on('wheel', (
      p: Phaser.Input.Pointer,
      _over: Phaser.GameObjects.GameObject[],
      _dx: number,
      dy: number,
    ) => this.onWheel(p, dy));
    const cancelPointerInteraction = () => this.cancelPointerInteraction();
    this.game.canvas.addEventListener('pointercancel', cancelPointerInteraction);
    window.addEventListener('blur', cancelPointerInteraction);

    this.gs.events.on('float', (b: PlacedBuilding, text: string, color: number) => this.floatText(b, text, color));
    this.gs.events.on('visitor-spawn', (v: Visitor, shop: PlacedBuilding) => this.spawnVisitorSprite(v, shop));
    this.gs.events.on('visitor-leave', (v: Visitor) => this.removeVisitorSprite(v));
    this.gs.events.on('visitor-update', (_v: Visitor) => {});
    this.gs.events.on('day', () => {
      this.advanceTitlesNow();
      const hadOffers = this.gs.data.commissionOffers.length > 0;
      const expired = this.gs.expireCommissionIfNeeded();
      if (expired) this.gs.logEvent('commission', 'info', '委托逾期：' + expired.name, '未在限期内完成，委托已经撤回', '#d8897f');
      else if (!hadOffers && this.gs.data.commissionOffers.length > 0) {
        this.gs.logEvent('commission', 'highlight', '新的宗门委托', '山下送来三份委托，请掌门择一承接', '#d7a5e8');
      }
      if (this.gs.data.recruitNextDay > 0 && this.gs.recruitCooldownDays() === 0) {
        this.gs.ensureRecruitCandidates();
        this.gs.logEvent('recruit', 'info', '新的散修到访', '山下又来了三位散修，请掌门过目', '#9ecbff');
      }
      if (this.recruitOpen) this.renderRecruit();
      if (this.commissionOpen) this.renderCommission();
      this.gs.save.save();
    });
    this.gs.logEvent('day-summary', 'highlight', restored ? '继续经营' : '宗门开山', restored ? '继续经营上次的宗门' : '宗门开山，等待掌门规划', '#ffe08a');
    if (!restored && this.gs.data.commissionOffers.length > 0) {
      this.gs.logEvent('commission', 'highlight', '新的宗门委托', '山下送来三份委托，请掌门择一承接', '#d7a5e8');
    }

    this.scale.on('resize', this.handleResize, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.purgeVisitorVisuals();
      this.scale.off('resize', this.handleResize, this);
      this.game.canvas.removeEventListener('pointercancel', cancelPointerInteraction);
      window.removeEventListener('blur', cancelPointerInteraction);
    });
  }

  purgeVisitorVisuals(): void {
    for (const sprite of this.visitorSprites.values()) {
      this.tweens?.killTweensOf(sprite);
      const debugRoute = sprite.getData('debugRoute') as Phaser.GameObjects.Graphics | undefined;
      if (debugRoute?.scene) debugRoute.destroy();
      if (sprite.scene) sprite.destroy();
    }
    this.visitorSprites.clear();
  }

  // ---------- Grid & buildings ----------
  visibleMapStage(): number {
    return Phaser.Math.Clamp(this.gs.data.expansionsUnlocked || 0, 0, 2);
  }

  alignRestoredBuildingsToSlots(): void {
    const available = V10_BUILD_SLOTS.filter(slot => slot.stage <= this.visibleMapStage());
    const used = new Set<string>();
    for (const building of this.gs.data.buildings) {
      if (this.isDedicatedDecoration(building)) continue;
      let target = available.find(slot => slot.id === building.slotId && !used.has(slot.id));
      if (!target) target = available.find(slot => slot.gx === building.gx && slot.gy === building.gy && !used.has(slot.id));
      if (!target) {
        target = available
          .filter(slot => !used.has(slot.id))
          .sort((a, b) => (
            Math.abs(a.gx - building.gx) + Math.abs(a.gy - building.gy)
          ) - (
            Math.abs(b.gx - building.gx) + Math.abs(b.gy - building.gy)
          ))[0];
      }
      if (!target) continue;
      building.slotId = target.id;
      building.gx = target.gx;
      building.gy = target.gy;
      used.add(target.id);
    }
    this.gs.grid.occupied = Array.from(
      { length: this.gs.grid.h },
      () => Array<number | null>(this.gs.grid.w).fill(null),
    );
    for (const building of this.gs.data.buildings) {
      if (this.isDedicatedDecoration(building)) continue;
      const def = this.gs.buildingDef(building.defId);
      if (building.slotId && this.gs.grid.canPlace(building.gx, building.gy, def.w, def.h)) {
        this.gs.grid.place(building.gx, building.gy, building.uid, def.w, def.h);
        continue;
      }
      const fallback = this.gs.grid.findNearestAvailable(building.gx, building.gy, def.w, def.h);
      if (!fallback) continue;
      building.gx = fallback.gx;
      building.gy = fallback.gy;
      this.gs.grid.place(building.gx, building.gy, building.uid, def.w, def.h);
    }
  }

  inStageRegion(gx: number, gy: number, stage: number): boolean {
    return V10_BUILD_SLOTS.some(slot => {
      if (slot.stage !== stage) return false;
      return gx >= slot.gx && gx < slot.gx + 2 && gy >= slot.gy && gy < slot.gy + 2;
    });
  }

  isUnlockedCell(gx: number, gy: number): boolean {
    if (!this.gs.grid.inBounds(gx, gy)) return false;
    const stage = this.visibleMapStage();
    for (let s = 0; s <= stage; s++) {
      if (this.inStageRegion(gx, gy, s)) return true;
    }
    return false;
  }

  isWaterCell(gx: number, gy: number): boolean {
    return !this.isUnlockedCell(gx, gy);
  }

  unlockedBuildSlots(): V10BuildSlot[] {
    const stage = this.visibleMapStage();
    return V10_BUILD_SLOTS.filter(slot => slot.stage <= stage);
  }

  isDedicatedDecoration(building: PlacedBuilding): boolean {
    return this.gs.buildingDef(building.defId).type === 'decor'
      && !!building.slotId?.startsWith('decor-slot-')
      && V12_DECORATION_SLOTS.some(slot => slot.id === building.slotId);
  }

  decorationSlotOccupied(slotId: string, excludeUid?: number): boolean {
    return this.gs.data.buildings.some(building => (
      building.uid !== excludeUid
      && building.slotId === slotId
      && this.gs.buildingDef(building.defId).type === 'decor'
    ));
  }

  placementSlots(def: BuildingDef | null): V10BuildSlot[] {
    return def?.type === 'decor' ? V12_DECORATION_SLOTS : this.unlockedBuildSlots();
  }

  placementSlot(def: BuildingDef, gx: number, gy: number, slotId?: string): V10BuildSlot | null {
    const slots = this.placementSlots(def);
    return slots.find(slot => slot.id === slotId)
      || slots.find(slot => slot.gx === gx && slot.gy === gy)
      || null;
  }

  fixedMapPoint(mapX: number, mapY: number): { x: number; y: number } {
    return {
      x: FIXED_MAP_ART.x - FIXED_MAP_ART.width / 2 + mapX * FIXED_MAP_ART.width / FIXED_MAP_ART.sourceWidth,
      y: FIXED_MAP_ART.y - FIXED_MAP_ART.height / 2 + mapY * FIXED_MAP_ART.height / FIXED_MAP_ART.sourceHeight,
    };
  }

  fixedMapSourcePoint(localX: number, localY: number): V10MapPoint {
    return {
      mapX: (localX - FIXED_MAP_ART.x + FIXED_MAP_ART.width / 2) * FIXED_MAP_ART.sourceWidth / FIXED_MAP_ART.width,
      mapY: (localY - FIXED_MAP_ART.y + FIXED_MAP_ART.height / 2) * FIXED_MAP_ART.sourceHeight / FIXED_MAP_ART.height,
    };
  }

  buildingMapPoint(building: PlacedBuilding): V10MapPoint | null {
    const slot = V12_DECORATION_SLOTS.find(item => item.id === building.slotId)
      || V10_BUILD_SLOTS.find(item => item.id === building.slotId)
      || V10_BUILD_SLOTS.find(item => item.gx === building.gx && item.gy === building.gy);
    return slot ? { mapX: slot.mapX, mapY: slot.mapY } : null;
  }

  visitorObstacles(
    excludeBuildingUid?: number,
    buildingHalfWidth = 48,
    buildingHalfHeight = 34,
    collisionScale = 1,
    includeDecor = false,
  ): VisitorObstacle[] {
    const fixed = V10_FIXED_OBJECTS
      .filter(object => object.id !== 'pond-lotus')
      .map(object => {
        if (object.id === 'main-hall') return { ...V12_MAIN_HALL_COLLISION };
        const halfHeight = Math.max(12, object.height * 0.34);
        return {
          x: object.mapX,
          y: object.mapY - halfHeight,
          halfWidth: Math.max(12, object.width * 0.38),
          halfHeight,
        };
      });
    fixed.push(...V12_GATE_COLLISIONS.map(obstacle => ({ ...obstacle })));
    if (buildingHalfWidth <= 0 || buildingHalfHeight <= 0) return fixed;
    const buildings = this.gs.data.buildings
      .filter(building => building.uid !== excludeBuildingUid)
      .map(building => {
        const point = this.buildingMapPoint(building);
        if (!point) return null;
        const def = this.gs.buildingDef(building.defId);
        if (def.type === 'decor' && !includeDecor) return null;
        const render = BUILDING_RENDER[def.id] || DEFAULT_BUILDING_RENDER;
        return {
          x: point.mapX + render.offsetX,
          y: point.mapY + render.collisionOffsetY,
          halfWidth: (render.collisionHalfWidth || buildingHalfWidth) * collisionScale,
          halfHeight: (render.collisionHalfHeight || buildingHalfHeight) * collisionScale,
        };
      })
      .filter((obstacle): obstacle is VisitorObstacle => !!obstacle);
    return [...fixed, ...buildings];
  }

  visitorPathIsClear(path: ReadonlyArray<V10MapPoint>, excludeBuildingUid?: number): boolean {
    const obstacles = this.visitorObstacles(excludeBuildingUid);
    for (let index = 1; index < path.length; index++) {
      const from = path[index - 1];
      const to = path[index];
      const samples = Math.max(1, Math.ceil(Math.hypot(to.mapX - from.mapX, to.mapY - from.mapY) / 8));
      for (let sample = 0; sample <= samples; sample++) {
        const t = sample / samples;
        const x = from.mapX + (to.mapX - from.mapX) * t;
        const y = from.mapY + (to.mapY - from.mapY) * t;
        if (obstacles.some(obstacle => (
          Math.abs(x - obstacle.x) <= obstacle.halfWidth
          && Math.abs(y - obstacle.y) <= obstacle.halfHeight
        ))) return false;
      }
    }
    return true;
  }

  planVisitorPath(start: V10MapPoint, target: V10MapPoint, excludeBuildingUid?: number): V10MapPoint[] | null {
    const targetSlot = V10_BUILD_SLOTS
      .filter(slot => slot.stage <= this.visibleMapStage())
      .sort((a, b) => Math.hypot(a.mapX - target.mapX, a.mapY + 44 - target.mapY)
        - Math.hypot(b.mapX - target.mapX, b.mapY + 44 - target.mapY))[0];
    const startNode = this.nearestRoadNode(start);
    const targetNodeId = targetSlot ? targetSlot.zone : this.nearestRoadNode(target)?.id;
    if (!startNode || !targetNodeId) return null;
    const road = this.roadPath(startNode.id, targetNodeId);
    if (!road) return null;
    let path: V10MapPoint[];
    if (targetSlot) {
      // The authored road reaches the outside edge of each build region. From there,
      // use the navigation grid to weave through dense slots to the exact shop entrance.
      const roadPrefix = road.slice(0, -1);
      const connectorStart = roadPrefix[roadPrefix.length - 1] || road[0];
      const walkable = V10_WALKABLE_POLYGONS[this.visibleMapStage()] || V10_WALKABLE_POLYGONS[0];
      const connectorObstacles = () => this.visitorObstacles(
        excludeBuildingUid,
        48,
        34,
        0.65,
        false,
      );
      const connector = findVisitorPath(
        { mapX: connectorStart.mapX, mapY: connectorStart.mapY },
        target,
        walkable,
        V10_WATER_POLYGON,
        connectorObstacles(),
      );
      if (!connector) return null;
      path = [
        start,
        ...roadPrefix.map(node => ({ mapX: node.mapX, mapY: node.mapY })),
        ...connector.slice(1),
      ];
    } else {
      path = [start, ...road.map(node => ({ mapX: node.mapX, mapY: node.mapY })), target];
      if (!this.visitorPathIsClear(path, excludeBuildingUid)) return null;
    }
    const compactPath = path.filter((point, index) => index === 0
      || Math.hypot(point.mapX - path[index - 1].mapX, point.mapY - path[index - 1].mapY) > 1);
    return compactPath;
  }

  nearestRoadNode(point: V10MapPoint) {
    return V12_ROAD_NODES.reduce((best, node) => {
      const distance = Math.hypot(node.mapX - point.mapX, node.mapY - point.mapY);
      return !best || distance < best.distance ? { ...node, distance } : best;
    }, null as (typeof V12_ROAD_NODES[number] & { distance: number }) | null);
  }

  roadPath(startId: string, targetId: string): typeof V12_ROAD_NODES | null {
    return v12RoadPath(startId, targetId);
  }

  visitorRouteDuration(path: ReadonlyArray<V10MapPoint>): number {
    let distance = 0;
    for (let index = 1; index < path.length; index++) {
      const from = this.fixedMapPoint(path[index - 1].mapX, path[index - 1].mapY);
      const to = this.fixedMapPoint(path[index].mapX, path[index].mapY);
      distance += Math.hypot(to.x - from.x, to.y - from.y);
    }
    return Math.max(450, distance / VISITOR_SPEED * 1000);
  }

  walkVisitorPath(
    container: Phaser.GameObjects.Container,
    path: ReadonlyArray<V10MapPoint>,
    finalGX: number,
    finalGY: number,
    onComplete?: () => void,
    trackReturnPath = false,
  ): void {
    this.setVisitorDebugRoute(container, path);
    let index = 1;
    const walkSegment = (): void => {
      if (index >= path.length) {
        if (onComplete) onComplete();
        return;
      }
      const mapPoint = path[index++];
      if (trackReturnPath) container.setData('returnPath', path.slice(0, index).reverse());
      const target = this.fixedMapPoint(mapPoint.mapX, mapPoint.mapY);
      const distance = Math.hypot(target.x - container.x, target.y - container.y);
      const duration = Math.max(140, distance / VISITOR_SPEED * 1000);
      this.walkTo(container, target.x, target.y, finalGX, finalGY, duration, () => {
        container.setData('mapX', mapPoint.mapX);
        container.setData('mapY', mapPoint.mapY);
        walkSegment();
      });
    };
    walkSegment();
  }

  visualDepth(localY: number, layer: number): number {
    return Math.round(localY * 100) + layer;
  }

  slotVisualPosition(gx: number, gy: number): { x: number; y: number } | null {
    const slot = V12_DECORATION_SLOTS.find(item => item.gx === gx && item.gy === gy)
      || V10_BUILD_SLOTS.find(item => item.gx === gx && item.gy === gy);
    if (!slot) return null;
    return this.fixedMapPoint(slot.mapX, slot.mapY);
  }

  slotVisualVertices(gx: number, gy: number, scale = 1): Phaser.Math.Vector2[] | null {
    const center = this.slotVisualPosition(gx, gy);
    if (!center) return null;
    const footprintScale = V12_DECORATION_SLOTS.some(slot => slot.gx === gx && slot.gy === gy) ? 0.5 : 1;
    const column = {
      x: V10_GRID_BASIS.column.x * MAP_ART_SCALE_X * scale * footprintScale,
      y: V10_GRID_BASIS.column.y * MAP_ART_SCALE_Y * scale * footprintScale,
    };
    const row = {
      x: V10_GRID_BASIS.row.x * MAP_ART_SCALE_X * scale * footprintScale,
      y: V10_GRID_BASIS.row.y * MAP_ART_SCALE_Y * scale * footprintScale,
    };
    return [
      new Phaser.Math.Vector2(center.x - (column.x + row.x) / 2, center.y - (column.y + row.y) / 2),
      new Phaser.Math.Vector2(center.x + (column.x - row.x) / 2, center.y + (column.y - row.y) / 2),
      new Phaser.Math.Vector2(center.x + (column.x + row.x) / 2, center.y + (column.y + row.y) / 2),
      new Phaser.Math.Vector2(center.x + (-column.x + row.x) / 2, center.y + (-column.y + row.y) / 2),
    ];
  }

  nearestVisualSlot(localX: number, localY: number): V10BuildSlot | null {
    const def = this.selectedBuild ? this.gs.buildingDef(this.selectedBuild) : null;
    let best: { slot: V10BuildSlot; distance: number } | null = null;
    for (const slot of this.placementSlots(def)) {
      const point = this.fixedMapPoint(slot.mapX, slot.mapY);
      const distance = Phaser.Math.Distance.Between(localX, localY, point.x, point.y);
      if (!best || distance < best.distance) best = { slot, distance };
    }
    return best && best.distance <= (def?.type === 'decor' ? 32 : 44) ? best.slot : null;
  }

  slotForFootprint(gx: number, gy: number, width: number, height: number): V10BuildSlot | null {
    return this.unlockedBuildSlots().find(slot => slot.gx === gx && slot.gy === gy && width <= 2 && height <= 2) || null;
  }

  nearestSlotPosition(gx: number, gy: number, width: number, height: number): { gx: number; gy: number } | null {
    const exact = this.slotForFootprint(gx, gy, width, height);
    if (exact) return { gx: exact.gx, gy: exact.gy };
    if (width > 2 || height > 2) return null;
    let best: { gx: number; gy: number; distance: number } | null = null;
    for (const slot of this.unlockedBuildSlots()) {
      const distance = Math.abs(slot.gx - gx) + Math.abs(slot.gy - gy);
      if (best === null || distance < best.distance) best = { gx: slot.gx, gy: slot.gy, distance };
    }
    return best && best.distance <= 5 ? { gx: best.gx, gy: best.gy } : null;
  }

  isBuildableFootprint(gx: number, gy: number, width = 1, height = 1): boolean {
    return this.slotForFootprint(gx, gy, width, height) !== null;
  }

  terrainKey(gx: number, gy: number): string {
    const edge = !this.isUnlockedCell(gx + 1, gy) || !this.isUnlockedCell(gx, gy + 1);
    if (this.isWaterCell(gx, gy)) return 'v10-tile_water_base_01';
    if ((gx === 12 && gy >= 6 && gy <= 17) || (gy === 10 && gx >= 7 && gx <= 20)) {
      if (gx === 12 && gy === 10) return 'v10-tile_stone_path_cross_01';
      return 'v10-tile_stone_path_straight_01';
    }
    if (this.visibleMapStage() >= 1 && gx >= 18 && gx <= 22 && gy >= 5 && gy <= 8) return 'v10-tile_herb_base_01';
    if (this.visibleMapStage() >= 2 && gx >= 4 && gx <= 9 && gy >= 12 && gy <= 15) return 'v10-tile_stone_base_01';
    if (edge) return 'v10-tile_cliff_edge_01';
    return 'v10-tile_grass_base_01';
  }

  drawCliffForCell(gx: number, gy: number, s: { x: number; y: number }): void {
    const frontMissing = !this.isUnlockedCell(gx, gy + 1);
    const rightMissing = !this.isUnlockedCell(gx + 1, gy);
    if (!frontMissing && !rightMissing) return;
    const cliff = this.add.graphics();
    const drop = 26;
    if (frontMissing) {
      cliff.fillStyle(0x68725e, 0.94);
      cliff.fillPoints([
        new Phaser.Math.Vector2(s.x - TILE_W / 2, s.y),
        new Phaser.Math.Vector2(s.x, s.y + TILE_H / 2),
        new Phaser.Math.Vector2(s.x, s.y + TILE_H / 2 + drop),
        new Phaser.Math.Vector2(s.x - TILE_W / 2, s.y + drop),
      ], true);
      cliff.lineStyle(1, 0x405044, 0.5);
      cliff.lineBetween(s.x - TILE_W / 2 + 8, s.y + 8, s.x - TILE_W / 2 + 8, s.y + drop - 2);
      cliff.lineBetween(s.x - TILE_W / 4, s.y + 12, s.x - TILE_W / 4, s.y + drop + 8);
    }
    if (rightMissing) {
      cliff.fillStyle(0x59675c, 0.96);
      cliff.fillPoints([
        new Phaser.Math.Vector2(s.x, s.y + TILE_H / 2),
        new Phaser.Math.Vector2(s.x + TILE_W / 2, s.y),
        new Phaser.Math.Vector2(s.x + TILE_W / 2, s.y + drop),
        new Phaser.Math.Vector2(s.x, s.y + TILE_H / 2 + drop),
      ], true);
      cliff.lineStyle(1, 0x39473d, 0.55);
      cliff.lineBetween(s.x + TILE_W / 4, s.y + 12, s.x + TILE_W / 4, s.y + drop + 8);
    }
    cliff.setDepth(-6);
    this.groundLayer.add(cliff);
  }

  drawGroundCell(gx: number, gy: number): void {
    const key = gx + ',' + gy;
    if (this.gridTileKeys.has(key)) return;
    const slot = V12_DECORATION_SLOTS.find(item => item.gx === gx && item.gy === gy)
      || this.unlockedBuildSlots().find(item => item.gx === gx && item.gy === gy);
    if (!slot) return;
    const point = this.slotVisualPosition(gx, gy);
    if (!point) return;
    this.gridTileKeys.add(key);
    const highlight = this.add.graphics({ x: point.x, y: point.y })
      .setDepth(this.gs.grid.getDepth(gx, gy, { width: 2, height: 2 }, -20))
      .setVisible(false);
    highlight.setData('slotId', slot.id);
    // Legal build markers must remain readable even when the last free slot is
    // beside a tall building or a fixed facility.
    this.overlayLayer.add(highlight);
    this.gridTiles.set(slot.id, highlight);
  }

  drawGrid(): void {
    this.mapBase = this.add.image(FIXED_MAP_ART.x, FIXED_MAP_ART.y, this.currentMapTexture())
      .setDisplaySize(FIXED_MAP_ART.width, FIXED_MAP_ART.height)
      .setOrigin(0.5)
      .setDepth(-12);
    this.groundLayer.add(this.mapBase);
    const g = this.gs.grid;
    for (const slot of this.unlockedBuildSlots()) this.drawGroundCell(slot.gx, slot.gy);
    for (const slot of V12_DECORATION_SLOTS) this.drawGroundCell(slot.gx, slot.gy);
    const gateGrid = this.gateGridPosition();
    const gateFoot = this.fixedMapPoint(V10_GATE_POINT.mapX, V10_GATE_POINT.mapY);
    const gate = this.add.container(gateFoot.x, gateFoot.y);
    const gateArt = this.add.image(0, 0, 'v10-fixed-sect-gate')
      .setDisplaySize(160 * MAP_ART_SCALE_X, 160 * MAP_ART_SCALE_Y)
      .setOrigin(0.5, 1.0);
    const gt = this.add.text(0, -144 * MAP_ART_SCALE_Y, '山门', {
      fontSize: '10px', color: '#ffe2a3', fontFamily: FONT,
      backgroundColor: '#2b1d13cc', padding: { x: 4, y: 2 },
    }).setOrigin(0.5);
    gate.add([gateArt, gt]);
    const gateDepthPoint = this.fixedMapPoint(V10_GATE_POINT.mapX, V12_GATE_PORTAL.depthY);
    gate.setDepth(this.visualDepth(gateDepthPoint.y, FACILITY_DEPTH_LAYER));
    this.entityLayer.add(gate);
    this.drawStageDecor();
    this.sortBoard();
  }

  drawStageDecor(): void {
    for (const art of this.stageDecor) art.destroy();
    this.stageDecor = [];
    for (const object of V10_FIXED_OBJECTS) {
      const point = this.fixedMapPoint(object.mapX, object.mapY);
      const art = this.add.image(point.x, point.y, object.texture)
        .setDisplaySize(object.width * MAP_ART_SCALE_X, object.height * MAP_ART_SCALE_Y)
        .setOrigin(0.5, 1)
        .setDepth(this.visualDepth(point.y, FACILITY_DEPTH_LAYER + (object.depthOffset || 0)));
      this.entityLayer.add(art);
      this.stageDecor.push(art);
    }
    this.sortBoard();
  }

  setGridEmphasis(active: boolean): void {
    if (!active) {
      for (const tile of this.gridTiles.values()) tile.setVisible(false);
      this.game.canvas.dataset.buildableSlotIds = '[]';
      this.game.canvas.dataset.buildableSlotPoints = '[]';
      return;
    }
    this.refreshBuildSlotHighlights();
  }

  currentMapTexture(): string {
    return V10_MAP_STAGES[this.visibleMapStage()].texture;
  }

  refreshBuildSlotHighlights(hoveredSlotId?: string): void {
    const def = this.selectedBuild ? this.gs.buildingDef(this.selectedBuild) : null;
    const availableSlots: V10BuildSlot[] = [];
    for (const slot of [...this.unlockedBuildSlots(), ...V12_DECORATION_SLOTS]) {
      const tile = this.gridTiles.get(slot.id);
      if (!tile) continue;
      const isDecorSlot = slot.id.startsWith('decor-slot-');
      const available = !!def && (def.type === 'decor'
        ? isDecorSlot && !this.decorationSlotOccupied(slot.id)
        : !isDecorSlot
          && this.gs.grid.canPlace(slot.gx, slot.gy, def.w, def.h)
          && this.isBuildableFootprint(slot.gx, slot.gy, def.w, def.h));
      tile.clear();
      tile.setVisible(available);
      if (!available) continue;
      availableSlots.push(slot);
      const hovered = slot.id === hoveredSlotId;
      const center = this.slotVisualPosition(slot.gx, slot.gy);
      const points = this.slotVisualVertices(slot.gx, slot.gy, hovered ? 1.08 : 1)
        ?.map(point => new Phaser.Math.Vector2(point.x - (center?.x || 0), point.y - (center?.y || 0)));
      if (!points) continue;
      tile.fillStyle(hovered ? 0x6ff08a : 0x53d878, hovered ? 0.48 : 0.28);
      tile.fillPoints(points, true);
      tile.lineStyle(hovered ? 3 : 2, hovered ? 0xd8ffd9 : 0x2aa95b, 0.95);
      tile.strokePoints(points, true);
    }
    this.game.canvas.dataset.buildableSlotIds = JSON.stringify(availableSlots.map(slot => slot.id));
    this.game.canvas.dataset.buildableSlotPoints = JSON.stringify(availableSlots.map(slot => {
      const point = this.fixedMapPoint(slot.mapX, slot.mapY);
      return {
        id: slot.id,
        x: this.board.x + point.x * this.board.scaleX,
        y: this.board.y + point.y * this.board.scaleY,
      };
    }));
  }

  toScreen(gx: number, gy: number): { x: number; y: number } {
    return this.gs.grid.toScreen(gx, gy);
  }

  gateGridPosition(): { gx: number; gy: number } {
    return { gx: Math.min(GATE_GRID_X, this.gs.grid.w - 1), gy: this.gs.grid.h };
  }

  lotVertices(gx: number, gy: number, width: number, height: number): Phaser.Math.Vector2[] {
    const top = this.toScreen(gx, gy);
    const right = this.toScreen(gx + width - 1, gy);
    const bottom = this.toScreen(gx + width - 1, gy + height - 1);
    const left = this.toScreen(gx, gy + height - 1);
    return [
      new Phaser.Math.Vector2(top.x, top.y - TILE_H / 2),
      new Phaser.Math.Vector2(right.x + TILE_W / 2, right.y),
      new Phaser.Math.Vector2(bottom.x, bottom.y + TILE_H / 2),
      new Phaser.Math.Vector2(left.x - TILE_W / 2, left.y),
    ];
  }

  buildingArtPosition(gx: number, gy: number, width: number, height: number): { x: number; y: number } {
    const slot = this.slotVisualPosition(gx, gy);
    if (slot) return { x: slot.x, y: slot.y + DEFAULT_BUILDING_RENDER.anchorOffsetY * MAP_ART_SCALE_Y };
    const center = this.gs.grid.toScreen(gx + (width - 1) / 2, gy + (height - 1) / 2);
    return { x: center.x, y: center.y + 5 };
  }

  buildingEntrance(b: PlacedBuilding): { x: number; y: number; gx: number; gy: number } {
    const def = this.gs.buildingDef(b.defId);
    const mapPoint = this.buildingMapPoint(b);
    const render = BUILDING_RENDER[def.id] || DEFAULT_BUILDING_RENDER;
    const entranceMapPoint = mapPoint ? {
      mapX: mapPoint.mapX + render.offsetX,
      mapY: mapPoint.mapY + render.anchorOffsetY + 8,
    } : null;
    const foot = entranceMapPoint
      ? this.fixedMapPoint(entranceMapPoint.mapX, entranceMapPoint.mapY)
      : this.buildingArtPosition(b.gx, b.gy, def.w, def.h);
    return {
      x: foot.x,
      y: foot.y,
      gx: b.gx + def.w - 1,
      gy: b.gy + def.h - 1,
    };
  }

  courtyardPalette(def: BuildingDef): { fill: number; edge: number; post: number } {
    if (def.type === 'gather' || def.type === 'mine') return { fill: 0xb8df83, edge: 0x638b43, post: 0xf4d35e };
    if (def.type === 'craft' || def.type === 'forge') return { fill: 0xd8c590, edge: 0x8b5a3c, post: 0xd9a441 };
    if (def.type === 'sell' || def.type === 'artifactSell') return { fill: 0xf2d28f, edge: 0xa45b42, post: 0xe85d4a };
    if (def.type === 'train') return { fill: 0xb8d2d0, edge: 0x557d82, post: 0xe8c75c };
    return { fill: 0xd8d1a8, edge: 0x806a4b, post: 0x7cbf72 };
  }

  drawLotPrism(
    graphics: Phaser.GameObjects.Graphics,
    gx: number,
    gy: number,
    width: number,
    height: number,
    color: number,
    originX = 0,
    originY = 0,
    prismHeight = 34,
  ): void {
    const slotVertices = this.slotVisualVertices(gx, gy);
    if (slotVertices) {
      const points = slotVertices.map(point => new Phaser.Math.Vector2(point.x - originX, point.y - originY));
      graphics.fillStyle(color, 0.05);
      graphics.fillPoints(points, true);
      graphics.lineStyle(2, color, 0.95);
      graphics.strokePoints(points, true);
      return;
    }
    const base = this.lotVertices(gx, gy, width, height)
      .map(point => new Phaser.Math.Vector2(point.x - originX, point.y - originY));
    const top = base.map(point => new Phaser.Math.Vector2(point.x, point.y - prismHeight));
    graphics.fillStyle(color, 0.13);
    graphics.fillPoints(base, true);
    graphics.lineStyle(2, color, 0.95);
    graphics.strokePoints(base, true);
    graphics.strokePoints(top, true);
    for (let i = 0; i < base.length; i++) {
      graphics.lineBetween(base[i].x, base[i].y, top[i].x, top[i].y);
    }
  }

  drawCourtyard(b: PlacedBuilding, def: BuildingDef): void {
    const lot = this.add.container(0, 0);
    this.groundLayer.add(lot);
    b.lotSprite = lot;
  }

  buildMenuHeight(): number {
    return this.scale.width < 900 ? 126 : 86;
  }

  topBarHeight(): number {
    return this.scale.width < 900 ? 56 : 68;
  }

  layoutBoard(): void {
    const g = this.gs.grid;
    const w = this.scale.width;
    const h = this.scale.height;
    const topSafe = (w < 900 ? 10 : 16) + this.topBarHeight() + (w < 900 ? 8 : 12);
    const bottomSafe = h - this.buildMenuHeight() - (w < 900 ? 14 : 20);
    const scale = Math.max(
      w / FIXED_MAP_ART.width,
      h / FIXED_MAP_ART.height,
    ) * 1.01;
    let focusX = (g.w - g.h) * TILE_W / 4;
    let focusY = (g.w + g.h - 2) * TILE_H / 4;
    const focusBuildings = this.gs.data.buildings.filter(building => this.gs.buildingDef(building.defId).type !== 'decor');
    if (focusBuildings.length > 0) {
      let totalX = 0;
      let totalY = 0;
      for (const b of focusBuildings) {
        const def = this.gs.buildingDef(b.defId);
        const point = this.slotVisualPosition(b.gx, b.gy) || this.gs.grid.toScreen(
          b.gx + (def.w - 1) / 2,
          b.gy + (def.h - 1) / 2,
        );
        totalX += point.x;
        totalY += point.y;
      }
      focusX = totalX / focusBuildings.length;
      focusY = totalY / focusBuildings.length;
    }

    this.minBoardScale = scale;
    this.maxBoardScale = scale * 2.0;
    if (focusBuildings.length > 0) {
      const hudSafeOffsetX = w >= 900 ? 20 : 0;
      this.originX = w / 2 + hudSafeOffsetX - focusX * scale;
      this.originY = (topSafe + bottomSafe) / 2 - focusY * scale;
    } else {
      this.originX = w / 2 - FIXED_MAP_ART.x * scale;
      this.originY = (topSafe + bottomSafe) / 2 - FIXED_MAP_ART.y * scale;
    }
    this.board.setScale(scale).setPosition(this.originX, this.originY);
    this.clampBoardPosition();
  }

  clampBoardPosition(): void {
    const scale = this.board.scaleX;
    const edge = 0;
    const minLocalX = FIXED_MAP_ART.x - FIXED_MAP_ART.width / 2;
    const maxLocalX = FIXED_MAP_ART.x + FIXED_MAP_ART.width / 2;
    const minLocalY = FIXED_MAP_ART.y - FIXED_MAP_ART.height / 2;
    const maxLocalY = FIXED_MAP_ART.y + FIXED_MAP_ART.height / 2;
    const mapWidth = (maxLocalX - minLocalX) * scale;
    const mapHeight = (maxLocalY - minLocalY) * scale;

    if (mapWidth <= this.scale.width - edge * 2) {
      const halfWidth = mapWidth / 2;
      const safeCenterX = Phaser.Math.Clamp(
        this.scale.width / 2 + (this.scale.width >= 900 ? 40 : 0),
        edge + halfWidth,
        this.scale.width - edge - halfWidth,
      );
      this.board.x = safeCenterX - (minLocalX + maxLocalX) * scale / 2;
    } else {
      this.board.x = Phaser.Math.Clamp(
        this.board.x,
        this.scale.width - edge - maxLocalX * scale,
        edge - minLocalX * scale,
      );
    }
    if (this.scale.width < 900) {
      const topSafe = 10 + this.topBarHeight() + 8;
      const bottomSafe = this.scale.height - this.buildMenuHeight() - 14;
      const safeHeight = Math.max(140, bottomSafe - topSafe);
      if (mapHeight <= safeHeight) {
        this.board.y = (topSafe + bottomSafe) / 2 - (minLocalY + maxLocalY) * scale / 2;
      } else {
        this.board.y = Phaser.Math.Clamp(
          this.board.y,
          bottomSafe - maxLocalY * scale,
          topSafe - minLocalY * scale,
        );
      }
    } else if (mapHeight <= this.scale.height - edge * 2) {
      this.board.y = this.scale.height / 2 - (minLocalY + maxLocalY) * scale / 2;
    } else {
      this.board.y = Phaser.Math.Clamp(
        this.board.y,
        this.scale.height - edge - maxLocalY * scale,
        edge - minLocalY * scale,
      );
    }
    this.originX = this.board.x;
    this.originY = this.board.y;
    this.game.canvas.dataset.v12Camera = JSON.stringify({
      scale,
      minScale: this.minBoardScale,
      maxScale: this.maxBoardScale,
      map: {
        left: this.board.x + minLocalX * scale,
        right: this.board.x + maxLocalX * scale,
        top: this.board.y + minLocalY * scale,
        bottom: this.board.y + maxLocalY * scale,
      },
    });
  }

  onWheel(p: Phaser.Input.Pointer, deltaY: number): void {
    if (this.selectedBuild || this.researchOpen || this.elderOpen || this.recruitOpen || this.commissionOpen || this.isPointerOverHUD(p)) return;
    const oldScale = this.board.scaleX;
    const factor = deltaY > 0 ? 0.9 : 1.1;
    const nextScale = Phaser.Math.Clamp(oldScale * factor, this.minBoardScale, this.maxBoardScale);
    if (Math.abs(nextScale - oldScale) < 0.001) return;
    const localX = (p.x - this.board.x) / oldScale;
    const localY = (p.y - this.board.y) / oldScale;
    this.board.setScale(nextScale);
    this.board.setPosition(p.x - localX * nextScale, p.y - localY * nextScale);
    this.clampBoardPosition();
  }

  isPointerOverHUD(p: Phaser.Input.Pointer): boolean {
    const compact = this.scale.width < 900;
    const top = compact ? 10 : 16;
    if (p.y >= top && p.y <= top + this.topBarHeight()) return true;
    if (p.y >= this.scale.height - this.buildMenuHeight() - 18) return true;
    if (this.scale.width >= 900) {
      const feed = this.eventFeedBounds();
      if (p.x >= feed.x && p.x <= feed.x + feed.width && p.y >= feed.y && p.y <= feed.y + feed.height) return true;
    }
    if (this.selectedBuilding) {
      const panelWidth = 320 * this.infoPanel.scaleX;
      const panelHeight = (this.infoPanel.getData('panelHeight') || 300) * this.infoPanel.scaleY;
      if (
        p.x >= this.infoPanel.x
        && p.x <= this.infoPanel.x + panelWidth
        && p.y >= this.infoPanel.y
        && p.y <= this.infoPanel.y + panelHeight
      ) return true;
    }
    return false;
  }

  pointerToGrid(p: Phaser.Input.Pointer): { gx: number; gy: number } {
    const localX = (p.x - this.board.x) / this.board.scaleX;
    const localY = (p.y - this.board.y) / this.board.scaleY;
    return this.gs.grid.toGrid(localX, localY);
  }

  pointerToBuildSlot(p: Phaser.Input.Pointer): V10BuildSlot | null {
    const localX = (p.x - this.board.x) / this.board.scaleX;
    const localY = (p.y - this.board.y) / this.board.scaleY;
    return this.nearestVisualSlot(localX, localY);
  }

  discipleTexture(b: PlacedBuilding): string {
    const discipleId = b.assigned[0];
    const disciple = this.gs.data.disciples.find(d => d.id === discipleId);
    return 'character-disciple-' + (disciple?.appearance || 'a');
  }

  createLegacyProductionFx(defId: string, artX: number, artY: number, displayW: number, displayH: number): Phaser.GameObjects.Container | null {
    if (!['lingtian', 'danfang', 'danpu'].includes(defId)) return null;
    const fx = this.add.container(0, 0).setVisible(false);
    if (defId === 'lingtian') {
      const motes = [-0.22, 0, 0.22].map((offset, index) => {
        const mote = this.add.circle(artX + displayW * offset, artY - displayH * (0.22 + index * 0.04), 2.2, 0x9df072, 0.85);
        fx.add(mote);
        this.tweens.add({
          targets: mote,
          y: mote.y - displayH * 0.22,
          alpha: 0.1,
          scale: 0.65,
          duration: 850 + index * 130,
          delay: index * 220,
          repeat: -1,
        });
        return mote;
      });
      fx.setData('fxParts', motes);
    } else if (defId === 'danfang') {
      const glow = this.add.ellipse(artX - displayW * 0.05, artY - displayH * 0.2, displayW * 0.3, displayH * 0.16, 0xff9c3d, 0.3);
      const flame = this.add.circle(artX - displayW * 0.05, artY - displayH * 0.24, Math.max(3, displayW * 0.045), 0xffcf5a, 0.9);
      const smoke = this.add.circle(artX + displayW * 0.03, artY - displayH * 0.42, Math.max(3, displayW * 0.035), 0xd8d1bd, 0.45);
      fx.add([glow, flame, smoke]);
      this.tweens.add({ targets: [glow, flame], alpha: { from: 0.35, to: 0.9 }, scale: { from: 0.85, to: 1.12 }, duration: 520, yoyo: true, repeat: -1 });
      this.tweens.add({ targets: smoke, y: smoke.y - displayH * 0.18, x: smoke.x + displayW * 0.08, alpha: 0.05, scale: 1.45, duration: 1200, repeat: -1 });
    } else {
      const glow = this.add.ellipse(artX + displayW * 0.03, artY - displayH * 0.23, displayW * 0.46, displayH * 0.24, 0xffd36a, 0.18);
      const aromas = [-0.12, 0.02, 0.15].map((offset, index) => {
        const aroma = this.add.circle(artX + displayW * offset, artY - displayH * (0.28 + index * 0.03), 2, 0xb9efc4, 0.7);
        fx.add(aroma);
        this.tweens.add({
          targets: aroma,
          y: aroma.y - displayH * 0.24,
          x: aroma.x + (index % 2 === 0 ? -1 : 1) * displayW * 0.08,
          alpha: 0.05,
          scale: 1.3,
          duration: 1050 + index * 150,
          delay: index * 180,
          repeat: -1,
        });
        return aroma;
      });
      fx.addAt(glow, 0);
      this.tweens.add({ targets: glow, alpha: { from: 0.12, to: 0.3 }, scale: { from: 0.92, to: 1.06 }, duration: 780, yoyo: true, repeat: -1 });
      fx.setData('fxParts', aromas);
    }
    return fx;
  }

  drawBuilding(b: PlacedBuilding, animateConstruction = false): void {
    const def = this.gs.buildingDef(b.defId);
    this.drawCourtyard(b, def);
    const render = BUILDING_RENDER[def.id] || DEFAULT_BUILDING_RENDER;
    const slotPoint = this.slotVisualPosition(b.gx, b.gy);
    const foot = slotPoint || this.buildingArtPosition(b.gx, b.gy, def.w, def.h);
    const artX = slotPoint ? render.offsetX * MAP_ART_SCALE_X : 0;
    const artY = slotPoint && !this.isDedicatedDecoration(b) ? render.anchorOffsetY * MAP_ART_SCALE_Y : 0;
    const renderScale = (def.renderScale ?? 1) * DEFAULT_BUILDING_SCALE;
    const displayW = render.width * renderScale * MAP_ART_SCALE_X;
    const displayH = render.height * renderScale * MAP_ART_SCALE_Y;
    const c = this.add.container(foot.x, foot.y);
    const art = this.add.image(artX, artY, 'building-' + def.id)
      .setDisplaySize(displayW, displayH)
      .setOrigin(0.5, 1.0);
    let productionFx: Phaser.GameObjects.GameObject | null = null;
    if (def.id === 'lingkuang') {
      productionFx = this.add.sprite(artX, artY - displayH * 0.23, 'fx-mine-glow')
        .setDisplaySize(displayW * 0.76, displayH * 0.76)
        .setAlpha(0.55)
        .play('v12-mine-glow');
    } else if (def.id === 'lianqi') {
      const array = this.add.image(artX + displayW * 0.19, artY - displayH * 0.18, 'fx-da-geng-sword-array')
        .setDisplaySize(displayW * 0.48, displayH * 0.48)
        .setAlpha(0.92);
      const sparks = this.add.sprite(artX - displayW * 0.22, artY - displayH * 0.26, 'fx-forge-sparks')
        .setDisplaySize(displayW * 0.55, displayH * 0.55)
        .setAlpha(0.6)
        .play('v12-forge-sparks');
      productionFx = sparks;
      c.add([art, array, sparks]);
      c.setData('productionFxArray', array);
    } else {
      productionFx = this.createLegacyProductionFx(def.id, artX, artY, displayW, displayH);
    }
    const worker = this.add.image(artX + displayW * 0.38, artY + 2, this.discipleTexture(b)).setDisplaySize(10, 15).setOrigin(0.5, 1);
    const label = this.add.text(artX, artY - displayH - 8, def.name, {
      fontSize: '9px', color: '#fff0c6', fontFamily: FONT,
      backgroundColor: '#2b1d13dd', padding: { x: 4, y: 2 },
      stroke: '#2b1d13', strokeThickness: 1,
    }).setOrigin(0.5);
    const progressBarWidth = Phaser.Math.Clamp(displayW * 0.5, 34, 54);
    const barY = artY - displayH + 1;
    const bar = this.add.rectangle(artX, barY, progressBarWidth, 4, 0x33251b, 0.9)
      .setOrigin(0.5)
      .setStrokeStyle(1, 0xc6a45c, 0.65)
      .setVisible(false);
    const fill = this.add.rectangle(artX - progressBarWidth / 2, barY, 0, 2, 0x91c96b)
      .setOrigin(0, 0.5)
      .setVisible(false);
    const hoverFrame = this.add.graphics().setVisible(false);
    if (this.isDedicatedDecoration(b)) {
      const points = this.slotVisualVertices(b.gx, b.gy)
        ?.map(point => new Phaser.Math.Vector2(point.x - foot.x, point.y - foot.y));
      if (points) {
        hoverFrame.fillStyle(0xffe071, 0.13);
        hoverFrame.fillPoints(points, true);
        hoverFrame.lineStyle(2, 0xffe071, 0.95);
        hoverFrame.strokePoints(points, true);
      }
    } else {
      this.drawLotPrism(hoverFrame, b.gx, b.gy, def.w, def.h, 0xffe071, foot.x, foot.y, 34);
    }
    const scaffold = this.add.graphics().setVisible(animateConstruction);
    const scaffoldHalfW = displayW / 2 + 2;
    const scaffoldH = displayH * 0.8;
    scaffold.lineStyle(3, 0x9a5d2e, 1);
    scaffold.lineBetween(artX - scaffoldHalfW, artY, artX - scaffoldHalfW, artY - scaffoldH);
    scaffold.lineBetween(artX + scaffoldHalfW, artY, artX + scaffoldHalfW, artY - scaffoldH);
    scaffold.lineBetween(artX - scaffoldHalfW, artY - scaffoldH * 0.84, artX + scaffoldHalfW, artY - scaffoldH * 0.84);
    scaffold.lineBetween(artX - scaffoldHalfW, artY - scaffoldH * 0.34, artX + scaffoldHalfW, artY - scaffoldH * 0.66);
    scaffold.lineBetween(artX - scaffoldHalfW, artY - scaffoldH * 0.66, artX + scaffoldHalfW, artY - scaffoldH * 0.34);
    scaffold.fillStyle(0xf5d35f, 1);
    scaffold.fillTriangle(
      artX - scaffoldHalfW + 1,
      artY - scaffoldH,
      artX - scaffoldHalfW + 11,
      artY - scaffoldH + 3,
      artX - scaffoldHalfW + 1,
      artY - scaffoldH + 9,
    );
    if (def.id !== 'lianqi') c.add(art);
    if (productionFx && def.id !== 'lianqi') c.add(productionFx);
    c.add([worker, label, bar, fill, scaffold, hoverFrame]);
    c.setData('bar', bar);
    c.setData('fill', fill);
    c.setData('progressBarWidth', progressBarWidth);
    c.setData('label', label);
    c.setData('worker', worker);
    c.setData('art', art);
    c.setData('hoverFrame', hoverFrame);
    c.setData('productionFx', productionFx);
    const hitW = Math.max(58, displayW + 14);
    const hitH = Math.max(58, displayH + 18);
    const selectionTarget = this.add.rectangle(artX, artY - hitH / 2 + 8, hitW, hitH, 0xffffff, 0.001)
      .setInteractive({ useHandCursor: true });
    c.addAt(selectionTarget, 0);
    c.setData('selectionTarget', selectionTarget);
    c.setData('selectionLocalX', selectionTarget.x);
    c.setData('selectionLocalY', selectionTarget.y);
    selectionTarget.on('pointerdown', (_ptr: Phaser.Input.Pointer, _lx: number, _ly: number, ev: any) => {
      if (this.selectedBuild) return;
      ev.stopPropagation();
      this.selectBuilding(b);
    });
    selectionTarget.on('pointerover', () => {
      c.setData('hovering', true);
      if (!this.selectedBuild) hoverFrame.setVisible(true);
    });
    selectionTarget.on('pointerout', () => {
      c.setData('hovering', false);
      hoverFrame.setVisible(false);
    });
    worker.setVisible(false);
    b.sprite = c;
    c.setDepth(slotPoint
      ? this.visualDepth(foot.y + artY, FACILITY_DEPTH_LAYER)
      : this.gs.grid.getDepth(
        b.gx,
        b.gy,
        { width: def.w, height: def.h },
        FACILITY_DEPTH_LAYER,
      ));
    this.entityLayer.add(c);
    this.sortBoard();

    if (animateConstruction) {
      const finalScaleX = art.scaleX;
      const finalScaleY = art.scaleY;
      art.setAlpha(0).setScale(finalScaleX * 0.86, finalScaleY * 0.86);
      worker.setAlpha(0);
      label.setAlpha(0);
      this.time.delayedCall(520, () => {
        this.tweens.add({
          targets: scaffold,
          alpha: 0,
          duration: 360,
          onComplete: () => scaffold.destroy(),
        });
        this.tweens.add({ targets: [art, label], alpha: 1, duration: 420 });
        this.tweens.add({
          targets: art,
          scaleX: finalScaleX,
          scaleY: finalScaleY,
          duration: 420,
          ease: 'Back.Out',
        });
        if (b.assigned.length > 0) this.tweens.add({ targets: worker, alpha: 1, duration: 420 });
      });
    }
  }

  sortBoard(): void {
    this.entityLayer.list.sort((a: any, b: any) => (a.depth || 0) - (b.depth || 0));
  }

  refreshBuildingVisual(b: PlacedBuilding): void {
    if (!b.sprite) return;
    const bar = b.sprite.getData('bar') as Phaser.GameObjects.Rectangle;
    const fill = b.sprite.getData('fill') as Phaser.GameObjects.Rectangle;
    const worker = b.sprite.getData('worker') as Phaser.GameObjects.Image;
    const def = this.gs.buildingDef(b.defId);
    const showBar = !!def.baseTime && (b.progress > 0 || b.queue > 0 || this.selectedBuilding?.uid === b.uid);
    const progressBarWidth = (b.sprite.getData('progressBarWidth') as number) || 54;
    fill.width = progressBarWidth * Phaser.Math.Clamp(b.progress, 0, 1);
    bar.setVisible(showBar);
    fill.setVisible(showBar);
    worker.setTexture(this.discipleTexture(b));
    worker.setVisible(false);
    const label = b.sprite.getData('label') as Phaser.GameObjects.Text;
    const productionFx = b.sprite.getData('productionFx') as Phaser.GameObjects.GameObject | null;
    const fxActive = def.id === 'danpu' ? b.queue > 0 : b.progress > 0;
    if (productionFx && 'setVisible' in productionFx) (productionFx as Phaser.GameObjects.Container).setVisible(fxActive);
    const productionFxArray = b.sprite.getData('productionFxArray') as Phaser.GameObjects.Image | null;
    if (productionFxArray) productionFxArray.setVisible(b.progress > 0);
    const scale = this.board ? this.board.scaleX : 1;
    const selected = this.selectedBuilding?.uid === b.uid;
    const hovering = !!b.sprite.getData('hovering');
    const zoomRatio = this.minBoardScale > 0 ? scale / this.minBoardScale : 1;
    const showLabel = selected || hovering || zoomRatio >= 1.42;
    label.setVisible(showLabel);
    if (!showLabel) return;
    let extra = '';
    if (zoomRatio >= 1.42 || selected) {
      if ((b.level || 1) > 1) extra += ' Lv' + b.level;
      if (def.type === 'sell' && b.sellRecipe) extra += '·' + this.gs.recipeDef(b.sellRecipe).name;
      if ((def.type === 'sell' || def.type === 'artifactSell') && b.queue > 0) extra += ' 排' + b.queue;
      if (b.comboBonus > 0) extra += ' ✦';
    }
    label.setText(def.name + extra);
  }

  // ---------- Input ----------
  onMove(p: Phaser.Input.Pointer): void {
    if (this.buildDragPointerId === p.id && p.isDown) {
      this.buildDragDistance = Phaser.Math.Distance.Between(
        this.buildDragStartX,
        this.buildDragStartY,
        p.x,
        p.y,
      );
    }
    if (this.researchOpen || this.elderOpen || this.recruitOpen || this.commissionOpen) {
      this.clearGhost();
      return;
    }
    if (this.selectedBuild) {
      const slot = this.pointerToBuildSlot(p);
      if (!slot) {
        this.clearGhost();
        this.refreshBuildSlotHighlights();
        return;
      }
      const def = this.gs.buildingDef(this.selectedBuild);
      const targetGX = slot.gx;
      const targetGY = slot.gy;
      if (!this.ghost) this.ghost = { gx: targetGX, gy: targetGY, slotId: slot.id, ok: false };
      this.ghost.gx = targetGX; this.ghost.gy = targetGY;
      this.ghost.slotId = slot.id;
      this.ghost.ok = def.type === 'decor'
        ? slot.id.startsWith('decor-slot-') && !this.decorationSlotOccupied(slot.id)
        : this.gs.grid.canPlace(targetGX, targetGY, def.w, def.h)
          && this.isBuildableFootprint(targetGX, targetGY, def.w, def.h);
      this.refreshBuildSlotHighlights(slot.id);
      if (this.ghost.gfx) this.ghost.gfx.destroy();
      const col = this.ghost.ok ? 0x7ddb6a : 0xdd6a6a;
      this.ghost.gfx = this.add.container(0, 0);
      const slotPoint = this.slotVisualPosition(targetGX, targetGY);
      const artPosition = slotPoint || this.buildingArtPosition(targetGX, targetGY, def.w, def.h);
      const render = BUILDING_RENDER[def.id] || DEFAULT_BUILDING_RENDER;
      const renderScale = (def.renderScale ?? 1) * DEFAULT_BUILDING_SCALE;
      const preview = this.add.image(
        artPosition.x + (slotPoint ? render.offsetX * MAP_ART_SCALE_X : 0),
        artPosition.y + (slotPoint && !slot.id.startsWith('decor-slot-') ? render.anchorOffsetY * MAP_ART_SCALE_Y : 0),
        'building-' + def.id,
      )
        .setDisplaySize(render.width * renderScale * MAP_ART_SCALE_X, render.height * renderScale * MAP_ART_SCALE_Y)
        .setOrigin(0.5, 1)
        .setTint(col)
        .setAlpha(0.58);
      const frame = this.add.graphics();
      if (def.type === 'decor') {
        const points = this.slotVisualVertices(targetGX, targetGY);
        if (points) {
          frame.fillStyle(col, 0.18);
          frame.fillPoints(points, true);
          frame.lineStyle(2, col, 0.95);
          frame.strokePoints(points, true);
        }
      } else {
        this.drawLotPrism(frame, targetGX, targetGY, def.w, def.h, col);
      }
      this.ghost.gfx.add([preview, frame]);
      this.placementLayer.add(this.ghost.gfx);
      return;
    }

    this.clearGhost();
    if (this.panPointerId !== p.id || !p.isDown) return;
    const dx = p.x - this.panLastX;
    const dy = p.y - this.panLastY;
    this.panLastX = p.x;
    this.panLastY = p.y;
    this.panDistance += Math.hypot(dx, dy);
    if (this.panDistance < 3) return;
    this.board.x += dx;
    this.board.y += dy;
    this.clampBoardPosition();
  }

  onDown(p: Phaser.Input.Pointer): void {
    if (this.researchOpen || this.elderOpen || this.recruitOpen || this.commissionOpen) return;
    if (this.buildDragPointerId === p.id) return;
    if (this.selectedBuild) {
      let gx = this.ghost?.gx, gy = this.ghost?.gy, slotId = this.ghost?.slotId;
      if (gx === undefined || gy === undefined) {
        const slot = this.pointerToBuildSlot(p);
        if (slot) {
          gx = slot.gx;
          gy = slot.gy;
          slotId = slot.id;
        }
      }
      const def = this.gs.buildingDef(this.selectedBuild);
      if (gx === undefined || gy === undefined) {
        this.toast('请点击仙山上的圆形建造空地');
        return;
      }
      const canPlace = def.type === 'decor'
        ? !!slotId?.startsWith('decor-slot-') && !this.decorationSlotOccupied(slotId)
        : this.gs.grid.canPlace(gx, gy, def.w, def.h) && this.isBuildableFootprint(gx, gy, def.w, def.h);
      if (canPlace) {
        this.tryPlace(this.selectedBuild, gx, gy, slotId);
      } else {
        this.toast('此处未开放或需要 ' + def.w + '×' + def.h + ' 的完整空地');
      }
    } else {
      this.selectBuilding(null);
      this.panPointerId = p.id;
      this.panLastX = p.x;
      this.panLastY = p.y;
      this.panDistance = 0;
    }
  }

  onPointerUp(p: Phaser.Input.Pointer): void {
    if (this.buildDragPointerId === p.id) {
      const dragged = this.buildDragDistance >= 8;
      const defId = this.selectedBuild;
      this.buildDragPointerId = null;
      this.buildDragDistance = 0;
      if (dragged) {
        if (defId && this.ghost?.ok && !this.isPointerOverHUD(p)) {
          this.tryPlace(defId, this.ghost.gx, this.ghost.gy, this.ghost.slotId);
        } else {
          this.toast('只能放在亮起的绿色空地');
          this.cancelBuild();
        }
      } else if (this.buildDragWasSelected) {
        this.cancelBuild();
      }
      this.buildDragWasSelected = false;
      return;
    }
    if (this.panPointerId === p.id) this.panPointerId = null;
  }

  cancelPointerInteraction(): void {
    if (this.buildDragPointerId !== null) this.cancelBuild();
    this.panPointerId = null;
    this.panDistance = 0;
  }

  beginBuildPointer(defId: string, p: Phaser.Input.Pointer): void {
    this.buildDragWasSelected = this.selectedBuild === defId;
    this.selectedBuild = defId;
    this.buildDragPointerId = p.id;
    this.buildDragStartX = p.x;
    this.buildDragStartY = p.y;
    this.buildDragDistance = 0;
    this.clearGhost();
    this.refreshBuildSlotHighlights();
    this.refreshBuildMenu();
  }

  tryPlace(defId: string, gx: number, gy: number, requestedSlotId?: string): void {
    const def = this.gs.buildingDef(defId);
    const d = this.gs.data;
    const slot = this.placementSlot(def, gx, gy, requestedSlotId);
    if (!slot) return;
    if (def.type === 'decor' && this.decorationSlotOccupied(slot.id)) return;
    if (d.spirit < def.cost) { this.toast('灵石不足'); return; }
    d.spirit -= def.cost;
    const b: PlacedBuilding = {
      uid: Date.now() + Math.floor(Math.random() * 999),
      defId, gx: slot.gx, gy: slot.gy, slotId: slot.id, progress: 0, level: 1,
      craftRecipe: null, sellRecipe: null,
      assigned: [], queue: 0, comboBonus: 0, stock: 0,
    };
    d.buildings.push(b);
    if (def.type !== 'decor') this.gs.grid.place(slot.gx, slot.gy, b.uid, def.w, def.h);
    this.drawBuilding(b, true);
    const combos = this.gs.combo.recalc();
    this.toast(def.name + ' 开始施工');
    this.time.delayedCall(900, () => {
      this.toast(def.name + ' 建成');
      this.gs.logEvent('build', 'highlight', def.name + ' 建成', def.name + '建成，可投入使用（-' + def.cost + '灵石）', '#8fdc72');
    });
    if (combos.length) {
      const comboText = combos.map(id => this.gs.defs.combos.find(c => c.id === id)!.name).join('、');
      this.toast('触发相性：' + comboText);
      this.gs.logEvent('combo', 'highlight', '触发相性', '触发相性：' + comboText, '#ffe071');
    }
    this.gs.save.save();
    const keepBuilding = this.input.keyboard
      ? this.input.keyboard.checkDown(this.input.keyboard.addKey('SHIFT'), 0)
      : false;
    if (!keepBuilding) this.cancelBuild();
    else this.refreshBuildSlotHighlights();
  }

  clearGhost(): void {
    if (this.ghost?.gfx) this.ghost.gfx.destroy();
    this.ghost = null;
  }

  cancelBuild(): void {
    this.selectedBuild = null;
    this.buildDragPointerId = null;
    this.buildDragDistance = 0;
    this.buildDragWasSelected = false;
    this.clearGhost();
    this.setGridEmphasis(false);
    this.refreshBuildMenu();
  }

  // ---------- Visitors ----------
  visitorDirectionSymbol(dx: number, dy: number): string {
    const horizontal = dx > 0 ? '右' : dx < 0 ? '左' : '';
    const vertical = dy > 0 ? '下' : dy < 0 ? '上' : '';
    return horizontal + vertical || '停';
  }

  refreshVisitorDebug(c: Phaser.GameObjects.Container): void {
    const arrow = c.getData('debugArrow') as Phaser.GameObjects.Graphics | undefined;
    const label = c.getData('debugLabel') as Phaser.GameObjects.Text | undefined;
    const route = c.getData('debugRoute') as Phaser.GameObjects.Graphics | undefined;
    if (!arrow || !label) return;
    arrow.setVisible(this.npcDebugEnabled);
    label.setVisible(this.npcDebugEnabled);
    route?.setVisible(this.npcDebugEnabled);
    if (!this.npcDebugEnabled) return;

    const person = c.getData('person') as Phaser.GameObjects.Image;
    const dx = Number(c.getData('actualDX') || 0);
    const dy = Number(c.getData('actualDY') || 0);
    const length = Math.hypot(dx, dy);
    arrow.clear();
    if (length > 0.01) {
      const ux = dx / length;
      const uy = dy / length;
      const startY = -10;
      const endX = ux * 24;
      const endY = startY + uy * 24;
      arrow.lineStyle(2, 0xff3b30, 1);
      arrow.lineBetween(0, startY, endX, endY);
      arrow.fillStyle(0xff3b30, 1);
      arrow.fillCircle(endX, endY, 3);
    }
    const textureKey = person.texture.key;
    const face = textureKey.endsWith('-back') ? '背' : '正';
    const flip = person.flipX ? '翻' : '原';
    const target = String(c.getData('debugTargetName') || '未知目标');
    const shortId = String(c.getData('visitorId')).slice(-4);
    label.setText(
      '#' + shortId + ' ' + String(c.getData('variant')).toUpperCase()
      + ' ' + this.visitorDirectionSymbol(Math.sign(dx), Math.sign(dy))
      + ' ' + face + '/' + flip + '\n→' + target,
    );
  }

  setVisitorDebugRoute(c: Phaser.GameObjects.Container, path: ReadonlyArray<V10MapPoint>): void {
    let route = c.getData('debugRoute') as Phaser.GameObjects.Graphics | undefined;
    if (!route) {
      route = this.add.graphics();
      this.overlayLayer.add(route);
      c.setData('debugRoute', route);
    }
    route.clear();
    route.lineStyle(2, 0xff3b30, 0.78);
    for (let index = 1; index < path.length; index++) {
      const from = this.fixedMapPoint(path[index - 1].mapX, path[index - 1].mapY);
      const to = this.fixedMapPoint(path[index].mapX, path[index].mapY);
      route.lineBetween(from.x, from.y, to.x, to.y);
    }
    route.setVisible(this.npcDebugEnabled);
    c.setData('debugPath', path.map(point => ({ mapX: point.mapX, mapY: point.mapY })));
  }

  toggleNPCDebug(): void {
    this.npcDebugEnabled = !this.npcDebugEnabled;
    for (const sprite of this.visitorSprites.values()) this.refreshVisitorDebug(sprite);
    this.layoutHUD();
    this.toast(this.npcDebugEnabled ? 'NPC诊断已开启：红线为路径，红点箭头为实时移动方向' : 'NPC诊断已关闭');
  }

  updateNPCAnimation(c: Phaser.GameObjects.Container, screenDX: number, screenDY: number): void {
    if (Math.abs(screenDX) < 0.1 && Math.abs(screenDY) < 0.1) return;
    const person = c.getData('person') as Phaser.GameObjects.Image;
    const variant = c.getData('variant') as VisitorVariant;
    const previousFacingBack = c.getData('facingBack');
    const facingBack = Math.abs(screenDY) > 0.6
      ? screenDY < 0
      : (typeof previousFacingBack === 'boolean' ? previousFacingBack : false);
    const previousMovingRight = c.getData('movingRight');
    const movingRight = Math.abs(screenDX) > 0.6
      ? screenDX > 0
      : (typeof previousMovingRight === 'boolean' ? previousMovingRight : true);
    const facing = facingBack ? 'back' : 'front';
    c.setData('movingRight', movingRight);
    c.setData('facingBack', facingBack);
    c.setData('directionX', Math.sign(screenDX));
    c.setData('directionY', Math.sign(screenDY));
    c.setData('actualDX', screenDX);
    c.setData('actualDY', screenDY);
    person.setTexture('character-visitor-' + variant + (facingBack ? '-back' : ''));
    person.setFlipX(VISITOR_NATIVE_RIGHT[variant][facing] !== movingRight);
    this.refreshVisitorDebug(c);
  }

  walkTo(c: Phaser.GameObjects.Container, x: number, y: number, targetGX: number, targetGY: number, duration: number, onComplete?: () => void): void {
    this.tweens.killTweensOf(c);
    const person = c.getData('person') as Phaser.GameObjects.Image;
    const shadow = c.getData('shadow') as Phaser.GameObjects.Ellipse;
    const baseY = 2;
    this.updateNPCAnimation(c, x - c.x, y - c.y);
    let previousX = c.x;
    let previousY = c.y;
    this.tweens.add({
      targets: c,
      x,
      y,
      duration,
      ease: 'Linear',
      onUpdate: (tween: Phaser.Tweens.Tween) => {
        this.updateNPCAnimation(c, c.x - previousX, c.y - previousY);
        previousX = c.x;
        previousY = c.y;
        const phase = tween.progress * Math.PI * 10;
        const lift = Math.abs(Math.sin(phase)) * 1.5;
        person.setY(baseY - lift).setAngle(Math.sin(phase) * 2.2);
        shadow.setScale(1 - lift * 0.055, 1 + lift * 0.015);
        c.setDepth(this.visualDepth(c.y, NPC_DEPTH_LAYER));
        this.sortBoard();
      },
      onComplete: () => {
        person.setY(baseY).setAngle(0);
        shadow.setScale(1);
        c.setData('gridX', targetGX);
        c.setData('gridY', targetGY);
        c.setDepth(this.visualDepth(c.y, NPC_DEPTH_LAYER));
        this.sortBoard();
        if (onComplete) onComplete();
      },
    });
  }

  spawnVisitorSprite(v: Visitor, shop: PlacedBuilding): void {
    const gateGrid = this.gateGridPosition();
    const gate = this.fixedMapPoint(V10_GATE_POINT.mapX, V10_GATE_POINT.mapY);
    const c = this.add.container(gate.x, gate.y);
    const shadow = this.add.ellipse(0, 1, 14, 5, 0x1c120d, 0.3);
    const variant = ['a', 'b', 'c', 'd'][Math.abs(v.id) % 4];
    const person = this.add.image(0, 2, 'character-visitor-' + variant).setDisplaySize(18, 26).setOrigin(0.5, 1);
    const debugArrow = this.add.graphics().setVisible(false);
    const debugLabel = this.add.text(0, -34, '', {
      fontSize: '8px', color: '#ffffff', fontFamily: FONT, align: 'center',
      backgroundColor: '#42160ddd', padding: { x: 3, y: 2 },
    }).setOrigin(0.5, 1).setVisible(false);
    c.add([shadow, person, debugArrow, debugLabel]);
    c.setData('person', person);
    c.setData('shadow', shadow);
    c.setData('variant', variant);
    c.setData('visitorId', v.id);
    c.setData('debugArrow', debugArrow);
    c.setData('debugLabel', debugLabel);
    c.setData('gridX', gateGrid.gx);
    c.setData('gridY', gateGrid.gy);
    c.setData('mapX', V10_GATE_POINT.mapX);
    c.setData('mapY', V10_GATE_POINT.mapY);
    c.setDepth(this.visualDepth(gate.y, NPC_DEPTH_LAYER));
    this.entityLayer.add(c);
    this.sortBoard();
    this.visitorSprites.set(v.id, c);
    const shopPoint = this.buildingMapPoint(shop);
    const target = this.buildingEntrance(shop);
    const shopDef = this.gs.buildingDef(shop.defId);
    c.setData('debugTargetUid', shop.uid);
    c.setData('debugTargetName', shopDef.name + '#' + shop.uid);
    const render = BUILDING_RENDER[shopDef.id] || DEFAULT_BUILDING_RENDER;
    const targetMap = shopPoint ? {
      mapX: shopPoint.mapX + render.offsetX,
      mapY: shopPoint.mapY + render.anchorOffsetY + 8,
    } : null;
    const path = targetMap ? this.planVisitorPath(V10_GATE_POINT, targetMap, shop.uid) : null;
    if (!path) {
      this.visitorSprites.delete(v.id);
      this.gs.data.visitors = this.gs.data.visitors.filter(visitor => visitor.id !== v.id);
      shop.queue = Math.max(0, shop.queue - 1);
      const debugRoute = c.getData('debugRoute') as Phaser.GameObjects.Graphics | undefined;
      debugRoute?.destroy();
      c.destroy();
      return;
    }
    v.walkTimer = this.visitorRouteDuration(path) / 1000 + 0.08;
    c.setData('returnPath', [path[0]]);
    this.walkVisitorPath(c, path, target.gx, target.gy, () => this.gs.economy.markVisitorArrived(v.id), true);
  }

  removeVisitorSprite(v: Visitor): void {
    const c = this.visitorSprites.get(v.id);
    if (!c) return;
    const finish = () => {
      this.visitorSprites.delete(v.id);
      const debugRoute = c.getData('debugRoute') as Phaser.GameObjects.Graphics | undefined;
      debugRoute?.destroy();
      c.destroy();
    };
    const gateGrid = this.gateGridPosition();
    const path = c.getData('returnPath') as V10MapPoint[] | undefined;
    if (!path) {
      this.tweens.killTweensOf(c);
      this.tweens.add({ targets: c, alpha: 0, duration: 240, onComplete: finish });
      return;
    }
    const current = this.fixedMapSourcePoint(c.x, c.y);
    const exitPath = [current, ...path.slice(1)];
    c.setData('debugTargetUid', null);
    c.setData('debugTargetName', '离场→山门');
    this.walkVisitorPath(c, exitPath, gateGrid.gx, gateGrid.gy, finish);
  }

  runVisitorDirectionCheck(): void {
    if (this.directionCheckRunning) return;
    this.directionCheckRunning = true;
    const variants: VisitorVariant[] = ['a', 'b', 'c', 'd'];
    let completed = 0;

    variants.forEach((variant, index) => {
      const startGX = 4 + index * 4;
      const startGY = 6;
      const start = this.toScreen(startGX, startGY);
      const c = this.add.container(start.x, start.y);
      const shadow = this.add.ellipse(0, 1, 14, 5, 0x1c120d, 0.3);
      const person = this.add.image(0, 2, 'character-visitor-' + variant)
        .setDisplaySize(18, 26)
        .setOrigin(0.5, 1);
      const label = this.add.text(0, -31, variant.toUpperCase(), {
        fontSize: '9px',
        color: '#fff6bd',
        fontFamily: FONT,
        backgroundColor: '#55361dcc',
        padding: { x: 3, y: 1 },
      }).setOrigin(0.5);
      c.add([shadow, person, label]);
      c.setData('person', person);
      c.setData('shadow', shadow);
      c.setData('variant', variant);
      c.setData('gridX', startGX);
      c.setData('gridY', startGY);
      this.entityLayer.add(c);

      const path = [
        { gx: startGX + 2, gy: startGY },
        { gx: startGX + 2, gy: startGY + 2 },
        { gx: startGX, gy: startGY + 2 },
        { gx: startGX, gy: startGY },
      ];
      const walkSegment = (pathIndex: number): void => {
        if (pathIndex >= path.length) {
          this.time.delayedCall(450, () => {
            c.destroy();
            completed++;
            if (completed === variants.length) this.directionCheckRunning = false;
          });
          return;
        }
        const next = path[pathIndex];
        const target = this.toScreen(next.gx, next.gy);
        this.walkTo(c, target.x, target.y, next.gx, next.gy, 480, () => walkSegment(pathIndex + 1));
      };
      walkSegment(0);
    });
    this.toast('人物朝向自查：右下 → 左下 → 左上 → 右上');
  }

  floatText(b: PlacedBuilding, text: string, color: number): void {
    const def = this.gs.buildingDef(b.defId);
    const s = this.buildingArtPosition(b.gx, b.gy, def.w, def.h);
    const t = this.add.text(s.x, s.y - 52, text, {
      fontSize: '11px', color: Phaser.Display.Color.IntegerToColor(color).rgba,
      fontStyle: 'bold', fontFamily: FONT, stroke: '#2b1d13', strokeThickness: 3,
    }).setOrigin(0.5);
    this.overlayLayer.add(t);
    this.floatTexts.push(t);
    this.tweens.add({ targets: t, y: t.y - 26, alpha: 0, duration: 1100, onComplete: () => t.destroy() });
  }

  toast(msg: string): void {
    const t = this.add.text(this.scale.width / 2, 72, msg, {
      fontSize: '14px', color: '#ffe2a3', fontFamily: FONT,
      backgroundColor: '#2b1d13ee', padding: { x: 10, y: 5 },
      stroke: '#2b1d13', strokeThickness: 2,
    }).setOrigin(0.5).setDepth(100);
    this.tweens.add({ targets: t, y: 40, alpha: 0, duration: 1600, onComplete: () => t.destroy() });
  }

  queueTitleBanner(titleName: string): void {
    this.titleBannerQueue.push(titleName);
    this.showNextTitleBanner();
  }

  showNextTitleBanner(): void {
    if (this.titleBannerShowing || this.titleBannerQueue.length === 0) return;
    this.showTitleBanner(this.titleBannerQueue.shift()!);
  }

  showTitleBanner(titleName: string): void {
    this.titleBannerShowing = true;
    const w = this.scale.width;
    const g = this.add.container(w / 2, this.scale.height * 0.3).setDepth(120);
    const bg = this.add.rectangle(0, 0, 420, 90, 0x2b241d, 0.9).setStrokeStyle(3, 0xffd76b, 1);
    const glow = this.add.rectangle(0, 0, 400, 70, 0xffd76b, 0.12);
    const txt = this.add.text(0, -8, '宗门晋号', { fontSize: '16px', color: '#ffe08a', fontFamily: FONT, fontStyle: 'bold' }).setOrigin(0.5);
    const name = this.add.text(0, 20, titleName, { fontSize: '26px', color: '#ffd76b', fontFamily: FONT, fontStyle: 'bold' }).setOrigin(0.5);
    g.add([bg, glow, txt, name]).setScale(0.6).setAlpha(0);
    this.tweens.add({ targets: g, scale: 1, alpha: 1, duration: 260, ease: 'Back.easeOut' });
    this.time.delayedCall(2200, () => {
      this.tweens.add({
        targets: g,
        alpha: 0,
        y: g.y - 30,
        duration: 400,
        onComplete: () => {
          g.destroy();
          this.titleBannerShowing = false;
          this.showNextTitleBanner();
        },
      });
    });
  }

  toggleTitlePanel(): void {
    if (this.titlePanelOpen) { this.closeTitlePanel(); return; }
    this.titlePanelOpen = true;
    const w = this.scale.width;
    const cur = this.gs.defs.titles[this.gs.titleIndex()];
    const next = this.gs.defs.titles[this.gs.titleIndex() + 1];
    const rows = next ? 1 + next.conds.length + (next.anyConds?.length || 0) + (next.anyConds?.length ? 1 : 0) : 0;
    const h = 150 + rows * 30;
    const g = this.add.container(w / 2, this.scale.height / 2).setDepth(110);
    const bg = this.add.rectangle(0, 0, 360, h, 0xfff0c9, 0.99).setStrokeStyle(2, 0xf08b3e);
    const curTxt = this.add.text(0, -h / 2 + 22, '当前称号：' + (cur ? cur.name : ''), { fontSize: '15px', color: '#b8860b', fontFamily: FONT, fontStyle: 'bold' }).setOrigin(0.5);
    g.add([bg, curTxt]);
    let y = -h / 2 + 52;
    if (next) {
      g.add(this.add.text(0, y, '下一称号：' + next.name + '（第' + next.minDay + '天起）', { fontSize: '13px', color: '#6a361c', fontFamily: FONT, fontStyle: 'bold' }).setOrigin(0.5));
      y += 28;
      const dayMet = this.gs.data.day >= next.minDay;
      g.add(this.add.text(-160, y, (dayMet ? '✓' : '✗') + ' 到达第' + next.minDay + '天（当前第' + this.gs.data.day + '天）', {
        fontSize: '12px',
        color: dayMet ? '#3f8d3c' : '#a0483c',
        fontFamily: FONT,
      }).setOrigin(0, 0.5));
      y += 30;
      for (const c of next.conds) {
        const met = this.gs.titleCondMet(c);
        const ok = met.ok;
        const mark = ok ? '✓' : '✗';
        const col = ok ? '#3f8d3c' : '#a0483c';
        g.add(this.add.text(-160, y, mark + ' ' + c.desc + '（' + met.cur + '/' + c.value + '）', { fontSize: '12px', color: col, fontFamily: FONT }).setOrigin(0, 0.5));
        y += 30;
      }
      if (next.anyConds?.length) {
        g.add(this.add.text(-160, y, '以下任意达成一项：', { fontSize: '12px', color: '#7a4b25', fontFamily: FONT, fontStyle: 'bold' }).setOrigin(0, 0.5));
        y += 30;
        for (const c of next.anyConds) {
          const met = this.gs.titleCondMet(c);
          const mark = met.ok ? '✓' : '✗';
          const col = met.ok ? '#3f8d3c' : '#a0483c';
          g.add(this.add.text(-160, y, mark + ' ' + c.desc + '（' + met.cur + '/' + c.value + '）', { fontSize: '12px', color: col, fontFamily: FONT }).setOrigin(0, 0.5));
          y += 30;
        }
      }
    } else {
      g.add(this.add.text(0, y, '已至最高称号', { fontSize: '13px', color: '#3f8d3c', fontFamily: FONT }).setOrigin(0.5));
    }
    const close = this.add.text(150, -h / 2 + 12, '✕', { fontSize: '16px', color: '#8a6b4d', fontFamily: FONT }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    close.on('pointerdown', () => this.closeTitlePanel());
    bg.on('pointerdown', (_p: any, _x: number, _y: number, ev: any) => ev.stopPropagation());
    g.add(close);
    this.titlePanel = g;
  }

  closeTitlePanel(): void {
    this.titlePanelOpen = false;
    if (this.titlePanel) { this.titlePanel.destroy(); this.titlePanel = undefined; }
  }

  // ---------- HUD ----------
  createHUD(): void {
    this.hudLayer = this.add.container(0, 0).setDepth(60);
    this.layoutHUD();
  }

  layoutHUD(): void {
    this.hudLayer.removeAll(true);
    const w = this.scale.width;
    const compact = w < 900;
    const margin = compact ? 8 : 18;
    const top = compact ? 8 : 16;
    const barHeight = this.topBarHeight();
    const panel = this.add.rectangle(margin, top, w - margin * 2, barHeight, 0xffefc1, 0.95)
      .setOrigin(0, 0)
      .setStrokeStyle(2, 0xf08b3e, 0.95)
      .setInteractive();
    panel.on('pointerdown', (_p: Phaser.Input.Pointer, _x: number, _y: number, ev: any) => ev.stopPropagation());
    this.hudLayer.add(panel);

    const brandWidth = compact ? 104 : 190;
    const timeWidth = compact ? 82 : 142;
    const systemWidth = compact ? 248 : 380;
    const brandRight = margin + brandWidth;
    const timeRight = brandRight + timeWidth;
    const systemLeft = w - margin - systemWidth;
    for (const x of [brandRight, timeRight, systemLeft]) {
      this.hudLayer.add(this.add.rectangle(x, top + 5, 1, barHeight - 10, 0xd69b55, 0.7));
    }

    const faction = this.gs.defs.factions.find((f: any) => f.id === this.gs.data.faction);
    const title = this.add.text(margin + 12, top + barHeight / 2 - (compact ? 0 : 8), faction?.name || '灵山宗门', {
      fontSize: compact ? '14px' : '19px',
      color: '#5a331d',
      fontFamily: FONT,
      fontStyle: 'bold',
    }).setOrigin(0, 0.5);
    this.hudLayer.add(title);
    if (!compact) {
      const curTitle = this.gs.defs.titles?.[this.gs.titleIndex()]?.name || '';
      const titleTxt = this.add.text(margin + 12, top + barHeight / 2 + 12, curTitle, {
        fontSize: '12px', color: '#b8860b', fontFamily: FONT, fontStyle: 'bold',
      }).setOrigin(0, 0.5).setInteractive({ useHandCursor: true });
      titleTxt.on('pointerdown', (_p: any, _x: number, _y: number, ev: any) => { ev.stopPropagation(); this.toggleTitlePanel(); });
      this.hudLayer.add(titleTxt);
    }

    this.timeText = this.add.text(brandRight + timeWidth / 2, top + barHeight / 2, '', {
      fontSize: compact ? '13px' : '17px',
      color: '#5a331d',
      align: 'center',
      fontFamily: FONT,
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.hudLayer.add(this.timeText);

    this.hud = this.add.text(timeRight + 12, top + barHeight / 2, '', {
      fontSize: compact ? '12px' : '13px',
      color: '#4a3523',
      fontFamily: FONT,
      wordWrap: { width: Math.max(100, systemLeft - timeRight - 24) },
    }).setOrigin(0, 0.5);
    this.hudLayer.add(this.hud);

    const systemButtons = [
      {
        label: this.gs.data.cunjinge.auction ? (compact ? '续拍' : '继续寸金阁') : '寸金阁',
        color: this.gs.data.cunjinge.auction || (this.gs.data.day >= 7 && (this.gs.data.day - 7) % 3 === 0) ? 0xb57a2e : 0x6f6758,
        run: () => {
          this.gs.save.save();
          const target = new URL('cunjinge/index.html', window.location.href);
          target.search = '';
          window.location.assign(target.toString());
        },
        cunjinge: true,
      },
      {
        label: compact ? '验收' : '验收工具',
        color: this.acceptanceToolsOpen ? 0xc67a2d : 0x8a623d,
        run: () => this.toggleAcceptanceTools(),
        acceptance: true,
      },
      {
        label: this.npcDebugEnabled ? (compact ? '关诊断' : '关闭诊断') : (compact ? '诊断' : 'NPC诊断'),
        color: this.npcDebugEnabled ? 0xc84335 : 0x704c35,
        run: () => this.toggleNPCDebug(),
        debug: true,
      },
      { label: '保存', color: 0x5fb95a, run: () => { this.gs.save.save(); this.toast('进度已保存'); } },
      { label: '重开', color: 0xe56d5f, run: () => { this.gs.save.clear(); this.scene.start('Menu'); } },
    ];
    const buttonGap = 5;
    const buttonWidth = (systemWidth - 18 - buttonGap * (systemButtons.length - 1)) / systemButtons.length;
    systemButtons.forEach((action, index) => {
      const x = systemLeft + 9 + buttonWidth / 2 + index * (buttonWidth + buttonGap);
      const btn = this.add.rectangle(x, top + barHeight / 2, buttonWidth, compact ? 28 : 34, action.color)
        .setStrokeStyle(1, 0xffffff, 0.72)
        .setInteractive({ useHandCursor: true });
      const text = this.add.text(x, top + barHeight / 2, action.label, {
        fontSize: compact ? '11px' : '12px',
        color: '#fffdf0',
        fontFamily: FONT,
        fontStyle: 'bold',
      }).setOrigin(0.5);
      btn.on('pointerdown', (_p: Phaser.Input.Pointer, _x: number, _y: number, ev: any) => {
        ev.stopPropagation();
        action.run();
      });
      if (action.debug) this.npcDebugButton = btn;
      if (action.acceptance) this.acceptanceToolsButton = btn;
      if (action.cunjinge) this.cunjingeButton = btn;
      this.hudLayer.add([btn, text]);
    });
  }

  toggleAcceptanceTools(): void {
    if (this.acceptanceToolsOpen) {
      this.closeAcceptanceTools();
      return;
    }
    this.acceptanceToolsOpen = true;
    this.renderAcceptanceTools();
    this.layoutHUD();
  }

  closeAcceptanceTools(): void {
    this.acceptanceToolsOpen = false;
    if (this.acceptanceToolsPanel) {
      this.acceptanceToolsPanel.destroy();
      this.acceptanceToolsPanel = undefined;
    }
    this.layoutHUD();
  }

  renderAcceptanceTools(): void {
    if (!this.acceptanceToolsOpen) return;
    if (!this.acceptanceToolsPanel) this.acceptanceToolsPanel = this.add.container(0, 0).setDepth(130);
    const panel = this.acceptanceToolsPanel;
    panel.removeAll(true);
    const screenW = this.scale.width;
    const screenH = this.scale.height;
    const width = Math.min(500, screenW - 20);
    const height = Math.min(370, screenH - 20);
    const left = (screenW - width) / 2;
    const top = (screenH - height) / 2;
    const blocker = this.add.rectangle(0, 0, screenW, screenH, 0x17120e, 0.58)
      .setOrigin(0, 0)
      .setInteractive();
    blocker.on('pointerdown', () => this.closeAcceptanceTools());
    const bg = this.add.rectangle(left, top, width, height, 0xffefc1, 0.99)
      .setOrigin(0, 0)
      .setStrokeStyle(2, 0xf08b3e, 0.98)
      .setInteractive();
    bg.on('pointerdown', (_p: Phaser.Input.Pointer, _x: number, _y: number, ev: any) => ev.stopPropagation());
    const title = this.add.text(left + 18, top + 20, '验收工具', {
      fontSize: '20px', color: '#5a331d', fontFamily: FONT, fontStyle: 'bold',
    }).setOrigin(0, 0.5);
    const note = this.add.text(left + 18, top + 49, '仅用于快速验收；每次操作会自动保存，不改变存档结构。', {
      fontSize: '12px', color: '#7a634b', fontFamily: FONT,
    }).setOrigin(0, 0.5);
    const close = this.add.text(left + width - 18, top + 20, '✕', {
      fontSize: '20px', color: '#7a4b25', fontFamily: FONT, fontStyle: 'bold',
    }).setOrigin(1, 0.5).setInteractive({ useHandCursor: true });
    close.on('pointerdown', () => this.closeAcceptanceTools());
    panel.add([blocker, bg, title, note, close]);

    const section = this.add.text(left + 18, top + 76, '资源补充', {
      fontSize: '13px', color: '#6a361c', fontFamily: FONT, fontStyle: 'bold',
    }).setOrigin(0, 0.5);
    panel.add(section);
    const gap = 10;
    const buttonWidth = (width - 46) / 2;
    const buttonHeight = 38;
    const addButton = (column: number, rowY: number, label: string, action: string, run: () => void, color = 0xb87932): void => {
      const x = left + 18 + buttonWidth / 2 + column * (buttonWidth + gap);
      const button = this.add.rectangle(x, rowY, buttonWidth, buttonHeight, color, 0.98)
        .setStrokeStyle(1, 0xffffff, 0.72)
        .setInteractive({ useHandCursor: true })
        .setData('acceptanceAction', action);
      const text = this.add.text(x, rowY, label, {
        fontSize: screenW < 900 ? '12px' : '13px', color: '#fffdf0', fontFamily: FONT, fontStyle: 'bold',
      }).setOrigin(0.5);
      button.on('pointerdown', (_p: Phaser.Input.Pointer, _x: number, _y: number, ev: any) => {
        ev.stopPropagation();
        run();
      });
      panel.add([button, text]);
    };
    const firstRow = top + 108;
    addButton(0, firstRow, '+50000 灵石', 'spirit', () => this.grantAcceptanceResource('spirit'));
    addButton(1, firstRow, '+1000 声望', 'reputation', () => this.grantAcceptanceResource('reputation'));
    addButton(0, firstRow + 46, '+200 药草', 'herbs', () => this.grantAcceptanceResource('herbs'));
    addButton(1, firstRow + 46, '+200 灵矿', 'spiritOre', () => this.grantAcceptanceResource('spiritOre'));
    addButton(0, firstRow + 92, '各类丹药 +50', 'pills', () => this.grantAcceptanceResource('pills'));
    addButton(1, firstRow + 92, '+50 青锋剑', 'azureEdgeSwords', () => this.grantAcceptanceResource('azureEdgeSwords'));

    const visitorHeaderY = firstRow + 126;
    panel.add(this.add.text(left + 18, visitorHeaderY, '访客测试', {
      fontSize: '13px', color: '#6a361c', fontFamily: FONT, fontStyle: 'bold',
    }).setOrigin(0, 0.5));
    addButton(0, visitorHeaderY + 32, '立即召来1名访客', 'spawnVisitor', () => this.spawnAcceptanceVisitor(), 0x4f8a63);
    addButton(1, visitorHeaderY + 32, '清理当前访客', 'clearVisitors', () => this.clearAcceptanceVisitors(), 0x9b654d);
    addButton(0, visitorHeaderY + 78, '推进1天', 'advanceDay', () => this.advanceAcceptanceDay(), 0x4f7792);
    const diagnosisLabel = this.npcDebugEnabled ? '关闭NPC路线诊断' : '开启NPC路线诊断';
    const diagnosisX = left + 18 + buttonWidth / 2 + buttonWidth + gap;
    const diagnosisY = visitorHeaderY + 78;
    const diagnosis = this.add.rectangle(diagnosisX, diagnosisY, buttonWidth, buttonHeight, this.npcDebugEnabled ? 0xc84335 : 0x704c35, 0.98)
      .setStrokeStyle(1, 0xffffff, 0.72)
      .setInteractive({ useHandCursor: true })
      .setData('acceptanceAction', 'npcDebug');
    const diagnosisText = this.add.text(diagnosisX, diagnosisY, diagnosisLabel, {
      fontSize: '12px', color: '#fffdf0', fontFamily: FONT, fontStyle: 'bold',
    }).setOrigin(0.5);
    diagnosis.on('pointerdown', (_p: Phaser.Input.Pointer, _x: number, _y: number, ev: any) => {
      ev.stopPropagation();
      this.toggleNPCDebug();
      this.renderAcceptanceTools();
    });
    panel.add([diagnosis, diagnosisText]);
  }

  advanceAcceptanceDay(): void {
    const previousDay = this.gs.data.day;
    this.gs.economy.debugAdvanceDay();
    this.gs.save.save();
    this.toast('已从第' + previousDay + '天推进到第' + this.gs.data.day + '天');
  }

  grantAcceptanceResource(kind: 'spirit' | 'reputation' | 'herbs' | 'spiritOre' | 'pills' | 'azureEdgeSwords'): void {
    const d = this.gs.data;
    let message = '';
    if (kind === 'spirit') { d.spirit += 50000; message = '已补充50000灵石'; }
    if (kind === 'reputation') { d.reputation = Math.min(999, d.reputation + 1000); message = '声望已补充至' + d.reputation; }
    if (kind === 'herbs') { d.herbs += 200; message = '已补充200药草'; }
    if (kind === 'spiritOre') { d.spiritOre += 200; message = '已补充200灵矿'; }
    if (kind === 'pills') {
      for (const recipeId of d.unlockedRecipes) d.pills[recipeId] = (d.pills[recipeId] || 0) + 50;
      message = '已为每种已解锁丹药补充50枚';
    }
    if (kind === 'azureEdgeSwords') { d.azureEdgeSwords += 50; message = '已补充50柄青锋剑'; }
    this.gs.save.save();
    this.toast(message);
  }

  spawnAcceptanceVisitor(): void {
    if (this.gs.economy.sellBuildings().length === 0) {
      this.toast('暂无丹药铺或法器铺，请先建造商铺');
      return;
    }
    const spawned = this.gs.economy.debugSpawnVisitor();
    if (!spawned) {
      this.toast('所有商铺入口均不可达，请调整紧贴商铺的建筑后重试');
      return;
    }
    this.gs.save.save();
    this.toast('已从山门召来1名访客');
  }

  clearAcceptanceVisitors(): void {
    this.purgeVisitorVisuals();
    this.gs.data.visitors = [];
    for (const shop of this.gs.economy.sellBuildings()) shop.queue = 0;
    this.gs.save.save();
    this.toast('当前访客与商铺队列已清理');
  }

  createEventFeed(): void {
    this.eventFeed = this.add.container(0, 0).setDepth(61);
    const onGameEvent = (): void => {
      this.renderEventFeed();
      if (this.eventHistoryOpen) this.renderEventHistory();
      const last = this.gs.data.eventLog[this.gs.data.eventLog.length - 1];
      if (last && last.type === 'title-up') {
        const current = this.gs.defs.titles[this.gs.titleIndex()];
        this.queueTitleBanner(current?.name || last.title);
        this.layoutHUD();
        if (this.titlePanelOpen) {
          this.closeTitlePanel();
          this.toggleTitlePanel();
        }
      } else {
        this.advanceTitlesNow();
      }
    };
    this.gs.events.on('game-event', onGameEvent);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.gs.events.off('game-event', onGameEvent));
    this.renderEventFeed();
  }

  renderEventFeed(): void {
    if (!this.eventFeed) return;
    this.eventFeed.removeAll(true);
    const compact = this.scale.width < 900;
    this.eventFeed.setVisible(true);
    const { x, y, width, height } = this.eventFeedBounds();
    const entries = this.gs.data.eventLog.slice(-(compact || this.eventFeedCollapsed ? 1 : 3)).reverse();
    this.eventFeed.setPosition(x, y);
    const bg = this.add.rectangle(0, 0, width, height, 0xffefc1, 0.94)
      .setOrigin(0, 0)
      .setStrokeStyle(2, 0x8c5a2b, 0.85)
      .setInteractive();
    bg.on('pointerdown', (_p: Phaser.Input.Pointer, _x: number, _y: number, ev: any) => ev.stopPropagation());
    const title = this.add.text(12, compact || this.eventFeedCollapsed ? height / 2 : 16, '宗门近况', {
      fontSize: compact ? '11px' : '13px', color: '#6a361c', fontFamily: FONT, fontStyle: 'bold',
    }).setOrigin(0, 0.5);
    const toggle = this.add.text(width - (compact ? 10 : 58), compact || this.eventFeedCollapsed ? height / 2 : 16, this.eventFeedCollapsed ? '展开' : '收起', {
      fontSize: '11px', color: '#7a4b25', fontFamily: FONT, fontStyle: 'bold',
    }).setOrigin(1, 0).setInteractive({ useHandCursor: true });
    toggle.setOrigin(1, 0.5);
    toggle.on('pointerdown', (_p: Phaser.Input.Pointer, _x: number, _y: number, ev: any) => {
      ev.stopPropagation();
      this.eventFeedCollapsed = !this.eventFeedCollapsed;
      this.renderEventFeed();
    });
    this.eventFeed.add([bg, title, toggle]);

    if (!compact && !this.eventFeedCollapsed) {
      const all = this.add.text(width - 10, 16, '全部', {
        fontSize: '11px', color: '#7a4b25', fontFamily: FONT, fontStyle: 'bold',
      }).setOrigin(1, 0.5).setInteractive({ useHandCursor: true });
      all.on('pointerdown', (_p: Phaser.Input.Pointer, _x: number, _y: number, ev: any) => {
        ev.stopPropagation();
        this.toggleEventHistory();
      });
      this.eventFeed.add(all);
    }

    if (entries.length === 0) {
      const empty = this.add.text(compact || this.eventFeedCollapsed ? 82 : 12, compact || this.eventFeedCollapsed ? height / 2 : 49, '暂无新事件', {
        fontSize: '11px', color: '#8a765e', fontFamily: FONT,
      }).setOrigin(0, 0.5);
      this.eventFeed.add(empty);
      return;
    }
    if (compact || this.eventFeedCollapsed) {
      const entry = entries[0];
      const latest = this.add.text(compact ? 82 : 88, height / 2, entry.title, {
        fontSize: '11px', color: '#5b4833', fontFamily: FONT,
        wordWrap: { width: Math.max(80, width - (compact ? 158 : 160)), useAdvancedWrap: true },
      }).setOrigin(0, 0.5).setMaxLines(1)
        .setFixedSize(Math.max(80, width - (compact ? 158 : 160)), 18);
      this.eventFeed.add(latest);
      return;
    }
    entries.forEach((entry, index) => {
      const rowY = 39 + index * 42;
      const marker = this.add.circle(15, rowY + 4, 3, index === 0 ? 0x67a451 : 0xc19555, 0.95);
      const head = this.add.text(24, rowY, entry.title, {
        fontSize: '11px', color: index === 0 ? '#5d3a22' : '#72563f', fontFamily: FONT, fontStyle: 'bold',
        wordWrap: { width: width - 42, useAdvancedWrap: true },
      }).setMaxLines(1).setFixedSize(width - 38, 14);
      const detail = this.add.text(24, rowY + 14, entry.detail, {
        fontSize: '10px', color: '#7d6a54', fontFamily: FONT,
        wordWrap: { width: width - 42, useAdvancedWrap: true },
      }).setMaxLines(2).setFixedSize(width - 38, 26);
      this.eventFeed.add([marker, head, detail]);
    });
  }

  eventFeedBounds(): { x: number; y: number; width: number; height: number } {
    const compact = this.scale.width < 900;
    const top = compact ? 10 : 16;
    const margin = compact ? 8 : 18;
    return {
      x: margin,
      y: top + this.topBarHeight() + (compact ? 6 : 12),
      width: compact ? Math.min(300, this.scale.width - margin * 2) : 300,
      height: compact || this.eventFeedCollapsed ? 34 : 166,
    };
  }

  toggleEventHistory(): void {
    if (this.eventHistoryOpen) { this.closeEventHistory(); return; }
    this.eventHistoryOpen = true;
    this.eventHistoryPage = 0;
    this.renderEventHistory();
  }

  closeEventHistory(): void {
    this.eventHistoryOpen = false;
    if (this.eventHistoryPanel) {
      this.eventHistoryPanel.destroy();
      this.eventHistoryPanel = undefined;
    }
  }

  renderEventHistory(): void {
    if (!this.eventHistoryOpen) return;
    if (!this.eventHistoryPanel) this.eventHistoryPanel = this.add.container(0, 0).setDepth(115);
    this.eventHistoryPanel.removeAll(true);
    const width = Math.min(700, this.scale.width - 40);
    const height = Math.min(620, this.scale.height - 60);
    const rowHeight = 46;
    const pageSize = Math.max(5, Math.floor((height - 112) / rowHeight));
    const events = [...this.gs.data.eventLog].reverse();
    const pageCount = Math.max(1, Math.ceil(events.length / pageSize));
    this.eventHistoryPage = Phaser.Math.Clamp(this.eventHistoryPage, 0, pageCount - 1);
    const entries = events.slice(this.eventHistoryPage * pageSize, (this.eventHistoryPage + 1) * pageSize);
    const g = this.eventHistoryPanel;
    g.setPosition(this.scale.width / 2, this.scale.height / 2);
    const bg = this.add.rectangle(0, 0, width, height, 0x2b241d, 0.98)
      .setStrokeStyle(2, 0xf0b45b, 0.9)
      .setInteractive();
    bg.on('pointerdown', (_p: Phaser.Input.Pointer, _x: number, _y: number, ev: any) => ev.stopPropagation());
    const title = this.add.text(-width / 2 + 20, -height / 2 + 18, '宗门编年史', {
      fontSize: '19px', color: '#ffe08a', fontFamily: FONT, fontStyle: 'bold',
    }).setOrigin(0, 0.5);
    const close = this.add.text(width / 2 - 18, -height / 2 + 18, '✕', {
      fontSize: '18px', color: '#fff1cf', fontFamily: FONT,
    }).setOrigin(1, 0.5).setInteractive({ useHandCursor: true });
    close.on('pointerdown', () => this.closeEventHistory());
    g.add([bg, title, close]);
    if (entries.length === 0) {
      g.add(this.add.text(0, 0, '尚无事件记录', { fontSize: '14px', color: '#b9aa90', fontFamily: FONT }).setOrigin(0.5));
    } else {
      entries.forEach((entry, index) => {
        const rowY = -height / 2 + 50 + index * rowHeight;
        const row = this.add.rectangle(-width / 2 + 14, rowY, width - 28, rowHeight - 4, 0x41372d, 0.88)
          .setOrigin(0, 0)
          .setStrokeStyle(1, 0x8d7353, 0.4);
        const head = this.add.text(-width / 2 + 28, rowY + 6, '第' + entry.day + '天 ' + entry.time + '  ·  ' + entry.title, {
          fontSize: '12px', color: entry.color, fontFamily: FONT, fontStyle: 'bold',
        });
        const detail = this.add.text(-width / 2 + 28, rowY + 23, entry.detail, {
          fontSize: '12px', color: '#fff1cf', fontFamily: FONT,
          wordWrap: { width: width - 70 },
        });
        g.add([row, head, detail]);
      });
    }
    const footerY = height / 2 - 20;
    const page = this.add.text(0, footerY, '第 ' + (this.eventHistoryPage + 1) + '/' + pageCount + ' 页 · 共 ' + events.length + ' 条', {
      fontSize: '12px', color: '#cdbd9d', fontFamily: FONT,
    }).setOrigin(0.5);
    g.add(page);
    if (this.eventHistoryPage > 0) {
      const newer = this.add.text(-width / 2 + 22, footerY, '‹ 较新', {
        fontSize: '13px', color: '#ffd36b', fontFamily: FONT, fontStyle: 'bold',
      }).setOrigin(0, 0.5).setInteractive({ useHandCursor: true });
      newer.on('pointerdown', () => { this.eventHistoryPage--; this.renderEventHistory(); });
      g.add(newer);
    }
    if (this.eventHistoryPage < pageCount - 1) {
      const older = this.add.text(width / 2 - 22, footerY, '更早 ›', {
        fontSize: '13px', color: '#ffd36b', fontFamily: FONT, fontStyle: 'bold',
      }).setOrigin(1, 0.5).setInteractive({ useHandCursor: true });
      older.on('pointerdown', () => { this.eventHistoryPage++; this.renderEventHistory(); });
      g.add(older);
    }
  }

  createBuildMenu(): void {
    this.buildMenu = this.add.container(0, 0).setDepth(60);
    this.layoutUI();
  }

  layoutUI(): void {
    this.buildMenu.removeAll(true);
    const w = this.scale.width, h = this.scale.height;
    const defs = this.gs.defs.buildings.filter(def => def.type !== 'decor');
    const allDecorDefs = this.gs.defs.buildings.filter(def => def.type === 'decor');
    const decorDefs = allDecorDefs.filter(def => (def.unlockExpansion || 0) <= this.visibleMapStage());
    const compact = w < 900;
    const menuHeight = this.buildMenuHeight();
    const buttonW = compact ? 50 : 60;
    const buttonH = compact ? 52 : 64;
    const gap = compact ? 4 : 5;
    const actions = [
      { label: '招募', icon: 'ui-recruit', color: 0x5fb95a, run: () => this.toggleRecruit() },
      { label: '长老', icon: 'ui-elder', color: 0xf1a24b, run: () => this.toggleElder() },
      { label: '扩张', icon: 'ui-expand', color: 0x6fcf75, run: () => this.tryExpand() },
      { label: '研发', icon: 'ui-research', color: 0x59aee8, run: () => this.toggleResearch() },
      { label: '委托', glyph: '令', color: 0xc895d9, run: () => this.toggleCommission() },
    ];
    const speeds = [
      { label: '暂停', icon: 'ui-pause', value: 0 },
      { label: '1X', icon: 'ui-speed-1x', value: 1 },
      { label: '2X', icon: 'ui-speed-2x', value: 2 },
    ];
    const totalButtons = defs.length + actions.length + speeds.length;
    const totalW = compact
      ? Math.max(defs.length * buttonW + (defs.length - 1) * gap, (actions.length + speeds.length) * buttonW + (actions.length + speeds.length - 1) * gap)
      : totalButtons * buttonW + (totalButtons - 1) * gap;
    this.buildMenu.setPosition(w / 2, h - 12);
    const toggleExtension = buttonW + gap;
    const bar = this.add.rectangle(toggleExtension / 2, -menuHeight / 2, totalW + toggleExtension + 20, menuHeight - 4, 0xffefc1, 0.96)
      .setStrokeStyle(2, 0xf08b3e, 0.95)
      .setInteractive();
    bar.on('pointerdown', (_p: Phaser.Input.Pointer, _x: number, _y: number, ev: any) => ev.stopPropagation());
    this.buildMenu.add(bar);

    const addButton = (
      x: number,
      y: number,
      label: string,
      color: number,
      run: (pointer: Phaser.Input.Pointer) => void,
      dataKey?: { key: string; value: string | number },
      iconKey?: string,
      glyph?: string,
    ): Phaser.GameObjects.Rectangle => {
      const btn = this.add.rectangle(x, y, buttonW, buttonH, color, 0.98)
        .setStrokeStyle(1, 0xe29a3a)
        .setInteractive({ useHandCursor: true });
      if (dataKey) btn.setData(dataKey.key, dataKey.value);
      const text = this.add.text(x, y + buttonH / 2 - 9, label, {
        fontSize: '12px',
        color: '#5a331d',
        fontFamily: FONT,
        fontStyle: 'bold',
      }).setOrigin(0.5);
      btn.on('pointerdown', (pointer: Phaser.Input.Pointer, _x: number, _y: number, ev: any) => {
        ev.stopPropagation();
        run(pointer);
      });
      this.buildMenu.add(btn);
      if (iconKey) {
        this.buildMenu.add(this.add.image(x, y - 8, iconKey)
          .setDisplaySize(compact ? 24 : 28, compact ? 24 : 28));
      } else if (glyph) {
        this.buildMenu.add(this.add.text(x, y - 9, glyph, {
          fontSize: compact ? '21px' : '25px',
          color: '#fff4c7',
          fontFamily: FONT,
          fontStyle: 'bold',
          stroke: '#6b3f28',
          strokeThickness: 2,
        }).setOrigin(0.5));
      }
      this.buildMenu.add(text);
      return btn;
    };

    const firstRowY = compact ? -menuHeight + 31 : -menuHeight / 2;
    const secondRowY = -30;
    const buildingStartX = compact
      ? -(defs.length * buttonW + (defs.length - 1) * gap) / 2 + buttonW / 2
      : -totalW / 2 + buttonW / 2;
    defs.forEach((def, i) => {
      const bx = buildingStartX + i * (buttonW + gap);
      addButton(bx, firstRowY, def.name, 0xffcf68, pointer => {
        this.beginBuildPointer(def.id, pointer);
      }, { key: 'defId', value: def.id });
      const icon = this.add.image(bx, firstRowY - 8, 'building-' + def.id)
        .setDisplaySize(compact ? 30 : 38, compact ? 27 : 34);
      const cost = this.add.text(bx, firstRowY + buttonH / 2 - 20, String(def.cost), {
        fontSize: '11px', color: '#7b241c', fontFamily: FONT, fontStyle: 'bold',
        stroke: '#fff1bd', strokeThickness: 2,
      }).setOrigin(0.5);
      this.buildMenu.add([icon, cost]);
    });

    const controls = [
      ...actions.map(action => ({
        label: action.label,
        color: action.color,
        run: action.run,
        data: { key: 'action', value: action.label },
        icon: action.icon,
        glyph: action.glyph,
      })),
      ...speeds.map(speed => ({
        label: speed.label,
        color: speed.value === 0 ? 0xe0a14a : 0x8fc96b,
        run: () => this.setGameSpeed(speed.value),
        data: { key: 'speed', value: speed.value },
        icon: speed.icon,
        glyph: undefined,
      })),
    ];
    const controlsStartX = compact
      ? -(controls.length * buttonW + (controls.length - 1) * gap) / 2 + buttonW / 2
      : buildingStartX + defs.length * (buttonW + gap);
    controls.forEach((control, index) => {
      addButton(
        controlsStartX + index * (buttonW + gap),
        compact ? secondRowY : firstRowY,
        control.label,
        control.color,
        control.run,
        control.data,
        control.icon,
        control.glyph,
      );
    });
    const decorToggleX = totalW / 2 + gap + buttonW / 2;
    addButton(
      decorToggleX,
      compact ? secondRowY : firstRowY,
      '装饰',
      this.decorMenuOpen ? 0xf3b85f : 0xd9b37a,
      () => {
        this.decorMenuOpen = !this.decorMenuOpen;
        this.layoutUI();
      },
      { key: 'action', value: '装饰' },
      undefined,
      '景',
    );
    if (this.decorMenuOpen) {
      const decorColumns = Math.min(8, decorDefs.length);
      const decorRows = Math.ceil(decorDefs.length / decorColumns);
      const paletteW = decorColumns * buttonW + (decorColumns - 1) * gap;
      const paletteHeaderH = 18;
      const paletteH = decorRows * buttonH + (decorRows - 1) * gap + paletteHeaderH;
      const paletteBottomY = firstRowY - buttonH / 2 - gap - 8;
      const paletteCenterY = paletteBottomY - paletteH / 2;
      const palette = this.add.rectangle(0, paletteCenterY, paletteW + 16, paletteH + 12, 0xffefc1, 0.98)
        .setStrokeStyle(2, 0xd8993a, 0.95)
        .setInteractive();
      palette.on('pointerdown', (_p: Phaser.Input.Pointer, _x: number, _y: number, ev: any) => ev.stopPropagation());
      this.buildMenu.add(palette);
      const nextHint = decorDefs.length < allDecorDefs.length ? ' · 扩建后开放更多' : ' · 已全部开放';
      const paletteTitle = this.add.text(0, paletteCenterY - paletteH / 2 + 10, '装饰 ' + decorDefs.length + '/' + allDecorDefs.length + nextHint, {
        fontSize: compact ? '10px' : '11px', color: '#6a4b2a', fontFamily: FONT, fontStyle: 'bold',
      }).setOrigin(0.5);
      this.buildMenu.add(paletteTitle);
      const paletteStartX = -paletteW / 2 + buttonW / 2;
      decorDefs.forEach((def, index) => {
        const column = index % decorColumns;
        const row = Math.floor(index / decorColumns);
        const bx = paletteStartX + column * (buttonW + gap);
        const by = paletteBottomY - buttonH / 2 - row * (buttonH + gap);
        addButton(bx, by, def.name, 0xcde0a1, pointer => {
          this.beginBuildPointer(def.id, pointer);
        }, { key: 'defId', value: def.id });
        const icon = this.add.image(bx, by - 8, 'building-' + def.id)
          .setDisplaySize(compact ? 30 : 38, compact ? 27 : 34);
        const cost = this.add.text(bx, by + buttonH / 2 - 20, String(def.cost), {
          fontSize: '11px', color: '#7b241c', fontFamily: FONT, fontStyle: 'bold',
          stroke: '#fff1bd', strokeThickness: 2,
        }).setOrigin(0.5);
        this.buildMenu.add([icon, cost]);
      });
    }
    this.refreshBuildMenu();
    if (this.infoPanel) this.layoutInfoPanel();
    if (this.researchPanel) this.researchPanel.setPosition(w / 2, h / 2);
    if (this.elderPanel) this.elderPanel.setPosition(w / 2, h / 2);
    if (this.recruitPanel) this.recruitPanel.setPosition(w / 2, h / 2);
    if (this.commissionPanel) this.commissionPanel.setPosition(w / 2, h / 2);
  }

  refreshBuildMenu(): void {
    for (const child of this.buildMenu.list) {
      if (child instanceof Phaser.GameObjects.Rectangle && child.getData('defId')) {
        const active = child.getData('defId') === this.selectedBuild;
        child.setFillStyle(active ? 0xff9f43 : 0xffcf68, 0.98);
        child.setStrokeStyle(active ? 3 : 1, active ? 0xe85d2a : 0xe99332);
      } else if (child instanceof Phaser.GameObjects.Rectangle && child.getData('speed') !== undefined) {
        const active = child.getData('speed') === this.gameSpeed;
        child.setFillStyle(active ? 0xffd65a : (child.getData('speed') === 0 ? 0xe0a14a : 0x8fc96b), 0.98);
        child.setStrokeStyle(active ? 3 : 1, active ? 0xfff3a2 : 0xe29a3a);
      }
    }
  }

  setGameSpeed(speed: number): void {
    this.gameSpeed = speed;
    this.time.timeScale = speed;
    this.tweens.timeScale = speed;
    this.refreshBuildMenu();
  }

  createInfoPanel(): void {
    this.infoPanel = this.add.container(0, 0).setDepth(70);
    this.layoutInfoPanel();
  }

  layoutInfoPanel(): void {
    if (!this.infoPanel) return;
    const panelHeight = this.infoPanel.getData('panelHeight') || 300;
    const top = (this.scale.width < 900 ? 10 : 16) + this.topBarHeight() + 18;
    const availableHeight = Math.max(180, this.scale.height - top - this.buildMenuHeight() - 30);
    const scale = Math.min(1, availableHeight / panelHeight);
    this.infoPanel.setScale(scale);
    this.infoPanel.setPosition(this.scale.width - 360 * scale - 18, top);
  }

  selectBuilding(b: PlacedBuilding | null): void {
    this.selectedBuilding = b;
    this.infoPanel.removeAll(true);
    this.infoPanel.setData('panelHeight', 300);
    if (!b) return;
    const def = this.gs.buildingDef(b.defId);
    const isDecoration = def.type === 'decor';
    const panelWidth = 360;
    const contentWidth = 340;
    const columnWidth = 166;
    const columnGap = 8;
    const bg = this.add.rectangle(0, 0, panelWidth, 300, 0xfff0c9, 0.98)
      .setStrokeStyle(2, 0xf08b3e, 0.95)
      .setOrigin(0, 0)
      .setInteractive();
    bg.on('pointerdown', (_p: Phaser.Input.Pointer, _x: number, _y: number, ev: any) => ev.stopPropagation());
    const title = this.add.text(10, 8, def.name + (isDecoration ? '' : ' Lv' + (b.level || 1)), {
      fontSize: '16px', color: '#6a361c', fontFamily: FONT, fontStyle: 'bold',
    });
    const desc = this.add.text(10, 31, def.desc, {
      fontSize: '12px', color: '#5b4833', fontFamily: FONT, wordWrap: { width: contentWidth },
    });
    const speed = this.add.text(10, 54, '效率 x' + this.gs.speedOf(b).toFixed(2), {
      fontSize: '12px', color: '#26776a', fontFamily: FONT,
    });
    const combo = this.add.text(10, 72, b.comboBonus > 0 ? '相性加成 +' + Math.round(b.comboBonus * 100) + '%' : '无相性', {
      fontSize: '12px', color: b.comboBonus > 0 ? '#3f8d3c' : '#8a6b4d', fontFamily: FONT,
    });
    speed.setVisible(!isDecoration);
    combo.setVisible(!isDecoration);
    this.infoPanel.add([bg, title, desc, speed, combo]);

    let y = isDecoration ? 60 : 94;
    const addSectionHeader = (label: string): void => {
      const band = this.add.rectangle(10, y, contentWidth, 18, 0xf3d69b, 0.88)
        .setStrokeStyle(1, 0xd9a04d, 0.45)
        .setOrigin(0, 0);
      const text = this.add.text(18, y + 9, label, {
        fontSize: '12px', color: '#7a4b25', fontFamily: FONT, fontStyle: 'bold',
      }).setOrigin(0, 0.5);
      this.infoPanel.add([band, text]);
      y += 23;
    };
    // 炼丹房：选择生产丹方
    if (def.type === 'craft' && def.id === 'danfang') {
      addSectionHeader('炼丹房生产');
      const currentRecipe = b.craftRecipe ? this.gs.recipeDef(b.craftRecipe) : null;
      const currentLabel = currentRecipe ? currentRecipe.name : '自动（最贵）';
      const currentDetail = currentRecipe
        ? '生产：' + currentLabel + '　耗药草' + currentRecipe.input + '　库存' + (this.gs.data.pills[currentRecipe.id] || 0)
        : '生产：' + currentLabel;
      const lbl = this.add.text(10, y + 2, currentDetail, {
        fontSize: '12px', color: '#8d4d20', fontFamily: FONT,
      });
      this.infoPanel.add(lbl);
      y += 22;
      const opts: (string | null)[] = [null, ...this.gs.data.unlockedRecipes];
      opts.forEach((rid, index) => {
        const recipe = rid === null ? null : this.gs.recipeDef(rid);
        const name = recipe ? recipe.name : '自动';
        const active = b.craftRecipe === rid;
        const detail = recipe ? ' -' + recipe.input + '草 库' + (this.gs.data.pills[rid!] || 0) : '';
        const col = index % 2;
        const row = Math.floor(index / 2);
        const bx = 10 + col * (columnWidth + columnGap);
        const by = y + row * 23;
        const btn = this.add.rectangle(bx, by, columnWidth, 20, active ? 0x9bd26a : 0xffd77b)
          .setStrokeStyle(1, active ? 0x5e9e4b : 0xd99a39)
          .setOrigin(0, 0)
          .setInteractive({ useHandCursor: true });
        const txt = this.add.text(bx + 5, by + 10, (active ? '● ' : '○ ') + name + detail, {
          fontSize: '11px', color: active ? '#28582c' : '#70421f', fontFamily: FONT,
        }).setOrigin(0, 0.5);
        btn.on('pointerdown', (_p: Phaser.Input.Pointer, _x: number, _y: number, ev: any) => {
          ev.stopPropagation();
          b.craftRecipe = rid;
          b.progress = 0;
          this.selectBuilding(b);
          this.gs.save.save();
        });
        this.infoPanel.add([btn, txt]);
      });
      y += Math.ceil(opts.length / 2) * 23;
      y += 6;
    }
    // 丹药铺：选择售卖丹方
    if (def.type === 'sell' && def.id === 'danpu') {
      addSectionHeader('丹药铺经营');
      const cur = b.sellRecipe ? this.gs.recipeDef(b.sellRecipe).name : '自动（最贵）';
      const lbl = this.add.text(10, y + 2, '售卖：' + cur, {
        fontSize: '12px', color: '#8d4d20', fontFamily: FONT,
      });
      this.infoPanel.add(lbl);
      y += 22;
      const opts: (string | null)[] = [null, ...this.gs.data.unlockedRecipes];
      opts.forEach((rid, index) => {
        const name = rid === null ? '自动' : this.gs.recipeDef(rid).name;
        const active = b.sellRecipe === rid;
        const stock = rid === null ? '' : ' x' + (this.gs.data.pills[rid] || 0);
        const col = index % 2;
        const row = Math.floor(index / 2);
        const bx = 10 + col * (columnWidth + columnGap);
        const by = y + row * 23;
        const btn = this.add.rectangle(bx, by, columnWidth, 20, active ? 0x9bd26a : 0xffd77b)
          .setStrokeStyle(1, active ? 0x5e9e4b : 0xd99a39)
          .setOrigin(0, 0)
          .setInteractive({ useHandCursor: true });
        const txt = this.add.text(bx + 5, by + 10, (active ? '● ' : '○ ') + name + stock, {
          fontSize: '12px', color: active ? '#28582c' : '#70421f', fontFamily: FONT,
        }).setOrigin(0, 0.5);
        btn.on('pointerdown', (_p: Phaser.Input.Pointer, _x: number, _y: number, ev: any) => {
          ev.stopPropagation();
          b.sellRecipe = rid;
          this.selectBuilding(b);
          this.gs.save.save();
        });
        this.infoPanel.add([btn, txt]);
      });
      y += Math.ceil(opts.length / 2) * 23;
      y += 6;
    }
    if (def.id === 'lingkuang') {
      addSectionHeader('灵矿开采');
      const stock = this.add.text(10, y + 2, '库存：' + this.gs.data.spiritOre + ' 灵矿石　·　8秒/块', {
        fontSize: '12px', color: '#26776a', fontFamily: FONT,
      });
      this.infoPanel.add(stock);
      y += 26;
    } else if (def.id === 'lianqi') {
      addSectionHeader('炼器生产');
      const stock = this.add.text(10, y + 2, '3灵矿石 → 1青锋剑　库存：' + this.gs.data.azureEdgeSwords, {
        fontSize: '12px', color: '#26776a', fontFamily: FONT,
      });
      this.infoPanel.add(stock);
      y += 26;
    } else if (def.id === 'faqipu') {
      addSectionHeader('法器铺经营');
      const stock = this.add.text(10, y + 2, '青锋剑：' + this.gs.data.azureEdgeSwords + '　售价：' + this.gs.artifactSellPrice() + '灵石', {
        fontSize: '12px', color: '#26776a', fontFamily: FONT,
      });
      this.infoPanel.add(stock);
      y += 26;
    }
    if (def.type === 'train') {
      addSectionHeader('练功房容量');
      const capacity = this.gs.trainingCapacity(b);
      const waiting = Math.max(0, b.assigned.length - capacity);
      const capacityText = this.add.text(10, y + 2, '同时培养：' + Math.min(b.assigned.length, capacity) + '/' + capacity + (waiting > 0 ? '　等待空位：' + waiting + '人' : ''), {
        fontSize: '12px', color: waiting > 0 ? '#a05b32' : '#26776a', fontFamily: FONT,
      });
      this.infoPanel.add(capacityText);
      y += 26;
    }
    // 装饰物没有升级；生产建筑沿用原设施成长规则。
    if (!isDecoration) {
      addSectionHeader('设施成长');
      const next = this.gs.nextUpgrade(b);
      if (next) {
        const affordable = this.gs.data.spirit >= next.cost;
        const upBtn = this.add.rectangle(10, y, contentWidth, 26, affordable ? 0x79cbd5 : 0xe2d3b7)
          .setStrokeStyle(1, affordable ? 0x3b91a0 : 0xb9a789)
          .setOrigin(0, 0)
          .setInteractive({ useHandCursor: true });
        let upDesc = '升级 Lv' + ((b.level || 1) + 1) + '（' + next.cost + '灵石）';
        if (next.speed) upDesc += ' 速度+' + Math.round(next.speed * 100) + '%';
        if (next.capacity) upDesc += ' 队列+' + next.capacity;
        if (next.beds) upDesc += ' 床位+' + next.beds;
        if (def.type === 'train') upDesc += ' 修炼位+1';
        const upTxt = this.add.text(panelWidth / 2, y + 13, upDesc, {
          fontSize: '12px', color: affordable ? '#174f5c' : '#88735d', fontFamily: FONT,
        }).setOrigin(0.5);
        upBtn.on('pointerdown', (_p: Phaser.Input.Pointer, _x: number, _y: number, ev: any) => {
          ev.stopPropagation();
          this.upgradeBuilding(b);
        });
        this.infoPanel.add([upBtn, upTxt]);
        y += 32;
      } else {
        const maxTxt = this.add.text(10, y + 4, '已满级', {
          fontSize: '12px', color: '#8a6b4d', fontFamily: FONT,
        });
        this.infoPanel.add(maxTxt);
        y += 24;
      }
    }

    // 弟子分配
    if (def.type !== 'house' && def.type !== 'decor') {
      const roleLabel = def.type === 'gather' || def.type === 'mine'
        ? (def.id === 'lingkuang' ? '开采' : '灵植')
        : def.type === 'craft' || def.type === 'forge'
          ? (def.id === 'lianqi' ? '炼器' : '炼丹')
          : def.type === 'sell' || def.type === 'artifactSell' ? '经营' : '天赋';
      addSectionHeader('弟子安排 · 看' + roleLabel);
      const idle = this.gs.data.disciples.filter(d => d.assignedTo === null || d.assignedTo === b.uid);
      idle.forEach((dis, index) => {
        const assigned = dis.assignedTo === b.uid;
        const attribute = def.id === 'lingtian' ? dis.planting : def.id === 'danfang' ? dis.alchemy : def.type === 'sell' || def.type === 'artifactSell' ? dis.business : dis.talent;
        const rootName = this.gs.spiritRootDef(dis.root)?.name || '';
        const col = index % 2;
        const row = Math.floor(index / 2);
        const bx = 10 + col * (columnWidth + columnGap);
        const by = y + row * 31;
        const btn = this.add.rectangle(bx, by, columnWidth, 28, assigned ? 0x9bd26a : 0xffd77b)
          .setStrokeStyle(1, assigned ? 0x5e9e4b : 0xd99a39)
          .setOrigin(0, 0)
          .setInteractive({ useHandCursor: true });
        let detail = rootName + ' · ' + roleLabel + attribute + ' · Lv' + dis.level + '/' + dis.maxLevel;
        if (def.type === 'train') {
          const assignedIndex = b.assigned.indexOf(dis.id);
          detail += assigned && assignedIndex >= this.gs.trainingCapacity(b)
            ? ' · 等待空位'
            : ' · ' + Math.round(dis.trainingProgress * 100) + '%';
        }
        const txt = this.add.text(bx + 7, by + 5, (assigned ? '✓ ' : '') + dis.name, {
          fontSize: '11px', color: assigned ? '#28582c' : '#70421f', fontFamily: FONT, fontStyle: 'bold',
        });
        const stat = this.add.text(bx + 7, by + 16, detail, {
          fontSize: '9px', color: assigned ? '#356b39' : '#8a5b35', fontFamily: FONT,
        });
        btn.on('pointerdown', (_p: Phaser.Input.Pointer, _x: number, _y: number, ev: any) => {
          ev.stopPropagation();
          this.toggleAssign(dis.id, b);
        });
        this.infoPanel.add([btn, txt, stat]);
      });
      y += Math.ceil(idle.length / 2) * 31;
    }
    // 拆除
    const sellBtn = this.add.rectangle(10, y + 6, contentWidth, 26, 0xf28b6c)
      .setStrokeStyle(1, 0xd55d45)
      .setOrigin(0, 0)
      .setInteractive({ useHandCursor: true });
    const sellTxt = this.add.text(panelWidth / 2, y + 19, '拆除（返还' + Math.floor(def.cost / 2) + '）', {
      fontSize: '12px', color: '#6b2c22', fontFamily: FONT,
    }).setOrigin(0.5);
    sellBtn.on('pointerdown', (_p: Phaser.Input.Pointer, _x: number, _y: number, ev: any) => {
      ev.stopPropagation();
      this.demolish(b);
    });
    this.infoPanel.add([sellBtn, sellTxt]);
    this.infoPanel.setData('demolishLocalX', panelWidth / 2);
    this.infoPanel.setData('demolishLocalY', y + 19);

    const panelHeight = y + 44;
    bg.setDisplaySize(panelWidth, panelHeight);
    this.infoPanel.setData('panelHeight', panelHeight);
    this.layoutInfoPanel();
  }

  upgradeBuilding(b: PlacedBuilding): void {
    const next = this.gs.nextUpgrade(b);
    if (!next) return;
    const d = this.gs.data;
    if (d.spirit < next.cost) { this.toast('灵石不足'); return; }
    d.spirit -= next.cost;
    b.level = (b.level || 1) + 1;
    const def = this.gs.buildingDef(b.defId);
    this.toast(def.name + ' 升到 Lv' + b.level);
    this.gs.logEvent('upgrade', 'highlight', def.name + ' 升级', def.name + '升至 Lv' + b.level + '（-' + next.cost + '灵石）', '#9ecbff');
    this.refreshBuildingVisual(b);
    this.selectBuilding(b);
    this.gs.save.save();
  }

  toggleAssign(discipleId: string, b: PlacedBuilding): void {
    const type = this.gs.buildingDef(b.defId).type;
    if (type === 'house' || type === 'decor') return;
    const dis = this.gs.data.disciples.find(d => d.id === discipleId)!;
    if (dis.assignedTo === b.uid) {
      dis.assignedTo = null;
      b.assigned = b.assigned.filter(x => x !== discipleId);
    } else {
      const prev = this.gs.data.buildings.find(x => x.uid === dis.assignedTo);
      if (prev) {
        prev.assigned = prev.assigned.filter(x => x !== discipleId);
        this.refreshBuildingVisual(prev);
      }
      dis.assignedTo = b.uid;
      b.assigned.push(discipleId);
    }
    this.refreshBuildingVisual(b);
    this.selectBuilding(b);
    this.gs.save.save();
  }

  demolish(b: PlacedBuilding): void {
    const def = this.gs.buildingDef(b.defId);
    const d = this.gs.data;
    if (def.type === 'sell' || def.type === 'artifactSell') this.releaseVisitorsForDemolishedShop(b);
    d.spirit += Math.floor(def.cost / 2);
    d.buildings = d.buildings.filter(x => x !== b);
    for (const dis of d.disciples) if (dis.assignedTo === b.uid) dis.assignedTo = null;
    if (!this.isDedicatedDecoration(b)) this.gs.grid.remove(b.gx, b.gy, def.w, def.h, b.uid);
    if (b.sprite) b.sprite.destroy();
    if (b.lotSprite) b.lotSprite.destroy();
    this.gs.combo.recalc();
    this.selectBuilding(null);
    this.refreshBuildSlotHighlights();
    this.gs.save.save();
  }

  releaseVisitorsForDemolishedShop(shop: PlacedBuilding): void {
    const leaving = this.gs.data.visitors.filter(visitor => visitor.targetUid === shop.uid);
    if (leaving.length === 0) return;
    this.gs.data.visitors = this.gs.data.visitors.filter(visitor => visitor.targetUid !== shop.uid);
    shop.queue = 0;
    for (const visitor of leaving) {
      visitor.state = 'leaving';
      this.removeVisitorSprite(visitor);
    }
    this.gs.logEvent(
      'visitor-leave',
      'info',
      '访客改道离开',
      '丹药铺拆除，' + leaving.length + '位访客改道离开，未计为流失',
      '#ffb47a',
    );
  }

  // ---------- Research ----------
  createResearchPanel(): void {
    this.researchPanel = this.add.container(this.scale.width / 2, this.scale.height / 2).setDepth(80);
  }

  closeManagementPanels(except: 'research' | 'elder' | 'recruit' | 'commission'): void {
    if (except !== 'research' && this.researchOpen) {
      this.researchOpen = false;
      this.researchPanel.removeAll(true);
    }
    if (except !== 'elder' && this.elderOpen) {
      this.elderOpen = false;
      this.elderPanel.removeAll(true);
    }
    if (except !== 'recruit' && this.recruitOpen) {
      this.recruitOpen = false;
      this.recruitPanel.removeAll(true);
    }
    if (except !== 'commission' && this.commissionOpen) {
      this.commissionOpen = false;
      this.commissionPanel.removeAll(true);
    }
  }

  toggleResearch(): void {
    if (!this.researchOpen) this.closeManagementPanels('research');
    this.researchOpen = !this.researchOpen;
    this.renderResearch();
  }

  renderResearch(): void {
    this.researchPanel.removeAll(true);
    if (!this.researchOpen) return;
    const recipes = this.gs.researchableRecipes();
    const projects = this.gs.researchableProjects();
    const rowCount = recipes.length + projects.length;
    const sectionCount = (recipes.length > 0 ? 1 : 0) + (projects.length > 0 ? 1 : 0);
    const h = 66 + Math.max(1, rowCount) * 46 + sectionCount * 30;
    const bg = this.add.rectangle(0, 0, 320, h, 0xfff0c9, 0.99).setStrokeStyle(2, 0xf08b3e).setInteractive();
    bg.on('pointerdown', (_p: Phaser.Input.Pointer, _x: number, _y: number, ev: any) => ev.stopPropagation());
    const title = this.add.text(0, -h / 2 + 18, '宗门研发', { fontSize: '17px', color: '#6a361c', fontFamily: FONT }).setOrigin(0.5);
    this.researchPanel.add([bg, title]);
    let y = -h / 2 + 50;
    if (rowCount === 0) {
      this.researchPanel.add(this.add.text(0, y, '当前研发已全部完成', { fontSize: '12px', color: '#7b6a55' }).setOrigin(0.5));
    }
    if (recipes.length > 0) {
      this.researchPanel.add(this.add.text(-138, y, '丹方研发', { fontSize: '12px', color: '#8d4d20', fontFamily: FONT, fontStyle: 'bold' }).setOrigin(0, 0.5));
      y += 30;
    }
    for (const r of recipes) {
      const check = this.gs.canResearch(r);
      const row = this.add.rectangle(0, y, 290, 38, check.ok ? 0xffd77b : 0xe9ddc5).setStrokeStyle(1, check.ok ? 0xd99a39 : 0xb9aa90).setInteractive({ useHandCursor: true });
      row.setData('researchRecipeId', r.id);
      const name = this.add.text(-138, y - 10, r.name + '  售' + r.price + '  耗草' + r.input, { fontSize: '12px', color: '#6a361c', fontFamily: FONT }).setOrigin(0, 0.5);
      const cost = this.add.text(-138, y + 8, '研发：' + r.research!.spirit + '灵石 ' + r.research!.rep + '声望' + (check.ok ? '' : '（' + check.reason + '）'), { fontSize: '12px', color: check.ok ? '#26776a' : '#887869', fontFamily: FONT }).setOrigin(0, 0.5);
      if (check.ok) row.on('pointerdown', (_p: Phaser.Input.Pointer, _x: number, _y: number, ev: any) => { ev.stopPropagation(); this.doResearch(r.id); });
      this.researchPanel.add([row, name, cost]);
      y += 46;
    }
    if (projects.length > 0) {
      this.researchPanel.add(this.add.text(-138, y, '炼器研发', { fontSize: '12px', color: '#426f83', fontFamily: FONT, fontStyle: 'bold' }).setOrigin(0, 0.5));
      y += 30;
    }
    for (const project of projects) {
      const check = this.gs.canResearchProject(project);
      const row = this.add.rectangle(0, y, 290, 38, check.ok ? 0xffd77b : 0xe9ddc5).setStrokeStyle(1, check.ok ? 0xd99a39 : 0xb9aa90).setInteractive({ useHandCursor: true });
      row.setData('researchProjectId', project.id);
      const name = this.add.text(-138, y - 10, project.name + '　' + project.desc, { fontSize: '12px', color: '#426f83', fontFamily: FONT }).setOrigin(0, 0.5);
      const cost = this.add.text(-138, y + 8, '研发：' + project.cost + '灵石 ' + project.rep + '声望' + (check.ok ? '' : '（' + check.reason + '）'), { fontSize: '12px', color: check.ok ? '#26776a' : '#887869', fontFamily: FONT }).setOrigin(0, 0.5);
      if (check.ok) row.on('pointerdown', (_p: Phaser.Input.Pointer, _x: number, _y: number, ev: any) => { ev.stopPropagation(); this.doProjectResearch(project.id); });
      this.researchPanel.add([row, name, cost]);
      y += 46;
    }
  }

  doResearch(recipeId: string): void {
    const r = this.gs.recipeDef(recipeId);
    if (this.gs.research(r)) {
      this.toast('研发成功：' + r.name);
      this.gs.logEvent('research', 'highlight', '研得新方', '研发成功：' + r.name + '（-' + r.research!.spirit + '灵石）', '#8bd5ff');
      this.renderResearch();
      this.gs.save.save();
    }
  }

  doProjectResearch(id: string): void {
    const project = this.gs.defs.researches.find(item => item.id === id);
    if (!project) return;
    if (this.gs.completeResearchProject(id)) {
      this.toast('研发成功：' + project.name);
      this.gs.logEvent('research', 'highlight', '炼器研发完成', project.name + '完成（-' + project.cost + '灵石）', '#78c9ef');
      this.renderResearch();
      this.gs.save.save();
    }
  }

  // ---------- Expansion ----------
  tryExpand(): void {
    const ex = this.gs.nextExpansion();
    if (!ex) { this.toast('区域已全部解锁'); return; }
    const d = this.gs.data;
    const lackSpirit = Math.max(0, ex.spirit - d.spirit);
    const lackRep = Math.max(0, ex.rep - d.reputation);
    if (lackSpirit > 0 || lackRep > 0) {
      const parts: string[] = [];
      if (lackSpirit > 0) parts.push('灵石差' + lackSpirit);
      if (lackRep > 0) parts.push('声望差' + lackRep);
      this.toast('扩张需 ' + ex.spirit + '灵石 ' + ex.rep + '声望：' + parts.join('、'));
      return;
    }
    if (this.gs.expand()) {
      this.drawGridExpansion();
      this.layoutBoard();
      this.layoutUI();
      this.toast('消耗 ' + ex.spirit + '灵石 ' + ex.rep + '声望，开拓新区域');
      this.gs.logEvent('expand', 'highlight', '开拓新域', '宗门开拓新区域（-' + ex.spirit + '灵石，需声望' + ex.rep + '）', '#8fdc72');
      this.gs.save.save();
    }
  }

  drawGridExpansion(): void {
    this.mapBase?.setTexture(this.currentMapTexture());
    for (const slot of this.unlockedBuildSlots()) this.drawGroundCell(slot.gx, slot.gy);
    this.drawStageDecor();
    this.refreshBuildSlotHighlights();
  }

  // ---------- Elders ----------
  toggleElder(): void {
    if (!this.elderOpen) this.closeManagementPanels('elder');
    this.elderOpen = !this.elderOpen;
    this.renderElder();
  }

  renderElder(): void {
    this.elderPanel.removeAll(true);
    if (!this.elderOpen) return;
    const hired = this.gs.data.elders;
    const list = this.gs.hireableElders();
    const h = 70 + (hired.length + Math.max(1, list.length)) * 44;
    const bg = this.add.rectangle(0, 0, 320, h, 0xfff0c9, 0.99).setStrokeStyle(2, 0xf08b3e).setInteractive();
    bg.on('pointerdown', (_p: Phaser.Input.Pointer, _x: number, _y: number, ev: any) => ev.stopPropagation());
    const title = this.add.text(0, -h / 2 + 18, '长老供奉', { fontSize: '17px', color: '#6a361c', fontFamily: FONT }).setOrigin(0.5);
    this.elderPanel.add([bg, title]);
    let y = -h / 2 + 48;
    for (const eid of hired) {
      const e = this.gs.defs.elders.find(x => x.id === eid)!;
      this.elderPanel.add(this.add.text(-138, y, '✓ ' + e.name + '：' + e.desc, { fontSize: '12px', color: '#3f8d3c' }).setOrigin(0, 0.5));
      y += 44;
    }
    if (list.length === 0 && hired.length === 0) {
      this.elderPanel.add(this.add.text(0, y, '暂无可聘长老', { fontSize: '12px', color: '#7b6a55' }).setOrigin(0.5));
    }
    for (const e of list) {
      const can = this.gs.data.spirit >= e.cost && this.gs.data.reputation >= e.rep;
      const row = this.add.rectangle(0, y + 10, 290, 36, can ? 0xffd77b : 0xe9ddc5).setStrokeStyle(1, can ? 0xd99a39 : 0xb9aa90).setInteractive({ useHandCursor: true });
      row.setData('elderId', e.id);
      const name = this.add.text(-138, y + 2, e.name + '：' + e.desc, { fontSize: '12px', color: '#6a361c', fontFamily: FONT }).setOrigin(0, 0.5);
      const cost = this.add.text(-138, y + 17, e.cost + '灵石 ' + e.rep + '声望' + (can ? '' : '（条件不足）'), { fontSize: '12px', color: can ? '#26776a' : '#887869', fontFamily: FONT }).setOrigin(0, 0.5);
      if (can) row.on('pointerdown', (_p: Phaser.Input.Pointer, _x: number, _y: number, ev: any) => { ev.stopPropagation(); this.hireElder(e.id); });
      this.elderPanel.add([row, name, cost]);
      y += 44;
    }
  }

  hireElder(id: string): void {
    const r = this.gs.hireElder(id);
    if (r.ok) {
      const e = this.gs.defs.elders.find(x => x.id === id)!;
      this.toast(e.name + ' 入山供奉');
      this.gs.logEvent('elder', 'highlight', '长老入山', e.name + '入山供奉（-' + e.cost + '灵石）', '#ffc96b');
      this.renderElder();
      this.gs.save.save();
    } else this.toast(r.reason);
  }

  // ---------- Recruit ----------
  toggleRecruit(): void {
    if (!this.recruitOpen) this.closeManagementPanels('recruit');
    this.recruitOpen = !this.recruitOpen;
    if (this.recruitOpen) {
      this.gs.ensureRecruitCandidates();
      this.gs.save.save();
    } else {
      this.recruitAbandonArmed = false;
    }
    this.renderRecruit();
  }

  renderRecruit(): void {
    this.recruitPanel.removeAll(true);
    if (!this.recruitOpen) return;
    const width = 900;
    const height = 570;
    const bg = this.add.rectangle(0, 0, width, height, 0xfff0c9, 0.995)
      .setStrokeStyle(3, 0xf08b3e)
      .setInteractive();
    bg.on('pointerdown', (_p: Phaser.Input.Pointer, _x: number, _y: number, ev: any) => ev.stopPropagation());
    const title = this.add.text(0, -height / 2 + 24, '招募弟子', {
      fontSize: '20px', color: '#6a361c', fontFamily: FONT, fontStyle: 'bold',
    }).setOrigin(0.5);
    const cooldownDays = this.gs.recruitCooldownDays();
    const reportText = cooldownDays > 0
      ? '本轮候选已离开山门，请掌门静候下一批散修'
      : '报告掌门，山下来了几位散修想加入我们宗门，请掌门过目';
    const report = this.add.text(0, -height / 2 + 57, reportText, {
      fontSize: '14px', color: '#7a4b25', fontFamily: FONT,
    }).setOrigin(0.5);
    const status = this.add.text(0, -height / 2 + 84, '灵石 ' + this.gs.data.spirit + '　弟子 ' + this.gs.data.disciples.length + '/' + this.gs.discipleCap(), {
      fontSize: '13px', color: '#26776a', fontFamily: FONT, fontStyle: 'bold',
    }).setOrigin(0.5);
    const close = this.add.text(width / 2 - 20, -height / 2 + 20, '✕', {
      fontSize: '20px', color: '#8a6b4d', fontFamily: FONT,
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    close.on('pointerdown', () => this.toggleRecruit());
    this.recruitPanel.add([bg, title, report, status, close]);

    if (cooldownDays > 0) {
      const cooldown = this.add.text(0, 16, '本轮候选已放弃\n新的散修将在 ' + cooldownDays + ' 天后到访', {
        fontSize: '20px', color: '#8d4d20', fontFamily: FONT,
        align: 'center', lineSpacing: 12,
      }).setOrigin(0.5);
      this.recruitPanel.add(cooldown);
      return;
    }

    const cardW = 250;
    const cardH = 330;
    const startX = -280;
    this.gs.data.recruitCandidates.forEach((candidate, index) => {
      this.renderRecruitCandidate(candidate, startX + index * 280, 10, cardW, cardH);
    });

    const refreshCost = this.gs.recruitRefreshCost();
    const refreshLabel = refreshCost === null
      ? (this.recruitAbandonArmed ? '再次点击确认放弃（冷却3天）' : '放弃本轮候选')
      : '刷新候选（' + refreshCost + '灵石）　' + this.gs.data.recruitRefreshCount + '/3';
    const canRefresh = refreshCost === null || this.gs.data.spirit >= refreshCost;
    const refresh = this.add.rectangle(0, height / 2 - 32, 310, 34, canRefresh ? 0x79cbd5 : 0xd8c9ad)
      .setStrokeStyle(1, canRefresh ? 0x3b91a0 : 0xa99a80)
      .setInteractive({ useHandCursor: canRefresh });
    const refreshText = this.add.text(0, height / 2 - 32, refreshLabel, {
      fontSize: '13px', color: canRefresh ? '#174f5c' : '#756957', fontFamily: FONT, fontStyle: 'bold',
    }).setOrigin(0.5);
    refresh.on('pointerdown', (_p: Phaser.Input.Pointer, _x: number, _y: number, ev: any) => {
      ev.stopPropagation();
      if (refreshCost === null) this.abandonRecruitCandidates();
      else this.refreshRecruitCandidates();
    });
    this.recruitPanel.add([refresh, refreshText]);
  }

  renderRecruitCandidate(candidate: RecruitCandidate, x: number, y: number, width: number, height: number): void {
    const root = this.gs.spiritRootDef(candidate.root)!;
    const rootColor = Phaser.Display.Color.HexStringToColor(root.color).color;
    const card = this.add.rectangle(x, y, width, height, 0xffe3a5, 0.98)
      .setStrokeStyle(3, rootColor, 0.95);
    const portraitBg = this.add.rectangle(x, y - height / 2 + 58, 64, 76, 0xf4d69a, 1)
      .setStrokeStyle(1, rootColor, 0.7);
    const portrait = this.add.image(x, y - height / 2 + 83, 'character-disciple-' + candidate.appearance)
      .setDisplaySize(42, 60)
      .setOrigin(0.5, 1);
    const name = this.add.text(x, y - 54, candidate.name, {
      fontSize: '18px', color: '#5d351f', fontFamily: FONT, fontStyle: 'bold',
    }).setOrigin(0.5);
    const rootText = this.add.text(x, y - 29, root.name + '　等级上限 Lv' + candidate.maxLevel, {
      fontSize: '12px', color: root.color, fontFamily: FONT, fontStyle: 'bold',
    }).setOrigin(0.5);
    const stats = this.add.text(x, y + 28,
      '灵植 ' + candidate.planting + '　炼丹 ' + candidate.alchemy + '\n'
      + '经营 ' + candidate.business + '　天赋 ' + candidate.talent,
      {
        fontSize: '13px', color: '#70421f', fontFamily: FONT,
        align: 'center', lineSpacing: 9,
      }).setOrigin(0.5);
    const affordable = this.gs.data.spirit >= candidate.cost && this.gs.data.disciples.length < this.gs.discipleCap();
    const hire = this.add.rectangle(x, y + height / 2 - 34, width - 34, 38, affordable ? 0x8fc96b : 0xd8c9ad)
      .setStrokeStyle(1, affordable ? 0x5a9b49 : 0xa99a80)
      .setInteractive({ useHandCursor: true });
    const hireText = this.add.text(x, y + height / 2 - 34, '收入门下　' + candidate.cost + '灵石', {
      fontSize: '13px', color: affordable ? '#28582c' : '#756957', fontFamily: FONT, fontStyle: 'bold',
    }).setOrigin(0.5);
    hire.on('pointerdown', (_p: Phaser.Input.Pointer, _x: number, _y: number, ev: any) => {
      ev.stopPropagation();
      this.hireRecruitCandidate(candidate.id);
    });
    this.recruitPanel.add([card, portraitBg, portrait, name, rootText, stats, hire, hireText]);
  }

  refreshRecruitCandidates(): void {
    const result = this.gs.refreshRecruitCandidates();
    if (!result.ok) {
      this.toast(result.reason);
      return;
    }
    this.recruitAbandonArmed = false;
    this.gs.logEvent('recruit', 'info', '重访山门散修', '掌门花费' + result.cost + '灵石，重新查看入门候选', '#9ecbff');
    this.gs.save.save();
    this.renderRecruit();
  }

  abandonRecruitCandidates(): void {
    if (!this.recruitAbandonArmed) {
      this.recruitAbandonArmed = true;
      this.renderRecruit();
      return;
    }
    const result = this.gs.abandonRecruitCandidates();
    if (!result.ok) {
      this.toast(result.reason);
      this.recruitAbandonArmed = false;
      this.renderRecruit();
      return;
    }
    this.recruitAbandonArmed = false;
    this.toast('本轮候选已放弃，3天后将有新的散修到访');
    this.gs.logEvent('recruit', 'info', '散修暂离山门', '掌门放弃本轮候选，新的散修将在3个游戏日后到访', '#9ecbff');
    this.gs.save.save();
    this.renderRecruit();
  }

  hireRecruitCandidate(candidateId: string): void {
    const result = this.gs.hireRecruitCandidate(candidateId);
    if (!result.ok || !result.candidate) {
      this.toast(result.reason);
      this.renderRecruit();
      return;
    }
    const candidate = result.candidate;
    const root = this.gs.spiritRootDef(candidate.root)!;
    this.toast(candidate.name + ' 拜入山门');
    this.gs.logEvent('recruit', 'highlight', '新弟子入门', root.name + '弟子' + candidate.name + '入门（-' + candidate.cost + '灵石）', '#9ecbff');
    this.recruitAbandonArmed = false;
    this.recruitOpen = false;
    this.renderRecruit();
    this.gs.save.save();
  }

  // ---------- Commissions ----------
  toggleCommission(): void {
    if (!this.commissionOpen) this.closeManagementPanels('commission');
    this.commissionOpen = !this.commissionOpen;
    if (this.commissionOpen) {
      this.gs.ensureCommissionOffers();
      this.gs.save.save();
    }
    this.renderCommission();
  }

  commissionRewardText(def: CommissionDef): string {
    const parts: string[] = [];
    if (def.reward.spirit) parts.push(def.reward.spirit + '灵石');
    if (def.reward.reputation) parts.push(def.reward.reputation + '声望');
    if (def.reward.training) parts.push('修炼进度+' + Math.round(def.reward.training * 100) + '%');
    return parts.join('、');
  }

  renderCommission(): void {
    this.commissionPanel.removeAll(true);
    if (!this.commissionOpen) return;
    const width = 760;
    const height = 420;
    const bg = this.add.rectangle(0, 0, width, height, 0xfff0c9, 0.995)
      .setStrokeStyle(3, 0xc27d3a)
      .setInteractive();
    bg.on('pointerdown', (_p: Phaser.Input.Pointer, _x: number, _y: number, ev: any) => ev.stopPropagation());
    const title = this.add.text(0, -height / 2 + 24, '宗门委托', {
      fontSize: '20px', color: '#6a361c', fontFamily: FONT, fontStyle: 'bold',
    }).setOrigin(0.5);
    const close = this.add.text(width / 2 - 20, -height / 2 + 20, '✕', {
      fontSize: '20px', color: '#8a6b4d', fontFamily: FONT,
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    close.on('pointerdown', () => this.toggleCommission());
    this.commissionPanel.add([bg, title, close]);

    const active = this.gs.data.activeCommission;
    if (active) {
      const def = this.gs.commissionDef(active.defId)!;
      const progress = this.gs.commissionProgress();
      const remainingDays = Math.max(0, active.deadlineDay - this.gs.data.day);
      const card = this.add.rectangle(0, 20, 640, 250, 0xffdfa0, 0.98).setStrokeStyle(2, 0xd99a39);
      const name = this.add.text(0, -70, def.name, {
        fontSize: '21px', color: '#6a361c', fontFamily: FONT, fontStyle: 'bold',
      }).setOrigin(0.5);
      const desc = this.add.text(0, -34, def.desc, {
        fontSize: '15px', color: '#70421f', fontFamily: FONT,
      }).setOrigin(0.5);
      const progressText = this.add.text(0, 3, '当前进度：' + progress.current + '/' + progress.target + '　剩余' + remainingDays + '天', {
        fontSize: '14px', color: progress.current >= progress.target ? '#3f8d3c' : '#a0483c', fontFamily: FONT, fontStyle: 'bold',
      }).setOrigin(0.5);
      const reward = this.add.text(0, 34, '完成奖励：' + this.commissionRewardText(def), {
        fontSize: '13px', color: '#26776a', fontFamily: FONT,
      }).setOrigin(0.5);
      const ready = progress.current >= progress.target;
      const submit = this.add.rectangle(0, 83, 230, 38, ready ? 0x8fc96b : 0xd8c9ad)
        .setStrokeStyle(1, ready ? 0x5a9b49 : 0xa99a80)
        .setInteractive({ useHandCursor: true });
      const submitText = this.add.text(0, 83, ready ? '提交委托' : '条件尚未完成', {
        fontSize: '14px', color: ready ? '#28582c' : '#756957', fontFamily: FONT, fontStyle: 'bold',
      }).setOrigin(0.5);
      submit.on('pointerdown', (_p: Phaser.Input.Pointer, _x: number, _y: number, ev: any) => {
        ev.stopPropagation();
        this.submitCommission();
      });
      this.commissionPanel.add([card, name, desc, progressText, reward, submit, submitText]);
      return;
    }

    const offers = this.gs.data.commissionOffers
      .map(id => this.gs.commissionDef(id))
      .filter((def): def is CommissionDef => !!def);
    if (offers.length === 0) {
      const wait = Math.max(0, this.gs.data.nextCommissionDay - this.gs.data.day);
      this.commissionPanel.add(this.add.text(0, 10, wait > 0 ? '下一批委托将在' + wait + '天后送达' : '暂时没有新的宗门委托', {
        fontSize: '15px', color: '#7b6a55', fontFamily: FONT,
      }).setOrigin(0.5));
      return;
    }
    this.commissionPanel.add(this.add.text(0, -height / 2 + 58, '请选择一项承接，承接后需在5天内完成', {
      fontSize: '13px', color: '#7a4b25', fontFamily: FONT,
    }).setOrigin(0.5));
    const startX = -240;
    offers.forEach((def, index) => {
      const x = startX + index * 240;
      const card = this.add.rectangle(x, 20, 215, 250, 0xffdfa0, 0.98).setStrokeStyle(2, 0xd99a39);
      const name = this.add.text(x, -75, def.name, {
        fontSize: '17px', color: '#6a361c', fontFamily: FONT, fontStyle: 'bold',
      }).setOrigin(0.5);
      const desc = this.add.text(x, -27, def.desc, {
        fontSize: '13px', color: '#70421f', fontFamily: FONT,
        align: 'center', wordWrap: { width: 185 },
      }).setOrigin(0.5);
      const reward = this.add.text(x, 26, '奖励\n' + this.commissionRewardText(def), {
        fontSize: '12px', color: '#26776a', fontFamily: FONT, align: 'center', lineSpacing: 5,
      }).setOrigin(0.5);
      const accept = this.add.rectangle(x, 100, 170, 34, 0x8fc96b)
        .setStrokeStyle(1, 0x5a9b49)
        .setInteractive({ useHandCursor: true });
      const acceptText = this.add.text(x, 100, '承接委托', {
        fontSize: '13px', color: '#28582c', fontFamily: FONT, fontStyle: 'bold',
      }).setOrigin(0.5);
      accept.on('pointerdown', (_p: Phaser.Input.Pointer, _x: number, _y: number, ev: any) => {
        ev.stopPropagation();
        this.acceptCommission(def.id);
      });
      this.commissionPanel.add([card, name, desc, reward, accept, acceptText]);
    });
  }

  acceptCommission(id: string): void {
    const result = this.gs.acceptCommission(id);
    if (!result.ok) {
      this.toast(result.reason);
      return;
    }
    const def = this.gs.commissionDef(id)!;
    this.gs.logEvent('commission', 'highlight', '承接委托：' + def.name, def.desc + '，限期5天', '#d7a5e8');
    this.gs.save.save();
    this.renderCommission();
  }

  submitCommission(): void {
    const result = this.gs.submitCommission();
    if (!result.ok || !result.def) {
      this.toast(result.reason);
      return;
    }
    this.toast('委托完成：' + result.def.name);
    this.gs.logEvent('commission', 'highlight', '完成委托：' + result.def.name, '获得' + result.rewardText, '#8fdc72');
    this.gs.save.save();
    this.renderCommission();
  }

  handleResize(): void {
    this.layoutBoard();
    this.layoutHUD();
    this.renderEventFeed();
    if (this.eventHistoryOpen) this.renderEventHistory();
    if (this.acceptanceToolsOpen) this.renderAcceptanceTools();
    this.layoutUI();
    if (this.selectedBuilding) this.selectBuilding(this.selectedBuilding);
  }

  // ---------- Loop ----------
  advanceTitlesNow(): void {
    if (this.titleAdvanceRunning) return;
    this.titleAdvanceRunning = true;
    try {
      if (this.gs.advanceTitles().length > 0) this.gs.save.save();
    } finally {
      this.titleAdvanceRunning = false;
    }
  }

  update(_time: number, dtMs: number): void {
    const dt = dtMs / 1000;
    this.gs.economy.update(dt * this.gameSpeed);
    this.commissionRefreshTimer += dt;
    if (this.commissionOpen && this.commissionRefreshTimer >= 0.5) {
      this.commissionRefreshTimer = 0;
      this.renderCommission();
    }
    this.titleCheckTimer += dt;
    if (this.titleCheckTimer >= 0.25) {
      this.titleCheckTimer = 0;
      this.advanceTitlesNow();
    }
    for (const b of this.gs.data.buildings) this.refreshBuildingVisual(b);
    this.updateHUD();
    this.saveTimer += dt;
    if (this.saveTimer > 10) { this.saveTimer = 0; this.gs.save.save(); }
  }

  updateHUD(): void {
    const d = this.gs.data;
    this.game.canvas.dataset.v12State = JSON.stringify({
      schemaVersion: d.schemaVersion,
      day: d.day,
      spiritOre: d.spiritOre,
      azureEdgeSwords: d.azureEdgeSwords,
      totalForged: d.totalForged,
      completedResearch: d.completedResearch,
      totalEarned: d.totalEarned,
      spirit: d.spirit,
      reputation: d.reputation,
      artifactSellPrice: this.gs.artifactSellPrice(),
      buildingCount: d.buildings.length,
      progressionBuildingCount: this.gs.progressionBuildingCount(),
      selectedBuild: this.selectedBuild,
      buildGhost: this.ghost ? { gx: this.ghost.gx, gy: this.ghost.gy, slotId: this.ghost.slotId || null, ok: this.ghost.ok } : null,
      buildingIds: d.buildings.map(building => building.defId),
      buildingVisuals: d.buildings.map(building => {
        const art = building.sprite?.getData('art') as Phaser.GameObjects.Image | undefined;
        const selectionLocalX = Number(building.sprite?.getData('selectionLocalX') || 0);
        const selectionLocalY = Number(building.sprite?.getData('selectionLocalY') || 0);
        const worker = building.sprite?.getData('worker') as Phaser.GameObjects.Image | undefined;
        const mapPoint = this.buildingMapPoint(building);
        return {
          uid: building.uid,
          id: building.defId,
          slotId: building.slotId || null,
          gx: building.gx,
          gy: building.gy,
          mapX: mapPoint?.mapX ?? null,
          mapY: mapPoint?.mapY ?? null,
          displayWidth: art?.displayWidth || 0,
          displayHeight: art?.displayHeight || 0,
          clickX: this.board.x + ((building.sprite?.x || 0) + selectionLocalX) * this.board.scaleX,
          clickY: this.board.y + ((building.sprite?.y || 0) + selectionLocalY) * this.board.scaleY,
          workerVisible: worker?.visible || false,
          productionFxVisible: !!(building.sprite?.getData('productionFx') as any)?.visible,
          efficiency: this.gs.speedOf(building),
        };
      }),
      selectedBuildingUid: this.selectedBuilding?.uid || null,
      demolishButton: this.selectedBuilding ? {
        x: this.infoPanel.x + Number(this.infoPanel.getData('demolishLocalX') || 0) * this.infoPanel.scaleX,
        y: this.infoPanel.y + Number(this.infoPanel.getData('demolishLocalY') || 0) * this.infoPanel.scaleY,
      } : null,
      herbs: d.herbs,
      flavorEventsToday: d.eventLog.filter(event => event.day === d.day && event.type === 'flavor').length,
      training: d.buildings.filter(building => this.gs.buildingDef(building.defId).type === 'train').map(building => ({
        uid: building.uid,
        level: building.level,
        capacity: this.gs.trainingCapacity(building),
        assigned: building.assigned.length,
        waiting: Math.max(0, building.assigned.length - this.gs.trainingCapacity(building)),
      })),
      disciples: d.disciples.map(disciple => ({ id: disciple.id, level: disciple.level, assignedTo: disciple.assignedTo, trainingProgress: disciple.trainingProgress })),
      pills: d.pills,
      visitors: d.visitors.map(visitor => ({
        id: visitor.id,
        state: visitor.state,
        targetUid: visitor.targetUid,
        walkTimer: visitor.walkTimer || 0,
        arrivedAtShop: !!visitor.arrivedAtShop,
        arrivalWait: visitor.arrivalWait || 0,
        hasSprite: this.visitorSprites.has(visitor.id),
      })),
      visitorVisuals: [...this.visitorSprites.entries()].map(([id, sprite]) => {
        const point = this.fixedMapSourcePoint(sprite.x, sprite.y);
        const variant = sprite.getData('variant') as VisitorVariant;
        const facingBack = !!sprite.getData('facingBack');
        const movingRight = !!sprite.getData('movingRight');
        const person = sprite.getData('person') as Phaser.GameObjects.Image;
        return {
          id,
          mapX: point.mapX,
          mapY: point.mapY,
          directionX: Number(sprite.getData('directionX') || 0),
          directionY: Number(sprite.getData('directionY') || 0),
          facingBack,
          movingRight,
          visualFacingRight: VISITOR_NATIVE_RIGHT[variant][facingBack ? 'back' : 'front'] !== person.flipX,
          textureKey: person.texture.key,
          flipX: person.flipX,
          targetUid: sprite.getData('debugTargetUid') ?? null,
          targetName: String(sprite.getData('debugTargetName') || ''),
          debugVisible: !!(sprite.getData('debugLabel') as Phaser.GameObjects.Text | undefined)?.visible,
          debugLabel: String((sprite.getData('debugLabel') as Phaser.GameObjects.Text | undefined)?.text || ''),
          debugPath: sprite.getData('debugPath') || [],
          displayWidth: person.displayWidth,
          displayHeight: person.displayHeight,
        };
      }),
      visitorDirectionContract: VISITOR_NATIVE_RIGHT,
      visitorFlow: {
        spawnTimer: this.gs.economy.spawnTimer,
        spawnInterval: this.gs.economy.spawnInterval(),
        desiredCount: this.gs.economy.desiredVisitorCount(),
        shops: this.gs.economy.sellBuildings().map(shop => ({
          uid: shop.uid,
          defId: shop.defId,
          load: this.gs.economy.shopLoad(shop),
          capacity: this.gs.shopCapacity(shop),
          canSell: this.gs.economy.shopCanSell(shop),
          queue: shop.queue,
        })),
      },
      npcDebug: {
        enabled: this.npcDebugEnabled,
        button: this.npcDebugButton ? { x: this.npcDebugButton.x, y: this.npcDebugButton.y } : null,
      },
      acceptanceTools: {
        open: this.acceptanceToolsOpen,
        button: this.acceptanceToolsButton ? { x: this.acceptanceToolsButton.x, y: this.acceptanceToolsButton.y } : null,
        actions: this.acceptanceToolsPanel?.list
          .filter((child: any) => child.getData?.('acceptanceAction'))
          .map((child: any) => ({
            action: child.getData('acceptanceAction'),
            x: Number(child.x),
            y: Number(child.y),
          })) || [],
      },
      cunjinge: {
        button: this.cunjingeButton ? { x: this.cunjingeButton.x, y: this.cunjingeButton.y } : null,
        openToday: d.day >= 7 && (d.day - 7) % 3 === 0,
        chips: d.cunjinge.chips,
        chests: d.cunjinge.chests,
        active: d.cunjinge.auction !== null,
      },
      uiButtons: this.buildMenu.list.filter((child: any) => child.getData?.('action') || child.getData?.('defId') || child.getData?.('speed') !== undefined).map((child: any) => ({
        action: child.getData('action') || null,
        defId: child.getData('defId') || null,
        speed: child.getData('speed'),
        x: this.buildMenu.x + child.x,
        y: this.buildMenu.y + child.y,
      })),
      researchRows: this.researchPanel.list.filter((child: any) => child.getData?.('researchRecipeId') || child.getData?.('researchProjectId')).map((child: any) => ({
        recipeId: child.getData('researchRecipeId') || null,
        projectId: child.getData('researchProjectId') || null,
        x: this.researchPanel.x + child.x,
        y: this.researchPanel.y + child.y,
      })),
      elderRows: this.elderPanel.list.filter((child: any) => child.getData?.('elderId')).map((child: any) => ({
        id: child.getData('elderId'),
        x: this.elderPanel.x + child.x,
        y: this.elderPanel.y + child.y,
      })),
    });
    const cap = this.gs.discipleCap();
    const pillTotal = Object.values(d.pills).reduce((sum, count) => sum + count, 0);
    const comboNames = d.activeCombos.map(id => '【' + this.gs.defs.combos.find(c => c.id === id)!.name + '】').join('');
    const totalMinutes = Math.floor(360 + (d.dayTime / 60) * 1080) % 1440;
    const hour = Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;
    this.timeText.setText(
      String(hour).padStart(2, '0') + ':' + String(minute).padStart(2, '0')
      + (this.scale.width < 900 ? '' : '\n第' + d.day + '天'),
    );
    const primary = [
      '灵石 ' + d.spirit,
      '声望 ' + d.reputation,
      '药草 ' + d.herbs,
      '丹药 ' + pillTotal,
      '灵矿 ' + d.spiritOre,
      '青锋剑 ' + d.azureEdgeSwords,
      '弟子 ' + d.disciples.length + '/' + cap,
    ];
    if (this.scale.width >= 900) {
      primary.push('收入 ' + d.totalEarned, '相性 ' + (comboNames || '无'));
    }
    this.hud.setText(primary.join(this.scale.width < 900 ? '  ' : '  ·  '));
    if (!this.keysBound && this.input.keyboard) {
      this.keysBound = true;
      this.input.keyboard.on('keydown-R', () => this.toggleRecruit());
      this.input.keyboard.on('keydown-V', () => this.runVisitorDirectionCheck());
      this.input.keyboard.on('keydown-D', () => this.toggleNPCDebug());
      this.input.keyboard.on('keydown-ESC', () => {
        this.cancelBuild();
        this.selectBuilding(null);
        if (this.acceptanceToolsOpen) this.closeAcceptanceTools();
        if (this.researchOpen) this.toggleResearch();
        if (this.elderOpen) this.toggleElder();
        if (this.recruitOpen) this.toggleRecruit();
        if (this.commissionOpen) this.toggleCommission();
        if (this.titlePanelOpen) this.closeTitlePanel();
        if (this.eventHistoryOpen) this.closeEventHistory();
      });
    }
  }
}
