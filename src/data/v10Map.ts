export interface V10BuildSlot {
  id: string;
  stage: 0 | 1 | 2;
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

export const V10_MAP_STAGES = [
  { stage: 0, texture: 'v10-map-stage-01', capacity: 20 },
  { stage: 1, texture: 'v10-map-stage-02', capacity: 32 },
  { stage: 2, texture: 'v10-map-stage-03', capacity: 48 },
] as const;

const STAGE_POINTS: ReadonlyArray<ReadonlyArray<readonly [number, number]>> = [
  [
    [840, 454], [740, 454], [592, 630], [790, 390], [890, 390],
    [940, 454], [690, 646], [990, 646], [740, 710], [640, 582],
    [928, 686], [690, 390], [840, 326], [640, 454], [740, 326],
    [590, 518], [460, 440], [590, 390], [640, 326], [540, 454],
  ],
  [
    [430, 330], [270, 430], [987, 547], [540, 290], [380, 410], [1135, 350],
    [1320, 410], [1380, 500], [1260, 500], [357, 480], [1200, 380], [1060, 680],
  ],
  [
    [270, 300], [520, 230], [1420, 458], [243, 382], [259, 528], [680, 230],
    [1434, 538], [209, 456], [354, 288], [1240, 280], [1280, 360], [272, 633],
    [1300, 670], [1200, 690], [920, 220], [1402, 599],
  ],
];

let slotNumber = 0;
export const V10_BUILD_SLOTS: V10BuildSlot[] = STAGE_POINTS.flatMap((points, stage) => points.map(([mapX, mapY]) => {
  const index = slotNumber++;
  return {
    id: `slot-${String(index + 1).padStart(2, '0')}`,
    stage: stage as 0 | 1 | 2,
    gx: (index % 12) * 2,
    gy: Math.floor(index / 12) * 2,
    mapX,
    mapY,
  };
}));

export const V10_GATE_POINT = { mapX: 820, mapY: 822 } as const;

export const V10_FIXED_OBJECTS: V10FixedObject[] = [
  { id: 'main-hall', texture: 'v10-fixed-main-hall', mapX: 810, mapY: 565, width: 210, height: 165 },
  { id: 'elder-pavilion', texture: 'v10-fixed-elder-pavilion', mapX: 450, mapY: 530, width: 122, height: 122 },
  { id: 'research-library', texture: 'v10-fixed-research-library', mapX: 1240, mapY: 595, width: 126, height: 126 },
  { id: 'construction-yard', texture: 'v10-fixed-construction-yard', mapX: 575, mapY: 675, width: 124, height: 93 },
  { id: 'hall-lantern-left', texture: 'v10-fixed-lantern-left', mapX: 815, mapY: 675, width: 36, height: 48, depthOffset: 2 },
  { id: 'hall-incense', texture: 'v10-fixed-incense', mapX: 865, mapY: 670, width: 42, height: 56, depthOffset: 2 },
  { id: 'hall-lantern-right', texture: 'v10-fixed-lantern-right', mapX: 915, mapY: 665, width: 36, height: 48, depthOffset: 2 },
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
  if (!a || !b) return false;
  return Math.hypot(a.mapX - b.mapX, a.mapY - b.mapY) <= 112;
}
