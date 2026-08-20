export type CunjingeRoomId = 'market' | 'cloud' | 'heaven';
export type CunjingeNpcArchetype = 'alchemist' | 'sword' | 'merchant';
export type CunjingeRarity = 'white' | 'green' | 'blue' | 'purple' | 'gold';
export type CunjingeShape = '1x1' | '1x2' | '2x1' | '2x2' | 'L';
export type CunjingeAppraisalId = 'shape' | 'aura' | 'price' | 'fake';

export interface CunjingeRoomDef {
  id: CunjingeRoomId;
  name: string;
  minChips: number;
  minReputation: number;
  valueMin: number;
  valueMax: number;
  xp: number;
}

export interface CunjingeNpcDef {
  id: string;
  name: string;
  title: string;
  archetype: CunjingeNpcArchetype;
  risk: number;
  bluff: number;
}

export interface CunjingeItemDef {
  id: string;
  name: string;
  category: 'herb' | 'pill' | 'ore' | 'artifact' | 'manual' | 'curio';
  rarity: CunjingeRarity;
  shape: CunjingeShape;
}

export interface CunjingeChestItem {
  defId: string;
  name: string;
  category: CunjingeItemDef['category'];
  rarity: CunjingeRarity;
  shape: CunjingeShape;
  x: number;
  y: number;
  cells: { x: number; y: number }[];
  value: number;
}

export interface CunjingeClue {
  round: number;
  title: string;
  detail: string;
  estimateLow: number;
  estimateHigh: number;
}

export interface CunjingeRoundBid {
  round: number;
  player: number;
  npcs: Record<string, number>;
  submitOrder: string[];
}

export interface CunjingeAuctionResult {
  winnerId: string;
  winningBid: number;
  actualValue: number;
  playerProfit: number;
  playerWon: boolean;
}

export interface CunjingeAuctionState {
  seed: number;
  roomId: CunjingeRoomId;
  tutorial: boolean;
  round: number;
  secondsLeft: number;
  playerDraftBid: number;
  previousPlayerBid: number;
  appraisalUsesLeft: number;
  usedAppraisals: CunjingeAppraisalId[];
  appraisalResults: string[];
  npcIds: string[];
  items: CunjingeChestItem[];
  clues: CunjingeClue[];
  bidHistory: CunjingeRoundBid[];
  result: CunjingeAuctionResult | null;
}

export interface CunjingeStats {
  chestsPlayed: number;
  wins: number;
  totalProfit: number;
  totalLoss: number;
  bestProfit: number;
  highestRarity: CunjingeRarity;
}

export interface CunjingeState {
  eventDay: number;
  chestsStarted: number;
  chips: number;
  activeAuction: CunjingeAuctionState | null;
  tutorialCompleted: boolean;
  quickRevealUnlocked: boolean;
  appraiserXp: number;
  stats: CunjingeStats;
  seedCounter: number;
}

export const CUNJINGE_ROOMS: CunjingeRoomDef[] = [
  { id: 'market', name: '散修集市', minChips: 500, minReputation: 0, valueMin: 300, valueMax: 1500, xp: 10 },
  { id: 'cloud', name: '云海宝会', minChips: 5000, minReputation: 100, valueMin: 3000, valueMax: 15000, xp: 20 },
  { id: 'heaven', name: '九霄仙拍', minChips: 20000, minReputation: 300, valueMin: 12000, valueMax: 80000, xp: 30 },
];

const NPC_NAMES = [
  ['丹霞子', '赤炉散人', '苏药君', '百草翁', '沈绛雪', '温丹青', '葛九丸', '叶火候'],
  ['顾听剑', '谢寒锋', '洛青崖', '燕回雪', '楚断流', '宁藏锋', '裴照夜', '江问刃'],
  ['金算盘', '沈万贯', '乔四海', '白掌柜', '许多宝', '陆千金', '闻人玉', '钱有余'],
] as const;

export const CUNJINGE_NPCS: CunjingeNpcDef[] = NPC_NAMES.flatMap((names, group) => names.map((name, index) => {
  const archetypes: CunjingeNpcArchetype[] = ['alchemist', 'sword', 'merchant'];
  const titles = ['丹修', '剑修', '行商'];
  return {
    id: `${archetypes[group]}-${index + 1}`,
    name,
    title: titles[group],
    archetype: archetypes[group],
    risk: 0.86 + ((index * 7 + group * 3) % 25) / 100,
    bluff: 0.05 + ((index * 5 + group * 4) % 13) / 100,
  };
}));

