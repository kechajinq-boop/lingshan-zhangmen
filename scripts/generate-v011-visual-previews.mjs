import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const outDir = path.join(root, 'deliverables', 'v011-grid-concept');
fs.mkdirSync(outDir, { recursive: true });

const basis = { column: { x: 62, y: -15 }, row: { x: 24, y: 38 } };
const stage1 = [
  { id: 'northwest_main', state: 'retained', origin: { x: 518, y: 386 }, columns: 4, rows: 2, firstCellId: 1 },
  { id: 'west_aux', state: 'retained', origin: { x: 398, y: 502 }, columns: 2, rows: 2, firstCellId: 9 },
  { id: 'northeast_aux', state: 'retained', origin: { x: 860, y: 410 }, columns: 2, rows: 2, firstCellId: 13 },
  { id: 'southeast_aux', state: 'retained', origin: { x: 923, y: 577 }, columns: 2, rows: 2, firstCellId: 17 }
];
const stage2New = [
  { id: 'stage2_northwest', state: 'stage2', origin: { x: 310, y: 340 }, columns: 2, rows: 2, firstCellId: 21 },
  { id: 'stage2_central_west', state: 'stage2', origin: { x: 630, y: 570 }, columns: 2, rows: 2, firstCellId: 25 },
  { id: 'stage2_east', state: 'stage2', origin: { x: 1180, y: 390 }, columns: 2, rows: 2, firstCellId: 29 }
];
const stage3New = [
  { id: 'stage3_west_inner', state: 'stage3', origin: { x: 230, y: 500 }, columns: 2, rows: 2, firstCellId: 33 },
  { id: 'stage3_north_inner', state: 'stage3', origin: { x: 470, y: 250 }, columns: 2, rows: 2, firstCellId: 37 },
  { id: 'stage3_southeast_inner', state: 'stage3', origin: { x: 1135, y: 660 }, columns: 2, rows: 2, firstCellId: 41 },
  { id: 'stage3_southwest_inner', state: 'stage3', origin: { x: 260, y: 600 }, columns: 2, rows: 2, firstCellId: 45 }
];

const fixedObjects = `
  <img class="fixed" data-foot-y="565" src="../../public/assets/v10/fixed/bldg_main_hall.png" style="left:810px;top:565px;width:210px;height:165px" alt="宗门大殿">
  <img class="fixed" data-foot-y="360" src="../../public/assets/v10/fixed/bldg_elder_pavilion.png" style="left:955px;top:360px;width:122px;height:122px" alt="长老亭">
  <img class="fixed" data-foot-y="700" src="../../public/assets/v10/fixed/bldg_construction_site.png" style="left:555px;top:700px;width:124px;height:93px" alt="营造工地">
  <img class="fixed" data-foot-y="600" src="../../public/assets/v10/fixed/bldg_research_library.png" style="left:1260px;top:600px;width:126px;height:126px" alt="研发阁">
  <img class="fixed" data-foot-y="820" src="../../public/assets/v10/fixed/bldg_sect_gate.png" style="left:820px;top:820px;width:142px;height:142px" alt="山门">
  <img class="fixed" data-foot-y="675" src="../../public/assets/v10/fixed/prop_lantern_stone_01.png" style="left:815px;top:675px;width:36px;height:48px" alt="石灯">
  <img class="fixed" data-foot-y="670" src="../../public/assets/v10/fixed/prop_incense_burner.png" style="left:865px;top:670px;width:42px;height:56px" alt="香炉">
  <img class="fixed" data-foot-y="665" src="../../public/assets/v10/fixed/prop_lantern_stone_02.png" style="left:915px;top:665px;width:36px;height:48px" alt="石灯">
  <img class="fixed" data-foot-y="520" src="../v10-continuous-flat-production/approved-assets/props/prop_water_lotus.png" style="left:1115px;top:520px;width:52px;height:39px" alt="荷花">`;
const fixedObjectsHall75 = fixedObjects.replace(
  'left:810px;top:565px;width:210px;height:165px',
  'left:810px;top:565px;width:157.5px;height:123.75px'
);

const jsData = value => JSON.stringify(value).replaceAll('<', '\\u003c');

