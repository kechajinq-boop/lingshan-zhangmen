import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const outDir = path.join(root, 'deliverables', 'v011-map-rebuild', 'grounding', 'spacious-full-load-v1');
fs.mkdirSync(outDir, { recursive: true });

const canvas = { width: 1672, height: 941 };
const cell = { width: 112, height: 72, rowStep: 90, rowSkew: 22 };
const zoneCenters = [
  [465, 220], [1295, 220],
  [345, 455], [1305, 455],
  [465, 690], [1295, 690],
];

const buildings = [
  { name: '灵田', src: '../../asset-qc-cleaned/building-lingtian/cutout.png', width: 105, height: 105, anchorOffsetY: 8 },
  { name: '炼丹房', src: '../alchemy-grounded-candidate-v1/qc-clean/cutout/cutout.png', width: 108, height: 101, adapted: true },
  { name: '丹药铺', src: '../../../../public/assets/v10/buildings/building-danpu.png', width: 107, height: 107 },
  { name: '练功房', src: '../../../../public/assets/v10/buildings/building-liangong.png', width: 107, height: 107 },
  { name: '厢房', src: '../../../../public/assets/v10/buildings/building-xiangfang.png', width: 105, height: 105 },
];

let number = 1;
const zones = zoneCenters.map(([cx, cy], zoneIndex) => {
  const slots = [];
  for (let row = 0; row < 2; row += 1) {
    for (let col = 0; col < 4; col += 1) {
      slots.push({
        id: number++, zoneIndex, row, col,
        x: cx + (col - 1.5) * cell.width + (row - 0.5) * cell.rowSkew,
        y: cy + (row - 0.5) * cell.rowStep,
      });
    }
  }
  return slots;
});
const slots = zones.flat();

const stage = slot => slot.id <= 20 ? 1 : slot.id <= 32 ? 2 : 3;
const polygon = slot => {
  const hw = cell.width / 2 - 3, hh = cell.height / 2;
  return `${slot.x - hw},${slot.y} ${slot.x},${slot.y - hh} ${slot.x + hw},${slot.y} ${slot.x},${slot.y + hh}`;
};
const grid = slots.map(slot => `<polygon class="cell s${stage(slot)}" points="${polygon(slot)}"/>`).join('');

const html = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=1672,initial-scale=1"><title>v0.11 放大格距48栋满载模拟</title><style>
*{box-sizing:border-box}html,body{margin:0;width:1672px;height:941px;overflow:hidden;background:#dbeaf1;font-family:"Microsoft YaHei",sans-serif}.canvas{position:relative;width:100%;height:100%;overflow:hidden;background:url('../southeast-extension-v1/single-map-roads-3bridges-southeast-extended.png') center/100% 100% no-repeat}.grid{position:absolute;inset:0;width:100%;height:100%;z-index:2}.cell{fill:rgba(31,198,99,.035);stroke:rgba(19,132,75,.34);stroke-width:1.5}.s2{stroke:rgba(23,129,171,.34)}.s3{stroke:rgba(160,103,21,.34)}.building,.fixed{position:absolute;object-fit:contain;transform:translate(-50%,-100%)}.building{z-index:10}.adapted{filter:none}.panel{position:absolute;left:18px;top:16px;z-index:9000;width:480px;padding:11px 14px;background:rgba(255,248,220,.95);border:3px solid #76502d;color:#3f2b1c;box-shadow:0 4px 14px rgba(45,33,19,.22)}h1{margin:0 0 4px;font-size:21px}p{margin:3px 0;font-size:13px;line-height:1.4}.legend{display:flex;gap:15px;margin-top:6px;font-size:12px}.key{display:inline-block;width:14px;height:9px;margin-right:4px;border:2px solid;vertical-align:-1px}.k1{border-color:#13844b}.k2{border-color:#1781ab}.k3{border-color:#a06715}
</style></head><body><main class="canvas"><svg class="grid" viewBox="0 0 1672 941">${grid}</svg><div id="objects"></div></main><script>
const slots=${JSON.stringify(slots)},buildings=${JSON.stringify(buildings)},layer=document.getElementById('objects');
function add(o,cls){const img=document.createElement('img');img.className=cls+(o.adapted?' adapted':'');img.src=o.src;img.alt=o.name;img.style.left=o.x+'px';img.style.top=o.y+'px';img.style.width=o.width+'px';img.style.height=o.height+'px';img.style.zIndex=String(1000+Math.round(o.y));layer.appendChild(img)}
add({name:'宗门大殿',src:'../../../../public/assets/v10/fixed/bldg_main_hall.png',x:827,y:517,width:238,height:186},'fixed');
add({name:'山门',src:'../../../../public/assets/v10/fixed/bldg_sect_gate.png',x:835,y:912,width:160,height:160},'fixed');
let i=0;for(const slot of slots){const b=buildings[i++%buildings.length];add({...b,x:slot.x,y:slot.y+36+(b.anchorOffsetY||0)},'building')}
</script></body></html>`;

fs.writeFileSync(path.join(outDir, 'spacious-48-buildings.html'), html, 'utf8');
fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify({
  schema: 'lingshan.v11.spacious-full-load-preview.v1', status: 'visual_candidate_not_integrated',
  canvas, cell, buildingScale: 'approximately 1.5x current 70-72px runtime preview',
  baseMap: { source: '../southeast-extension-v1/single-map-roads-3bridges-southeast-extended.png', status: 'visual_candidate_not_integrated' },
  anchorAdjustments: { '灵田': { y: 8, reason: 'visual ground-contact alignment inside enlarged slot' } },
  fixedBuildingScale: {
    '宗门大殿': { scale: 2, width: 238, height: 186, anchor: { x: 827, y: 517 } },
    '山门': { scale: 2, width: 160, height: 160, anchor: { x: 835, y: 912 } },
  },
  slots,
}, null, 2) + '\n');
console.log('generated spacious full-load preview');