const ITEM_ROWS: Array<[string, string, CunjingeItemDef['category'], CunjingeRarity, CunjingeShape]> = [
  ['spirit-herb', '百年灵草', 'herb', 'white', '1x1'], ['moon-dew', '月华露', 'herb', 'green', '1x1'],
  ['fire-lotus', '赤焰莲', 'herb', 'blue', '1x2'], ['cloud-ganoderma', '云纹芝', 'herb', 'purple', '2x1'],
  ['gathering-pill', '聚灵丹', 'pill', 'white', '1x1'], ['foundation-pill', '筑基丹', 'pill', 'green', '1x1'],
  ['sword-pill', '凝剑丸', 'pill', 'blue', '1x1'], ['transcend-pill', '化神丹', 'pill', 'purple', '1x1'],
  ['raw-ore', '灵矿原石', 'ore', 'white', '1x1'], ['star-iron', '星纹铁', 'ore', 'green', '1x2'],
  ['cold-jade', '寒髓玉', 'ore', 'blue', '2x1'], ['sun-gold', '大日精金', 'ore', 'gold', '2x2'],
  ['azure-sword', '青锋剑', 'artifact', 'green', '1x2'], ['frost-blade', '霜魄古剑', 'artifact', 'blue', '1x2'],
  ['spirit-gourd', '纳灵葫芦', 'artifact', 'blue', '1x2'], ['jade-pendant', '护心玉佩', 'artifact', 'purple', '1x1'],
  ['array-disc', '小周天阵盘', 'artifact', 'purple', '2x2'], ['bronze-furnace', '三足丹炉', 'artifact', 'purple', '2x2'],
  ['broken-banner', '残破万妖幡', 'artifact', 'gold', 'L'], ['nameless-seal', '无名道印', 'artifact', 'gold', '2x2'],
  ['herb-scroll', '百草残卷', 'manual', 'green', '1x2'], ['sword-scroll', '御剑残篇', 'manual', 'blue', '1x2'],
  ['array-scroll', '阵道秘录', 'manual', 'purple', '2x1'], ['heaven-script', '天书残页', 'manual', 'gold', '1x1'],
  ['spirit-wood', '雷击灵木', 'curio', 'green', '2x1'], ['old-incense', '上古香炉', 'curio', 'blue', '1x1'],
  ['crane-feather', '仙鹤尾羽', 'curio', 'blue', '1x2'], ['dragon-scale', '疑似龙鳞', 'curio', 'purple', '2x1'],
  ['jade-cicada', '玉蝉', 'curio', 'green', '1x1'], ['star-sand', '星河砂', 'ore', 'purple', '1x1'],
  ['wooden-fish', '悟道木鱼', 'curio', 'white', '1x1'], ['cracked-bell', '裂纹古钟', 'curio', 'green', '2x2'],
  ['ink-stone', '灵墨砚台', 'curio', 'blue', '2x1'], ['cloud-ruler', '量云尺', 'artifact', 'purple', '1x2'],
  ['jade-box', '封灵玉匣', 'curio', 'blue', '2x1'], ['phoenix-pin', '凤纹金簪', 'curio', 'purple', '1x2'],
  ['meteor-fragment', '天外陨铁', 'ore', 'gold', '2x2'], ['immortal-token', '仙府令牌', 'artifact', 'gold', '1x1'],
  ['fake-elixir', '走火废丹', 'pill', 'white', '1x1'], ['blank-scroll', '无字残卷', 'manual', 'white', '1x2'],
];

export const CUNJINGE_ITEMS: CunjingeItemDef[] = ITEM_ROWS.map(([id, name, category, rarity, shape]) => ({ id, name, category, rarity, shape }));

const RARITY_RANK: Record<CunjingeRarity, number> = { white: 0, green: 1, blue: 2, purple: 3, gold: 4 };
const LEVEL_THRESHOLDS = [0, 150, 350, 600, 900, 1250, 1650, 2100, 2600, 3150];

function mulberry32(seed: number): () => number {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let n = value;
    n = Math.imul(n ^ (n >>> 15), n | 1);
    n ^= n + Math.imul(n ^ (n >>> 7), n | 61);
    return ((n ^ (n >>> 14)) >>> 0) / 4294967296;
  };
}

