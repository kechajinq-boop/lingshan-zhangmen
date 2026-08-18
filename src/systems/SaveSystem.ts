import { GameState, GameStateData } from '../state';

const KEY = 'lingshan_save_v1';
const PRE_V10_BACKUP_KEY = 'lingshan_save_backup_pre_v10';
const PRE_V12_BACKUP_KEY = 'lingshan_save_backup_pre_v12';
const PRE_V0122A_BACKUP_KEY = 'lingshan_save_backup_pre_v0122a';
const CORRUPT_BACKUP_KEY = 'lingshan_save_backup_corrupt';
const SCHEMA_VERSION = 9;

export class SaveSystem {
  gs: GameState;
  constructor(gs: GameState) { this.gs = gs; }

  save(): void {
    const d = this.gs.data;
    const plain: GameStateData = {
      ...d,
      schemaVersion: SCHEMA_VERSION,
      buildings: d.buildings.map(b => ({
        ...b,
        progress: b.defId === 'danpu' || b.defId === 'faqipu' ? 0 : b.progress,
        queue: 0,
        sprite: undefined,
        lotSprite: undefined,
      })),
      visitors: [],
    };
    try { localStorage.setItem(KEY, JSON.stringify(plain)); } catch (e) { /* 原型阶段忽略 */ }
  }

  load(): GameStateData | null {
    try {
      const s = localStorage.getItem(KEY);
      if (!s) return null;
      const d = JSON.parse(s);
      if (!d || typeof d !== 'object') throw new Error('invalid save');
      const oldSchema = Number(d.schemaVersion) || 0;
      if (oldSchema < SCHEMA_VERSION && !localStorage.getItem(PRE_V10_BACKUP_KEY)) {
        localStorage.setItem(PRE_V10_BACKUP_KEY, s);
      }
      if (oldSchema < SCHEMA_VERSION && !localStorage.getItem(PRE_V12_BACKUP_KEY)) {
        localStorage.setItem(PRE_V12_BACKUP_KEY, s);
      }
      if (oldSchema < SCHEMA_VERSION && !localStorage.getItem(PRE_V0122A_BACKUP_KEY)) {
        localStorage.setItem(PRE_V0122A_BACKUP_KEY, s);
      }
      d.schemaVersion = SCHEMA_VERSION;
      d.spiritOre = Number.isFinite(Number(d.spiritOre)) ? Math.max(0, Number(d.spiritOre)) : 0;
      d.azureEdgeSwords = Number.isFinite(Number(d.azureEdgeSwords)) ? Math.max(0, Number(d.azureEdgeSwords)) : 0;
      d.totalForged = Number.isFinite(Number(d.totalForged)) ? Math.max(0, Number(d.totalForged)) : 0;
      d.buildings = Array.isArray(d.buildings) ? d.buildings : [];
      d.buildings = d.buildings.map((building: any) => ({
        ...building,
        progress: building.defId === 'danpu' || building.defId === 'faqipu' ? 0 : (Number(building.progress) || 0),
        queue: 0,
      }));
      d.visitors = [];
      return d;
    } catch (e) {
      try {
        const raw = localStorage.getItem(KEY);
        if (raw && !localStorage.getItem(CORRUPT_BACKUP_KEY)) {
          localStorage.setItem(CORRUPT_BACKUP_KEY, raw);
        }
      } catch (_backupError) { /* 保留原存档失败时也不覆盖它 */ }
      return null;
    }
  }

  clear(): void { try { localStorage.removeItem(KEY); } catch (e) {} }
}
