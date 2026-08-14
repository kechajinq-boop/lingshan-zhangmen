import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const outDir = path.join(root, 'deliverables', 'v011-map-rebuild', 'equal-parcel');
const manifest = JSON.parse(fs.readFileSync(path.join(outDir, 'equal-12-parcels-manifest.json'), 'utf8'));
const { width, height } = manifest.canvas;
const cell = manifest.cell;
const art = 'equal-12-parcels-clean-foundation-v1.png';

const buildings = [
  { name: '灵田', src: '../asset-qc-cleaned/building-lingtian/cutout.png', width: 70, height: 70 },
  { name: '炼丹房', src: '../../../public/assets/v10/buildings/building-danfang.png', width: 72, height: 72 },
  { name: '丹药铺', src: '../../../public/assets/v10/buildings/building-danpu.png', width: 71, height: 71 },
  { name: '练功房', src: '../../../public/assets/v10/buildings/building-liangong.png', width: 71, height: 71 },
  { name: '厢房', src: '../../../public/assets/v10/buildings/building-xiangfang.png', width: 70, height: 70 },
];

const diamond = (x, y, w = cell.width, h = cell.height) =>
  `${x},${y - h / 2} ${x + w / 2},${y} ${x},${y + h / 2} ${x - w / 2},${y}`;

const overlay = manifest.parcels.map(parcel => {
  const parcelPoints = diamond(parcel.mapX, parcel.mapY, manifest.parcel.width, manifest.parcel.height);
  const cells = parcel.cells.map(slot => `<polygon class="cell" points="${diamond(slot.mapX, slot.mapY)}"/>`).join('');
  return `<polygon class="parcel stage-${parcel.stage}" points="${parcelPoints}"/>${cells}`;
}).join('');

const page = filled => `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=${width},initial-scale=1"><title>v0.11 等面积美术模拟</title><style>
*{box-sizing:border-box}html,body{margin:0;width:${width}px;height:${height}px;overflow:hidden;background:#dbeaf1;font-family:"Microsoft YaHei",sans-serif}.canvas{position:relative;width:100%;height:100%;overflow:hidden;background:url('${art}') center/100% 100% no-repeat}.grid{position:absolute;inset:0;width:100%;height:100%}.parcel{fill:rgba(38,225,116,.08);stroke:#118f56;stroke-width:4;stroke-linejoin:round}.stage-2{stroke:#1b89b4}.stage-3{stroke:#a46d16}.cell{fill:rgba(255,255,255,.035);stroke:rgba(22,93,59,.78);stroke-width:2}.building,.fixed{position:absolute;object-fit:contain;transform:translate(-50%,-100%);filter:drop-shadow(3px 4px 2px rgba(25,38,22,.28))}.panel{position:absolute;left:20px;top:18px;z-index:9000;width:410px;padding:12px 15px;background:rgba(255,248,220,.94);border:3px solid #76502d;color:#3f2b1c;box-shadow:0 4px 14px rgba(45,33,19,.22)}h1{margin:0 0 5px;font-size:21px}p{margin:3px 0;font-size:13px;line-height:1.4}.legend{display:flex;gap:12px;margin-top:6px;font-size:12px}.dot{display:inline-block;width:13px;height:9px;margin-right:4px;border:2px solid}.s1{border-color:#118f56}.s2{border-color:#1b89b4}.s3{border-color:#a46d16}
</style></head><body><main class="canvas"><svg class="grid" viewBox="0 0 ${width} ${height}">${overlay}</svg><div id="objects"></div><section class="panel"><h1>v0.11·12块等面积地块${filled ? '满建筑模拟' : '美术底图对齐'}</h1><p>每块严格同尺寸2×2，共12块、48格；绿色/蓝色/金色边界是程序精确坐标。</p><p>${filled ? '建筑按统一尺寸落在48格中心，用于检查满载密度。' : '当前只验证底图与数学格线的贴合，不进入正式游戏。'}</p><div class="legend"><span><i class="dot s1"></i>阶段一</span><span><i class="dot s2"></i>阶段二</span><span><i class="dot s3"></i>阶段三</span></div></section></main><script>
const parcels=${JSON.stringify(manifest.parcels)},buildings=${JSON.stringify(buildings)},filled=${filled},layer=document.getElementById('objects');
function add(o,klass){const img=document.createElement('img');img.className=klass;img.src=o.src;img.alt=o.name;img.style.left=o.mapX+'px';img.style.top=o.mapY+'px';img.style.width=o.width+'px';img.style.height=o.height+'px';img.style.zIndex=String(1000+Math.round(o.mapY));layer.appendChild(img)}
add({name:'宗门大殿',src:'../../../public/assets/v10/fixed/bldg_main_hall.png',mapX:835,mapY:510,width:119,height:93},'fixed');
add({name:'山门',src:'../../../public/assets/v10/fixed/bldg_sect_gate.png',mapX:835,mapY:900,width:80,height:80},'fixed');
if(filled){let i=0;for(const parcel of parcels)for(const slot of parcel.cells){const item=buildings[i++%buildings.length];add({...item,mapX:slot.mapX,mapY:slot.mapY+27},'building')}}
</script></body></html>`;

fs.writeFileSync(path.join(outDir, 'equal-12-parcels-art-grid.html'), page(false), 'utf8');
fs.writeFileSync(path.join(outDir, 'equal-12-parcels-art-48-buildings.html'), page(true), 'utf8');
console.log('已生成等面积地块美术合成预览。');
