import { IsoGrid } from './systems/IsoGrid';
import { Economy } from './systems/Economy';
import { ComboSystem } from './systems/ComboSystem';
import { SaveSystem } from './systems/SaveSystem';

export type FactionId = 'dan' | 'jian';
export type SpiritRootId = 'tian' | 'shuang' | 'san' | 'si' | 'wu';
export type DiscipleAppearance = 'a' | 'b' | 'c' | 'd';
const INITIAL_GRID_W = 26;
const INITIAL_GRID_H = 19;

export interface BuildingDef {
  id: string; name: string; cost: number; w: number; h: number; color: string;
  type: 'gather' | 'craft' | 'sell' | 'train' | 'house' | 'mine' | 'forge' | 'artifactSell' | 'decor';
  output?: string; input?: string; baseTime?: number; capacity?: number; beds?: number; desc: string;
  renderScale?: number;
  unlockExpansion?: number;
  upgrades?: { cost: number; speed?: number; capacity?: number; beds?: number }[];
}
export interface RecipeDef { id: string; name: string; input: number; price: number; unlock: string; research?: { spirit: number; rep: number }; }
export interface ComboDef { id: string; name: string; needs: string[]; effect: string; value: number; desc: string; negative?: boolean; }
export interface ResearchDef { id: string; name: string; cost: number; rep: number; effect: string; value: number; desc: string; }
export interface FlavorEventDef {
  id: string; title: string; detail: string;
  effect?: { spirit?: number; reputation?: number; herbs?: number; spiritOre?: number };
}

export interface PlacedBuilding {
  uid: number; defId: string; gx: number; gy: number; slotId?: string;
  progress: number;
  level: number;
  craftRecipe: string | null;
  sellRecipe: string | null;
  assigned: string[];
  queue: number;
  comboBonus: number;
  stock: number;
  sprite?: Phaser.GameObjects.Container;
  lotSprite?: Phaser.GameObjects.Container;
}

export interface Disciple {
  id: string; name: string; level: number; assignedTo: number | null;
  root: SpiritRootId;
  planting: number;
  alchemy: number;
  business: number;
  talent: number;
  maxLevel: number;
  appearance: DiscipleAppearance;
  trainingProgress: number;
}

export interface RecruitCandidate {
  id: string; name: string; root: SpiritRootId;
  planting: number; alchemy: number; business: number; talent: number;
  maxLevel: number; appearance: DiscipleAppearance; cost: number;
}

export interface SpiritRootDef {
  id: SpiritRootId; name: string; weight: number; min: number; max: number; maxLevel: number; cost: number; color: string;
}

export interface CommissionDef {
  id: string; name: string; desc: string;
  type: 'herbs' | 'pill' | 'anyPill' | 'visitors' | 'craft' | 'train';
  target: number;
  recipeId?: string;
  reward: { spirit?: number; reputation?: number; training?: number };
}

export interface ActiveCommission {
  defId: string; acceptedDay: number; deadlineDay: number; startProgress: number;
}

export interface Visitor {
  id: number; state: 'walking' | 'queuing' | 'buying' | 'leaving';
  targetUid: number; patience: number; happy: boolean;
  name?: string; identity?: string;
  walkTimer?: number;
  arrivedAtShop?: boolean;
  arrivalWait?: number;
  sprite?: Phaser.GameObjects.Container;
}

export type EventType = 'visitor-buy' | 'visitor-leave' | 'gather' | 'craft' | 'build' | 'upgrade' | 'recruit' | 'train' | 'research' | 'elder' | 'expand' | 'commission' | 'combo' | 'day-summary' | 'title-up' | 'flavor';
export interface GameEvent { id: number; day: number; time: string; type: EventType; level: 'info' | 'highlight' | 'critical'; title: string; detail: string; color: string; }
export interface TitleCond { type: string; value: number; desc: string; }
export interface TitleDef { id: string; name: string; minDay: number; conds: TitleCond[]; anyConds?: TitleCond[]; }

export interface GameStateData {
  schemaVersion: number;
  faction: FactionId;
  spirit: number;
  herbs: number;
  pills: Record<string, number>;
  spiritOre: number;
  azureEdgeSwords: number;
  reputation: number;
  day: number; dayTime: number;
  gridW: number; gridH: number;
  unlockedRecipes: string[];
  completedResearch: string[];
  disciples: Disciple[];
  buildings: PlacedBuilding[];
  visitors: Visitor[];
  activeCombos: string[];
  expansionsUnlocked: number;
  elders: string[];
  totalEarned: number; visitorsServed: number; visitorsLost: number;
  totalCrafted: number; totalForged: number; totalBreakthroughs: number;
  dayEarned: number; dayVisitorsServed: number;
  recruitCandidates: RecruitCandidate[]; recruitRefreshCount: number; recruitNextDay: number;
  commissionOffers: string[]; activeCommission: ActiveCommission | null; nextCommissionDay: number;
  eventLog: GameEvent[]; firstSellDone: boolean; currentTitle: string;
  lastFlavorEventDay: number; recentFlavorEventIds: string[];
}