function int(random: () => number, min: number, max: number): number {
  return min + Math.floor(random() * (max - min + 1));
}

function shapeCells(shape: CunjingeShape): { x: number; y: number }[] {
  if (shape === '1x2') return [{ x: 0, y: 0 }, { x: 0, y: 1 }];
  if (shape === '2x1') return [{ x: 0, y: 0 }, { x: 1, y: 0 }];
  if (shape === '2x2') return [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }];
  if (shape === 'L') return [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }];
  return [{ x: 0, y: 0 }];
}

function chooseItem(random: () => number, room: CunjingeRoomId, goldCount: number): CunjingeItemDef {
  const maxRank = room === 'market' ? 3 : 4;
  const roll = random();
  let targetRank = room === 'market'
    ? (roll < 0.48 ? 0 : roll < 0.78 ? 1 : roll < 0.95 ? 2 : 3)
    : room === 'cloud'
      ? (roll < 0.18 ? 0 : roll < 0.48 ? 1 : roll < 0.78 ? 2 : roll < 0.96 ? 3 : 4)
      : (roll < 0.07 ? 0 : roll < 0.22 ? 1 : roll < 0.51 ? 2 : roll < 0.84 ? 3 : 4);
  targetRank = Math.min(targetRank, maxRank);
  if (targetRank === 4 && goldCount >= 2) targetRank = 3;
  const pool = CUNJINGE_ITEMS.filter(item => RARITY_RANK[item.rarity] === targetRank);
  return pool[int(random, 0, pool.length - 1)];
}

export function defaultCunjingeState(): CunjingeState {
  return {
    eventDay: 0,
    chestsStarted: 0,
    chips: 0,
    activeAuction: null,
    tutorialCompleted: false,
    quickRevealUnlocked: false,
    appraiserXp: 0,
    stats: { chestsPlayed: 0, wins: 0, totalProfit: 0, totalLoss: 0, bestProfit: 0, highestRarity: 'white' },
    seedCounter: 1,
  };
}

export function normalizeCunjingeState(value: Partial<CunjingeState> | null | undefined): CunjingeState {
  const base = defaultCunjingeState();
  const stats = { ...base.stats, ...(value?.stats || {}) };
  return {
    ...base,
    ...(value || {}),
    chips: Math.max(0, Math.floor(Number(value?.chips) || 0)),
    chestsStarted: Math.max(0, Math.floor(Number(value?.chestsStarted) || 0)),
    appraiserXp: Math.max(0, Math.floor(Number(value?.appraiserXp) || 0)),
    seedCounter: Math.max(1, Math.floor(Number(value?.seedCounter) || 1)),
    stats,
    activeAuction: value?.activeAuction || null,
  };
}

export function isCunjingeOpenDay(day: number): boolean {
  return day >= 7 && (day - 7) % 3 === 0;
}

export function nextCunjingeOpenDay(day: number): number {
  if (day <= 7) return 7;
  const remainder = (day - 7) % 3;
  return remainder === 0 ? day : day + (3 - remainder);
}

export function syncCunjingeEvent(state: CunjingeState, day: number): void {
  if (!isCunjingeOpenDay(day)) return;
  if (state.eventDay !== day && !state.activeAuction) {
    state.eventDay = day;
    state.chestsStarted = 0;
  }
}

export function maxExchangeableSpirit(spirit: number): number {
  const safeSpirit = Math.max(0, Math.floor(spirit));
  const reserve = Math.max(500, Math.ceil(safeSpirit * 0.15));
  return Math.max(0, safeSpirit - reserve);
}

export function appraiserLevel(xp: number): number {
  let level = 1;
  LEVEL_THRESHOLDS.forEach((threshold, index) => {
    if (xp >= threshold) level = index + 1;
  });
  return Math.min(10, level);
}

export function cunjingeRoom(id: CunjingeRoomId): CunjingeRoomDef {
  return CUNJINGE_ROOMS.find(room => room.id === id)!;
}

export function canEnterCunjingeRoom(roomId: CunjingeRoomId, chips: number, reputation: number): string | null {
  const room = cunjingeRoom(roomId);
  if (reputation < room.minReputation) return `需要声望 ${room.minReputation}`;
  if (chips < room.minChips) return `需要筹码 ${room.minChips}`;
  return null;
}

