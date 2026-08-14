import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const contractPath = path.join(root, 'deliverables', 'v011-map-rebuild', 'previews', 'v011-map-contract-v1.json');
const contract = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
const allSlots = [...contract.stage1Slots, ...contract.stage2NewSlots, ...contract.stage3NewSlots];

const errors = [];
const checks = [];
const check = (condition, message) => {
  checks.push({ message, pass: Boolean(condition) });
  if (!condition) errors.push(message);
};

const pointInPolygon = (point, polygon) => {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    const crosses = ((yi > point.mapY) !== (yj > point.mapY))
      && point.mapX < ((xj - xi) * (point.mapY - yi)) / (yj - yi) + xi;
    if (crosses) inside = !inside;
  }
  return inside;
};

check(contract.stage1Slots.length === 20, '阶段一必须为20格');
check(contract.stage2NewSlots.length === 12, '阶段二必须新增12格');
check(contract.stage3NewSlots.length === 16, '阶段三必须新增16格');
check(allSlots.length === 48, '三阶段总计必须为48格');
check(new Set(allSlots.map(slot => slot.id)).size === 48, 'slotId不得重复');
check(allSlots.every((slot, index) => slot.id === `slot-${String(index + 1).padStart(2, '0')}`), 'slotId必须稳定连续为slot-01至slot-48');

const walkable = contract.navigation.walkableSafePolygon;
const water = contract.navigation.blockedPolygons[0].points;
check(allSlots.every(slot => pointInPolygon(slot, walkable)), '所有建造格中心必须位于岛内安全多边形');
check(allSlots.every(slot => !pointInPolygon(slot, water)), '所有建造格中心必须避开溪流与水池');

let minDistance = Number.POSITIVE_INFINITY;
let nearestPair = [];
for (let i = 0; i < allSlots.length; i++) {
  for (let j = i + 1; j < allSlots.length; j++) {
    const dx = allSlots[i].mapX - allSlots[j].mapX;
    const dy = allSlots[i].mapY - allSlots[j].mapY;
    const distance = Math.hypot(dx, dy);
    if (distance < minDistance) {
      minDistance = distance;
      nearestPair = [allSlots[i].id, allSlots[j].id];
    }
  }
}
check(minDistance >= 84, '任意两个建造格中心距离不得小于84像素（适配68%建筑模型）');

const report = {
  schema: 'lingshan.v11.map-preview-qa.v1',
  generatedAt: new Date().toISOString(),
  pass: errors.length === 0,
  slotCounts: { stage1: 20, stage2: 32, stage3: 48 },
  minSlotDistance: Number(minDistance.toFixed(2)),
  nearestPair,
  checks,
  errors,
};

const output = path.join(path.dirname(contractPath), 'v011-map-preview-qa.json');
fs.writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`v0.11候选地图预检通过：20/32/48格，最小格距${report.minSlotDistance}px。`);
