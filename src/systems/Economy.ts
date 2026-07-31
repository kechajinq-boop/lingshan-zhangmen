import { GameState, PlacedBuilding } from '../state';

const DAY_LEN = 60; // seconds per in-game day

export class Economy {
  gs: GameState;
  spawnTimer = 0;
  visitorSeq = 0;
  nextShopCursor = 0;
  lastShopStockNoticeDay = 0;
  gatherCount = 0; craftCount = 0;

  constructor(gs: GameState) { this.gs = gs; }

  update(dt: number): void {
    const d = this.gs.data;
    d.dayTime += dt;
    if (d.dayTime >= DAY_LEN) {
      d.dayTime = 0;
      if (this.gatherCount > 0) { this.gs.logEvent('gather', 'info', '灵田收获', '灵田收获 ' + this.gatherCount + ' 份药草', '#7ddb6a'); this.gatherCount = 0; }
      if (this.craftCount > 0) { this.gs.logEvent('craft', 'info', '炼丹完成', '炼丹房炼成 ' + this.craftCount + ' 枚丹药', '#ffb347'); this.craftCount = 0; }
      this.gs.logEvent('day-summary', 'info', '第' + d.day + '天小结', '营收 ' + d.dayEarned + ' 灵石，服务 ' + d.dayVisitorsServed + ' 人', '#8bd5ff');
      d.dayEarned = 0;
      d.dayVisitorsServed = 0;
      d.day++;
      this.gs.events.emit('day', d.day);
    }
    for (const b of d.buildings) this.tickBuilding(b, dt);
    this.tickVisitors(dt);
    this.spawnTimer += dt;
    const interval = this.spawnInterval();
    if (this.spawnTimer >= interval) { this.spawnTimer = 0; this.trySpawnVisitors(); }
  }

  spawnInterval(): number {
    const v = this.gs.defs.visitor;
    const repFactor = Math.max(0.3, 1 - this.gs.data.reputation / 200);
    let interval = v.spawnBase * repFactor;
    if (this.gs.data.activeCombos.includes('ketuan')) interval *= (1 - 0.2);
    interval *= (1 - this.gs.elderBonus('visitor'));
    return Math.max(v.spawnMin, interval);
  }

  tickBuilding(b: PlacedBuilding, dt: number): void {
    const def = this.gs.buildingDef(b.defId);
    const d = this.gs.data;
    if (!def.baseTime) return;
    const speed = this.gs.speedOf(b);
    if (def.type === 'gather') {
      b.progress += (dt / def.baseTime) * speed;
      if (b.progress >= 1) { b.progress = 0; d.herbs++; this.gatherCount++; this.gs.events.emit('float', b, '+1药草', 0x7ddb6a); }
    } else if (def.type === 'craft') {
      const recipe = b.craftRecipe ? this.gs.recipeDef(b.craftRecipe) : this.bestRecipe();
      const availableHerbs = d.herbs - this.gs.reservedHerbsForCommission();
      if (recipe && availableHerbs >= recipe.input) {
        b.progress += (dt / def.baseTime) * speed;
        if (b.progress >= 1) {
          b.progress = 0; d.herbs -= recipe.input; d.pills[recipe.id]++; this.craftCount++; d.totalCrafted++;
          this.gs.events.emit('float', b, '+1' + recipe.name, 0xffb347);
        }
      }
    } else if (def.type === 'train') {
      let totalProgress = 0;
      let activeCount = 0;
      for (const did of b.assigned) {
        const dis = d.disciples.find(x => x.id === did);
        if (!dis) continue;
        if (dis.level >= dis.maxLevel) {
          dis.trainingProgress = 1;
          continue;
        }
        activeCount++;
        const targetLevel = dis.level + 1;
        const trainingTime = 45 + targetLevel * 20;
        const speed = 1 + dis.talent * 0.002 + this.gs.upgradeBonus(b, 'speed');
        dis.trainingProgress = Math.min(1, dis.trainingProgress + (dt / trainingTime) * speed);
        if (dis.trainingProgress >= 1) {
          const cost = this.gs.trainingCost(targetLevel);
          if (d.spirit >= cost) {
            d.spirit -= cost;
            dis.level = targetLevel;
            dis.trainingProgress = 0;
            d.totalBreakthroughs++;
            this.gs.logEvent('train', 'highlight', dis.name + ' 突破', dis.name + ' 突破至 Lv' + dis.level + '（-' + cost + '灵石）', '#9ecbff');
            this.gs.events.emit('float', b, dis.name + ' 升到' + dis.level + '级（-' + cost + '灵石）', 0x9ecbff);
          }
        }
        totalProgress += dis.trainingProgress;
      }
      b.progress = activeCount > 0 ? totalProgress / activeCount : 0;
    }
    // sell handled by visitor arrival flow
  }