function generateChestItems(seed: number, roomId: CunjingeRoomId, tutorial: boolean): CunjingeChestItem[] {
  const random = mulberry32(seed ^ 0x51f15e);
  const room = cunjingeRoom(roomId);
  const count = tutorial ? 9 : int(random, 8, 18);
  const occupied = new Set<string>();
  const items: CunjingeChestItem[] = [];
  let goldCount = 0;
  for (let index = 0; index < count; index++) {
    let def = tutorial ? CUNJINGE_ITEMS[(index * 3) % 18] : chooseItem(random, roomId, goldCount);
    let offsets = shapeCells(def.shape);
    let placed: { x: number; y: number; cells: { x: number; y: number }[] } | null = null;
    for (let attempt = 0; attempt < 100; attempt++) {
      const x = int(random, 0, 9);
      const y = int(random, 0, 7);
      const cells = offsets.map(cell => ({ x: x + cell.x, y: y + cell.y }));
      if (cells.every(cell => cell.x < 10 && cell.y < 8 && !occupied.has(`${cell.x},${cell.y}`))) {
        placed = { x, y, cells };
        break;
      }
    }
    if (!placed) {
      def = CUNJINGE_ITEMS.find(item => item.shape === '1x1' && item.rarity === 'white')!;
      offsets = shapeCells(def.shape);
      outer: for (let y = 0; y < 8; y++) for (let x = 0; x < 10; x++) {
        if (!occupied.has(`${x},${y}`)) { placed = { x, y, cells: [{ x, y }] }; break outer; }
      }
    }
    if (!placed) break;
    placed.cells.forEach(cell => occupied.add(`${cell.x},${cell.y}`));
    if (def.rarity === 'gold') goldCount++;
    items.push({
      defId: def.id,
      name: def.name,
      category: def.category,
      rarity: def.rarity,
      shape: def.shape,
      x: placed.x,
      y: placed.y,
      cells: placed.cells,
      value: 0,
    });
  }
  const targetValue = tutorial ? 680 : int(random, room.valueMin, room.valueMax);
  const weights = items.map(item => Math.pow(2.3, RARITY_RANK[item.rarity]) * (0.85 + random() * 0.3));
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  let assigned = 0;
  items.forEach((item, index) => {
    item.value = index === items.length - 1
      ? Math.max(1, targetValue - assigned)
      : Math.max(1, Math.round(targetValue * weights[index] / totalWeight));
    assigned += item.value;
  });
  return items;
}

function generateClues(seed: number, items: CunjingeChestItem[]): CunjingeClue[] {
  const random = mulberry32(seed ^ 0xa11ce);
  const total = items.reduce((sum, item) => sum + item.value, 0);
  const rarest = [...items].sort((a, b) => RARITY_RANK[b.rarity] - RARITY_RANK[a.rarity])[0];
  const largest = [...items].sort((a, b) => b.cells.length - a.cells.length)[0];
  const exact = [...items].sort((a, b) => b.value - a.value).slice(0, 2);
  const bands = [
    [0.38, 1.65], [0.52, 1.42], [0.64, 1.28], [0.76, 1.16], [0.88, 1.08],
  ];
  const details = [
    `匣内约有 ${Math.max(8, items.length - 2)}～${Math.min(18, items.length + 2)} 件宝物`,
    `最大轮廓占 ${largest.cells.length} 格，至少有一件${largest.shape}宝物`,
    `显露出一件${rarest.rarity === 'gold' ? '金色' : rarest.rarity === 'purple' ? '紫色' : '蓝绿色'}${rarest.category === 'artifact' ? '法器' : '宝物'}轮廓`,
    `${exact.map(item => item.name + '约值' + item.value).join('；')}`,
    `寸金阁给出的最低估值为 ${Math.max(1, Math.floor(total * (0.88 + random() * 0.05)))}`,
  ];
  return details.map((detail, index) => ({
    round: index + 1,
    title: ['数量线索', '轮廓线索', '品质线索', '问价线索', '最低估值'][index],
    detail,
    estimateLow: Math.max(1, Math.floor(total * bands[index][0])),
    estimateHigh: Math.max(1, Math.ceil(total * bands[index][1])),
  }));
}

function chooseNpcIds(seed: number): string[] {
  const random = mulberry32(seed ^ 0xc0ffee);
  const pool = [...CUNJINGE_NPCS];
  const selected: string[] = [];
  while (selected.length < 3) selected.push(pool.splice(int(random, 0, pool.length - 1), 1)[0].id);
  return selected;
}

