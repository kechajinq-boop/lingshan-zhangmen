import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const outDir = path.join(root, 'deliverables', 'v011-map-rebuild', 'equal-parcel');
fs.mkdirSync(outDir, { recursive: true });

const canvas = { width: 1672, height: 941 };
const cell = { width: 90, height: 52, rowSkew: 22 };
const zoneCenters = [
  [465, 220], [1295, 220],
  [345, 455], [1305, 455],
  [465, 690], [1295, 690],
];
const art = 'single-map-roads-3bridges-source.png';

const stageForCell = (zoneIndex, col) => {
  if (zoneIndex <= 1) return 1;
  if (zoneIndex === 2) return col === 3 ? 1 : 2;
  if (zoneIndex === 3) return col === 0 ? 1 : 2;
  return 3;
};

const cellPoints = (cx, cy) => [
  [cx - cell.width / 2 - cell.rowSkew / 2, cy - cell.height / 2],
  [cx + cell.width / 2 - cell.rowSkew / 2, cy - cell.height / 2],
  [cx + cell.width / 2 + cell.rowSkew / 2, cy + cell.height / 2],
  [cx - cell.width / 2 + cell.rowSkew / 2, cy + cell.height / 2],
];
const asPoints = points => points.map(([x, y]) => `${x},${y}`).join(' ');

let slotNumber = 1;
const zones = zoneCenters.map(([cx, cy], zoneIndex) => {
  const cells = [];
  for (let row = 0; row < 2; row += 1) {
    for (let col = 0; col < 4; col += 1) {
      const mapX = cx + (col - 1.5) * cell.width + (row - 0.5) * cell.rowSkew;
      const mapY = cy + (row - 0.5) * cell.height;
      cells.push({
        id: `slot-${String(slotNumber++).padStart(2, '0')}`,
        zoneId: `zone-${String(zoneIndex + 1).padStart(2, '0')}`,
        parcelId: `parcel-${String(zoneIndex * 2 + (col < 2 ? 1 : 2)).padStart(2, '0')}`,
        row,
        col,
        stage: stageForCell(zoneIndex, col),
        mapX,
        mapY,
        points: cellPoints(mapX, mapY),
      });
    }
  }
  return { id: `zone-${String(zoneIndex + 1).padStart(2, '0')}`, mapX: cx, mapY: cy, rows: 2, cols: 4, cells };
});
const slots = zones.flatMap(zone => zone.cells);
const unlockedCount = stage => slots.filter(slot => slot.stage <= stage).length;

const islandPolygon = [[835,55],[1480,150],[1630,420],[1500,750],[1015,875],[635,875],[130,740],[35,430],[200,150]];
const pointInPolygon = ([x, y], polygon) => {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i], [xj, yj] = polygon[j];
    if (((yi > y) !== (yj > y)) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
};
const bounds = points => ({
  left: Math.min(...points.map(([x]) => x)), right: Math.max(...points.map(([x]) => x)),
  top: Math.min(...points.map(([, y]) => y)), bottom: Math.max(...points.map(([, y]) => y)),
});
const overlaps = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
const zoneBounds = zones.map(zone => bounds(zone.cells.flatMap(item => item.points)));
const reserved = [
  { id: 'hall', left: 650, right: 1020, top: 330, bottom: 535 },
  { id: 'main-road', left: 790, right: 880, top: 520, bottom: 860 },
  { id: 'river', left: 980, right: 1085, top: 75, bottom: 850 },
];
const checks = {
  zoneCount: zones.length === 6,
  slotCount: slots.length === 48,
  everyZoneIsFourByTwo: zones.every(zone => zone.rows === 2 && zone.cols === 4 && zone.cells.length === 8),
  equalColumnSpacing: zones.every(zone => [0, 1].every(row => {
    const xs = zone.cells.filter(cellItem => cellItem.row === row).map(cellItem => cellItem.mapX);
    return xs.slice(1).every((x, index) => x - xs[index] === cell.width);
  })),
  equalRowSpacing: zones.every(zone => {
    const y0 = zone.cells.find(cellItem => cellItem.row === 0).mapY;
    const y1 = zone.cells.find(cellItem => cellItem.row === 1).mapY;
    return y1 - y0 === cell.height;
  }),
  everyCellInsideIsland: slots.every(slot => slot.points.every(point => pointInPolygon(point, islandPolygon))),
  zonesDoNotOverlap: zoneBounds.every((area, index) => zoneBounds.slice(index + 1).every(other => !overlaps(area, other))),
  zonesClearReservedAreas: zoneBounds.every(area => reserved.every(blocker => !overlaps(area, blocker))),
  stageOneHas20Slots: unlockedCount(1) === 20,
  stageTwoHas32Slots: unlockedCount(2) === 32,
  stageThreeHas48Slots: unlockedCount(3) === 48,
};
const qa = { schema: 'lingshan.v11.continuous-4x2-qa.v1', pass: Object.values(checks).every(Boolean), checks };
fs.writeFileSync(path.join(outDir, 'continuous-4x2-qa.json'), `${JSON.stringify(qa, null, 2)}\n`, 'utf8');
const artPath = path.join(outDir, art);
const artSha256 = crypto.createHash('sha256').update(fs.readFileSync(artPath)).digest('hex');
fs.writeFileSync(path.join(outDir, 'continuous-4x2-manifest.json'), `${JSON.stringify({
  schema: 'lingshan.v11.continuous-4x2.v2',
  status: 'candidate_not_integrated',
  canvas,
  cell,
  stageCapacities: [20, 32, 48],
  art: { file: art, sha256: artSha256, role: 'approved_visual_candidate_not_runtime_base' },
  routeDraft: {
    northRoadExtension: [[800, 330], [800, 125]],
    bridgeCrossings: [
      { id: 'bridge-north', center: [1010, 330] },
      { id: 'bridge-middle', center: [1010, 577] },
      { id: 'bridge-south', center: [1010, 805] },
    ],
  },
  zones,
}, null, 2)}\n`, 'utf8');
if (!qa.pass) throw new Error(`连续4×2区域检查失败: ${JSON.stringify(checks)}`);