export class GameState {
  data: GameStateData;
  defs: { buildings: BuildingDef[]; recipes: RecipeDef[]; researches: ResearchDef[]; flavorEvents: FlavorEventDef[]; combos: ComboDef[]; factions: any[]; disciple: any; visitor: any; maxLevel: number; expansions: { spirit: number; rep: number; side: string }[]; elders: { id: string; name: string; cost: number; rep: number; effect: string; value: number; desc: string }[]; titles: TitleDef[]; visitorNames: { identity: string; name: string }[]; discipleNames: string[]; spiritRoots: SpiritRootDef[]; commissions: CommissionDef[] };
  grid: IsoGrid;
  economy: Economy;
  combo: ComboSystem;
  save: SaveSystem;
  scene: Phaser.Scene;
  events: Phaser.Events.EventEmitter;

  constructor(scene: Phaser.Scene, raw: any, faction: FactionId, restored?: GameStateData) {
    this.scene = scene;
    this.defs = raw;
    if (!this.defs.titles) this.defs.titles = [];
    if (!this.defs.visitorNames) this.defs.visitorNames = [];
    if (!this.defs.discipleNames) this.defs.discipleNames = [];
    if (!this.defs.spiritRoots) this.defs.spiritRoots = [];
    if (!this.defs.commissions) this.defs.commissions = [];
    if (!this.defs.researches) this.defs.researches = [];
    if (!this.defs.flavorEvents) this.defs.flavorEvents = [];
    this.events = new Phaser.Events.EventEmitter();
    this.grid = new IsoGrid(INITIAL_GRID_W, INITIAL_GRID_H);
    this.economy = new Economy(this);
    this.combo = new ComboSystem(this);
    this.save = new SaveSystem(this);
    if (restored) {
      if (!restored.eventLog) restored.eventLog = [];
      if (restored.firstSellDone === undefined) restored.firstSellDone = restored.visitorsServed > 0;
      if (!restored.currentTitle) restored.currentTitle = 't0';
      if (restored.dayEarned === undefined) restored.dayEarned = 0;
      if (restored.dayVisitorsServed === undefined) restored.dayVisitorsServed = 0;
      if (restored.totalCrafted === undefined) restored.totalCrafted = 0;
      if (restored.spiritOre === undefined) restored.spiritOre = 0;
      if (restored.azureEdgeSwords === undefined) restored.azureEdgeSwords = 0;
      if (restored.totalForged === undefined) restored.totalForged = 0;
      if (restored.totalBreakthroughs === undefined) restored.totalBreakthroughs = 0;
      if (!Array.isArray(restored.recruitCandidates)) restored.recruitCandidates = [];
      if (restored.recruitRefreshCount === undefined) restored.recruitRefreshCount = 0;
      if (restored.recruitNextDay === undefined) restored.recruitNextDay = 0;
      if (!Array.isArray(restored.commissionOffers)) restored.commissionOffers = [];
      if (restored.activeCommission === undefined) restored.activeCommission = null;
      if (restored.activeCommission && restored.activeCommission.deadlineDay < restored.activeCommission.acceptedDay + 5) {
        restored.activeCommission.deadlineDay = restored.activeCommission.acceptedDay + 5;
      }
      if (restored.nextCommissionDay === undefined) restored.nextCommissionDay = restored.day;
      if (!Array.isArray(restored.disciples)) restored.disciples = [];
      if (!Array.isArray(restored.buildings)) restored.buildings = [];
      if (!Array.isArray(restored.unlockedRecipes)) restored.unlockedRecipes = [];
      if (!Array.isArray(restored.completedResearch)) restored.completedResearch = [];
      if (!Array.isArray(restored.recentFlavorEventIds)) restored.recentFlavorEventIds = [];
      if (!Number.isFinite(restored.lastFlavorEventDay)) restored.lastFlavorEventDay = restored.day;
      if (!restored.pills || typeof restored.pills !== 'object') restored.pills = {};
      for (const recipeId of restored.unlockedRecipes) {
        if (!Number.isFinite(restored.pills[recipeId])) restored.pills[recipeId] = 0;
      }
      for (const building of restored.buildings) {
        if (building.craftRecipe === undefined) building.craftRecipe = null;
        if (building.sellRecipe === undefined) building.sellRecipe = null;
      }
      this.normalizeDisciples(restored.disciples);
      let oldGridW = restored.gridW || 8;
      let oldGridH = restored.gridH || 8;
      const desiredGridW = INITIAL_GRID_W;
      if (oldGridW > desiredGridW || oldGridH > INITIAL_GRID_H) {
        const trimX = Math.max(0, Math.floor((oldGridW - desiredGridW) / 2));
        const trimY = Math.max(0, Math.floor((oldGridH - INITIAL_GRID_H) / 2));
        const canTrimSafely = restored.buildings.every(building => {
          const def = this.buildingDef(building.defId);
          const gx = building.gx - trimX;
          const gy = building.gy - trimY;
          return gx >= 0 && gy >= 0 && gx + def.w <= desiredGridW && gy + def.h <= INITIAL_GRID_H;
        });
        if (canTrimSafely) {
          for (const building of restored.buildings) {
            building.gx -= trimX;
            building.gy -= trimY;
          }
          oldGridW = desiredGridW;
          oldGridH = INITIAL_GRID_H;
        }
      }
      const offsetX = oldGridW < desiredGridW ? Math.floor((desiredGridW - oldGridW) / 2) : 0;
      const offsetY = oldGridH < INITIAL_GRID_H ? Math.floor((INITIAL_GRID_H - oldGridH) / 2) : 0;
      if (offsetX || offsetY) {
        for (const building of restored.buildings) {
          building.gx += offsetX;
          building.gy += offsetY;
        }
      }
      restored.gridW = Math.max(oldGridW, desiredGridW);
      restored.gridH = Math.max(oldGridH, INITIAL_GRID_H);
      this.grid = new IsoGrid(restored.gridW, restored.gridH);
      this.data = restored;
      this.grid.rebuildFrom(restored.buildings, (building) => {
        const def = this.buildingDef(building.defId);
        return { width: def.w, height: def.h };
      });
    } else {
      const fac = raw.factions.find((f: any) => f.id === faction);
      const recipes = raw.recipes.filter((r: RecipeDef) => r.unlock === 'default' || r.unlock === faction).map((r: RecipeDef) => r.id);
      this.data = {
        schemaVersion: 9,
        faction, spirit: 300, herbs: 0, pills: {}, spiritOre: 0, azureEdgeSwords: 0, reputation: 10,
        day: 1, dayTime: 0, gridW: INITIAL_GRID_W, gridH: INITIAL_GRID_H,
        unlockedRecipes: recipes,
        completedResearch: [],
        disciples: [{
          id: 'd0', name: '顾长风', level: 1, assignedTo: null,
          root: 'san', planting: 62, alchemy: 60, business: 56, talent: 65,
          maxLevel: 8, appearance: 'a', trainingProgress: 0,
        }],
        buildings: [], visitors: [], activeCombos: [],
        expansionsUnlocked: 0, elders: [],
        totalEarned: 0, visitorsServed: 0, visitorsLost: 0,
        totalCrafted: 0, totalForged: 0, totalBreakthroughs: 0,
        dayEarned: 0, dayVisitorsServed: 0,
        recruitCandidates: [], recruitRefreshCount: 0, recruitNextDay: 0,
        commissionOffers: [], activeCommission: null, nextCommissionDay: 1,
        eventLog: [], firstSellDone: false, currentTitle: 't0',
        lastFlavorEventDay: 1, recentFlavorEventIds: [],
      };
      for (const r of recipes) this.data.pills[r] = 0;
    }
    this.ensureCommissionOffers();
  }

