import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const outDir = path.join(root, 'deliverables', 'v011-map-rebuild', 'equal-parcel');
fs.mkdirSync(outDir, { recursive: true });

const canvas = { width: 1672, height: 941 };
const cell = { width: 104, height: 52 };
const block = { width: cell.width * 2, height: cell.height * 2, cells: 4 };

// 12个完全相同的2×2地块。地块中心只决定位置，不改变尺寸。
const blockCenters = [
  [340, 220], [590, 220], [1190, 220], [1400, 220],
  [230, 455], [460, 455], [1190, 455], [1420, 455],
  [340, 690], [590, 690], [1190, 690], [1400, 690],
];

const cellsForBlock = (blockCenterX, blockCenterY, blockIndex) => {
  const offsets = [
    [0, -cell.height / 2],
    [-cell.width / 2, 0],
    [cell.width / 2, 0],
    [0, cell.height / 2],
  ];
  return offsets.map(([dx, dy], localIndex) => ({
    id: `slot-${String(blockIndex * 4 + localIndex + 1).padStart(2, '0')}`,
    blockId: `parcel-${String(blockIndex + 1).padStart(2, '0')}`,
    localIndex: localIndex + 1,
    mapX: blockCenterX + dx,
    mapY: blockCenterY + dy,
  }));
};

const parcels = blockCenters.map(([mapX, mapY], index) => ({
  id: `parcel-${String(index + 1).padStart(2, '0')}`,
  index: index + 1,
  mapX,
  mapY,
  width: block.width,
  height: block.height,
  cells: cellsForBlock(mapX, mapY, index),
}));
const slots = parcels.flatMap(parcel => parcel.cells);

const stageByParcel = index => index < 5 ? 1 : index < 8 ? 2 : 3;
parcels.forEach((parcel, index) => {
  parcel.stage = stageByParcel(index);
  parcel.cells.forEach(slot => { slot.stage = parcel.stage; });
});

const assets = [
  { name: '灵田', src: '../asset-qc-cleaned/building-lingtian/cutout.png', width: 78, height: 78 },
  { name: '炼丹房', src: '../../../public/assets/v10/buildings/building-danfang.png', width: 80, height: 80 },
  { name: '丹药铺', src: '../../../public/assets/v10/buildings/building-danpu.png', width: 79, height: 79 },
  { name: '练功房', src: '../../../public/assets/v10/buildings/building-liangong.png', width: 79, height: 79 },
  { name: '厢房', src: '../../../public/assets/v10/buildings/building-xiangfang.png', width: 78, height: 78 },
];

const islandPolygon = '835,55 1480,150 1630,420 1500,750 1015,875 635,875 130,740 35,430 200,150';
const roadLines = [
  [[170, 335], [1500, 335]],
  [[170, 570], [1500, 570]],
  [[230, 805], [1440, 805]],
  [[835, 430], [835, 840]],
];

const sharedStyle = `
*{box-sizing:border-box}html,body{margin:0;width:${canvas.width}px;height:${canvas.height}px;overflow:hidden;background:#dbeaf1;font-family:"Microsoft YaHei",sans-serif}.canvas{position:relative;width:100%;height:100%;overflow:hidden;background:radial-gradient(circle at 50% 45%,#f8fbff 0,#dceef6 62%,#c3dfe9 100%)}svg{position:absolute;inset:0;width:100%;height:100%}.island{fill:#91bd68;stroke:#557f48;stroke-width:8}.cliff{fill:none;stroke:#75936a;stroke-width:28;opacity:.7}.road{stroke:#dfcca5;stroke-width:38;stroke-linecap:round}.road-edge{stroke:#a99368;stroke-width:44;stroke-linecap:round}.river{fill:none;stroke:#51bfd1;stroke-width:48;stroke-linecap:round}.river-edge{fill:none;stroke:#3d8795;stroke-width:60;stroke-linecap:round}.plaza{fill:#e7d7b6;stroke:#9e875c;stroke-width:4}.parcel{stroke-width:4;stroke-linejoin:round}.stage1{fill:rgba(69,222,122,.30);stroke:#15894d}.stage2{fill:rgba(71,184,235,.30);stroke:#187aa5}.stage3{fill:rgba(233,187,64,.28);stroke:#a66a0d}.cell{fill:rgba(255,255,255,.08);stroke:rgba(42,83,51,.78);stroke-width:2}.label{font-size:18px;font-weight:900;text-anchor:middle;dominant-baseline:middle;fill:#173426;paint-order:stroke fill;stroke:#f7ffe9;stroke-width:4}.slot{font-size:12px;font-weight:900;text-anchor:middle;dominant-baseline:middle;fill:#203a2c;paint-order:stroke fill;stroke:#fff;stroke-width:3}.panel{position:absolute;left:22px;top:20px;z-index:5000;width:440px;padding:13px 16px;background:rgba(255,248,218,.96);border:3px solid #775029;color:#422d1b;box-shadow:0 4px 14px rgba(45,33,19,.24)}.panel h1{margin:0 0 7px;font-size:22px}.panel p{margin:4px 0;font-size:14px;line-height:1.45}.legend{display:flex;gap:13px;margin-top:7px;font-size:13px}.swatch{display:inline-block;width:16px;height:10px;margin-right:4px}.s1{background:#45de7a}.s2{background:#47b8eb}.s3{background:#e9bb40}.building,.fixed{position:absolute;object-fit:contain;transform:translate(-50%,-100%);filter:drop-shadow(3px 5px 3px rgba(35,42,28,.24))}`;