const buildings = [
  { name: '灵田', src: '../asset-qc-cleaned/building-lingtian/cutout.png', width: 70, height: 70 },
  { name: '炼丹房', src: '../../../public/assets/v10/buildings/building-danfang.png', width: 72, height: 72 },
  { name: '丹药铺', src: '../../../public/assets/v10/buildings/building-danpu.png', width: 71, height: 71 },
  { name: '练功房', src: '../../../public/assets/v10/buildings/building-liangong.png', width: 71, height: 71 },
  { name: '厢房', src: '../../../public/assets/v10/buildings/building-xiangfang.png', width: 70, height: 70 },
];
const grid = zones.map(zone => zone.cells.map(slot => `<polygon class="cell stage-${slot.stage} parcel-${slot.parcelId.slice(-2)}" points="${asPoints(slot.points)}"/>`).join('')).join('');
const html = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=1672,initial-scale=1"><title>v0.11 连续4×2均匀满建筑模拟</title><style>
*{box-sizing:border-box}html,body{margin:0;width:${canvas.width}px;height:${canvas.height}px;overflow:hidden;background:#dbeaf1;font-family:"Microsoft YaHei",sans-serif}.canvas{position:relative;width:100%;height:100%;overflow:hidden;background:url('${art}') center/100% 100% no-repeat}.grid{position:absolute;inset:0;width:100%;height:100%}.cell{fill:rgba(24,219,109,.07);stroke:#118f56;stroke-width:2}.stage-2{fill:rgba(22,135,180,.07);stroke:#1687b4}.stage-3{fill:rgba(191,129,30,.07);stroke:#a46d16}.building,.fixed{position:absolute;object-fit:contain;transform:translate(-50%,-100%);filter:drop-shadow(3px 4px 2px rgba(25,38,22,.28))}.panel{position:absolute;left:20px;top:18px;z-index:9000;width:445px;padding:12px 15px;background:rgba(255,248,220,.94);border:3px solid #76502d;color:#3f2b1c;box-shadow:0 4px 14px rgba(45,33,19,.22)}h1{margin:0 0 5px;font-size:21px}p{margin:3px 0;font-size:13px;line-height:1.4}.legend{display:flex;gap:14px;margin-top:7px;font-size:12px}.key{display:inline-block;width:13px;height:9px;margin-right:4px;border:2px solid;vertical-align:-1px}.s1{border-color:#118f56}.s2{border-color:#1687b4}.s3{border-color:#a46d16}
</style></head><body><main class="canvas"><svg class="grid" viewBox="0 0 ${canvas.width} ${canvas.height}">${grid}</svg><div id="objects"></div><section class="panel"><h1>v0.11·连续4×2均匀满建筑模拟</h1><p>每片区域连续4列×2行，共6片、48位；8栋建筑按统一间距铺满整片区域。</p><p>每两列仍是一个2×2扩建单位，但视觉上不再缩成两个小团。</p></section></main><script>
const zones=${JSON.stringify(zones)},buildings=${JSON.stringify(buildings)},layer=document.getElementById('objects');
function add(o,klass){const img=document.createElement('img');img.className=klass;img.src=o.src;img.alt=o.name;img.style.left=o.mapX+'px';img.style.top=o.mapY+'px';img.style.width=o.width+'px';img.style.height=o.height+'px';img.style.zIndex=String(1000+Math.round(o.mapY));layer.appendChild(img)}
add({name:'宗门大殿',src:'../../../public/assets/v10/fixed/bldg_main_hall.png',mapX:835,mapY:510,width:119,height:93},'fixed');add({name:'山门',src:'../../../public/assets/v10/fixed/bldg_sect_gate.png',mapX:835,mapY:900,width:80,height:80},'fixed');
let i=0;for(const zone of zones)for(const slot of zone.cells){const item=buildings[i++%buildings.length];add({...item,mapX:slot.mapX,mapY:slot.mapY+27},'building')}
</script></body></html>`;
const updatedHtml = html.replace(
  '<h1>v0.11·连续4×2均匀满建筑模拟</h1><p>每片区域连续4列×2行，共6片、48位；8栋建筑按统一间距铺满整片区域。</p><p>每两列仍是一个2×2扩建单位，但视觉上不再缩成两个小团。</p>',
  '<h1>v0.11·单地图三阶段满载候选</h1><p>同一张仙山地图永久保留，扩建只累计开放20／32／48个建造格。</p><p>北向道路与三座过河桥已接通；桥梁同时作为NPC合法过河节点。</p><div class="legend"><span><i class="key s1"></i>一阶段20格</span><span><i class="key s2"></i>二阶段新增12格</span><span><i class="key s3"></i>三阶段新增16格</span></div>',
);
fs.writeFileSync(path.join(outDir, 'single-map-3bridges-48-buildings.html'), updatedHtml, 'utf8');
console.log('单地图布局验证通过：阶段容量20/32/48，北向道路与三桥候选已接入预览。');