  bestRecipe() {
    const d = this.gs.data;
    let best = null as any;
    for (const rid of d.unlockedRecipes) {
      const r = this.gs.recipeDef(rid);
      if (!best || r.price > best.price) best = r;
    }
    return best;
  }

  sellBuildings(): PlacedBuilding[] {
    return this.gs.data.buildings.filter(b => this.gs.buildingDef(b.defId).type === 'sell');
  }

  totalPills(): number {
    return Object.values(this.gs.data.pills).reduce((a, b) => a + b, 0);
  }

  shopLoad(shop: PlacedBuilding): number {
    return this.gs.data.visitors.filter(v => v.targetUid === shop.uid && v.state !== 'leaving').length;
  }

  syncSellShopQueues(shops = this.sellBuildings()): void {
    for (const shop of shops) shop.queue = this.shopLoad(shop);
  }

  shopCanSell(shop: PlacedBuilding): boolean {
    const d = this.gs.data;
    if (shop.sellRecipe) return (d.pills[shop.sellRecipe] || 0) > 0;
    return this.totalPills() > 0;
  }

  notifyShopStockShortage(shops: PlacedBuilding[], sellable: PlacedBuilding[]): void {
    const d = this.gs.data;
    if (shops.length <= 1 || d.day === this.lastShopStockNoticeDay) return;
    if (this.totalPills() === 0 || this.totalPills() < shops.length || sellable.length < shops.length) {
      this.lastShopStockNoticeDay = d.day;
      this.gs.logEvent(
        'visitor-leave',
        'info',
        '丹药铺客流不足',
        '丹药库存或指定售卖丹方不足，部分丹药铺暂时无客，补足丹药后会自动分流。',
        '#ffb347',
      );
    }
  }

  desiredVisitorCount(): number {
    const shops = this.sellBuildings().filter(shop => this.shopCanSell(shop));
    if (shops.length === 0) return 0;
    const capacity = shops.reduce((sum, shop) => sum + this.gs.shopCapacity(shop), 0);
    return Math.max(1, Math.min(this.totalPills(), shops.length * 2, capacity));
  }

  trySpawnVisitors(): void {
    const d = this.gs.data;
    const shops = this.sellBuildings();
    if (shops.length === 0) return;
    this.syncSellShopQueues(shops);
    const sellable = shops.filter(shop => this.shopCanSell(shop));
    this.notifyShopStockShortage(shops, sellable);
    if (sellable.length === 0) return;
    const shopUids = new Set(sellable.map(shop => shop.uid));
    const activeVisitors = d.visitors.filter(visitor => shopUids.has(visitor.targetUid)).length;
    const missing = this.desiredVisitorCount() - activeVisitors;
    for (let i = 0; i < missing; i++) {
      if (!this.trySpawnVisitor()) break;
    }
  }

  trySpawnVisitor(): boolean {
    const d = this.gs.data;
    const shops = this.sellBuildings().filter(shop => this.shopCanSell(shop));
    if (shops.length === 0 || this.totalPills() === 0) return false;
    this.syncSellShopQueues(shops);
    // choose shop with lowest real load; rotate equal-load shops so visitors do not stick to the first shop
    const open = shops.filter(s => this.shopLoad(s) < this.gs.shopCapacity(s));
    if (open.length === 0) return false;
    const minLoad = Math.min(...open.map(s => this.shopLoad(s)));
    const candidates = open.filter(s => this.shopLoad(s) === minLoad);
    const target = candidates[this.nextShopCursor % candidates.length];
    this.nextShopCursor++;
    const v: any = { id: Date.now() + (++this.visitorSeq), state: 'walking' as const, targetUid: target.uid, patience: this.gs.defs.visitor.patience, happy: false, walkTimer: 1.6 };
    const pool = this.gs.defs.visitorNames || [];
    if (pool.length) { const p = pool[Math.floor(Math.random() * pool.length)]; v.identity = p.identity; v.name = p.name; } else { v.identity = '访客'; v.name = '访客' + v.id % 100; }
    d.visitors.push(v);
    target.queue++;
    this.gs.events.emit('visitor-spawn', v, target);
    return true;
  }