  normalizeDisciples(disciples: Disciple[]): void {
    const names = this.defs.discipleNames.length ? this.defs.discipleNames : ['顾长风', '苏灵溪', '沈青崖', '洛清霜'];
    const appearances: DiscipleAppearance[] = ['a', 'b', 'c', 'd'];
    const used = new Set<string>();
    disciples.forEach((disciple, index) => {
      if (!disciple.name || /^(弟子\d+|大弟子)$/.test(disciple.name) || used.has(disciple.name)) {
        disciple.name = names.find(name => !used.has(name)) || names[index % names.length] + (index + 1);
      }
      used.add(disciple.name);
      disciple.root = disciple.root || 'san';
      disciple.planting = disciple.planting ?? (58 + index % 8);
      disciple.alchemy = disciple.alchemy ?? (56 + (index * 3) % 10);
      disciple.business = disciple.business ?? (55 + (index * 5) % 11);
      disciple.talent = disciple.talent ?? (60 + (index * 7) % 8);
      const root = this.spiritRootDef(disciple.root);
      disciple.maxLevel = Math.max(disciple.level || 1, disciple.maxLevel || root?.maxLevel || 8);
      disciple.appearance = disciple.appearance || appearances[index % appearances.length];
      disciple.trainingProgress = disciple.trainingProgress ?? 0;
      if (disciple.assignedTo === undefined) disciple.assignedTo = null;
    });
  }

