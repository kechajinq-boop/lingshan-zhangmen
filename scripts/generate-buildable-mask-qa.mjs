import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'deliverables', 'v10-continuous-flat-production', 'buildable-qa');
const canvas = { width: 1672, height: 941 };
const footprint = { width: 96, height: 48 };
const safetyFootprint = { width: 112, height: 64 };
const waterSafetyDistance = 72;

const stageDefinitions = [
  {
    id: 1,
    name: '一阶段',
    capacity: 20,
    base: 'deliverables/v10-continuous-flat-production/stage1-base-candidate-v2.png',
    polygon: [[390,345],[485,290],[950,280],[1020,310],[1150,380],[1320,450],[1340,530],[1290,600],[1160,650],[1030,690],[940,760],[880,790],[820,805],[740,770],[650,730],[520,700],[390,640],[330,560],[340,450]],
  },
  {
    id: 2,
    name: '二阶段',
    capacity: 32,
    base: 'deliverables/v10-continuous-flat-production/stage2/stage2-base-candidate-v1.png',
    polygon: [[280,320],[400,250],[600,220],[980,250],[1120,280],[1320,350],[1460,440],[1480,560],[1410,640],[1300,690],[1100,720],[960,770],[880,810],[800,825],[700,790],[520,750],[340,690],[220,590],[210,430]],
  },
  {
    id: 3,
    name: '三阶段',
    capacity: 48,
    base: 'deliverables/v10-continuous-flat-production/stage3/stage3-base-candidate-v1.png',
    polygon: [[180,300],[360,210],[620,150],[980,160],[1220,220],[1440,300],[1560,410],[1580,560],[1500,650],[1360,700],[1120,740],[980,790],[880,830],[800,850],[680,810],[460,770],[240,700],[120,600],[100,410]],
  },
];

const waterPolygon = [[1002,260],[1057,308],[1028,357],[1072,408],[1112,454],[1168,495],[1178,558],[1130,608],[1060,566],[1058,502],[1022,448],[995,390],[974,335]];
const reservedLandmarks = [
  { id: 'main-hall', label: '宗门大殿地基', x: 730, y: 535, width: 160, height: 70 },
  { id: 'elder-pavilion', label: '长老亭地基', x: 400, y: 505, width: 100, height: 50 },
  { id: 'research-library', label: '研发阁地基', x: 1190, y: 570, width: 100, height: 50 },
  { id: 'construction-yard', label: '营造工地地基', x: 420, y: 580, width: 110, height: 55 },
  { id: 'sect-gate', label: '山门地基', x: 778, y: 810, width: 105, height: 55 },
];
const roadCorridors = [
  { id: 'sect-main-access', width: 34, points: [[836,850],[836,720],[832,640],[810,605]] },
];

const pointInPolygon = ([x, y], polygon) => {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    const intersect = ((yi > y) !== (yj > y)) && (x < ((xj - xi) * (y - yi)) / ((yj - yi) || 1) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
};

const distanceToSegment = (point, a, b) => {
  const [px, py] = point;
  const [ax, ay] = a;
  const [bx, by] = b;
  const dx = bx - ax;
  const dy = by - ay;
  const length2 = dx * dx + dy * dy;
  const t = length2 === 0 ? 0 : Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / length2));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
};

const footprintCorners = (x, y, size = footprint) => [
  [x, y - size.height / 2],
  [x + size.width / 2, y],
  [x, y + size.height / 2],
  [x - size.width / 2, y],
];

const distanceToPolygon = (point, polygon) => Math.min(...polygon.map((vertex, index) => (
  distanceToSegment(point, vertex, polygon[(index + 1) % polygon.length])
)));

const diamondIntersectsRect = (x, y, zone, gap = 4) => {
  const minX = zone.x - gap;
  const maxX = zone.x + zone.width + gap;
  const minY = zone.y - gap;
  const maxY = zone.y + zone.height + gap;
  const nearestX = Math.max(minX, Math.min(x, maxX));
  const nearestY = Math.max(minY, Math.min(y, maxY));
  const normalizedDistance = Math.abs(x - nearestX) / (safetyFootprint.width / 2)
    + Math.abs(y - nearestY) / (safetyFootprint.height / 2);
  return normalizedDistance <= 1;
};

const intersectsReserved = (x, y) => {
  if (reservedLandmarks.some(zone => diamondIntersectsRect(x, y, zone))) return true;
  if (pointInPolygon([x, y], waterPolygon) || distanceToPolygon([x, y], waterPolygon) < waterSafetyDistance) return true;
  return roadCorridors.some(road => road.points.slice(1).some((point, index) => (
    distanceToSegment([x, y], road.points[index], point) < road.width / 2 + footprint.width / 2 + 4
  )));
};

