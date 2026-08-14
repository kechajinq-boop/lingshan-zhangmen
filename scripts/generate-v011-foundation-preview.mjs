import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const outDir = path.join(root, 'deliverables', 'v011-map-rebuild', 'previews');
fs.mkdirSync(outDir, { recursive: true });

const canvas = { width: 1672, height: 941 };
const cell = { halfWidth: 55, halfHeight: 27 };

const stage1Slots = [
  // 西北主生产区：连续 4×2，顺着地图的等角方向排列。
  [410, 270], [530, 270], [650, 270], [770, 270],
  [465, 340], [585, 340], [705, 340], [825, 340],
  // 西南辅助区：连续 2×2。
  [280, 500], [400, 500], [335, 570], [455, 570],
  // 东北经营区：连续 2×2，避开溪流与水池。
  [1230, 420], [1350, 420], [1285, 490], [1405, 490],
  // 东南辅助区：连续 2×2，远离悬崖边缘。
  [990, 670], [1110, 670], [1045, 740], [1165, 740],
].map(([mapX, mapY], index) => ({
  id: `slot-${String(index + 1).padStart(2, '0')}`,
  stage: 0,
  mapX,
  mapY,
}));

const stage2NewSlots = [
  [870, 150], [990, 150], [925, 215], [1045, 215],
  [600, 650], [720, 650], [655, 720], [775, 720],
  [1280, 590], [1400, 590], [1335, 660], [1455, 660],
].map(([mapX, mapY], index) => ({
  id: `slot-${String(index + 21).padStart(2, '0')}`,
  stage: 1,
  mapX,
  mapY,
}));

const stage3NewSlots = [
  [210, 320], [330, 320], [265, 390], [385, 390],
  [420, 130], [540, 130], [475, 200], [595, 200],
  [1240, 280], [1360, 280], [1295, 350], [1415, 350],
  [260, 650], [380, 650], [315, 720], [435, 720],
].map(([mapX, mapY], index) => ({
  id: `slot-${String(index + 33).padStart(2, '0')}`,
  stage: 2,
  mapX,
  mapY,
}));

const stage2Slots = [...stage1Slots, ...stage2NewSlots];
const stage3Slots = [...stage2Slots, ...stage3NewSlots];

const assetTypes = [
  { key: 'lingtian', name: '灵田', src: '../asset-qc-cleaned/building-lingtian/cutout.png', width: 78, height: 78, footY: 28 },
  { key: 'danfang', name: '炼丹房', src: '../../../public/assets/v10/buildings/building-danfang.png', width: 80, height: 80, footY: 28 },
  { key: 'danpu', name: '丹药铺', src: '../../../public/assets/v10/buildings/building-danpu.png', width: 79, height: 79, footY: 28 },
  { key: 'liangong', name: '练功房', src: '../../../public/assets/v10/buildings/building-liangong.png', width: 79, height: 79, footY: 28 },
  { key: 'xiangfang', name: '厢房', src: '../../../public/assets/v10/buildings/building-xiangfang.png', width: 78, height: 78, footY: 28 },
];

const fixedObjects = [
  { id: 'main-hall', name: '宗门大殿', src: '../../../public/assets/v10/fixed/bldg_main_hall.png', mapX: 835, mapY: 548, width: 158, height: 124 },
  { id: 'gate', name: '山门', src: '../../../public/assets/v10/fixed/bldg_sect_gate.png', mapX: 835, mapY: 900, width: 106, height: 106 },
  { id: 'lotus', name: '荷花', src: '../../../public/assets/v10/fixed/prop_water_lotus.png', mapX: 1160, mapY: 548, width: 52, height: 39 },
];

const walkableSafePolygon = [
  [300, 120], [600, 100], [850, 130], [1050, 100], [1250, 170],
  [1550, 320], [1600, 500], [1500, 650], [1250, 730], [900, 850],
  [620, 810], [350, 750], [140, 600], [80, 450], [180, 300],
];

const waterBlockedPolygon = [
  [1040, 270], [1105, 300], [1115, 375], [1160, 425], [1215, 470],
  [1235, 535], [1200, 595], [1135, 585], [1090, 525], [1075, 440],
  [1035, 370],
];

const makePlacements = slots => slots.map((slot, index) => ({
  ...slot,
  ...assetTypes[index % assetTypes.length],
}));

