import type { PlacedBuilding } from '../state';

export const TILE_W = 48;
export const TILE_H = 24;
export interface Footprint { width: number; height: number; }

export class IsoGrid {
  w: number; h: number;
  occupied: (number | null)[][];

  constructor(w: number, h: number) {
    this.w = w; this.h = h;
    this.occupied = Array.from({ length: h }, () => Array<number | null>(w).fill(null));
  }

  toScreen(gx: number, gy: number): { x: number; y: number } {
    return { x: (gx - gy) * (TILE_W / 2), y: (gx + gy) * (TILE_H / 2) };
  }

  getSpritePosition(gx: number, gy: number, w = 1, h = 1): { x: number; y: number } {
    const bottomTile = this.toScreen(gx + w - 1, gy + h - 1);
    return { x: bottomTile.x, y: bottomTile.y + TILE_H / 2 };
  }

  getDepth(
    gridX: number,
    gridY: number,
    footprint: { width: number; height: number } = { width: 1, height: 1 },
    layer = 0,
  ): number {
    const maxFootX = gridX + footprint.width - 1;
    const maxFootY = gridY + footprint.height - 1;
    const diagonal = maxFootX + maxFootY;
    return diagonal * 10000 + maxFootX * 10 + layer;
  }

  toGrid(sx: number, sy: number): { gx: number; gy: number } {
    const gx = (sx / (TILE_W / 2) + sy / (TILE_H / 2)) / 2;
    const gy = (sy / (TILE_H / 2) - sx / (TILE_W / 2)) / 2;
    return { gx: Math.round(gx), gy: Math.round(gy) };
  }

  inBounds(gx: number, gy: number): boolean {
    return gx >= 0 && gy >= 0 && gx < this.w && gy < this.h;
  }

  canPlace(gx: number, gy: number, width = 1, height = 1): boolean {
    if (!this.inBounds(gx, gy) || !this.inBounds(gx + width - 1, gy + height - 1)) return false;
    for (let y = gy; y < gy + height; y++) {
      for (let x = gx; x < gx + width; x++) {
        if (this.occupied[y][x] !== null) return false;
      }
    }
    return true;
  }

  place(gx: number, gy: number, uid: number, width = 1, height = 1): void {
    for (let y = gy; y < gy + height; y++) {
      for (let x = gx; x < gx + width; x++) {
        if (this.inBounds(x, y)) this.occupied[y][x] = uid;
      }
    }
  }

  remove(gx: number, gy: number, width = 1, height = 1, uid?: number): void {
    for (let y = gy; y < gy + height; y++) {
      for (let x = gx; x < gx + width; x++) {
        if (this.inBounds(x, y) && (uid === undefined || this.occupied[y][x] === uid)) {
          this.occupied[y][x] = null;
        }
      }
    }
  }

  areAdjacent(
    a: PlacedBuilding,
    b: PlacedBuilding,
    aFootprint: Footprint = { width: 1, height: 1 },
    bFootprint: Footprint = { width: 1, height: 1 },
  ): boolean {
    const aRight = a.gx + aFootprint.width - 1;
    const aBottom = a.gy + aFootprint.height - 1;
    const bRight = b.gx + bFootprint.width - 1;
    const bBottom = b.gy + bFootprint.height - 1;
    const verticalOverlap = a.gy <= bBottom && b.gy <= aBottom;
    const horizontalOverlap = a.gx <= bRight && b.gx <= aRight;
    return (
      (verticalOverlap && (aRight + 1 === b.gx || bRight + 1 === a.gx))
      || (horizontalOverlap && (aBottom + 1 === b.gy || bBottom + 1 === a.gy))
    );
  }

  findNearestAvailable(gx: number, gy: number, width = 1, height = 1): { gx: number; gy: number } | null {
    const maxRadius = Math.max(this.w, this.h);
    for (let radius = 0; radius <= maxRadius; radius++) {
      for (let dy = -radius; dy <= radius; dy++) {
        const dx = radius - Math.abs(dy);
        const candidates = dx === 0
          ? [{ gx, gy: gy + dy }]
          : [{ gx: gx - dx, gy: gy + dy }, { gx: gx + dx, gy: gy + dy }];
        for (const candidate of candidates) {
          if (this.canPlace(candidate.gx, candidate.gy, width, height)) return candidate;
        }
      }
    }
    return null;
  }

  rebuildFrom(
    buildings: PlacedBuilding[],
    getFootprint: (building: PlacedBuilding) => Footprint = () => ({ width: 1, height: 1 }),
  ): void {
    this.occupied = Array.from({ length: this.h }, () => Array<number | null>(this.w).fill(null));
    for (const b of buildings) {
      const footprint = getFootprint(b);
      const position = this.findNearestAvailable(b.gx, b.gy, footprint.width, footprint.height);
      if (!position) continue;
      b.gx = position.gx;
      b.gy = position.gy;
      this.place(b.gx, b.gy, b.uid, footprint.width, footprint.height);
    }
  }
}