const fitsPolygon = (x, y, polygon) => footprintCorners(x, y, safetyFootprint).every(point => pointInPolygon(point, polygon));

// 人工排布，优先使用岛内开阔区域。扩建新增点不再自动沿边界填充。
const stageAdditions = [
  [
    [840,454],[740,454],[592,630],[790,390],[890,390],
    [940,454],[690,646],[990,646],[740,710],[640,582],
    [928,686],[690,390],[840,326],[640,454],[740,326],
    [590,518],[460,440],[590,390],[640,326],[540,454],
  ],
  [
    [430,330],[270,430],[987,547],[540,290],[380,410],[1135,350],
    [1320,410],[1380,500],[1260,500],[357,480],[1200,380],[1060,680],
  ],
  [
    [270,300],[520,230],[1420,458],[243,382],[259,528],[680,230],
    [1434,538],[209,456],[354,288],[1240,280],[1280,360],[272,633],
    [1300,670],[1200,690],[920,220],[1402,599],
  ],
];

const selectedByStage = [];
const cumulativeSlots = [];
for (let stageIndex = 0; stageIndex < stageAdditions.length; stageIndex += 1) {
  for (const [x, y] of stageAdditions[stageIndex]) cumulativeSlots.push({ x, y, unlockStage: stageIndex + 1 });
  selectedByStage.push(cumulativeSlots.map(slot => ({ ...slot })));
}

const points = polygon => polygon.map(point => point.join(',')).join(' ');
const diamond = (x, y) => points(footprintCorners(x, y));
const escapeXml = value => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[char]));

const renderSvg = async (stage, slots) => {
  const imageHref = pathToFileURL(path.join(root, stage.base)).href;
  const slotMarkup = slots.map((slot, index) => {
    const isNew = slot.unlockStage === stage.id;
    const fill = isNew ? '#63d8ff' : '#ffe37a';
    const stroke = isNew ? '#006e93' : '#7a4c00';
    return `<g><polygon points="${diamond(slot.x, slot.y)}" fill="${fill}" fill-opacity="0.72" stroke="${stroke}" stroke-width="3"/><text x="${slot.x}" y="${slot.y + 5}" text-anchor="middle" font-size="15" font-weight="700" fill="#15212b">${index + 1}</text></g>`;
  }).join('');
  const landmarkMarkup = reservedLandmarks.map(zone => `<g><rect x="${zone.x}" y="${zone.y}" width="${zone.width}" height="${zone.height}" rx="18" fill="#ff4258" fill-opacity="0.48" stroke="#8f0014" stroke-width="3"/><text x="${zone.x + zone.width / 2}" y="${zone.y + zone.height / 2 + 5}" text-anchor="middle" font-size="18" font-weight="700" fill="#ffffff">${escapeXml(zone.label)}</text></g>`).join('');
  const roads = roadCorridors.map(road => `<polyline points="${points(road.points)}" fill="none" stroke="#ff4258" stroke-opacity="0.58" stroke-width="${road.width}" stroke-linecap="round" stroke-linejoin="round"/>`).join('');
  const previousCount = stage.id === 1 ? 0 : stageDefinitions[stage.id - 2].capacity;
  const newCount = stage.capacity - previousCount;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}" viewBox="0 0 ${canvas.width} ${canvas.height}">
  <image href="${imageHref}" x="0" y="0" width="${canvas.width}" height="${canvas.height}"/>
  <polygon points="${points(stage.polygon)}" fill="#28d764" fill-opacity="0.27" stroke="#087b33" stroke-width="6" stroke-linejoin="round"/>
  <polygon points="${points(waterPolygon)}" fill="#ff4258" fill-opacity="0.48" stroke="#8f0014" stroke-width="3"/>
  ${roads}
  ${landmarkMarkup}
  ${slotMarkup}
  <g transform="translate(24 22)">
    <rect width="535" height="138" rx="18" fill="#fff9e8" fill-opacity="0.94" stroke="#5f4122" stroke-width="4"/>
    <text x="22" y="36" font-family="Microsoft YaHei, sans-serif" font-size="25" font-weight="700" fill="#3c2a18">V0.10 ${escapeXml(stage.name)}·可建范围验证</text>
    <text x="22" y="68" font-family="Microsoft YaHei, sans-serif" font-size="19" fill="#3c2a18">容量抽样：${stage.capacity} 栋（本阶段新增 ${newCount} 栋）</text>
    <rect x="22" y="87" width="24" height="18" rx="4" fill="#28d764" fill-opacity="0.55"/><text x="55" y="102" font-size="16" fill="#3c2a18">连续可建区</text>
    <rect x="168" y="87" width="24" height="18" rx="4" fill="#ff4258" fill-opacity="0.65"/><text x="201" y="102" font-size="16" fill="#3c2a18">禁建区</text>
    <polygon points="330,96 342,87 354,96 342,105" fill="#ffe37a" stroke="#7a4c00"/><text x="366" y="102" font-size="16" fill="#3c2a18">保留容量</text>
    <polygon points="464,96 476,87 488,96 476,105" fill="#63d8ff" stroke="#006e93"/><text x="500" y="102" font-size="16" fill="#3c2a18">新增</text>
    <text x="22" y="128" font-size="14" fill="#6b5947">菱形仅用于内部容量验证，正式游戏中不显示固定地块</text>
  </g>