function writeJson(name, stage, zones, notes) {
  const validationZones = zones.map(zone => ({
    ...zone,
    state: stage === 3
      ? (zone.firstCellId <= 32 ? 'retained' : 'new')
      : (zone.firstCellId <= 20 ? 'retained' : 'new')
  }));
  const result = {
    schema: 'lingshan.build-grid-preview.v1',
    stage,
    canvas: { width: 1672, height: 941 },
    gridMode: 'staggered_isometric_map_calibrated',
    buildingVisualScale: 0.6,
    cellBasis: basis,
    zones: validationZones,
    retainedCells: stage === 3 ? 32 : 20,
    newCells: stage === 3 ? 16 : 12,
    totalCells: stage === 3 ? 48 : 32,
    notes
  };
  fs.writeFileSync(path.join(outDir, name), `${JSON.stringify(result, null, 2)}\n`, 'utf8');
}

function gridHtml({ stage, zones, title, subtitle }) {
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=1672,initial-scale=1"><title>${title}</title>
  <style>*{box-sizing:border-box}html,body{width:100%;height:100%;margin:0;overflow:hidden;background:#d9edf2}.canvas{position:relative;width:1672px;height:941px;overflow:hidden;font-family:"Microsoft YaHei",sans-serif}.base{position:absolute;inset:0;width:1672px;height:941px;object-fit:cover}.fixed{position:absolute;z-index:2;object-fit:contain;transform:translate(-50%,-100%)}svg{position:absolute;inset:0;z-index:4;width:1672px;height:941px}.cell{stroke-width:3;stroke-linejoin:round}.retained{fill:rgba(255,214,88,.24);stroke:rgba(143,92,11,.93)}.stage2{fill:rgba(47,211,242,.28);stroke:rgba(0,112,151,.94)}.stage3{fill:rgba(77,226,139,.38);stroke:rgba(0,128,70,.96)}.cell-number{fill:#17384a;stroke:rgba(248,255,255,.95);stroke-width:3;paint-order:stroke fill;font-size:15px;font-weight:900;text-anchor:middle;dominant-baseline:middle}.panel{position:absolute;z-index:3000;left:24px;top:22px;width:445px;padding:13px 16px;color:#4b2d18;background:rgba(255,248,218,.95);border:3px solid #7b4d23;box-shadow:0 4px 12px rgba(45,33,19,.25)}.panel h1{margin:0 0 7px;font-size:22px}.panel p{margin:3px 0;font-size:14px;line-height:1.4}.swatch{display:inline-block;width:18px;height:11px;margin-right:7px;vertical-align:-1px;border:2px solid}.old{background:rgba(255,214,88,.3);border-color:#8f5c0b}.s2{background:rgba(47,211,242,.35);border-color:#007097}.s3{background:rgba(77,226,139,.4);border-color:#008046}</style></head><body><div class="canvas">
  <img class="base" src="../../public/assets/v10/map/map_stage_0${stage}_base.png" alt="阶段${stage}仙山底图">${fixedObjects}<svg id="grid" viewBox="0 0 1672 941"></svg>
  <div class="panel"><h1>${title}</h1><p><span class="swatch old"></span>1—20：阶段一确认格位</p><p><span class="swatch s2"></span>21—32：阶段二确认格位</p>${stage === 3 ? '<p><span class="swatch s3"></span>33—48：阶段三新增16格</p>' : ''}<p>${subtitle}</p></div></div>
  <script>const NS='http://www.w3.org/2000/svg',basis=${jsData(basis)},zones=${jsData(zones)},svg=document.getElementById('grid');function add(x,y,id,state){const a=basis.column,b=basis.row,p=[[x,y],[x+a.x,y+a.y],[x+a.x+b.x,y+a.y+b.y],[x+b.x,y+b.y]],q=document.createElementNS(NS,'polygon');q.setAttribute('class','cell '+state);q.setAttribute('points',p.map(v=>v.join(',')).join(' '));svg.appendChild(q);const t=document.createElementNS(NS,'text');t.setAttribute('class','cell-number');t.setAttribute('x',x+(a.x+b.x)/2);t.setAttribute('y',y+(a.y+b.y)/2+1);t.textContent=id;svg.appendChild(t)}for(const z of zones){let id=z.firstCellId;for(let r=0;r<z.rows;r++)for(let c=0;c<z.columns;c++)add(z.origin.x+c*basis.column.x+r*basis.row.x,z.origin.y+c*basis.column.y+r*basis.row.y,id++,z.state)}</script></body></html>`;
}

function densityHtml(stage, zones, total, scale = 0.6, gridBasis = basis, gridPercent = 100, fixedMarkup = fixedObjects, hallPercent = 100) {
  const percent = Math.round(scale * 100);
  const gridLabel = gridPercent === 100 ? '' : `·格距${gridPercent}%`;
  const hallLabel = hallPercent === 100 ? '' : `·大殿${hallPercent}%`;
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=1672,initial-scale=1"><title>阶段${stage}·${total}栋${percent}%满建筑模拟${gridLabel}${hallLabel}</title><style>
  *{box-sizing:border-box}html,body{width:100%;height:100%;margin:0;overflow:hidden;background:#d9edf2}.canvas{position:relative;width:1672px;height:941px;overflow:hidden;font-family:"Microsoft YaHei",sans-serif}.base{position:absolute;inset:0;width:1672px;height:941px;object-fit:cover}.fixed,.building{position:absolute;object-fit:contain;transform:translate(-50%,-100%)}svg{position:absolute;inset:0;z-index:4;width:1672px;height:941px;pointer-events:none}.cell{fill:rgba(40,226,132,.07);stroke:rgba(5,132,77,.48);stroke-width:1.5;stroke-linejoin:round}.panel{position:absolute;z-index:3000;left:24px;top:22px;width:405px;padding:13px 16px;color:#4b2d18;background:rgba(255,248,218,.95);border:3px solid #7b4d23;box-shadow:0 4px 12px rgba(45,33,19,.25)}.panel h1{margin:0 0 7px;font-size:21px}.panel p{margin:3px 0;font-size:14px;line-height:1.42}</style></head><body><div class="canvas"><img class="base" src="../../public/assets/v10/map/map_stage_0${stage}_base.png" alt="阶段${stage}仙山底图">${fixedMarkup}<svg id="grid" viewBox="0 0 1672 941"></svg><div id="buildings"></div><div class="panel"><h1>阶段${stage}·${total}栋${percent}%满建筑模拟${gridLabel}${hallLabel}</h1><p>全部已规划格位放满建筑，五类建筑循环排列。</p><p>用于检查相邻遮挡、固定建筑比例、悬崖与水域安全距离。</p></div></div>
  <script>const NS='http://www.w3.org/2000/svg',basis=${jsData(gridBasis)},zones=${jsData(zones)},svg=document.getElementById('grid'),layer=document.getElementById('buildings'),cells=[];const types=[{n:'灵田',f:'building-lingtian.png',w:114,h:114,ox:0,ay:30},{n:'炼丹房',f:'building-danfang.png',w:117,h:117,ox:3,ay:31},{n:'丹药铺',f:'building-danpu.png',w:115,h:115,ox:-2,ay:30},{n:'练功房',f:'building-liangong.png',w:115,h:115,ox:2,ay:31},{n:'厢房',f:'building-xiangfang.png',w:114,h:114,ox:0,ay:30}],scale=${scale};function add(x,y,id){const a=basis.column,b=basis.row,p=[[x,y],[x+a.x,y+a.y],[x+a.x+b.x,y+a.y+b.y],[x+b.x,y+b.y]],q=document.createElementNS(NS,'polygon');q.setAttribute('class','cell');q.setAttribute('points',p.map(v=>v.join(',')).join(' '));svg.appendChild(q);cells.push({id,x:x+(a.x+b.x)/2,y:y+(a.y+b.y)/2})}for(const z of zones){let id=z.firstCellId;for(let r=0;r<z.rows;r++)for(let c=0;c<z.columns;c++)add(z.origin.x+c*basis.column.x+r*basis.row.x,z.origin.y+c*basis.column.y+r*basis.row.y,id++)}cells.sort((a,b)=>a.id-b.id).forEach((c,i)=>{const t=types[i%types.length],fy=c.y+t.ay,img=document.createElement('img');img.className='building';img.src='../../public/assets/v10/buildings/'+t.f;img.alt=c.id+'号格·'+t.n;img.style.cssText='left:'+(c.x+t.ox)+'px;top:'+fy+'px;width:'+(t.w*scale)+'px;height:'+(t.h*scale)+'px;z-index:'+(1000+Math.round(fy));layer.appendChild(img)});document.querySelectorAll('.fixed').forEach(i=>i.style.zIndex=String(1000+Number(i.dataset.footY||0)))</script></body></html>`;
}

const stage2 = [...stage1, ...stage2New];
const stage3 = [...stage2, ...stage3New];
const expandedBasis = {
  column: { x: basis.column.x * 1.08, y: basis.column.y * 1.08 },
  row: { x: basis.row.x * 1.08, y: basis.row.y * 1.08 }
};
function recenterZones(zones, oldBasis, newBasis) {
  return zones.map(zone => ({
    ...zone,
    origin: {
      x: Number((zone.origin.x + zone.columns / 2 * (oldBasis.column.x - newBasis.column.x) + zone.rows / 2 * (oldBasis.row.x - newBasis.row.x)).toFixed(2)),
      y: Number((zone.origin.y + zone.columns / 2 * (oldBasis.column.y - newBasis.column.y) + zone.rows / 2 * (oldBasis.row.y - newBasis.row.y)).toFixed(2))
    }
  }));
}
const stage1Grid108 = recenterZones(stage1, basis, expandedBasis);
const stage2Grid108 = recenterZones(stage2, basis, expandedBasis);
const stage3Grid108 = recenterZones(stage3, basis, expandedBasis);

writeJson('stage2-grid-zones-v3-32-isometric.json', 2, stage2, [
  '阶段一1至20号格坐标保持不变。',
  '25至28号格保持营造工地右侧内部平地位置。',
  '按用户标记，将29至32号格整体向左移动80像素，远离东侧悬崖。',
  '尚未写入正式运行时。'
]);
fs.writeFileSync(path.join(outDir, 'stage2-grid-zones-v3-32-isometric.html'), gridHtml({ stage: 2, zones: stage2, title: '二阶段·32格点位预览 v3', subtitle: '29—32已向左收回80像素，远离东侧悬崖。' }), 'utf8');
writeJson('stage3-grid-zones-v4-48-isometric.json', 3, stage3, [
  '完整继承阶段二32格坐标。',
  '阶段三新增33至48号格为4组连续2×2；41至44号格按用户红框移至东南内部空地。',
  '该图为满建筑模拟前的安全区候选，尚未写入正式运行时。'
]);
fs.writeFileSync(path.join(outDir, 'stage3-grid-zones-v4-48-isometric.html'), gridHtml({ stage: 3, zones: stage3, title: '三阶段·48格点位预览 v4', subtitle: '29—32继承阶段二新位置；41—44已移至东南内部空地。' }), 'utf8');
fs.writeFileSync(path.join(outDir, 'stage2-grid-32-buildings-scale60-v2.html'), densityHtml(2, stage2, 32), 'utf8');
fs.writeFileSync(path.join(outDir, 'stage3-grid-48-buildings-scale60-v4.html'), densityHtml(3, stage3, 48), 'utf8');
fs.writeFileSync(path.join(outDir, 'stage1-grid-20-buildings-scale68.html'), densityHtml(1, stage1, 20, 0.68), 'utf8');
fs.writeFileSync(path.join(outDir, 'stage2-grid-32-buildings-scale68.html'), densityHtml(2, stage2, 32, 0.68), 'utf8');
fs.writeFileSync(path.join(outDir, 'stage3-grid-48-buildings-scale68.html'), densityHtml(3, stage3, 48, 0.68), 'utf8');
fs.writeFileSync(path.join(outDir, 'stage1-grid-20-buildings-scale68-grid108.html'), densityHtml(1, stage1Grid108, 20, 0.68, expandedBasis, 108), 'utf8');
fs.writeFileSync(path.join(outDir, 'stage2-grid-32-buildings-scale68-grid108.html'), densityHtml(2, stage2Grid108, 32, 0.68, expandedBasis, 108), 'utf8');
fs.writeFileSync(path.join(outDir, 'stage3-grid-48-buildings-scale68-grid108.html'), densityHtml(3, stage3Grid108, 48, 0.68, expandedBasis, 108), 'utf8');
fs.writeFileSync(path.join(outDir, 'stage1-grid-20-buildings-scale68-grid108-hall75.html'), densityHtml(1, stage1Grid108, 20, 0.68, expandedBasis, 108, fixedObjectsHall75, 75), 'utf8');
fs.writeFileSync(path.join(outDir, 'stage2-grid-32-buildings-scale68-grid108-hall75.html'), densityHtml(2, stage2Grid108, 32, 0.68, expandedBasis, 108, fixedObjectsHall75, 75), 'utf8');
fs.writeFileSync(path.join(outDir, 'stage3-grid-48-buildings-scale68-grid108-hall75.html'), densityHtml(3, stage3Grid108, 48, 0.68, expandedBasis, 108, fixedObjectsHall75, 75), 'utf8');

fs.writeFileSync(path.join(outDir, 'grid108-scale68-preview-manifest.json'), `${JSON.stringify({
  schema: 'lingshan.build-grid-density-preview.v1',
  canvas: { width: 1672, height: 941 },
  buildingVisualScale: 0.68,
  gridSpacingScale: 1.08,
  cellBasis: expandedBasis,
  stages: [
    { stage: 1, totalCells: 20, zones: stage1Grid108 },
    { stage: 2, totalCells: 32, zones: stage2Grid108 },
    { stage: 3, totalCells: 48, zones: stage3Grid108 }
  ]
}, null, 2)}\n`, 'utf8');

const comparison = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=1800,initial-scale=1"><title>固定建筑比例对比</title><style>*{box-sizing:border-box}html,body{margin:0;width:1800px;height:720px;overflow:hidden;background:#d9edf2;font-family:"Microsoft YaHei",sans-serif}.title{height:74px;padding:14px 28px;color:#4b2d18;background:#fff6d8;border-bottom:4px solid #7b4d23}.title h1{margin:0;font-size:25px}.title p{margin:4px 0;font-size:14px}.row{display:flex;gap:18px;padding:18px}.panel{position:relative;width:576px;height:610px;overflow:hidden;border:3px solid #7b4d23;background-image:url('../../public/assets/v10/map/map_stage_01_base.png');background-size:1672px 941px;background-position:-525px -210px}.tag{position:absolute;z-index:30;left:12px;top:12px;padding:8px 12px;background:rgba(255,248,218,.94);border:2px solid #7b4d23;font-weight:900}.fixed,.player{position:absolute;transform:translate(-50%,-100%);object-fit:contain}.player{width:69px;height:69px}.tile{position:absolute;width:86px;height:54px;border:2px solid rgba(0,130,75,.65);transform:skewY(-13deg);background:rgba(80,230,145,.08)}</style></head><body><div class="title"><h1>固定建筑比例对比：玩家建筑始终保持已确认的60%</h1><p>只比较固定景观建筑的相对体量；正式比例由你确认后再进入代码。</p></div><div class="row" id="row"></div><script>const configs=[{label:'现状 100%',s:1},{label:'建议 90%',s:.9},{label:'紧凑 80%',s:.8}],row=document.getElementById('row');for(const c of configs){const p=document.createElement('section');p.className='panel';p.innerHTML='<div class="tag">'+c.label+'</div>';const fixed=[['bldg_main_hall.png',288,350,210,165],['bldg_elder_pavilion.png',130,235,122,122],['bldg_research_library.png',448,255,126,126],['bldg_construction_site.png',130,520,124,93],['bldg_sect_gate.png',448,545,142,142]];for(const [f,x,y,w,h] of fixed){const i=document.createElement('img');i.className='fixed';i.src='../../public/assets/v10/fixed/'+f;i.style.cssText='left:'+x+'px;top:'+y+'px;width:'+(w*c.s)+'px;height:'+(h*c.s)+'px';p.appendChild(i)}for(const [idx,x,y] of [[0,230,475],[1,288,458],[2,346,475]]){const t=document.createElement('div');t.className='tile';t.style.cssText='left:'+(x-43)+'px;top:'+(y-35)+'px';p.appendChild(t);const i=document.createElement('img');i.className='player';i.src='../../public/assets/v10/buildings/'+['building-lingtian.png','building-danfang.png','building-danpu.png'][idx];i.style.cssText='left:'+x+'px;top:'+y+'px';p.appendChild(i)}row.appendChild(p)}</script></body></html>`;
fs.writeFileSync(path.join(outDir, 'fixed-building-scale-comparison.html'), comparison, 'utf8');

console.log('已生成阶段三格位、阶段二/三60%满载图和固定建筑比例对比页面。');
