import Phaser from 'phaser';
import { BuildingDef, CommissionDef, GameState, PlacedBuilding, RecruitCandidate, Visitor } from '../state';
import { TILE_W, TILE_H } from '../systems/IsoGrid';

interface BuildGhost { gx: number; gy: number; ok: boolean; gfx?: Phaser.GameObjects.Container; }
type VisitorVariant = 'a' | 'b' | 'c' | 'd';

const FONT = '"Microsoft YaHei", "PingFang SC", "Noto Sans CJK SC", sans-serif';
const FACILITY_DEPTH_LAYER = 20;
const NPC_DEPTH_LAYER = 30;
const BUILDING_DISPLAY_W = 48;
const BUILDING_DISPLAY_H = 42;
const DEFAULT_BUILDING_SCALE = 0.8;
const GATE_GRID_X = 10;
const INITIAL_GRID_DIAGONAL = 26 + 19;
const VISITOR_NATIVE_RIGHT: Record<VisitorVariant, { front: boolean; back: boolean }> = {
  a: { front: true, back: true },
  b: { front: false, back: true },
  c: { front: false, back: true },
  d: { front: true, back: true },
};

export class GameScene extends Phaser.Scene {
  gs!: GameState;
  originX = 0; originY = 0;
  board!: Phaser.GameObjects.Container;
  groundLayer!: Phaser.GameObjects.Container;
  placementLayer!: Phaser.GameObjects.Container;
  entityLayer!: Phaser.GameObjects.Container;
  overlayLayer!: Phaser.GameObjects.Container;
  backdrop!: Phaser.GameObjects.Image;
  hudLayer!: Phaser.GameObjects.Container;
  hud!: Phaser.GameObjects.Text;
  timeText!: Phaser.GameObjects.Text;
  eventFeed!: Phaser.GameObjects.Container;
  eventHistoryPanel?: Phaser.GameObjects.Container;
  eventHistoryOpen = false;
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
  ghost: BuildGhost | null = null;
  selectedBuilding: PlacedBuilding | null = null;
  visitorSprites = new Map<number, Phaser.GameObjects.Container>();
  floatTexts: Phaser.GameObjects.Text[] = [];
  gridTiles: Phaser.GameObjects.Polygon[] = [];
  eventEntries: { text: string; color: string }[] = [];
  gameSpeed = 1;
  directionCheckRunning = false;
  keysBound = false;
  saveTimer = 0;
  minBoardScale = 1;
  maxBoardScale = 2;
  panPointerId: number | null = null;
  panLastX = 0;
  panLastY = 0;
  panDistance = 0;

  constructor() { super('Game'); }

  create(data: { faction?: string; load?: boolean }): void {
    const raw: any = this.cache.json.get('gamedata');
    let restored = null;
    if (data.load) {
      const tmp = new GameState(this, raw, 'dan');
      restored = tmp.save.load();
    }
    this.gs = new GameState(this, raw, (data.faction as any) || (restored ? restored.faction : 'dan'), restored || undefined);
    this.originX = 0;
    this.originY = 0;

    this.cameras.main.setBackgroundColor(0x8edcf2);
    this.backdrop = this.add.image(this.scale.width / 2, this.scale.height / 2, 'menu-bg')
      .setDisplaySize(this.scale.width, this.scale.height)
      .setAlpha(0.22)
      .setDepth(-10);
    this.board = this.add.container(0, 0);
    this.groundLayer = this.add.container(0, 0);
    this.placementLayer = this.add.container(0, 0);
    this.entityLayer = this.add.container(0, 0);
    this.overlayLayer = this.add.container(0, 0);
    this.board.add([this.groundLayer, this.placementLayer, this.entityLayer, this.overlayLayer]);
    this.drawGrid();
    if (restored) {
      if (!this.gs.data.expansionsUnlocked) this.gs.data.expansionsUnlocked = 0;
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
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.scale.off('resize', this.handleResize, this));
  }