  logEvent(type: EventType, level: 'info' | 'highlight' | 'critical', title: string, detail: string, color: string): void {
    const d = this.data;
    const totalMinutes = Math.floor(360 + (d.dayTime / 60) * 1080) % 1440;
    const hh = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
    const mm = String(totalMinutes % 60).padStart(2, '0');
    d.eventLog.push({ id: Date.now() + Math.floor(Math.random() * 1000), day: d.day, time: hh + ':' + mm, type, level, title, detail, color });
    if (d.eventLog.length > 200) d.eventLog.splice(0, d.eventLog.length - 200);
    this.events.emit('game-event');
  }

  spiritRootDef(id: SpiritRootId): SpiritRootDef | undefined {
    return this.defs.spiritRoots.find(root => root.id === id);
  }

  ensureRecruitCandidates(): RecruitCandidate[] {
    if (this.data.recruitNextDay > this.data.day) return [];
    if (this.data.recruitNextDay > 0) {
      this.data.recruitNextDay = 0;
      this.data.recruitRefreshCount = 0;
    }
    if (this.data.recruitCandidates.length !== 3) this.data.recruitCandidates = this.rollRecruitCandidates();
    return this.data.recruitCandidates;
  }

  recruitCooldownDays(): number {
    return Math.max(0, this.data.recruitNextDay - this.data.day);
  }

  rollRecruitCandidates(): RecruitCandidate[] {
    const usedNames = new Set([
      ...this.data.disciples.map(disciple => disciple.name),
      ...this.data.recruitCandidates.map(candidate => candidate.name),
    ]);
    const appearances: DiscipleAppearance[] = ['a', 'b', 'c', 'd'];
    const candidates: RecruitCandidate[] = [];
    for (let index = 0; index < 3; index++) {
      const root = this.rollSpiritRoot();
      const name = this.rollDiscipleName(usedNames, index);
      usedNames.add(name);
      const specialty = Math.floor(Math.random() * 4);
      const values = [0, 1, 2, 3].map(attributeIndex => {
        const min = attributeIndex === specialty ? Math.ceil((root.min + root.max) / 2) : root.min;
        return min + Math.floor(Math.random() * (root.max - min + 1));
      });
      candidates.push({
        id: 'c' + Date.now() + '_' + index + '_' + Math.floor(Math.random() * 10000),
        name,
        root: root.id,
        planting: values[0],
        alchemy: values[1],
        business: values[2],
        talent: values[3],
        maxLevel: root.maxLevel,
        appearance: appearances[Math.floor(Math.random() * appearances.length)],
        cost: root.cost,
      });
    }
    return candidates;
  }

  rollDiscipleName(usedNames: Set<string>, index: number): string {
    const availableNames = this.defs.discipleNames.filter(name => !usedNames.has(name));
    if (availableNames.length) return availableNames[Math.floor(Math.random() * availableNames.length)];
    const surnames = ['凌', '陆', '云', '沈', '顾', '谢', '白', '洛', '秦', '楚', '温', '叶'];
    const givenA = ['清', '玄', '问', '知', '照', '归', '扶', '观', '听', '映', '怀', '凝'];
    const givenB = ['尘', '真', '川', '月', '雪', '澜', '舟', '霜', '竹', '岚', '星', '衡'];
    for (let attempt = 0; attempt < 36; attempt++) {
      const name = surnames[(Date.now() + index + attempt) % surnames.length]
        + givenA[Math.floor(Math.random() * givenA.length)]
        + givenB[Math.floor(Math.random() * givenB.length)];
      if (!usedNames.has(name)) return name;
    }
    return '游尘客' + ['甲', '乙', '丙', '丁', '戊', '己'][index % 6];
  }

  rollSpiritRoot(): SpiritRootDef {
    const roots = this.defs.spiritRoots;
    const fallback: SpiritRootDef = { id: 'san', name: '三灵根', weight: 1, min: 55, max: 69, maxLevel: 8, cost: 150, color: '#5aa7dc' };
    if (!roots.length) return fallback;
    const total = roots.reduce((sum, root) => sum + root.weight, 0);
    let roll = Math.random() * total;
    for (const root of roots) {
      roll -= root.weight;
      if (roll <= 0) return root;
    }
    return roots[roots.length - 1];
  }

  recruitRefreshCost(): number | null {
    return [500, 1000, 2000][this.data.recruitRefreshCount] ?? null;
  }

  refreshRecruitCandidates(): { ok: boolean; reason: string; cost: number } {
    if (this.recruitCooldownDays() > 0) return { ok: false, reason: '新的散修尚未到访', cost: 0 };
    const cost = this.recruitRefreshCost();
    if (cost === null) return { ok: false, reason: '本轮刷新次数已用尽', cost: 0 };
    if (this.data.spirit < cost) return { ok: false, reason: '灵石不足，还差' + (cost - this.data.spirit), cost };
    this.data.spirit -= cost;
    this.data.recruitRefreshCount++;
    this.data.recruitCandidates = this.rollRecruitCandidates();
    return { ok: true, reason: '', cost };
  }