</svg>`;
};

await fs.mkdir(outDir, { recursive: true });
for (let index = 0; index < stageDefinitions.length; index += 1) {
  const stage = stageDefinitions[index];
  const svg = await renderSvg(stage, selectedByStage[index]);
  const svgPath = path.join(outDir, `stage${stage.id}-buildable-mask-qa.svg`);
  await fs.writeFile(svgPath, svg, 'utf8');
}

const manifest = {
  version: 1,
  canvas,
  mode: 'grid_mode',
  visualModel: 'layered_raster',
  engineTarget: 'Phaser',
  grid: {
    type: 'hidden-isometric-snap-grid',
    tileWidth: 48,
    tileHeight: 24,
    buildingFootprintTiles: { width: 2, height: 2 },
    buildingFootprintPixels: footprint,
    qaSafetyEnvelopePixels: safetyFootprint,
    visibleToPlayer: false,
  },
  placementRule: '建筑占地四角必须全部落在当前阶段绿色区域内，且不得与水域、主路、固定地标或已有建筑相交。',
  expansionRule: '扩建只更换底图并增加可建范围；旧范围始终是新范围的子集，现有建筑坐标不迁移。',
  labels: {
    titleSuffix: '·可建范围验证',
    capacityPrefix: '容量抽样：',
    buildingUnit: '栋',
    stageNewPrefix: '（本阶段新增',
    stageNewSuffix: '栋）',
    buildable: '连续可建区',
    forbidden: '禁建区',
    retained: '保留容量',
    newlyUnlocked: '新增',
    note: '菱形仅用于内部验证，正式游戏不显示固定地块',
  },
  exclusions: {
    waterPolygon,
    waterSafetyDistance,
    roadCorridors,
    reservedLandmarks,
  },
  stages: stageDefinitions.map((stage, index) => ({
    id: stage.id,
    name: stage.name,
    capacityTarget: stage.capacity,
    base: stage.base,
    cumulativeBuildablePolygon: stage.polygon,
    sampleFootprints: selectedByStage[index],
    qaImage: `deliverables/v10-continuous-flat-production/buildable-qa/stage${stage.id}-buildable-mask-qa.png`,
  })),
};
await fs.writeFile(path.join(outDir, 'buildable-mask-manifest-v1.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

for (const stage of manifest.stages) {
  if (stage.sampleFootprints.length !== stage.capacityTarget) throw new Error(`Stage ${stage.id} capacity mismatch`);
  const invalidSlots = stage.sampleFootprints
    .map((slot, index) => ({ index: index + 1, ...slot }))
    .filter(slot => !fitsPolygon(slot.x, slot.y, stage.cumulativeBuildablePolygon) || intersectsReserved(slot.x, slot.y));
  if (invalidSlots.length > 0) throw new Error(`Stage ${stage.id} invalid sample footprints: ${JSON.stringify(invalidSlots)}`);
  const overlaps = [];
  for (let i = 0; i < stage.sampleFootprints.length; i += 1) {
    for (let j = i + 1; j < stage.sampleFootprints.length; j += 1) {
      const a = stage.sampleFootprints[i];
      const b = stage.sampleFootprints[j];
      if (Math.abs(a.x - b.x) / footprint.width + Math.abs(a.y - b.y) / footprint.height < 1) overlaps.push([i + 1, j + 1]);
    }
  }
  if (overlaps.length > 0) throw new Error(`Stage ${stage.id} overlapping sample footprints: ${JSON.stringify(overlaps)}`);
}

console.log(JSON.stringify({
  outputDirectory: path.relative(root, outDir),
  stages: manifest.stages.map(stage => ({ id: stage.id, capacity: stage.sampleFootprints.length, qaImage: stage.qaImage })),
}, null, 2));