const html = ({ slots = stage1Slots, stage = 1, buildMode = false } = {}) => `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=1672,initial-scale=1">
<title>灵山大掌门 v0.11 阶段${stage} ${buildMode ? '建造模式' : `${slots.length}栋满载模拟`}</title>
<style>
*{box-sizing:border-box}html,body{margin:0;width:${canvas.width}px;height:${canvas.height}px;overflow:hidden;background:#dcecf3;font-family:"Microsoft YaHei",sans-serif}.canvas{position:relative;width:100%;height:100%;overflow:hidden}.base{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.fixed,.building{position:absolute;object-fit:contain;transform:translate(-50%,-100%);filter:drop-shadow(3px 5px 3px rgba(35,42,28,.24))}.cell{position:absolute;width:${cell.halfWidth * 2}px;height:${cell.halfHeight * 2}px;transform:translate(-50%,-50%) rotate(0deg);clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:${buildMode ? 'rgba(75,235,135,.44)' : 'rgba(50,220,125,.055)'};border:${buildMode ? '3px solid rgba(16,147,77,.92)' : '1px solid rgba(16,147,77,.22)'};filter:${buildMode ? 'drop-shadow(0 0 7px rgba(102,255,161,.86))' : 'none'}.slot-id{position:absolute;transform:translate(-50%,-50%);font-size:14px;font-weight:900;color:#163d2c;text-shadow:0 1px 2px #f4ffe8;display:${buildMode ? 'block' : 'none'}}.panel{position:absolute;left:24px;top:22px;z-index:5000;width:430px;padding:14px 16px;color:#4b2d18;background:rgba(255,248,218,.94);border:3px solid #7b4d23;box-shadow:0 4px 14px rgba(45,33,19,.24)}.panel h1{margin:0 0 7px;font-size:22px}.panel p{margin:4px 0;font-size:14px;line-height:1.45}.badge{display:inline-block;margin-right:7px;padding:2px 7px;border-radius:10px;background:#168e51;color:#fff;font-weight:800}</style></head>
<body><main class="canvas"><img class="base" src="../foundation/v011-stage3-foundation-candidate-v1.png" alt="v0.11仙山地图候选底图"><div id="cells"></div><div id="objects"></div>
<section class="panel"><h1>v0.11 阶段${stage}·${buildMode ? '建造模式预览' : `${slots.length}栋满载模拟`}</h1><p><span class="badge">交错等角</span>${slots.length}个建造位按连续2×2/4×2区域规划，建筑按68%基准显示。</p><p>${buildMode ? `选择建筑后，本阶段${slots.length}个未占用格同时绿色亮起；悬崖、水域、道路与大殿不属于建造区。` : '用于检查建筑密度、相邻遮挡、道路留白和固定建筑比例。'}</p></section></main>
<script>
const slots=${JSON.stringify(slots)},placements=${JSON.stringify(makePlacements(slots))},fixed=${JSON.stringify(fixedObjects)},buildMode=${buildMode};
const cells=document.getElementById('cells'),objects=document.getElementById('objects');
for(const s of slots){const c=document.createElement('div');c.className='cell';c.style.left=s.mapX+'px';c.style.top=s.mapY+'px';c.style.zIndex=String(100+Math.round(s.mapY));cells.appendChild(c);const id=document.createElement('div');id.className='slot-id';id.style.left=s.mapX+'px';id.style.top=s.mapY+'px';id.style.zIndex=String(200+Math.round(s.mapY));id.textContent=s.id.slice(-2);cells.appendChild(id)}
function addImage(o,klass){const img=document.createElement('img');img.className=klass;img.src=o.src;img.alt=o.name;img.style.left=o.mapX+'px';img.style.top=(o.mapY+(o.footY||0))+'px';img.style.width=o.width+'px';img.style.height=o.height+'px';img.style.zIndex=String(1000+Math.round(o.mapY+(o.footY||0)));objects.appendChild(img)}
for(const o of fixed)addImage(o,'fixed');
if(!buildMode)for(const o of placements)addImage(o,'building');
</script></body></html>`;

for (const [stage, slots] of [[1, stage1Slots], [2, stage2Slots], [3, stage3Slots]]) {
  fs.writeFileSync(path.join(outDir, `stage${stage}-${slots.length}-buildings-preview.html`), html({ slots, stage }), 'utf8');
  fs.writeFileSync(path.join(outDir, `stage${stage}-build-mode-preview.html`), html({ slots, stage, buildMode: true }), 'utf8');
}

const contract = {
  schema: 'lingshan.v11.map-foundation.v1',
  status: 'candidate_not_integrated',
  canvas,
  visualModel: 'layered_raster',
  gridMode: 'staggered_isometric_grouped',
  buildingVisualScale: 0.68,
  fixedBuildingScale: { mainHall: 0.75 },
  stageCapacities: [20, 32, 48],
  stableSlotIdentity: 'slot-01..slot-48',
  stage1Slots,
  stage2NewSlots,
  stage3NewSlots,
  fixedObjects,
  layers: ['foundation', 'roads', 'water', 'fixed_objects', 'build_slots', 'player_buildings', 'npcs', 'ui'],
  navigation: {
    model: 'astar_on_explicit_walkable_and_blocked_polygons',
    walkableSafePolygon,
    blockedPolygons: [{ id: 'stream-and-pond', points: waterBlockedPolygon }],
    gatePoint: { mapX: 835, mapY: 900 },
    hallFrontPoint: { mapX: 835, mapY: 585 },
    buildingEntrances: 'derived_from_shared_building_metadata',
    fixedRoutes: 'reserved_for_gate_and_special_transitions',
  },
  notes: [
    '候选底图和点位尚未写入正式游戏。',
    '阶段一只验证20格密度、68%建筑比例、75%宗门大殿比例与全局绿色高亮。',
    '阶段二和阶段三继续沿用稳定slotId，扩建时只解锁新格，不移动旧建筑。',
  ],
};
fs.writeFileSync(path.join(outDir, 'v011-map-contract-v1.json'), `${JSON.stringify(contract, null, 2)}\n`, 'utf8');

console.log('已生成 v0.11 阶段一满载、建造模式预览与候选地图契约。');
