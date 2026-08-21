export interface V12BuildSlot {
  id: string;
  stage: 0 | 1 | 2;
  zone: string;
  row: number;
  column: number;
  gx: number;
  gy: number;
  mapX: number;
  mapY: number;
}

export interface V12FixedObject {
  id: string;
  texture: string;
  mapX: number;
  mapY: number;
  width: number;
  height: number;
  depthOffset?: number;
}

export interface V12MapPoint {
  mapX: number;
  mapY: number;
}

export interface V12RoadNode extends V12MapPoint {
  id: string;
  links: string[];
}

export const V12_MAP_STAGES = [
  { stage: 0, texture: 'v12-map-base', capacity: 20 },
  { stage: 1, texture: 'v12-map-base', capacity: 32 },
  { stage: 2, texture: 'v12-map-base', capacity: 48 },
] as const;

// The approved build marker is a 112x72 isometric diamond. The six regions
// use larger visual spacing so full-capacity buildings stay readable.
export const V12_GRID_BASIS = {
  column: { x: 56, y: -36 },
  row: { x: 56, y: 36 },
} as const;

const REGION_CENTERS = [
  [465, 220], [1295, 220],
  [345, 455], [1305, 455],
  [465, 690], [1295, 690],
] as const;

const CELL_COLUMN_STEP = 112;
const CELL_ROW_STEP = 90;
const CELL_ROW_SKEW = 22;

const stageForCell = (zoneIndex: number, column: number): 0 | 1 | 2 => {
  if (zoneIndex <= 1) return 0;
  if (zoneIndex === 2) return column === 3 ? 0 : 1;
  if (zoneIndex === 3) return column === 0 ? 0 : 1;
  return 2;
};

const spatialSlots = REGION_CENTERS.flatMap(([centerX, centerY], zoneIndex) => {
  const slots: Omit<V12BuildSlot, 'id' | 'gx' | 'gy'>[] = [];
  for (let row = 0; row < 2; row++) {
    for (let column = 0; column < 4; column++) {
      slots.push({
        stage: stageForCell(zoneIndex, column),
        zone: `zone-${String(zoneIndex + 1).padStart(2, '0')}`,
        row,
        column,
        mapX: centerX + (column - 1.5) * CELL_COLUMN_STEP + (row - 0.5) * CELL_ROW_SKEW,
        mapY: centerY + (row - 0.5) * CELL_ROW_STEP,
      });
    }
  }
  return slots;
});

// Allocate IDs by unlock stage, then by region position. This preserves the
// schema-7 promise that slot-01..20/32/48 remain valid at each stage while the
// approved regions stay spatially grouped.
export const V12_BUILD_SLOTS: V12BuildSlot[] = spatialSlots
  .sort((a, b) => a.stage - b.stage || a.zone.localeCompare(b.zone) || a.row - b.row || a.column - b.column)
  .map((slot, index) => ({
    ...slot,
    id: `slot-${String(index + 1).padStart(2, '0')}`,
    gx: (index % 12) * 2,
    gy: Math.floor(index / 12) * 2,
  }));

// Small 1x1 decoration anchors approved against the full 48-building map.
// They are kept outside the construction grid so decorations never consume a
// 2x2 building lot or block a shop entrance. The synthetic grid coordinates
// are stable save identifiers only; rendering uses the authored map points.
export const V12_DECORATION_SLOTS: V12BuildSlot[] = [
  { id: 'decor-slot-01', mapX: 856, mapY: 191 },
  { id: 'decor-slot-02', mapX: 754, mapY: 192 },
  { id: 'decor-slot-03', mapX: 935, mapY: 229 },
  { id: 'decor-slot-04', mapX: 855, mapY: 239 },
  { id: 'decor-slot-05', mapX: 753, mapY: 243 },
  { id: 'decor-slot-06', mapX: 934, mapY: 286 },
  { id: 'decor-slot-07', mapX: 858, mapY: 288 },
  { id: 'decor-slot-08', mapX: 756, mapY: 290 },
  { id: 'decor-slot-09', mapX: 634, mapY: 386 },
  { id: 'decor-slot-10', mapX: 951, mapY: 381 },
  { id: 'decor-slot-11', mapX: 722, mapY: 388 },
  { id: 'decor-slot-12', mapX: 641, mapY: 455 },
  { id: 'decor-slot-13', mapX: 647, mapY: 537 },
  { id: 'decor-slot-14', mapX: 738, mapY: 543 },
  { id: 'decor-slot-15', mapX: 908, mapY: 558 },
  { id: 'decor-slot-16', mapX: 772, mapY: 623 },
  { id: 'decor-slot-17', mapX: 897, mapY: 628 },
  { id: 'decor-slot-18', mapX: 777, mapY: 678 },
  { id: 'decor-slot-19', mapX: 903, mapY: 684 },
  { id: 'decor-slot-20', mapX: 784, mapY: 741 },
  { id: 'decor-slot-21', mapX: 904, mapY: 745 },
  { id: 'decor-slot-22', mapX: 783, mapY: 800 },
  { id: 'decor-slot-23', mapX: 903, mapY: 803 },
].map((slot, index) => ({
  ...slot,
  stage: 0,
  zone: 'decor',
  row: 0,
  column: index,
  gx: 100 + index,
  gy: 100,
}));