  abandonRecruitCandidates(): { ok: boolean; reason: string } {
    if (this.data.recruitRefreshCount < 3) return { ok: false, reason: '需用尽三次刷新后才能放弃本轮' };
    if (this.data.recruitCandidates.length !== 3) return { ok: false, reason: '当前没有可放弃的候选' };
    this.data.recruitCandidates = [];
    this.data.recruitRefreshCount = 0;
    this.data.recruitNextDay = this.data.day + 3;
    return { ok: true, reason: '' };
  }

  hireRecruitCandidate(candidateId: string): { ok: boolean; reason: string; candidate?: RecruitCandidate } {
    const candidate = this.data.recruitCandidates.find(item => item.id === candidateId);
    if (!candidate) return { ok: false, reason: '候选弟子已离开' };
    if (this.data.disciples.length >= this.discipleCap()) return { ok: false, reason: '弟子上限已满，需建厢房' };
    if (this.data.spirit < candidate.cost) return { ok: false, reason: '灵石不足，还差' + (candidate.cost - this.data.spirit) };
    this.data.spirit -= candidate.cost;
    this.data.disciples.push({
      id: 'd' + Date.now() + '_' + Math.floor(Math.random() * 10000),
      name: candidate.name,
      level: 1,
      assignedTo: null,
      root: candidate.root,
      planting: candidate.planting,
      alchemy: candidate.alchemy,
      business: candidate.business,
      talent: candidate.talent,
      maxLevel: candidate.maxLevel,
      appearance: candidate.appearance,
      trainingProgress: 0,
    });
    this.data.recruitCandidates = [];
    this.data.recruitRefreshCount = 0;
    this.data.recruitNextDay = 0;
    return { ok: true, reason: '', candidate };
  }

  commissionDef(id: string): CommissionDef | undefined {
    return this.defs.commissions.find(commission => commission.id === id);
  }

  ensureCommissionOffers(): void {
    const d = this.data;
    if (d.activeCommission || d.commissionOffers.length > 0 || d.day < d.nextCommissionDay) return;
    const eligible = this.defs.commissions.filter(commission => {
      return !commission.recipeId || d.unlockedRecipes.includes(commission.recipeId);
    });
    const shuffled = [...eligible].sort(() => Math.random() - 0.5);
    d.commissionOffers = shuffled.slice(0, 3).map(commission => commission.id);
  }

  commissionStartValue(def: CommissionDef): number {
    if (def.type === 'visitors') return this.data.visitorsServed;
    if (def.type === 'craft') return this.data.totalCrafted;
    if (def.type === 'train') return this.data.totalBreakthroughs;
    return 0;
  }

  acceptCommission(id: string): { ok: boolean; reason: string } {
    if (this.data.activeCommission) return { ok: false, reason: '已有进行中的委托' };
    if (!this.data.commissionOffers.includes(id)) return { ok: false, reason: '委托已经失效' };
    const def = this.commissionDef(id);
    if (!def) return { ok: false, reason: '委托不存在' };
    this.data.activeCommission = {
      defId: id,
      acceptedDay: this.data.day,
      deadlineDay: this.data.day + 5,
      startProgress: this.commissionStartValue(def),
    };
    this.data.commissionOffers = [];
    return { ok: true, reason: '' };
  }

  commissionProgress(): { current: number; target: number } {
    const active = this.data.activeCommission;
    if (!active) return { current: 0, target: 0 };
    const def = this.commissionDef(active.defId);
    if (!def) return { current: 0, target: 0 };
    let current = 0;
    if (def.type === 'herbs') current = this.data.herbs;
    else if (def.type === 'pill' && def.recipeId) current = this.data.pills[def.recipeId] || 0;
    else if (def.type === 'anyPill') current = Object.values(this.data.pills).reduce((sum, count) => sum + count, 0);
    else current = this.commissionStartValue(def) - active.startProgress;
    return { current: Math.max(0, current), target: def.target };
  }

  reservedHerbsForCommission(): number {
    const active = this.data.activeCommission;
    if (!active) return 0;
    const def = this.commissionDef(active.defId);
    if (!def || def.type !== 'herbs') return 0;
    return Math.max(0, def.target);
  }

