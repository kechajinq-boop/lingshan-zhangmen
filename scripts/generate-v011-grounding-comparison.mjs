import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const outDir = path.join(root, 'deliverables', 'v011-map-rebuild', 'grounding');
fs.mkdirSync(outDir, { recursive: true });

const map = '../equal-parcel/single-map-roads-3bridges-source.png';
const assets = {
  alchemy: '../../../public/assets/v10/buildings/building-danfang.png',
  field: '../asset-qc-cleaned/building-lingtian/cutout.png',
};

const panels = [
  { id: 'current', title: 'A 当前处理', note: '图片底边定位＋整栋外轮廓投影', treatment: 'current' },
  { id: 'anchor', title: 'B 脚点／阴影修正', note: '真实脚点＋基座附近接触阴影', treatment: 'anchor' },
  { id: 'grounded', title: 'C 完整接地适配', note: '脚点＋接触阴影＋草地／石板过渡', treatment: 'grounded' },
];

const card = (panel, row, asset, label) => `
  <section class="card ${panel.treatment} row-${row}">
    <header><strong>${panel.title}</strong><span>${panel.note}</span></header>
    <div class="scene">
      <img class="map" src="${map}" alt="仙山地图草地建造区">
      <div class="decal"></div><div class="contact"></div>
      <img class="building ${asset}" src="${assets[asset]}" alt="${label}">
      <div class="fringe"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
      <div class="caption">${label}</div>
    </div>
  </section>`;

const markup = [
  ...panels.map(panel => card(panel, 1, 'alchemy', '炼丹房')),
  ...panels.map(panel => card(panel, 2, 'field', '灵田')),
].join('');