export function createCunjingeAuction(seed: number, roomId: CunjingeRoomId, tutorial = false): CunjingeAuctionState {
  const items = generateChestItems(seed, roomId, tutorial);
  return {
    seed,
    roomId,
    tutorial,
    round: 1,
    secondsLeft: 30,
    playerDraftBid: 0,
    previousPlayerBid: 0,
    appraisalUsesLeft: 2,
    usedAppraisals: [],
    appraisalResults: [],
    npcIds: chooseNpcIds(seed),
    items,
    clues: generateClues(seed, items),
    bidHistory: [],
    result: null,
  };
}

export function startCunjingeAuction(state: CunjingeState, roomId: CunjingeRoomId, day: number, tutorial = false): string | null {
  syncCunjingeEvent(state, day);
  if (state.activeAuction) return '已有一匣竞拍尚未完成';
  if (!tutorial && !isCunjingeOpenDay(day)) return `距离开放还有 ${nextCunjingeOpenDay(day) - day} 天`;
  if (!tutorial && state.chestsStarted >= 3) return '本次万宝会的3匣已经全部参与';
  if (tutorial && state.tutorialCompleted) return '教学宝匣已经完成';
  const seed = day * 100003 + state.seedCounter * 7919 + (tutorial ? 17 : 0);
  state.seedCounter++;
  state.activeAuction = createCunjingeAuction(seed, roomId, tutorial);
  if (!tutorial) state.chestsStarted++;
  return null;
}

function visibleEstimate(auction: CunjingeAuctionState): { low: number; high: number } {
  const clue = auction.clues[Math.max(0, Math.min(auction.round, 5) - 1)];
  return { low: clue.estimateLow, high: clue.estimateHigh };
}

export function suggestedCunjingeBid(auction: CunjingeAuctionState, kind: 'safe' | 'reference' | 'bold' | 'follow'): number {
  const estimate = visibleEstimate(auction);
  const reference = Math.round((estimate.low + estimate.high) / 2);
  if (kind === 'safe') return Math.round(reference * 0.8);
  if (kind === 'bold') return Math.round(reference * 1.2);
  if (kind === 'follow') {
    const previous = auction.bidHistory[auction.bidHistory.length - 1];
    const highest = previous ? Math.max(previous.player, ...Object.values(previous.npcs)) : reference;
    return highest + 5;
  }
  return reference;
}

function npcBidForRound(auction: CunjingeAuctionState, npc: CunjingeNpcDef): number {
  const random = mulberry32(auction.seed + auction.round * 101 + Number(npc.id.replace(/\D/g, '') || 1) * 37 + npc.archetype.length * 997);
  const estimate = visibleEstimate(auction);
  const midpoint = (estimate.low + estimate.high) / 2;
  const prior = auction.bidHistory[auction.bidHistory.length - 1]?.npcs[npc.id] || 0;
  const roundConfidence = 0.62 + auction.round * 0.075;
  const bluff = auction.round < 5 && random() < npc.bluff ? 1.08 + random() * 0.12 : 1;
  const target = midpoint * npc.risk * roundConfidence * bluff;
  return Math.max(0, Math.round((prior * 0.25 + target * 0.75) / 5) * 5);
}

export function useCunjingeAppraisal(auction: CunjingeAuctionState, id: CunjingeAppraisalId, level: number): string {
  if (auction.appraisalUsesLeft <= 0) return '本匣鉴宝次数已用完';
  if (auction.usedAppraisals.includes(id)) return '同一种鉴宝术每匣只能使用一次';
  const sorted = [...auction.items].sort((a, b) => b.value - a.value);
  let result = '';
  if (id === 'shape') {
    const rare = [...auction.items].sort((a, b) => RARITY_RANK[b.rarity] - RARITY_RANK[a.rarity])[0];
    result = `辨形术：${rare.shape}轮廓属于${rare.category === 'artifact' ? '法器' : '非制式宝物'}${level >= 6 ? '，品质为' + rare.rarity : ''}`;
  } else if (id === 'aura') {
    const count = level >= 8 ? 5 : level >= 4 ? 4 : 3;
    result = `观气术：${sorted.slice(0, count).map(item => item.name + '灵光' + item.rarity).join('、')}`;
  } else if (id === 'price') {
    const count = level >= 7 ? 3 : 2;
    result = `问价符：${sorted.slice(0, count).map(item => item.name + '=' + item.value).join('、')}`;
  } else {
    const fakes = auction.items.filter(item => item.defId === 'fake-elixir' || item.defId === 'blank-scroll');
    result = fakes.length ? `排伪诀：发现${fakes.map(item => item.name + (level >= 6 ? '=' + item.value : '')).join('、')}` : '排伪诀：未发现明显废丹或无字残卷';
  }
  auction.appraisalUsesLeft--;
  auction.usedAppraisals.push(id);
  auction.appraisalResults.push(result);
  return result;
}