  submitCommission(): { ok: boolean; reason: string; def?: CommissionDef; rewardText?: string } {
    const active = this.data.activeCommission;
    if (!active) return { ok: false, reason: '当前没有进行中的委托' };
    const def = this.commissionDef(active.defId);
    if (!def) return { ok: false, reason: '委托不存在' };
    const progress = this.commissionProgress();
    if (progress.current < progress.target) return { ok: false, reason: '尚差' + (progress.target - progress.current) };
    if (def.type === 'herbs') this.data.herbs -= def.target;
    else if (def.type === 'pill' && def.recipeId) this.data.pills[def.recipeId] -= def.target;
    else if (def.type === 'anyPill') this.consumeAnyPills(def.target);
    const rewardParts: string[] = [];
    if (def.reward.spirit) {
      this.data.spirit += def.reward.spirit;
      rewardParts.push(def.reward.spirit + '灵石');
    }
    if (def.reward.reputation) {
      this.data.reputation += def.reward.reputation;
      rewardParts.push(def.reward.reputation + '声望');
    }
    if (def.reward.training) {
      const disciple = this.data.disciples
        .filter(item => item.level < item.maxLevel)
        .sort((a, b) => a.level - b.level)[0];
      if (disciple) {
        disciple.trainingProgress = Math.min(1, disciple.trainingProgress + def.reward.training);
        rewardParts.push(disciple.name + '修炼进度+' + Math.round(def.reward.training * 100) + '%');
      }
    }
    this.data.activeCommission = null;
    this.data.nextCommissionDay = this.data.day + 3;
    return { ok: true, reason: '', def, rewardText: rewardParts.join('、') || '宗门声望提升' };
  }

  consumeAnyPills(count: number): void {
    const recipeIds = Object.keys(this.data.pills).sort((a, b) => this.recipeDef(a).price - this.recipeDef(b).price);
    let remaining = count;
    for (const recipeId of recipeIds) {
      const used = Math.min(remaining, this.data.pills[recipeId] || 0);
      this.data.pills[recipeId] -= used;
      remaining -= used;
      if (remaining <= 0) break;
    }
  }

  expireCommissionIfNeeded(): CommissionDef | null {
    const active = this.data.activeCommission;
    if (!active || this.data.day < active.deadlineDay) {
      this.ensureCommissionOffers();
      return null;
    }
    const def = this.commissionDef(active.defId) || null;
    this.data.activeCommission = null;
    this.data.nextCommissionDay = this.data.day + 3;
    return def;
  }

  trainingCost(targetLevel: number): number {
    return 30 + targetLevel * 10;
  }

  trainingCapacity(b: PlacedBuilding): number {
    return this.buildingDef(b.defId).type === 'train' ? Math.min(6, this.upgradeLevel(b) + 1) : 0;
  }

  progressionBuildingCount(): number {
    return this.data.buildings.filter(building => this.buildingDef(building.defId).type !== 'decor').length;
  }

  titleIndex(): number { return Math.max(0, this.defs.titles.findIndex(t => t.id === this.data.currentTitle)); }

  titleCondMet(c: TitleCond): { ok: boolean; cur: number } {
    const d = this.data;
    let cur = 0;
    if (c.type === 'visitorsServed') cur = d.visitorsServed;
    else if (c.type === 'reputation') cur = d.reputation;
    else if (c.type === 'totalEarned') cur = d.totalEarned;
    else if (c.type === 'disciples') cur = d.disciples.length;
    else if (c.type === 'research') cur = this.defs.recipes.filter(r => r.unlock === 'research' && d.unlockedRecipes.includes(r.id)).length + d.completedResearch.length;
    else if (c.type === 'elders') cur = d.elders.length;
    else if (c.type === 'expansions') cur = d.expansionsUnlocked;
    else if (c.type === 'buildings') cur = this.progressionBuildingCount();
    else if (c.type === 'upgradeLevels') cur = d.buildings.reduce((sum, b) => sum + (this.buildingDef(b.defId).type === 'decor' ? 0 : Math.max(0, (b.level || 1) - 1)), 0);
    else if (c.type === 'firstSell') cur = d.firstSellDone ? 1 : 0;
    else if (c.type === 'hasCore') { const types = new Set(d.buildings.map(b => this.buildingDef(b.defId).type)); cur = (types.has('gather') && types.has('craft') && types.has('sell')) ? 1 : 0; }
    return { ok: cur >= c.value, cur };
  }

  checkTitleUp(): TitleDef | null {
    const next = this.defs.titles[this.titleIndex() + 1];
    if (!next) return null;
    if (this.data.day < next.minDay) return null;
    for (const c of next.conds) if (!this.titleCondMet(c).ok) return null;
    if (next.anyConds?.length && !next.anyConds.some(c => this.titleCondMet(c).ok)) return null;
    return next;
  }

  advanceTitles(): TitleDef[] {
    const advanced: TitleDef[] = [];
    let next = this.checkTitleUp();
    while (next) {
      this.applyTitleUp(next);
      advanced.push(next);
      next = this.checkTitleUp();
    }
    return advanced;
  }