  // ---------- Grid & buildings ----------
  drawGrid(): void {
    const g = this.gs.grid;
    for (let gy = 0; gy < g.h; gy++) {
      for (let gx = 0; gx < g.w; gx++) {
        const s = this.toScreen(gx, gy);
        const color = (gx + gy) % 2 === 0 ? 0x8fd16d : 0x7bc45f;
        const tile = this.add.polygon(s.x, s.y, [0, TILE_H / 2, TILE_W / 2, 0, 0, -TILE_H / 2, -TILE_W / 2, 0], color)
          .setStrokeStyle(1, 0xd9ee91, 0.22);
        this.groundLayer.add(tile);
        this.gridTiles.push(tile);
      }
    }
    const gateGrid = this.gateGridPosition();
    const e = this.toScreen(gateGrid.gx, gateGrid.gy);
    const gateFoot = g.getSpritePosition(gateGrid.gx, gateGrid.gy);
    const gateTile = this.add.polygon(e.x, e.y, [0, TILE_H / 2, TILE_W / 2, 0, 0, -TILE_H / 2, -TILE_W / 2, 0], 0xe5c66a)
      .setStrokeStyle(1, 0xfff1a6, 0.9);
    const gate = this.add.container(gateFoot.x, gateFoot.y);
    const gateArt = this.add.image(0, 0, 'building-gate').setDisplaySize(70, 60).setOrigin(0.5, 1.0);
    const gt = this.add.text(0, -TILE_H / 2 - 48, '山门', {
      fontSize: '10px', color: '#ffe2a3', fontFamily: FONT,
      backgroundColor: '#2b1d13cc', padding: { x: 4, y: 2 },
    }).setOrigin(0.5);
    gate.add([gateArt, gt]);
    gate.setDepth(g.getDepth(gateGrid.gx, gateGrid.gy, { width: 1, height: 1 }, FACILITY_DEPTH_LAYER));
    this.groundLayer.add(gateTile);
    this.entityLayer.add(gate);
    this.sortBoard();
  }

  setGridEmphasis(active: boolean): void {
    for (const tile of this.gridTiles) {
      tile.setStrokeStyle(1, 0xd9ee91, active ? 0.72 : 0.22);
    }
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
    const center = this.gs.grid.toScreen(gx + (width - 1) / 2, gy + (height - 1) / 2);
    return { x: center.x, y: center.y + 5 };
  }

  buildingEntrance(b: PlacedBuilding): { x: number; y: number; gx: number; gy: number } {
    const def = this.gs.buildingDef(b.defId);
    const foot = this.gs.grid.getSpritePosition(b.gx, b.gy, def.w, def.h);
    return {
      x: foot.x,
      y: foot.y + 2,
      gx: b.gx + def.w - 1,
      gy: b.gy + def.h - 1,
    };
  }

  courtyardPalette(def: BuildingDef): { fill: number; edge: number; post: number } {
    if (def.type === 'gather') return { fill: 0xb8df83, edge: 0x638b43, post: 0xf4d35e };
    if (def.type === 'craft') return { fill: 0xd8c590, edge: 0x8b5a3c, post: 0xd9a441 };
    if (def.type === 'sell') return { fill: 0xf2d28f, edge: 0xa45b42, post: 0xe85d4a };
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
    const palette = this.courtyardPalette(def);
    const lot = this.add.container(0, 0);
    const graphics = this.add.graphics();
    const footprintVertices = this.lotVertices(b.gx, b.gy, def.w, def.h);
    const centerX = footprintVertices.reduce((sum, point) => sum + point.x, 0) / footprintVertices.length;
    const centerY = footprintVertices.reduce((sum, point) => sum + point.y, 0) / footprintVertices.length;
    const vertices = footprintVertices.map(point => new Phaser.Math.Vector2(
      Phaser.Math.Linear(point.x, centerX, 0.06),
      Phaser.Math.Linear(point.y, centerY, 0.06),
    ));
    graphics.fillStyle(palette.fill, 0.58);
    graphics.fillPoints(vertices, true);
    graphics.lineStyle(1, 0xfff0a8, 0.72);
    graphics.strokePoints(vertices, true);
    graphics.lineStyle(3, palette.edge, 0.92);
    graphics.lineBetween(vertices[1].x, vertices[1].y, vertices[2].x, vertices[2].y);
    graphics.lineBetween(vertices[2].x, vertices[2].y, vertices[3].x, vertices[3].y);
    graphics.fillStyle(palette.post, 0.96);
    for (const point of vertices) graphics.fillRect(point.x - 2, point.y - 6, 4, 7);
    lot.add(graphics);
    this.groundLayer.add(lot);
    b.lotSprite = lot;
  }