export function submitCunjingeBid(state: CunjingeState, bid: number, elapsedSeconds = 0): CunjingeRoundBid | string {
  const auction = state.activeAuction;
  if (!auction || auction.result) return '当前没有可报价的宝匣';
  let normalizedBid = Math.max(0, Math.floor(Number(bid) || 0));
  if (!auction.tutorial && normalizedBid > state.chips) return '报价不能超过当前筹码';
  if (auction.tutorial) {
    const actual = auction.items.reduce((sum, item) => sum + item.value, 0);
    normalizedBid = Math.min(normalizedBid, actual - 100);
  }
  const npcs: Record<string, number> = {};
  auction.npcIds.forEach(id => { npcs[id] = npcBidForRound(auction, CUNJINGE_NPCS.find(npc => npc.id === id)!); });
  const random = mulberry32(auction.seed + auction.round * 31337);
  const orders = auction.npcIds.map(id => ({ id, at: 2 + random() * 26 }));
  orders.push({ id: 'player', at: Math.max(0, Math.min(30, elapsedSeconds)) });
  orders.sort((a, b) => a.at - b.at || a.id.localeCompare(b.id));
  const roundBid: CunjingeRoundBid = { round: auction.round, player: normalizedBid, npcs, submitOrder: orders.map(item => item.id) };
  auction.bidHistory.push(roundBid);
  auction.previousPlayerBid = normalizedBid;
  if (auction.round < 5) {
    auction.round++;
    auction.secondsLeft = 30;
    auction.playerDraftBid = normalizedBid;
    return roundBid;
  }
  const all = [{ id: 'player', bid: normalizedBid }, ...auction.npcIds.map(id => ({ id, bid: npcs[id] }))];
  const orderIndex = new Map(roundBid.submitOrder.map((id, index) => [id, index]));
  all.sort((a, b) => b.bid - a.bid || (orderIndex.get(a.id)! - orderIndex.get(b.id)!));
  const winner = all[0];
  const actualValue = auction.items.reduce((sum, item) => sum + item.value, 0);
  const playerWon = winner.id === 'player';
  const playerProfit = playerWon ? actualValue - winner.bid : 0;
  auction.result = { winnerId: winner.id, winningBid: winner.bid, actualValue, playerProfit, playerWon };
  if (playerWon) state.chips = Math.max(0, state.chips - winner.bid + actualValue);
  state.stats.chestsPlayed++;
  if (playerWon) {
    state.stats.wins++;
    if (playerProfit >= 0) {
      state.stats.totalProfit += playerProfit;
      state.stats.bestProfit = Math.max(state.stats.bestProfit, playerProfit);
    } else state.stats.totalLoss += Math.abs(playerProfit);
    const rarest = [...auction.items].sort((a, b) => RARITY_RANK[b.rarity] - RARITY_RANK[a.rarity])[0]?.rarity || 'white';
    if (RARITY_RANK[rarest] > RARITY_RANK[state.stats.highestRarity]) state.stats.highestRarity = rarest;
  }
  if (!auction.tutorial) state.appraiserXp += cunjingeRoom(auction.roomId).xp + (playerWon ? 5 : 0);
  else state.tutorialCompleted = true;
  state.quickRevealUnlocked = state.stats.chestsPlayed >= 3;
  return roundBid;
}

export function finishCunjingeChest(state: CunjingeState): void {
  if (state.activeAuction?.result) state.activeAuction = null;
}

export function exchangeCunjingeChips(state: CunjingeState, spirit: number, requested: number): { spirit: number; exchanged: number } {
  const exchanged = Math.min(maxExchangeableSpirit(spirit), Math.max(0, Math.floor(requested)));
  state.chips += exchanged;
  return { spirit: spirit - exchanged, exchanged };
}

export function refundCunjingeChips(state: CunjingeState, spirit: number): number {
  const result = spirit + state.chips;
  state.chips = 0;
  return result;
}
