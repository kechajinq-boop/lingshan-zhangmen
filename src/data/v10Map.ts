export interface V10BuildSlot {
  id: string;
  stage: 0 | 1 | 2;
  zone: string;
  gx: number;
  gy: number;
  mapX: number;
  mapY: number;
}

export interface V10FixedObject {
  id: string;
  texture: string;
  mapX: number;
  mapY: number;
  width: number;
  height: number;
  depthOffset?: number;
}

export interface V10MapPoint {
  mapX: number;
  mapY: number;
}

export const V10_MAP_STAGES = [
  { stage: 0, texture: 'v10-map-stage-01', capacity: 20 },
  { stage: 1, texture: 'v10-map-stage-02', capacity: 32 },
  { stage: 2, texture: 'v10-map-stage-03', capacity: 48 },
] as const;

export const V10_GRID_BASIS = {
  column: { x: 66.96, y: -16.2 },
  row: { x: 25.92, y: 41.04 },
} as const;

interface V10BuildZone {
  id: string;
  stage: 0 | 1 | 2;
  originX: number;
  originY: number;
  columns: number;
  rows: number;
  firstCellNumber: number;
}

const V10_BUILD_ZONES: ReadonlyArray<V10BuildZone> = [
  { id: 'northwest_main', stage: 0, originX: 506.16, originY: 385.36, columns: 4, rows: 2, firstCellNumber: 1 },
  { id: 'west_aux', stage: 0, originX: 391.12, originY: 500.16, columns: 2, rows: 2, firstCellNumber: 9 },
  { id: 'northeast_aux', stage: 0, originX: 853.12, originY: 408.16, columns: 2, rows: 2, firstCellNumber: 13 },
  { id: 'southeast_aux', stage: 0, originX: 916.12, originY: 575.16, columns: 2, rows: 2, firstCellNumber: 17 },
  { id: 'stage2_northwest', stage: 1, originX: 303.12, originY: 338.16, columns: 2, rows: 2, firstCellNumber: 21 },
  { id: 'stage2_central_west', stage: 1, originX: 623.12, originY: 568.16, columns: 2, rows: 2, firstCellNumber: 25 },
  { id: 'stage2_east', stage: 1, originX: 1173.12, originY: 388.16, columns: 2, rows: 2, firstCellNumber: 29 },
  { id: 'stage3_west_inner', stage: 2, originX: 223.12, originY: 498.16, columns: 2, rows: 2, firstCellNumber: 33 },
  { id: 'stage3_north_inner', stage: 2, originX: 463.12, originY: 248.16, columns: 2, rows: 2, firstCellNumber: 37 },
  { id: 'stage3_southeast_inner', stage: 2, originX: 1128.12, originY: 658.16, columns: 2, rows: 2, firstCellNumber: 41 },
  { id: 'stage3_southwest_inner', stage: 2, originX: 253.12, originY: 598.16, columns: 2, rows: 2, firstCellNumber: 45 },
];

const cellCenterOffset = {
  x: (V10_GRID_BASIS.column.x + V10_GRID_BASIS.row.x) / 2,
  y: (V10_GRID_BASIS.column.y + V10_GRID_BASIS.row.y) / 2,
};

export const V10_BUILD_SLOTS: V10BuildSlot[] = V10_BUILD_ZONES
  .flatMap(zone => {
    const slots: V10BuildSlot[] = [];
    let number = zone.firstCellNumber;
    for (let row = 0; row < zone.rows; row++) {
      for (let column = 0; column < zone.columns; column++) {
        const index = number - 1;
        slots.push({
          id: `slot-${String(number).padStart(2, '0')}`,
          stage: zone.stage,
          zone: zone.id,
          gx: (index % 12) * 2,
          gy: Math.floor(index / 12) * 2,
          mapX: Number((zone.originX + column * V10_GRID_BASIS.column.x + row * V10_GRID_BASIS.row.x + cellCenterOffset.x).toFixed(2)),
          mapY: Number((zone.originY + column * V10_GRID_BASIS.column.y + row * V10_GRID_BASIS.row.y + cellCenterOffset.y).toFixed(2)),
        });
        number++;
      }
    }
    return slots;
  })
  .sort((a, b) => a.id.localeCompare(b.id));

export const V10_GATE_POINT = { mapX: 820, mapY: 822 } as const;