  applyTitleUp(t: TitleDef): void {
    this.data.currentTitle = t.id;
    this.logEvent('title-up', 'critical', '宗门晋号：' + t.name, '声望日隆，晋号「' + t.name + '」', '#ffd76b');
  }

  buildingDef(id: string): BuildingDef { return this.defs.buildings.find(b => b.id === id)!; }
  recipeDef(id: string): RecipeDef { return this.defs.recipes.find(r => r.id === id)!; }

  factionBonus(type: string): number {
    const f = this.defs.factions.find((x: any) => x.id === this.data.faction);
    return f && f.bonusType === type ? f.bonusValue : 0;
  }

  discipleCap(): number {
    let cap = 2;
    for (const b of this.data.buildings) {
      const d = this.buildingDef(b.defId);
      if (d.type === 'house') cap += this.houseBeds(b);
    }
    return cap;
  }

  upgradeLevel(b: PlacedBuilding): number { return b.level || 1; }

  upgradeBonus(b: PlacedBuilding, key: 'speed' | 'capacity' | 'beds'): number {
    const def = this.buildingDef(b.defId);
    if (!def.upgrades) return 0;
    let total = 0;
    for (let i = 0; i < this.upgradeLevel(b) - 1 && i < def.upgrades.length; i++) total += def.upgrades[i][key] || 0;
    return total;
  }

  nextUpgrade(b: PlacedBuilding): { cost: number; speed?: number; capacity?: number; beds?: number } | null {
    const def = this.buildingDef(b.defId);
    if (!def.upgrades) return null;
    const idx = this.upgradeLevel(b) - 1;
    return idx < def.upgrades.length ? def.upgrades[idx] : null;
  }

  houseBeds(b: PlacedBuilding): number {
    const d = this.buildingDef(b.defId);
    return (d.beds || 0) + this.upgradeBonus(b, 'beds');
  }

  shopCapacity(b: PlacedBuilding): number {
    const d = this.buildingDef(b.defId);
    return (d.capacity || 0) + this.upgradeBonus(b, 'capacity');
  }

  speedOf(b: PlacedBuilding): number {
    let mult = 1 + b.comboBonus + this.workersBonus(b) + this.upgradeBonus(b, 'speed');
    const def = this.buildingDef(b.defId);
    // Dan-specific faction, elder and combo effects must not leak into forging.
    if (def.id === 'danfang') mult += this.factionBonus('craftSpeed') + this.elderBonus('craftSpeed');
    if (def.id === 'lianqi') mult += this.researchBonus('forgeSpeed') + this.elderBonus('forgeSpeed');
    return mult;
  }

  workersBonus(b: PlacedBuilding): number {
    const def = this.buildingDef(b.defId);
    if (def.type === 'house' || def.type === 'decor') return 0;
    let bonus = 0;
    for (const did of b.assigned) {
      const dis = this.data.disciples.find(d => d.id === did);
      if (!dis) continue;
      let attribute = dis.talent;
      if (def.id === 'lingtian') attribute = dis.planting;
      else if (def.id === 'danfang') attribute = dis.alchemy;
      else if (def.type === 'sell' || def.type === 'artifactSell') attribute = dis.business;
      bonus += attribute * 0.002 + Math.max(0, dis.level - 1) * 0.02;
    }
    return Math.min(1, bonus);
  }

  sellPrice(recipeId: string): number {
    const r = this.recipeDef(recipeId);
    return Math.round(r.price * (1 + this.factionBonus('sellPrice') + this.elderBonus('sellPrice')));
  }

  artifactSellPrice(): number {
    return Math.round(65 * (1 + this.factionBonus('sellPrice') + this.researchBonus('artifactSellPrice') + this.elderBonus('artifactSellPrice')));
  }

  researchBonus(effect: string): number {
    let total = 0;
    for (const id of this.data.completedResearch) {
      const research = this.defs.researches.find(item => item.id === id);
      if (research?.effect === effect) total += research.value;
    }
    return total;
  }

  elderBonus(effect: string): number {
    let total = 0;
    for (const eid of this.data.elders) {
      const e = this.defs.elders.find(x => x.id === eid);
      if (e && e.effect === effect) total += e.value;
    }
    return total;
  }

  hireableElders() { return this.defs.elders.filter(e => !this.data.elders.includes(e.id)); }

  hireElder(id: string): { ok: boolean; reason: string } {
    const e = this.defs.elders.find(x => x.id === id);
    if (!e) return { ok: false, reason: '无此长老' };
    if (this.data.spirit < e.cost) return { ok: false, reason: '灵石不足' };
    if (this.data.reputation < e.rep) return { ok: false, reason: '声望不足' };
    this.data.spirit -= e.cost;
    this.data.elders.push(id);
    return { ok: true, reason: '' };
  }

