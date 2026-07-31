import { GameState, GameStateData } from '../state';

const KEY = 'lingshan_save_v1';
const SCHEMA_VERSION = 6;

export class SaveSystem {
  gs: GameState;
  constructor(gs: GameState) { this.gs = gs; }

  save(): void {
    const d = this.gs.data;
    const plain: GameStateData = {
      ...d,
      schemaVersion: SCHEMA_VERSION,
      buildings: d.buildings.map(b => ({ ...b, sprite: undefined, lotSprite: undefined })),
      visitors: [],
    };
    try { localStorage.setItem(KEY, JSON.stringify(plain)); } catch (e) { /* 原型阶段忽略 */ }
  }

  load(): GameStateData | null {
    try {
      const s = localStorage.getItem(KEY);
      if (!s) return null;
      const d = JSON.parse(s);
      d.schemaVersion = SCHEMA_VERSION;
      d.buildings = Array.isArray(d.buildings) ? d.buildings : [];
      d.visitors = [];
      return d;
    } catch (e) { return null; }
  }

  clear(): void { try { localStorage.removeItem(KEY); } catch (e) {} }
}