const diamondPoints = (cx, cy, width = cell.width, height = cell.height) => [
  `${cx},${cy - height / 2}`,
  `${cx + width / 2},${cy}`,
  `${cx},${cy + height / 2}`,
  `${cx - width / 2},${cy}`,
].join(' ');

const foundationSvg = () => `
<svg viewBox="0 0 ${canvas.width} ${canvas.height}" aria-label="等面积地块数学骨架">
  <polygon class="cliff" points="${islandPolygon}"/>
  <polygon class="island" points="${islandPolygon}"/>
  ${roadLines.map(([a,b]) => `<line class="road-edge" x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/><line class="road" x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/>`).join('')}
  <path class="river-edge" d="M1030 105 C1000 245 1050 350 1025 455 C995 565 1045 665 1020 805"/>
  <path class="river" d="M1030 105 C1000 245 1050 350 1025 455 C995 565 1045 665 1020 805"/>
  <polygon class="plaza" points="835,350 990,430 835,510 680,430"/>
  ${parcels.map(parcel => `<polygon class="parcel stage${parcel.stage}" points="${diamondPoints(parcel.mapX, parcel.mapY, block.width, block.height)}"/>${parcel.cells.map(slot => `<polygon class="cell" points="${diamondPoints(slot.mapX, slot.mapY)}"/>`).join('')}`).join('')}
</svg>`;

const page = ({ filled = false }) => `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=1672,initial-scale=1"><title>v0.11 等面积地块${filled ? '48栋满载' : '数学骨架'}</title><style>${sharedStyle}</style></head><body><main class="canvas">${foundationSvg()}<div id="objects"></div>
<section class="panel"><h1>v0.11·12块等面积地块${filled ? '满载模拟' : '数学骨架'}</h1><p>每块严格为同尺寸2×2，共12块、48个建筑位；宽高均由同一组数值生成。</p><p>中央大殿、水系、主路独立保留，不侵占任何建筑格。</p><div class="legend"><span><i class="swatch s1"></i>阶段一5块</span><span><i class="swatch s2"></i>阶段二+3块</span><span><i class="swatch s3"></i>阶段三+4块</span></div></section></main>
<script>const parcels=${JSON.stringify(parcels)},assets=${JSON.stringify(assets)},filled=${filled},layer=document.getElementById('objects');
function image(o,klass){const img=document.createElement('img');img.className=klass;img.src=o.src;img.alt=o.name;img.style.left=o.mapX+'px';img.style.top=o.mapY+'px';img.style.width=o.width+'px';img.style.height=o.height+'px';img.style.zIndex=String(1000+Math.round(o.mapY));layer.appendChild(img)}
image({name:'宗门大殿',src:'../../../public/assets/v10/fixed/bldg_main_hall.png',mapX:835,mapY:468,width:158,height:124},'fixed');image({name:'山门',src:'../../../public/assets/v10/fixed/bldg_sect_gate.png',mapX:835,mapY:865,width:106,height:106},'fixed');
if(filled){let index=0;for(const parcel of parcels)for(const slot of parcel.cells){const a=assets[index++%assets.length];image({...a,mapX:slot.mapX,mapY:slot.mapY+28},'building')}}else{for(const parcel of parcels){const label=document.createElement('div');label.className='label';label.style.position='absolute';label.style.left=parcel.mapX+'px';label.style.top=(parcel.mapY-1)+'px';label.style.transform='translate(-50%,-50%)';label.style.zIndex='3000';label.textContent=parcel.index;layer.appendChild(label);for(const slot of parcel.cells){const id=document.createElement('div');id.className='slot';id.style.position='absolute';id.style.left=slot.mapX+'px';id.style.top=slot.mapY+'px';id.style.transform='translate(-50%,-50%)';id.style.zIndex='3000';id.textContent=slot.id.slice(-2);layer.appendChild(id)}}}
</script></body></html>`;