  tickVisitors(dt: number): void {
    const d = this.gs.data;
    for (let i = d.visitors.length - 1; i >= 0; i--) {
      const v = d.visitors[i];
      const shop = d.buildings.find(b => b.uid === v.targetUid);
      if (!shop) { d.visitors.splice(i, 1); continue; }
      const shopDef = this.gs.buildingDef(shop.defId);
      if (v.state === 'walking') {
        v.walkTimer = (v.walkTimer ?? 0) - dt;
        if (v.walkTimer <= 0) {
          const buying = d.visitors.some(x => x.targetUid === shop.uid && x.state === 'buying');
          v.state = buying ? 'walking' : 'buying';
          if (v.state === 'buying') { v.walkTimer = 0; this.gs.events.emit('visitor-update', v); }
          else v.walkTimer = 0.5;
        }
        if (v.state === 'walking') {
          v.patience -= dt;
          if (v.patience <= 0) this.visitorLeave(v, shop, false, i);
        }
      } else if (v.state === 'buying') {
        shop.progress += (dt / (shopDef.baseTime || 4)) * this.gs.speedOf(shop);
        if (shop.progress >= 1) {
          shop.progress = 0;
          const recipe = this.pickPillToSell(shop);
          if (recipe) {
            const price = this.gs.sellPrice(recipe.id);
            d.pills[recipe.id]--;
            const tip = v.patience > this.gs.defs.visitor.patience * 0.5 ? this.gs.defs.visitor.happyTip : 0;
            d.spirit += price + tip;
            d.totalEarned += price + tip;
            d.dayEarned += price + tip;
            d.reputation = Math.min(999, d.reputation + 1 + (tip > 0 ? 1 : 0));
            d.visitorsServed++;
            d.dayVisitorsServed++;
            this.gs.events.emit('float', shop, '+' + (price + tip) + '灵石', 0xffe08a);
            v.happy = tip > 0;
            d.firstSellDone = true;
            const visitorName = [v.identity, v.name || '访客'].filter(Boolean).join('·');
            this.gs.logEvent('visitor-buy', 'highlight', (v.name || '访客') + ' 购丹', visitorName + ' 在' + this.gs.buildingDef(shop.defId).name + '购得' + recipe.name + '，付 ' + (price + tip) + ' 灵石', '#ffe08a');
            this.visitorLeave(v, shop, true, i);
          } else {
            this.visitorLeave(v, shop, false, i, '丹药售罄，未能购得所需丹药');
          }
        }
      }
    }
  }

  pickPillToSell(shop?: any) {
    const d = this.gs.data;
    // 店铺指定配方优先
    if (shop && shop.sellRecipe && d.pills[shop.sellRecipe] > 0) {
      return this.gs.recipeDef(shop.sellRecipe);
    }
    let best = null as any;
    for (const rid of Object.keys(d.pills)) {
      if (d.pills[rid] > 0) {
        const r = this.gs.recipeDef(rid);
        if (!best || r.price > best.price) best = r;
      }
    }
    return best;
  }

  visitorLeave(v: any, shop: PlacedBuilding, served: boolean, index: number, reason = '久候不至，拂袖而去'): void {
    if (!served) {
      this.gs.data.reputation = Math.max(0, this.gs.data.reputation - 2);
      this.gs.data.visitorsLost++;
      this.gs.events.emit('float', shop, '访客流失…', 0xff8a8a);
      const visitorName = [v.identity, v.name || '访客'].filter(Boolean).join('·');
      this.gs.logEvent('visitor-leave', 'info', (v.name || '访客') + ' 离去', visitorName + '：' + reason, '#ff9b8c');
    }
    shop.queue = Math.max(0, shop.queue - 1);
    // promote next queued visitor at this shop to buying
    const next = this.gs.data.visitors.find(x => x.targetUid === shop.uid && x.state === 'walking');
    this.gs.data.visitors.splice(index, 1);
    v.state = 'leaving';
    this.gs.events.emit('visitor-leave', v);
    if (next) { next.state = 'buying'; this.gs.events.emit('visitor-update', next); }
  }
}