  buildMenuHeight(): number {
    return this.scale.width < 760 ? 126 : 86;
  }

  topBarHeight(): number {
    return this.scale.width < 900 ? 56 : 68;
  }

  layoutBoard(): void {
    const g = this.gs.grid;
    const w = this.scale.width;
    const h = this.scale.height;
    const initialWidth = INITIAL_GRID_DIAGONAL * TILE_W / 2;
    const initialHeight = INITIAL_GRID_DIAGONAL * TILE_H / 2;
    const scale = Math.min((w * 0.9) / initialWidth, (h * 0.8) / initialHeight);
    let focusX = (g.w - g.h) * TILE_W / 4;
    let focusY = (g.w + g.h - 2) * TILE_H / 4;
    if (this.gs.data.buildings.length > 0) {
      let totalX = 0;
      let totalY = 0;
      for (const b of this.gs.data.buildings) {
        const def = this.gs.buildingDef(b.defId);
        const point = this.gs.grid.toScreen(
          b.gx + (def.w - 1) / 2,
          b.gy + (def.h - 1) / 2,
        );
        totalX += point.x;
        totalY += point.y;
      }
      focusX = totalX / this.gs.data.buildings.length;
      focusY = totalY / this.gs.data.buildings.length;
    }

    this.minBoardScale = scale * 0.82;
    this.maxBoardScale = scale * 2.2;
    const hudSafeOffsetX = w >= 900 ? 40 : 0;
    this.originX = w / 2 + hudSafeOffsetX - focusX * scale;
    this.originY = h * 0.56 - focusY * scale;
    this.board.setScale(scale).setPosition(this.originX, this.originY);
    this.clampBoardPosition();
  }

