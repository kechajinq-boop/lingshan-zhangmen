import { GameState, ComboDef } from '../state';

export class ComboSystem {
  gs: GameState;
  constructor(gs: GameState) { this.gs = gs; }

  // 判断一组建筑是否两两相邻（对3建筑组合：至少链式相邻即可）
  groupAdjacent(buildings: import('../state').PlacedBuilding[]): boolean {
    for (let i = 0; i < buildings.length; i++) {
      let linked = false;
      for (let j = 0; j < buildings.length; j++) {
        if (i === j) continue;
        const aDef = this.gs.buildingDef(buildings[i].defId);
        const bDef = this.gs.buildingDef(buildings[j].defId);
        if (this.gs.grid.areAdjacent(
          buildings[i],
          buildings[j],
          { width: aDef.w, height: aDef.h },
          { width: bDef.w, height: bDef.h },
        )) linked = true;
      }
      if (!linked) return false;
    }
    return true;
  }

  recalc(): string[] {
    const d = this.gs.data;
    const found: string[] = [];
    for (const b of d.buildings) b.comboBonus = 0;
    for (const combo of this.gs.defs.combos) {
      const match = this.findCombo(combo);
      if (match) {
        found.push(combo.id);
        if (combo.effect === 'craftSpeed') {
          for (const t of d.buildings) {
            if (this.gs.buildingDef(t.defId).type === 'craft') t.comboBonus += combo.value;
          }
        }
      }
    }
    d.activeCombos = [...new Set(found)];
    return d.activeCombos;
  }

  findCombo(combo: ComboDef): boolean {
    const d = this.gs.data;
    const need = combo.needs;
    // 收集每种需求类型的建筑实例
    const pools = need.map(id => d.buildings.filter(b => b.defId === id));
    if (pools.some(p => p.length === 0)) return false;
    // 简单组合搜索（建筑数量少，暴力即可）
    if (need.length === 2) {
      for (const a of pools[0]) for (const b of pools[1]) {
        const aDef = this.gs.buildingDef(a.defId);
        const bDef = this.gs.buildingDef(b.defId);
        if (a !== b && this.gs.grid.areAdjacent(
          a,
          b,
          { width: aDef.w, height: aDef.h },
          { width: bDef.w, height: bDef.h },
        )) return true;
      }
      return false;
    }
    if (need.length === 3) {
      for (const a of pools[0]) for (const b of pools[1]) for (const c of pools[2]) {
        if (a !== b && b !== c && a !== c && this.groupAdjacent([a, b, c])) return true;
      }
      return false;
    }
    return false;
  }
}