  nextExpansion() {
    return this.data.expansionsUnlocked < this.defs.expansions.length ? this.defs.expansions[this.data.expansionsUnlocked] : null;
  }

  canExpand(): { ok: boolean; reason: string } {
    const ex = this.nextExpansion();
    if (!ex) return { ok: false, reason: '已全部解锁' };
    if (this.data.spirit < ex.spirit) return { ok: false, reason: '灵石不足' };
    if (this.data.reputation < ex.rep) return { ok: false, reason: '声望不足' };
    return { ok: true, reason: '' };
  }

  expand(): boolean {
    const check = this.canExpand();
    if (!check.ok) return false;
    const ex = this.nextExpansion()!;
    this.data.spirit -= ex.spirit;
    this.data.expansionsUnlocked++;
    this.data.gridW = this.grid.w;
    this.data.gridH = this.grid.h;
    return true;
  }

  researchableRecipes(): RecipeDef[] {
    return this.defs.recipes.filter(r => r.unlock === 'research' && !this.data.unlockedRecipes.includes(r.id));
  }

  canResearch(r: RecipeDef): { ok: boolean; reason: string } {
    if (!r.research) return { ok: false, reason: '不可研发' };
    if (this.data.spirit < r.research.spirit) return { ok: false, reason: '灵石不足' };
    if (this.data.reputation < r.research.rep) return { ok: false, reason: '声望不足' };
    return { ok: true, reason: '' };
  }

  research(r: RecipeDef): boolean {
    const check = this.canResearch(r);
    if (!check.ok || !r.research) return false;
    this.data.spirit -= r.research.spirit;
    this.data.unlockedRecipes.push(r.id);
    this.data.pills[r.id] = 0;
    return true;
  }

  researchableProjects(): ResearchDef[] {
    return this.defs.researches.filter(research => !this.data.completedResearch.includes(research.id));
  }

  canResearchProject(research: ResearchDef): { ok: boolean; reason: string } {
    if (this.data.completedResearch.includes(research.id)) return { ok: false, reason: '已经完成' };
    if (this.data.spirit < research.cost) return { ok: false, reason: '灵石不足' };
    if (this.data.reputation < research.rep) return { ok: false, reason: '声望不足' };
    return { ok: true, reason: '' };
  }

  completeResearchProject(id: string): boolean {
    const research = this.defs.researches.find(item => item.id === id);
    if (!research || !this.canResearchProject(research).ok) return false;
    this.data.spirit -= research.cost;
    this.data.completedResearch.push(id);
    return true;
  }

  triggerDailyFlavorEvents(random: () => number = Math.random): FlavorEventDef[] {
    const d = this.data;
    if (d.lastFlavorEventDay >= d.day || this.defs.flavorEvents.length === 0) return [];
    const recent = new Set(d.recentFlavorEventIds);
    let pool = this.defs.flavorEvents.filter(event => !recent.has(event.id));
    if (pool.length < 2) pool = [...this.defs.flavorEvents];
    const count = random() < 0.5 ? 1 : 2;
    const selected: FlavorEventDef[] = [];
    while (pool.length > 0 && selected.length < count) {
      const index = Math.min(pool.length - 1, Math.floor(random() * pool.length));
      selected.push(pool.splice(index, 1)[0]);
    }
    for (const event of selected) {
      this.applyFlavorEffect(event);
      const suffix = this.flavorEffectText(event);
      this.logEvent('flavor', event.effect ? 'highlight' : 'info', event.title, event.detail + (suffix ? '｜' + suffix : ''), event.effect ? '#b8df83' : '#d7c7a4');
    }
    d.lastFlavorEventDay = d.day;
    d.recentFlavorEventIds = [...d.recentFlavorEventIds, ...selected.map(event => event.id)].slice(-5);
    return selected;
  }

  applyFlavorEffect(event: FlavorEventDef): void {
    const effect = event.effect;
    if (!effect) return;
    const d = this.data;
    if (effect.spirit) d.spirit = Math.max(0, d.spirit + effect.spirit);
    if (effect.reputation) d.reputation = Phaser.Math.Clamp(d.reputation + effect.reputation, 0, 999);
    if (effect.herbs) d.herbs = Math.max(0, d.herbs + effect.herbs);
    if (effect.spiritOre) d.spiritOre = Math.max(0, d.spiritOre + effect.spiritOre);
  }

  flavorEffectText(event: FlavorEventDef): string {
    const effect = event.effect;
    if (!effect) return '';
    const parts: string[] = [];
    const push = (label: string, value?: number): void => {
      if (!value) return;
      parts.push(label + (value > 0 ? '+' : '') + value);
    };
    push('灵石', effect.spirit);
    push('声望', effect.reputation);
    push('药草', effect.herbs);
    push('灵矿石', effect.spiritOre);
    return parts.join('，');
  }
}