  clampBoardPosition(): void {
    const g = this.gs.grid;
    const scale = this.board.scaleX;
    const edge = 48;
    const minLocalX = -g.h * TILE_W / 2;
    const maxLocalX = g.w * TILE_W / 2;
    const minLocalY = -TILE_H / 2;
    const maxLocalY = (g.w + g.h - 1) * TILE_H / 2;
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
    if (mapHeight <= this.scale.height - edge * 2) {
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
    if (this.scale.width >= 900 && p.x >= 18 && p.x <= 318 && p.y >= top + this.topBarHeight() + 18) {
      const feedHeight = 28 + Math.max(1, this.eventEntries.length) * 42;
      if (p.y <= top + this.topBarHeight() + 18 + feedHeight) return true;
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

  discipleTexture(b: PlacedBuilding): string {
    const discipleId = b.assigned[0];
    const disciple = this.gs.data.disciples.find(d => d.id === discipleId);
    return 'character-disciple-' + (disciple?.appearance || 'a');
  }

  drawBuilding(b: PlacedBuilding, animateConstruction = false): void {
    const def = this.gs.buildingDef(b.defId);
    this.drawCourtyard(b, def);
    const foot = this.gs.grid.getSpritePosition(b.gx, b.gy, def.w, def.h);
    const artPosition = this.buildingArtPosition(b.gx, b.gy, def.w, def.h);
    const artX = artPosition.x - foot.x;
    const artY = artPosition.y - foot.y;
    const renderScale = def.renderScale ?? DEFAULT_BUILDING_SCALE;
    const displayW = BUILDING_DISPLAY_W * renderScale;
    const displayH = BUILDING_DISPLAY_H * renderScale;
    const c = this.add.container(foot.x, foot.y);
    const art = this.add.image(artX, artY, 'building-' + def.id)
      .setDisplaySize(displayW, displayH)
      .setOrigin(0.5, 1.0);
    const worker = this.add.image(artX + displayW * 0.38, artY + 2, this.discipleTexture(b)).setDisplaySize(12, 18).setOrigin(0.5, 1);
    const label = this.add.text(artX, artY - displayH - 8, def.name, {
      fontSize: '9px', color: '#fff0c6', fontFamily: FONT,
      backgroundColor: '#2b1d13dd', padding: { x: 4, y: 2 },
      stroke: '#2b1d13', strokeThickness: 1,
    }).setOrigin(0.5);
    const barY = artY - displayH + 1;
    const bar = this.add.rectangle(artX, barY, TILE_W * 0.66, 5, 0x33251b, 0.95)
      .setOrigin(0.5)
      .setStrokeStyle(1, 0xc6a45c, 0.65)
      .setVisible(false);
    const fill = this.add.rectangle(artX - TILE_W * 0.33, barY, 0, 3, 0x91c96b)
      .setOrigin(0, 0.5)
      .setVisible(false);
    const hoverFrame = this.add.graphics().setVisible(false);
    this.drawLotPrism(hoverFrame, b.gx, b.gy, def.w, def.h, 0xffe071, foot.x, foot.y, 34);
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
    c.add([art, worker, label, bar, fill, scaffold, hoverFrame]);
    c.setData('bar', bar);
    c.setData('fill', fill);
    c.setData('label', label);
    c.setData('worker', worker);
    c.setData('art', art);
    c.setData('hoverFrame', hoverFrame);
    const hitW = Math.max(50, displayW + 12);
    const hitH = Math.max(50, displayH + 16);
    c.setSize(hitW, hitH);
    c.setInteractive(
      new Phaser.Geom.Rectangle(artX - hitW / 2, artY - hitH + 8, hitW, hitH),
      Phaser.Geom.Rectangle.Contains,
      true,
    );
    c.input!.cursor = 'pointer';
    c.on('pointerdown', (_ptr: Phaser.Input.Pointer, _lx: number, _ly: number, ev: any) => {
      if (this.selectedBuild) return;
      ev.stopPropagation();
      this.selectBuilding(b);
    });
    c.on('pointerover', () => {
      if (!this.selectedBuild) hoverFrame.setVisible(true);
    });
    c.on('pointerout', () => hoverFrame.setVisible(false));
    worker.setVisible(b.assigned.length > 0);
    b.sprite = c;
    c.setDepth(this.gs.grid.getDepth(
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
    const showBar = b.progress > 0 || b.queue > 0 || this.selectedBuilding?.uid === b.uid;
    fill.width = (TILE_W * 0.66) * Phaser.Math.Clamp(b.progress, 0, 1);
    bar.setVisible(showBar);
    fill.setVisible(showBar);
    worker.setTexture(this.discipleTexture(b));
    worker.setVisible(b.assigned.length > 0);
    const label = b.sprite.getData('label') as Phaser.GameObjects.Text;
    const scale = this.board ? this.board.scaleX : 1;
    const selected = this.selectedBuilding?.uid === b.uid;
    if (scale <= 0.55) { label.setVisible(false); return; }
    label.setVisible(true);
    let extra = '';
    if (scale > 0.95 || selected) {
      if ((b.level || 1) > 1) extra += ' Lv' + b.level;
      if (def.type === 'sell' && b.sellRecipe) extra += '·' + this.gs.recipeDef(b.sellRecipe).name;
      if (def.type === 'sell' && b.queue > 0) extra += ' 排' + b.queue;
      if (b.comboBonus > 0) extra += ' ✦';
    }
    label.setText(def.name + extra);
  }

  // ---------- Input ----------
  onMove(p: Phaser.Input.Pointer): void {
    if (this.researchOpen || this.elderOpen || this.recruitOpen || this.commissionOpen) {
      this.clearGhost();
      return;
    }
    if (this.selectedBuild) {
      const g = this.pointerToGrid(p);
      const def = this.gs.buildingDef(this.selectedBuild);
      if (!this.ghost) this.ghost = { gx: g.gx, gy: g.gy, ok: false };
      this.ghost.gx = g.gx; this.ghost.gy = g.gy;
      this.ghost.ok = this.gs.grid.canPlace(g.gx, g.gy, def.w, def.h);
      if (this.ghost.gfx) this.ghost.gfx.destroy();
      const col = this.ghost.ok ? 0x7ddb6a : 0xdd6a6a;
      this.ghost.gfx = this.add.container(0, 0);
      const artPosition = this.buildingArtPosition(g.gx, g.gy, def.w, def.h);
      const renderScale = def.renderScale ?? DEFAULT_BUILDING_SCALE;
      const preview = this.add.image(artPosition.x, artPosition.y, 'building-' + def.id)
        .setDisplaySize(BUILDING_DISPLAY_W * renderScale, BUILDING_DISPLAY_H * renderScale)
        .setOrigin(0.5, 1)
        .setTint(col)
        .setAlpha(0.58);
      const frame = this.add.graphics();
      this.drawLotPrism(frame, g.gx, g.gy, def.w, def.h, col);
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
    if (this.selectedBuild) {
      // 优先用 ghost，否则直接从指针位置反算格子（避免 hover 间隙导致点空）
      let gx = this.ghost?.gx, gy = this.ghost?.gy;
      if (gx === undefined || gy === undefined) {
        const g = this.pointerToGrid(p);
        gx = g.gx; gy = g.gy;
      }
      const def = this.gs.buildingDef(this.selectedBuild);
      if (this.gs.grid.canPlace(gx, gy, def.w, def.h)) {
        this.tryPlace(this.selectedBuild, gx, gy);
      } else {
        this.toast('此处需要 ' + def.w + '×' + def.h + ' 的完整空地');
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
    if (this.panPointerId === p.id) this.panPointerId = null;
  }

  tryPlace(defId: string, gx: number, gy: number): void {
    const def = this.gs.buildingDef(defId);
    const d = this.gs.data;
    if (d.spirit < def.cost) { this.toast('灵石不足'); return; }
    d.spirit -= def.cost;
    const b: PlacedBuilding = {
      uid: Date.now() + Math.floor(Math.random() * 999),
      defId, gx, gy, progress: 0, level: 1,
      craftRecipe: null, sellRecipe: null,
      assigned: [], queue: 0, comboBonus: 0, stock: 0,
    };
    d.buildings.push(b);
    this.gs.grid.place(gx, gy, b.uid, def.w, def.h);
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
  }

  clearGhost(): void {
    if (this.ghost?.gfx) this.ghost.gfx.destroy();
    this.ghost = null;
  }

  cancelBuild(): void {
    this.selectedBuild = null;
    this.clearGhost();
    this.setGridEmphasis(false);
    this.refreshBuildMenu();
  }

  // ---------- Visitors ----------
  updateNPCAnimation(c: Phaser.GameObjects.Container, screenDX: number, screenDY: number): void {
    if (Math.abs(screenDX) < 0.1 && Math.abs(screenDY) < 0.1) return;
    const person = c.getData('person') as Phaser.GameObjects.Image;
    const variant = c.getData('variant') as VisitorVariant;
    const facingBack = screenDY < -0.1;
    const movingRight = screenDX > 0;
    const facing = facingBack ? 'back' : 'front';
    person.setTexture('character-visitor-' + variant + (facingBack ? '-back' : ''));
    person.setFlipX(facingBack ? false : VISITOR_NATIVE_RIGHT[variant][facing] !== movingRight);
  }

  walkTo(c: Phaser.GameObjects.Container, x: number, y: number, targetGX: number, targetGY: number, duration: number, onComplete?: () => void): void {
    this.tweens.killTweensOf(c);
    const person = c.getData('person') as Phaser.GameObjects.Image;
    const shadow = c.getData('shadow') as Phaser.GameObjects.Ellipse;
    const startGX = c.getData('gridX') as number;
    const startGY = c.getData('gridY') as number;
    const baseY = 2;
    this.updateNPCAnimation(c, x - c.x, y - c.y);
    this.tweens.add({
      targets: c,
      x,
      y,
      duration,
      ease: 'Linear',
      onUpdate: (tween: Phaser.Tweens.Tween) => {
        const phase = tween.progress * Math.PI * 10;
        const lift = Math.abs(Math.sin(phase)) * 1.5;
        const gridX = Math.floor(Phaser.Math.Linear(startGX, targetGX, tween.progress));
        const gridY = Math.floor(Phaser.Math.Linear(startGY, targetGY, tween.progress));
        person.setY(baseY - lift).setAngle(Math.sin(phase) * 2.2);
        shadow.setScale(1 - lift * 0.055, 1 + lift * 0.015);
        c.setDepth(this.gs.grid.getDepth(
          gridX,
          gridY,
          { width: 1, height: 1 },
          NPC_DEPTH_LAYER,
        ));
        this.sortBoard();
      },
      onComplete: () => {
        person.setY(baseY).setAngle(0);
        shadow.setScale(1);
        c.setData('gridX', targetGX);
        c.setData('gridY', targetGY);
        c.setDepth(this.gs.grid.getDepth(
          targetGX,
          targetGY,
          { width: 1, height: 1 },
          NPC_DEPTH_LAYER,
        ));
        this.sortBoard();
        if (onComplete) onComplete();
      },
    });
  }

  spawnVisitorSprite(v: Visitor, shop: PlacedBuilding): void {
    const gateGrid = this.gateGridPosition();
    const gate = this.toScreen(gateGrid.gx, gateGrid.gy);
    const c = this.add.container(gate.x, gate.y);
    const shadow = this.add.ellipse(0, 1, 14, 5, 0x1c120d, 0.3);
    const variant = ['a', 'b', 'c', 'd'][Math.abs(v.id) % 4];
    const person = this.add.image(0, 2, 'character-visitor-' + variant).setDisplaySize(18, 26).setOrigin(0.5, 1);
    c.add([shadow, person]);
    c.setData('person', person);
    c.setData('shadow', shadow);
    c.setData('variant', variant);
    c.setData('gridX', gateGrid.gx);
    c.setData('gridY', gateGrid.gy);
    c.setDepth(this.gs.grid.getDepth(
      gateGrid.gx,
      gateGrid.gy,
      { width: 1, height: 1 },
      NPC_DEPTH_LAYER,
    ));
    this.entityLayer.add(c);
    this.sortBoard();
    this.visitorSprites.set(v.id, c);
    const target = this.buildingEntrance(shop);
    this.walkTo(c, target.x, target.y, target.gx, target.gy, 1600);
  }

  removeVisitorSprite(v: Visitor): void {
    const c = this.visitorSprites.get(v.id);
    if (!c) return;
    this.visitorSprites.delete(v.id);
    const gateGrid = this.gateGridPosition();
    const gate = this.toScreen(gateGrid.gx, gateGrid.gy);
    this.walkTo(c, gate.x, gate.y, gateGrid.gx, gateGrid.gy, 1200, () => c.destroy());
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
    const systemWidth = compact ? 104 : 150;
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
      { label: '保存', color: 0x5fb95a, run: () => { this.gs.save.save(); this.toast('进度已保存'); } },
      { label: '重开', color: 0xe56d5f, run: () => { this.gs.save.clear(); this.scene.start('Menu'); } },
    ];
    const buttonGap = 5;
    const buttonWidth = (systemWidth - 18 - buttonGap) / 2;
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
      this.hudLayer.add([btn, text]);
    });
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
    this.eventFeed.setVisible(!compact);
    if (compact) return;
    const x = 18;
    const y = 16 + this.topBarHeight() + 18;
    const width = 350;
    const rowHeight = 48;
    const shown = this.gs.data.eventLog.slice(-4).reverse();
    const entries = shown.length > 0 ? shown : null;
    const height = 34 + Math.max(1, entries ? entries.length : 1) * rowHeight + 22;
    this.eventFeed.setPosition(x, y);
    const bg = this.add.rectangle(0, 0, width, height, 0x2b241d, 0.78)
      .setOrigin(0, 0)
      .setStrokeStyle(1, 0xf0b45b, 0.7)
      .setInteractive();
    bg.on('pointerdown', (_p: Phaser.Input.Pointer, _x: number, _y: number, ev: any) => ev.stopPropagation());
    const title = this.add.text(12, 8, '宗门近况', {
      fontSize: '14px', color: '#ffe08a', fontFamily: FONT, fontStyle: 'bold',
    });
    const all = this.add.text(width - 12, 9, '查看全部 ›', {
      fontSize: '12px', color: '#ffd36b', fontFamily: FONT, fontStyle: 'bold',
    }).setOrigin(1, 0).setInteractive({ useHandCursor: true });
    all.on('pointerdown', (_p: Phaser.Input.Pointer, _x: number, _y: number, ev: any) => {
      ev.stopPropagation();
      this.toggleEventHistory();
    });
    this.eventFeed.add([bg, title, all]);
    if (!entries) {
      this.eventFeed.add(this.add.text(12, 34, '暂无新事件', { fontSize: '12px', color: '#b9aa90', fontFamily: FONT }));
    } else {
      entries.forEach((entry, index) => {
        const rowY = 34 + index * rowHeight;
        const row = this.add.rectangle(8, rowY, width - 16, rowHeight - 6, 0x41372d, 0.82)
          .setOrigin(0, 0)
          .setStrokeStyle(1, 0x8d7353, 0.45);
        const dot = this.add.rectangle(16, rowY + 9, 5, 20, Phaser.Display.Color.HexStringToColor(entry.color).color, 1)
          .setOrigin(0, 0);
        const head = this.add.text(30, rowY + 6, entry.title + '  ·  ' + entry.time, {
          fontSize: '12px', color: entry.color, fontFamily: FONT, fontStyle: 'bold',
          wordWrap: { width: width - 60 },
        });
        const detail = this.add.text(30, rowY + 22, entry.detail, {
          fontSize: '12px', color: '#fff1cf', fontFamily: FONT,
          wordWrap: { width: width - 60 },
        });
        this.eventFeed.add([row, dot, head, detail]);
      });
    }
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
    const defs = this.gs.defs.buildings;
    const compact = w < 760;
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
    const bar = this.add.rectangle(0, -menuHeight / 2, totalW + 20, menuHeight - 4, 0xffefc1, 0.96)
      .setStrokeStyle(2, 0xf08b3e, 0.95)
      .setInteractive();
    bar.on('pointerdown', (_p: Phaser.Input.Pointer, _x: number, _y: number, ev: any) => ev.stopPropagation());
    this.buildMenu.add(bar);

    const addButton = (
      x: number,
      y: number,
      label: string,
      color: number,
      run: () => void,
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
      btn.on('pointerdown', (_p: Phaser.Input.Pointer, _x: number, _y: number, ev: any) => {
        ev.stopPropagation();
        run();
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
      addButton(bx, firstRowY, def.name, 0xffcf68, () => {
        this.selectedBuild = this.selectedBuild === def.id ? null : def.id;
        this.setGridEmphasis(this.selectedBuild !== null);
        this.refreshBuildMenu();
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
        data: undefined as { key: string; value: string | number } | undefined,
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
    const panelWidth = 360;
    const contentWidth = 340;
    const columnWidth = 166;
    const columnGap = 8;
    const bg = this.add.rectangle(0, 0, panelWidth, 300, 0xfff0c9, 0.98)
      .setStrokeStyle(2, 0xf08b3e, 0.95)
      .setOrigin(0, 0)
      .setInteractive();
    bg.on('pointerdown', (_p: Phaser.Input.Pointer, _x: number, _y: number, ev: any) => ev.stopPropagation());
    const title = this.add.text(10, 8, def.name + ' Lv' + (b.level || 1), {
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
    this.infoPanel.add([bg, title, desc, speed, combo]);

    let y = 94;
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
    if (def.type === 'craft') {
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
    if (def.type === 'sell') {
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
    // 升级按钮
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

    // 弟子分配
    if (def.type !== 'house') {
      const roleLabel = def.type === 'gather' ? '灵植' : def.type === 'craft' ? '炼丹' : def.type === 'sell' ? '经营' : '天赋';
      addSectionHeader('弟子安排 · 看' + roleLabel);
      const idle = this.gs.data.disciples.filter(d => d.assignedTo === null || d.assignedTo === b.uid);
      idle.forEach((dis, index) => {
        const assigned = dis.assignedTo === b.uid;
        const attribute = def.type === 'gather' ? dis.planting : def.type === 'craft' ? dis.alchemy : def.type === 'sell' ? dis.business : dis.talent;
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
        if (def.type === 'train') detail += ' · ' + Math.round(dis.trainingProgress * 100) + '%';
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
    if (this.gs.buildingDef(b.defId).type === 'house') return;
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
    if (def.type === 'sell') this.releaseVisitorsForDemolishedShop(b);
    d.spirit += Math.floor(def.cost / 2);
    d.buildings = d.buildings.filter(x => x !== b);
    for (const dis of d.disciples) if (dis.assignedTo === b.uid) dis.assignedTo = null;
    this.gs.grid.remove(b.gx, b.gy, def.w, def.h, b.uid);
    if (b.sprite) b.sprite.destroy();
    if (b.lotSprite) b.lotSprite.destroy();
    this.gs.combo.recalc();
    this.selectBuilding(null);
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
    const list = this.gs.researchableRecipes();
    const h = 60 + Math.max(1, list.length) * 46;
    const bg = this.add.rectangle(0, 0, 320, h, 0xfff0c9, 0.99).setStrokeStyle(2, 0xf08b3e).setInteractive();
    bg.on('pointerdown', (_p: Phaser.Input.Pointer, _x: number, _y: number, ev: any) => ev.stopPropagation());
    const title = this.add.text(0, -h / 2 + 18, '丹方研发', { fontSize: '17px', color: '#6a361c', fontFamily: FONT }).setOrigin(0.5);
    this.researchPanel.add([bg, title]);
    let y = -h / 2 + 50;
    if (list.length === 0) {
      this.researchPanel.add(this.add.text(0, y, '暂无可研发丹方', { fontSize: '12px', color: '#7b6a55' }).setOrigin(0.5));
    }
    for (const r of list) {
      const check = this.gs.canResearch(r);
      const row = this.add.rectangle(0, y, 290, 38, check.ok ? 0xffd77b : 0xe9ddc5).setStrokeStyle(1, check.ok ? 0xd99a39 : 0xb9aa90).setInteractive({ useHandCursor: true });
      const name = this.add.text(-138, y - 10, r.name + '  售' + r.price + '  耗草' + r.input, { fontSize: '12px', color: '#6a361c', fontFamily: FONT }).setOrigin(0, 0.5);
      const cost = this.add.text(-138, y + 8, '研发：' + r.research!.spirit + '灵石 ' + r.research!.rep + '声望' + (check.ok ? '' : '（' + check.reason + '）'), { fontSize: '12px', color: check.ok ? '#26776a' : '#887869', fontFamily: FONT }).setOrigin(0, 0.5);
      if (check.ok) row.on('pointerdown', (_p: Phaser.Input.Pointer, _x: number, _y: number, ev: any) => { ev.stopPropagation(); this.doResearch(r.id); });
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
      this.toast('消耗 ' + ex.spirit + '灵石 ' + ex.rep + '声望，开拓新区域');
      this.gs.logEvent('expand', 'highlight', '开拓新域', '宗门开拓新区域（-' + ex.spirit + '灵石，需声望' + ex.rep + '）', '#8fdc72');
      this.gs.save.save();
    }
  }

  drawGridExpansion(): void {
    const g = this.gs.grid;
    const startX = g.w - 4;
    for (let gy = 0; gy < g.h; gy++) {
      for (let gx = startX; gx < g.w; gx++) {
        const s = this.toScreen(gx, gy);
        const color = (gx + gy) % 2 === 0 ? 0x8fd16d : 0x7bc45f;
        const tile = this.add.polygon(s.x, s.y, [0, TILE_H / 2, TILE_W / 2, 0, 0, -TILE_H / 2, -TILE_W / 2, 0], color)
          .setStrokeStyle(1, 0xd9ee91, this.selectedBuild ? 0.72 : 0.22);
        this.groundLayer.add(tile);
        this.gridTiles.push(tile);
      }
    }
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
    this.backdrop.setPosition(this.scale.width / 2, this.scale.height / 2)
      .setDisplaySize(this.scale.width, this.scale.height);
    this.layoutHUD();
    this.renderEventFeed();
    if (this.eventHistoryOpen) this.renderEventHistory();
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
      this.input.keyboard.on('keydown-ESC', () => {
        this.cancelBuild();
        this.selectBuilding(null);
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