fs.writeFileSync(path.join(outDir, 'equal-12-parcels-skeleton.html'), page({ filled: false }), 'utf8');
fs.writeFileSync(path.join(outDir, 'equal-12-parcels-48-buildings.html'), page({ filled: true }), 'utf8');

const manifest = {
  schema: 'lingshan.v11.equal-parcel-grid.v1',
  status: 'candidate_not_integrated',
  canvas,
  gridMode: 'twelve_equal_isometric_2x2_parcels',
  cell,
  parcel: block,
  stageParcelCounts: [5, 8, 12],
  stageSlotCounts: [20, 32, 48],
  reservedZones: ['central_hall_plaza', 'north_south_main_road', 'river_corridor'],
  parcels,
};
fs.writeFileSync(path.join(outDir, 'equal-12-parcels-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

const widths = new Set(parcels.map(parcel => parcel.width));
const heights = new Set(parcels.map(parcel => parcel.height));
const slotIds = slots.map(slot => slot.id);
const islandPoints = islandPolygon.split(' ').map(point => point.split(',').map(Number));
const pointInPolygon = ([x, y], polygon) => {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i], [xj, yj] = polygon[j];
    const crosses = ((yi > y) !== (yj > y)) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (crosses) inside = !inside;
  }
  return inside;
};
const parcelCorners = parcel => [
  [parcel.mapX, parcel.mapY - parcel.height / 2],
  [parcel.mapX + parcel.width / 2, parcel.mapY],
  [parcel.mapX, parcel.mapY + parcel.height / 2],
  [parcel.mapX - parcel.width / 2, parcel.mapY],
];
const unsafeParcels = parcels.filter(parcel => parcelCorners(parcel).some(point => !pointInPolygon(point, islandPoints))).map(parcel => parcel.id);
const pointToSegmentDistance = ([px, py], [ax, ay], [bx, by]) => {
  const dx = bx - ax, dy = by - ay;
  const lengthSq = dx * dx + dy * dy;
  const t = lengthSq ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lengthSq)) : 0;
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
};
const riverSamples = Array.from({ length: 71 }, (_, index) => {
  const y = 105 + index * 10;
  const x = y < 350 ? 1030 - (y - 105) * 0.08 : y < 565 ? 1015 + (y - 350) * 0.02 : 1020;
  return [x, y];
});
const parcelOverlapsRect = (parcel, rect) => {
  const halfW = parcel.width / 2;
  const halfH = parcel.height / 2;
  return parcel.mapX + halfW > rect.left && parcel.mapX - halfW < rect.right
    && parcel.mapY + halfH > rect.top && parcel.mapY - halfH < rect.bottom;
};
const reservedRects = [
  { id: 'hall-plaza', left: 650, right: 1020, top: 330, bottom: 540 },
  { id: 'main-road-lower', left: 790, right: 880, top: 520, bottom: 850 },
];
const checks = {
  parcelCount: parcels.length === 12,
  slotCount: slots.length === 48,
  everyParcelHasFourCells: parcels.every(parcel => parcel.cells.length === 4),
  equalParcelWidth: widths.size === 1,
  equalParcelHeight: heights.size === 1,
  uniqueSlotIds: new Set(slotIds).size === 48,
  stableSlotIds: slotIds.every((id,index) => id === `slot-${String(index+1).padStart(2,'0')}`),
  parcelsDoNotOverlap: parcels.every((parcel, index) => parcels.slice(index + 1).every(other => {
    const dx = Math.abs(parcel.mapX - other.mapX);
    const dy = Math.abs(parcel.mapY - other.mapY);
    return dx / parcel.width + dy / parcel.height >= 1;
  })),
  everyParcelCornerInsideIsland: parcels.every(parcel => parcelCorners(parcel).every(point => pointInPolygon(point, islandPoints))),
  everyParcelClearOfRiver: parcels.every(parcel => riverSamples.every(point => pointToSegmentDistance(point, [parcel.mapX - parcel.width / 2, parcel.mapY], [parcel.mapX + parcel.width / 2, parcel.mapY]) > 40)),
  everyParcelClearOfHallAndMainRoad: parcels.every(parcel => reservedRects.every(rect => !parcelOverlapsRect(parcel, rect))),
};
const qa = { schema: 'lingshan.v11.equal-parcel-grid-qa.v1', pass: Object.values(checks).every(Boolean), checks, unsafeParcels };
fs.writeFileSync(path.join(outDir, 'equal-12-parcels-qa.json'), `${JSON.stringify(qa, null, 2)}\n`, 'utf8');
if (!qa.pass) process.exit(1);
console.log('等面积骨架验证通过：12块×4格=48格，全部地块宽高一致。');