// Runtime visitor navigation uses the fixed-map art coordinates rather than the
// legacy isometric grid. These conservative outlines keep visitors on the
// visible island and out of the river/lake while still leaving room to route
// around player buildings.
export const V10_WALKABLE_POLYGONS: ReadonlyArray<ReadonlyArray<V10MapPoint>> = [
  [
    { mapX: 500, mapY: 270 }, { mapX: 950, mapY: 270 }, { mapX: 1280, mapY: 390 },
    { mapX: 1360, mapY: 520 }, { mapX: 1080, mapY: 700 }, { mapX: 820, mapY: 840 },
    { mapX: 400, mapY: 680 }, { mapX: 320, mapY: 560 }, { mapX: 350, mapY: 430 },
    { mapX: 410, mapY: 340 },
  ],
  [
    { mapX: 360, mapY: 190 }, { mapX: 1020, mapY: 190 }, { mapX: 1420, mapY: 330 },
    { mapX: 1510, mapY: 530 }, { mapX: 1250, mapY: 690 }, { mapX: 820, mapY: 840 },
    { mapX: 260, mapY: 690 }, { mapX: 170, mapY: 540 }, { mapX: 220, mapY: 330 },
  ],
  [
    { mapX: 270, mapY: 120 }, { mapX: 1040, mapY: 100 }, { mapX: 1510, mapY: 230 },
    { mapX: 1600, mapY: 470 }, { mapX: 1460, mapY: 650 }, { mapX: 980, mapY: 760 },
    { mapX: 820, mapY: 850 }, { mapX: 260, mapY: 730 }, { mapX: 90, mapY: 560 },
    { mapX: 120, mapY: 310 },
  ],
];

export const V10_WATER_POLYGON: ReadonlyArray<V10MapPoint> = [
  { mapX: 1002, mapY: 240 }, { mapX: 1062, mapY: 305 }, { mapX: 1026, mapY: 365 },
  { mapX: 1090, mapY: 435 }, { mapX: 1170, mapY: 492 }, { mapX: 1188, mapY: 590 },
  { mapX: 1100, mapY: 700 }, { mapX: 1018, mapY: 632 }, { mapX: 1005, mapY: 520 },
  { mapX: 955, mapY: 420 }, { mapX: 978, mapY: 330 },
];

export const V10_FIXED_OBJECTS: V10FixedObject[] = [
  { id: 'main-hall', texture: 'v10-fixed-main-hall', mapX: 810, mapY: 565, width: 157.5, height: 123.75 },
  { id: 'elder-pavilion', texture: 'v10-fixed-elder-pavilion', mapX: 955, mapY: 360, width: 122, height: 122 },
  { id: 'research-library', texture: 'v10-fixed-research-library', mapX: 1260, mapY: 600, width: 126, height: 126 },
  { id: 'construction-yard', texture: 'v10-fixed-construction-yard', mapX: 555, mapY: 700, width: 124, height: 93 },
  { id: 'hall-lantern-left', texture: 'v10-fixed-lantern-left', mapX: 815, mapY: 675, width: 36, height: 48, depthOffset: 2 },
  { id: 'hall-incense', texture: 'v10-fixed-incense', mapX: 865, mapY: 670, width: 42, height: 56, depthOffset: 2 },
  { id: 'hall-lantern-right', texture: 'v10-fixed-lantern-right', mapX: 915, mapY: 665, width: 36, height: 48, depthOffset: 2 },
  { id: 'pond-lotus', texture: 'v10-fixed-water-lotus', mapX: 1115, mapY: 520, width: 52, height: 39, depthOffset: 1 },
];

export function v10StageForBuildingCount(count: number): 0 | 1 | 2 {
  if (count > V10_MAP_STAGES[1].capacity) return 2;
  if (count > V10_MAP_STAGES[0].capacity) return 1;
  return 0;
}

export function v10SlotsAreAdjacent(aId?: string, bId?: string): boolean {
  if (!aId || !bId || aId === bId) return false;
  const a = V10_BUILD_SLOTS.find(slot => slot.id === aId);
  const b = V10_BUILD_SLOTS.find(slot => slot.id === bId);
  if (!a || !b || a.zone !== b.zone) return false;
  const dx = Math.abs(a.mapX - b.mapX);
  const dy = Math.abs(a.mapY - b.mapY);
  const sameVector = (x: number, y: number, vector: { x: number; y: number }): boolean => (
    Math.abs(x - Math.abs(vector.x)) < 0.1 && Math.abs(y - Math.abs(vector.y)) < 0.1
  );
  return sameVector(dx, dy, V10_GRID_BASIS.column) || sameVector(dx, dy, V10_GRID_BASIS.row);
}
