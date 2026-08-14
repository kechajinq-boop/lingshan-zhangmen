import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const outDir = path.join(root, 'deliverables', 'v011-map-rebuild', 'grounding', 'alchemy-grounded-candidate-v1');
fs.mkdirSync(outDir, { recursive: true });

const map = '../../equal-parcel/single-map-roads-3bridges-source.png';
const original = '../../../../public/assets/v10/buildings/building-danfang.png';
const adapted = './qc-clean/cutout/cutout.png';
const cells = [
  { cls: 'original', title: '原版炼丹房', note: '完整菱形底板，像独立模型台', asset: original },
  { cls: 'adapted', title: '地图适配候选', note: '不规则草地／石板边缘，墙脚直接接地', asset: adapted },
];

const card = (item, index) => `<section class="card ${item.cls}">
  <div class="label"><b>${item.title}</b><span>${item.note}</span></div>
  <div class="scene"><img class="map" src="${map}"><img class="building" src="${item.asset}"><span class="tag">${index === 0 ? '当前基线' : '候选 v1'}</span></div>
</section>`;

const html = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=1672,initial-scale=1"><title>炼丹房接地适配对比</title><style>
*{box-sizing:border-box}html,body{margin:0;width:1672px;height:941px;overflow:hidden;background:#dfeef1;font-family:"Microsoft YaHei",sans-serif;color:#3d2b1b}.page{width:100%;height:100%;padding:82px 20px 20px}.top{position:absolute;left:20px;right:20px;top:16px;height:56px;padding:8px 16px;background:#fff8dc;border:3px solid #76502d}h1{display:inline-block;margin:0 22px 0 0;font-size:23px}.top span{font-size:14px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;height:100%}.card{position:relative;overflow:hidden;border:4px solid #7f5740;background:#a9c875}.adapted{border-color:#3e8552}.label{position:absolute;z-index:10;left:12px;top:12px;padding:8px 12px;background:rgba(255,249,225,.96);border:2px solid #76502d}.label b{display:block;font-size:21px}.label span{display:block;margin-top:3px;font-size:13px}.scene{position:absolute;inset:0;overflow:hidden}.map{position:absolute;width:2508px;height:1412px;max-width:none;left:calc(50% - 1210px);top:calc(50% - 420px)}.building{position:absolute;z-index:5;left:50%;top:50%;object-fit:contain;transform:translate(-50%,-100%)}.original .building{width:122px;height:122px;filter:drop-shadow(3px 5px 3px rgba(28,37,24,.30))}.adapted .building{width:135px;height:126px;filter:none;top:calc(50% + 4px)}.tag{position:absolute;z-index:10;right:12px;top:12px;padding:5px 9px;color:#fff;background:#9a4f45;font-weight:800}.adapted .tag{background:#3d8350}.card::after{content:'';position:absolute;z-index:4;left:50%;top:calc(50% + 1px);width:130px;height:29px;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(ellipse,rgba(48,56,31,.22),rgba(48,56,31,0) 72%);pointer-events:none}.original::after{display:none}
.map{left:calc(50% - 750px)!important;top:calc(50% - 330px)!important}.original .building{width:225px;height:225px}.adapted .building{width:203px;height:189px}.card::after{width:188px;height:39px;background:radial-gradient(ellipse,rgba(48,56,31,.19),rgba(48,56,31,0) 72%)}
</style></head><body><main class="page"><div class="top"><h1>v0.11 炼丹房真实地图接地适配</h1><span>同一地图区域、接近实机尺寸；左侧为现有素材，右侧为重做底座后的候选素材。</span></div><div class="grid">${cells.map(card).join('')}</div></main></body></html>`;

fs.writeFileSync(path.join(outDir, 'map-comparison.html'), html, 'utf8');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify({
  schema: 'lingshan.v11.alchemy-grounding-candidate.v1',
  status: 'visual_candidate_not_integrated',
  source: { path: original, sha256: hash(path.join(outDir, original)) },
  candidate: { path: adapted, sha256: hash(path.join(outDir, adapted)) },
  map: { path: map, sha256: hash(path.join(outDir, map)) },
  processing: ['image edit preserving building identity', 'magenta chroma removal', 'detached fragment cleanup', 'alpha QC'],
}, null, 2) + '\n');
console.log('generated alchemy grounding preview');