const html = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=1672,initial-scale=1"><title>v0.11建筑接地处理三档对比</title><style>
*{box-sizing:border-box}html,body{margin:0;width:1672px;height:941px;overflow:hidden;background:#dcebf0;font-family:"Microsoft YaHei",sans-serif;color:#3d2b1b}.page{position:relative;width:100%;height:100%;padding:82px 20px 22px;background:#dcebf0}.top{position:absolute;left:20px;right:20px;top:16px;height:56px;padding:8px 16px;background:rgba(255,249,225,.96);border:3px solid #76502d;box-shadow:0 4px 12px rgba(45,33,19,.2)}h1{display:inline-block;margin:0 20px 0 0;font-size:23px}.top span{font-size:14px}.grid{height:100%;display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(2,1fr);gap:12px}.card{position:relative;overflow:hidden;border:3px solid rgba(91,67,38,.8);background:#a9c875}.card header{position:absolute;z-index:20;left:10px;top:10px;padding:7px 11px;background:rgba(255,248,220,.94);border:2px solid #76502d;box-shadow:0 3px 8px rgba(44,30,17,.18)}.card header strong{display:block;font-size:18px}.card header span{display:block;margin-top:2px;font-size:12px}.scene{position:absolute;inset:0;overflow:hidden}.map{position:absolute;z-index:1;width:3344px;height:1882px;max-width:none;left:calc(50% - 930px);top:calc(50% - 494px);object-fit:fill}.building{position:absolute;z-index:8;left:50%;top:50%;width:144px;height:144px;object-fit:contain;image-rendering:auto}.current .building{transform:translate(-50%,-100%);filter:drop-shadow(5px 7px 4px rgba(25,38,22,.34))}.anchor .building,.grounded .building{transform:translate(-50%,-100%);filter:saturate(.91) contrast(.96) brightness(1.015)}.anchor .alchemy,.grounded .alchemy{top:calc(50% + 4px)}.anchor .field,.grounded .field{top:calc(50% + 9px)}.contact{display:none;position:absolute;z-index:6;left:50%;top:50%;border-radius:50%;transform:translate(-50%,-50%);background:radial-gradient(ellipse,rgba(38,48,27,.42) 0,rgba(44,55,29,.25) 42%,rgba(44,55,29,0) 76%);filter:blur(1.2px)}.anchor .contact,.grounded .contact{display:block}.row-1 .contact{width:112px;height:25px}.row-2 .contact{width:130px;height:23px}.decal{display:none;position:absolute;z-index:5;left:50%;top:50%;transform:translate(-50%,-50%) skewX(-10deg);clip-path:polygon(10% 22%,75% 5%,100% 45%,84% 83%,28% 100%,0 60%);background:radial-gradient(ellipse at center,rgba(97,126,55,.30) 0,rgba(126,150,76,.19) 44%,rgba(172,188,111,0) 74%);filter:blur(.35px)}.grounded .decal{display:block}.grounded.row-1 .decal{width:190px;height:64px;background:radial-gradient(ellipse at center,rgba(115,111,72,.25) 0,rgba(122,143,74,.18) 48%,rgba(172,188,111,0) 76%)}.grounded.row-2 .decal{width:210px;height:64px}.grounded .building{filter:saturate(.86) contrast(.94) brightness(1.02)}.fringe{display:none;position:absolute;z-index:9;left:50%;top:calc(50% + 3px);width:118px;height:12px;transform:translate(-50%,-50%);background:radial-gradient(ellipse at 14% 85%,rgba(116,144,65,.92) 0 6%,transparent 8%),radial-gradient(ellipse at 35% 75%,rgba(132,153,76,.92) 0 7%,transparent 9%),radial-gradient(ellipse at 63% 85%,rgba(106,137,59,.9) 0 6%,transparent 8%),radial-gradient(ellipse at 86% 78%,rgba(134,158,78,.9) 0 7%,transparent 9%)}.grounded .fringe{display:block}.grounded.row-2 .fringe{top:calc(50% + 8px);width:132px}.caption{position:absolute;z-index:30;right:10px;bottom:9px;padding:4px 9px;color:#fff;background:rgba(50,34,20,.76);border:1px solid rgba(255,237,190,.78);font-size:13px}.current{border-color:#9a5547}.anchor{border-color:#557c9b}.grounded{border-color:#438357}.current::after,.anchor::after,.grounded::after{position:absolute;z-index:25;right:10px;top:10px;padding:4px 8px;color:#fff;font-weight:800;font-size:12px}.current::after{content:'悬浮基线';background:#a34e43}.anchor::after{content:'结构修正';background:#4d7899}.grounded::after{content:'推荐方向';background:#39814e}
.anchor .contact,.grounded .contact{top:calc(50% - 3px);width:122px;height:34px;background:radial-gradient(ellipse,rgba(42,51,28,.31) 0,rgba(47,57,31,.19) 48%,rgba(47,57,31,0) 78%);filter:blur(1px)}
.anchor.row-2 .contact,.grounded.row-2 .contact{top:calc(50% + 2px);width:140px;height:32px}
.grounded .decal{top:calc(50% - 4px);width:184px!important;height:70px!important;transform:translate(-50%,-50%);clip-path:polygon(12% 22%,49% 3%,88% 21%,100% 55%,84% 84%,48% 100%,13% 82%,0 53%);background:radial-gradient(ellipse at center,rgba(163,146,87,.34) 0,rgba(135,145,72,.24) 52%,rgba(114,137,63,.04) 82%)!important;filter:blur(.25px)}
.grounded.row-2 .decal{top:calc(50% + 1px);width:205px!important;height:72px!important;background:radial-gradient(ellipse at center,rgba(110,133,61,.34) 0,rgba(124,144,69,.20) 56%,rgba(158,171,88,.02) 84%)!important}
.grounded .building{filter:saturate(.88) contrast(.95) brightness(1.015)}
.grounded .fringe{display:block;z-index:9;top:calc(50% + 7px);width:130px;height:11px;background:none}
.grounded.row-2 .fringe{top:calc(50% + 12px);width:150px}
.fringe i{position:absolute;bottom:1px;width:2px;height:6px;border-radius:80% 10% 70% 15%;background:#66833d;transform-origin:bottom center}.fringe i:nth-child(1){left:3%;transform:rotate(-28deg)}.fringe i:nth-child(2){left:9%;height:4px;transform:rotate(20deg)}.fringe i:nth-child(3){left:18%;height:5px;transform:rotate(-16deg)}.fringe i:nth-child(4){left:29%;height:4px;transform:rotate(22deg)}.fringe i:nth-child(5){right:29%;height:5px;transform:rotate(-22deg)}.fringe i:nth-child(6){right:18%;height:4px;transform:rotate(17deg)}.fringe i:nth-child(7){right:9%;height:6px;transform:rotate(-24deg)}.fringe i:nth-child(8){right:3%;height:4px;transform:rotate(25deg)}
</style></head><body><main class="page"><div class="top"><h1>v0.11 建筑接地处理三档对比</h1><span>同一底图、同一位置、同一比例；仅比较脚点、阴影与地表融合。上排炼丹房，下排灵田。</span></div><div class="grid">${markup}</div></main></body></html>`;

const htmlPath = path.join(outDir, 'building-grounding-comparison.html');
fs.writeFileSync(htmlPath, html, 'utf8');

const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const manifest = {
  schema: 'lingshan.v11.building-grounding-comparison.v1',
  status: 'visual_candidate_not_integrated',
  map: { path: map, sha256: hash(path.join(outDir, map)) },
  assets: Object.fromEntries(Object.entries(assets).map(([id, relative]) => [id, { path: relative, sha256: hash(path.join(outDir, relative)) }])),
  variants: panels.map(panel => ({ id: panel.id, treatment: panel.treatment })),
  note: 'Candidate comparison only. No stable game asset was replaced.',
};
fs.writeFileSync(path.join(outDir, 'building-grounding-comparison-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
console.log(`已生成: ${path.relative(root, htmlPath)}`);