export const V12_GATE_POINT = { mapX: 835, mapY: 912 } as const;

// Visitors enter through the open centre of the gate. The two side blocks are
// navigation obstacles; the centre corridor is the only legal crossing.
export const V12_GATE_PORTAL = {
  x: 835,
  halfWidth: 28,
  northY: 800,
  southY: 925,
  depthY: 805,
} as const;

export const V12_GATE_COLLISIONS = [
  { x: 785, y: 862, halfWidth: 22, halfHeight: 63 },
  { x: 885, y: 862, halfWidth: 22, halfHeight: 63 },
] as const;

export const V12_FIXED_OBJECTS: V12FixedObject[] = [
  {
    id: 'main-hall',
    texture: 'v10-fixed-main-hall',
    mapX: 827,
    mapY: 517,
    width: 238,
    height: 186,
  },
];

// The main hall sprite is bottom-anchored at mapY=517. Visitors may pass
// behind its roof, but must never cut through the lower body or front steps.
// Keep this separate from the art bounds so navigation has an explicit,
// testable contract.
export const V12_MAIN_HALL_COLLISION = {
  x: 827,
  y: 454,
  halfWidth: 132,
  halfHeight: 75,
} as const;

// Conservative island outline used by QA and as a final navigation guard.
export const V12_WALKABLE_POLYGONS: ReadonlyArray<ReadonlyArray<V12MapPoint>> = [0, 1, 2].map(() => [
  { mapX: 260, mapY: 110 }, { mapX: 760, mapY: 70 }, { mapX: 900, mapY: 95 },
  { mapX: 1160, mapY: 90 }, { mapX: 1510, mapY: 150 }, { mapX: 1610, mapY: 390 },
  { mapX: 1580, mapY: 750 }, { mapX: 1120, mapY: 850 }, { mapX: 835, mapY: 925 },
  { mapX: 560, mapY: 850 }, { mapX: 120, mapY: 760 }, { mapX: 45, mapY: 430 },
  { mapX: 110, mapY: 240 },
]);

// River is blocked everywhere except at the three approved bridge crossings.
export const V12_WATER_POLYGON: ReadonlyArray<V12MapPoint> = [
  { mapX: 952, mapY: 70 }, { mapX: 1050, mapY: 70 }, { mapX: 1055, mapY: 250 },
  { mapX: 1025, mapY: 355 }, { mapX: 1040, mapY: 480 }, { mapX: 1020, mapY: 620 },
  { mapX: 1040, mapY: 850 }, { mapX: 940, mapY: 850 }, { mapX: 940, mapY: 620 },
  { mapX: 955, mapY: 480 }, { mapX: 940, mapY: 355 }, { mapX: 955, mapY: 250 },
];

export const V12_BRIDGES = [
  { id: 'bridge-north', mapX: 995, mapY: 320 },
  { id: 'bridge-middle', mapX: 995, mapY: 570 },
  { id: 'bridge-south', mapX: 995, mapY: 805 },
] as const;

