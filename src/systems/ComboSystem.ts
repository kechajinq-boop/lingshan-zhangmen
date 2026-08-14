import { GameState, ComboDef, PlacedBuilding } from '../state';
import { v12SlotsAreAdjacent } from '../data/v12Map';

export class ComboSystem {
  gs: GameState;
  constructor(gs: GameState) { this.gs = gs; }

  areAdjacent(a: PlacedBuilding, b: PlacedBuilding): boolean {
    if (a.slotId && b.slotId) return v12SlotsAreAdjacent(a.slotId, b.slotId);
    const aDef = this.gs.buildingDef(a.defId);
    const bDef = this.gs.buildingDef(b.defId);
    return this.gs.grid.areAdjacent(
      a,
      b,
      { width: aDef.w, height: aDef.h },
      { width: bDef.w, height: bDef.h },
    );
  }

  // 判断一组建筑是否两两相邻（对3建筑组合：至少链式相邻即可）
  groupAdjacent(buildings: PlacedBuilding[]): boolean {
    for (let i = 0; i < buildings.length; i++) {
      let linked = false;
      for (let j = 0; j < buildings.length; j++) {
        if (i === j) continue;
        if (this.areAdjacent(buildings[i], buildings[j])) linked = true;
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
          for (const t of d.buildings) if (t.defId === 'danfang') t.comboBonus += combo.value;
        }
      }
    }
    d.activeCombos = [...new Set(found)];
    return d.activeCombos;
  }

  findCombo(combo: ComboDef): boolean {
    const d = this.gs.data;
    const need = combo.needs;
    const pools = need.map(id => d.buildings.filter(b => b.defId === id));
    if (pools.some(p => p.length === 0)) return false;
    if (need.length === 2) {
      for (const a of pools[0]) for (const b of pools[1]) {
        if (a !== b && this.areAdjacent(a, b)) return true;
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