// The visible stone roads are the authoritative visitor network. Region entry
// nodes are connected later to each building's own entrance point.
export const V12_ROAD_NODES: V12RoadNode[] = [
  { id: 'gate', mapX: 835, mapY: 900, links: ['south-junction'] },
  { id: 'south-junction', mapX: 835, mapY: 805, links: ['gate', 'middle-junction', 'south-west', 'bridge-south'] },
  { id: 'middle-junction', mapX: 835, mapY: 570, links: ['south-junction', 'hall-south', 'middle-west', 'bridge-middle'] },
  { id: 'hall-south', mapX: 835, mapY: 545, links: ['middle-junction', 'hall-south-west'] },
  { id: 'hall-south-west', mapX: 675, mapY: 545, links: ['hall-south', 'hall-west'] },
  { id: 'hall-west', mapX: 660, mapY: 454, links: ['hall-south-west', 'hall-north-west'] },
  { id: 'hall-north-west', mapX: 675, mapY: 365, links: ['hall-west', 'hall-north'] },
  { id: 'hall-north', mapX: 835, mapY: 355, links: ['hall-north-west', 'north-junction'] },
  { id: 'north-junction', mapX: 835, mapY: 320, links: ['hall-north', 'north-west', 'bridge-north', 'north-end'] },
  { id: 'north-end', mapX: 835, mapY: 115, links: ['north-junction'] },
  { id: 'north-west', mapX: 465, mapY: 320, links: ['north-junction', 'zone-01'] },
  { id: 'middle-west', mapX: 345, mapY: 570, links: ['middle-junction', 'zone-03'] },
  { id: 'south-west', mapX: 465, mapY: 805, links: ['south-junction', 'zone-05'] },
  { id: 'bridge-north', mapX: 995, mapY: 320, links: ['north-junction', 'north-east'] },
  { id: 'north-east', mapX: 1295, mapY: 320, links: ['bridge-north', 'zone-02'] },
  { id: 'bridge-middle', mapX: 995, mapY: 570, links: ['middle-junction', 'middle-east'] },
  { id: 'middle-east', mapX: 1305, mapY: 570, links: ['bridge-middle', 'zone-04'] },
  { id: 'bridge-south', mapX: 995, mapY: 805, links: ['south-junction', 'south-east'] },
  { id: 'south-east', mapX: 1295, mapY: 805, links: ['bridge-south', 'zone-06'] },
  { id: 'zone-01', mapX: 465, mapY: 310, links: ['north-west'] },
  { id: 'zone-02', mapX: 1295, mapY: 310, links: ['north-east'] },
  { id: 'zone-03', mapX: 345, mapY: 545, links: ['middle-west'] },
  { id: 'zone-04', mapX: 1305, mapY: 545, links: ['middle-east'] },
  { id: 'zone-05', mapX: 465, mapY: 780, links: ['south-west'] },
  { id: 'zone-06', mapX: 1295, mapY: 780, links: ['south-east'] },
];

export function v12StageForBuildingCount(count: number): 0 | 1 | 2 {
  if (count > V12_MAP_STAGES[1].capacity) return 2;
  if (count > V12_MAP_STAGES[0].capacity) return 1;
  return 0;
}

export function v12SlotsAreAdjacent(aId?: string, bId?: string): boolean {
  if (!aId || !bId || aId === bId) return false;
  const a = V12_BUILD_SLOTS.find(slot => slot.id === aId);
  const b = V12_BUILD_SLOTS.find(slot => slot.id === bId);
  return !!a && !!b && a.zone === b.zone
    && Math.abs(a.row - b.row) + Math.abs(a.column - b.column) === 1;
}

export function v12RoadPath(startId: string, targetId: string): V12RoadNode[] | null {
  const byId = new Map(V12_ROAD_NODES.map(node => [node.id, node]));
  if (!byId.has(startId) || !byId.has(targetId)) return null;
  const queue = [startId];
  const previous = new Map<string, string | null>([[startId, null]]);
  while (queue.length) {
    const current = queue.shift()!;
    if (current === targetId) break;
    for (const link of byId.get(current)?.links || []) {
      if (!byId.has(link) || previous.has(link)) continue;
      previous.set(link, current);
      queue.push(link);
    }
  }
  if (!previous.has(targetId)) return null;
  const ids: string[] = [];
  for (let id: string | null = targetId; id; id = previous.get(id) ?? null) ids.push(id);
  return ids.reverse().map(id => byId.get(id)!);
}
