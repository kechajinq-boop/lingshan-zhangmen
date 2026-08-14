import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const outputFlag = args.indexOf('--output');
const outputPath = outputFlag >= 0 ? args[outputFlag + 1] : null;
const inputPaths = args.filter((_, index) => index !== outputFlag && index !== outputFlag + 1);

if (inputPaths.length === 0 || !outputPath) {
  console.error('用法: node scripts/export-approved-grid-slots.mjs <阶段1.json> [阶段2.json] [阶段3.json] --output <候选输出.json>');
  process.exit(2);
}

const readDocument = filePath => {
  const absolute = path.resolve(filePath);
  const raw = fs.readFileSync(absolute, 'utf8');
  return {
    absolute,
    relative: path.relative(process.cwd(), absolute).replaceAll('\\', '/'),
    sha256: crypto.createHash('sha256').update(raw).digest('hex'),
    document: JSON.parse(raw),
  };
};

const samePoint = (a, b) => a?.x === b?.x && a?.y === b?.y;

function expand(source) {
  const doc = source.document;
  if (doc.schema !== 'lingshan.build-grid-preview.v1') throw new Error(`${source.relative}: schema不正确`);
  if (!Number.isInteger(doc.stage) || doc.stage < 1 || doc.stage > 3) throw new Error(`${source.relative}: stage必须为1至3`);
  if (doc.buildingVisualScale !== 0.6) throw new Error(`${source.relative}: 不是已确认的60%视觉比例`);
  if (!samePoint(doc.cellBasis?.column, { x: 62, y: -15 }) || !samePoint(doc.cellBasis?.row, { x: 24, y: 38 })) {
    throw new Error(`${source.relative}: 交错等角基向量不一致`);
  }
  const cells = [];
  for (const zone of doc.zones ?? []) {
    let id = zone.firstCellId;
    for (let row = 0; row < zone.rows; row += 1) {
      for (let column = 0; column < zone.columns; column += 1) {
        const x = zone.origin.x + column * doc.cellBasis.column.x + row * doc.cellBasis.row.x;
        const y = zone.origin.y + column * doc.cellBasis.column.y + row * doc.cellBasis.row.y;
        cells.push({
          number: id,
          mapX: x + (doc.cellBasis.column.x + doc.cellBasis.row.x) / 2,
          mapY: y + (doc.cellBasis.column.y + doc.cellBasis.row.y) / 2,
          zone: zone.id,
        });
        id += 1;
      }
    }
  }
  cells.sort((a, b) => a.number - b.number);
  if (cells.length !== doc.totalCells) throw new Error(`${source.relative}: 展开格数与totalCells不一致`);
  return { stage: doc.stage, canvas: doc.canvas, basis: doc.cellBasis, visualScale: doc.buildingVisualScale, cells };
}

try {
  const sources = inputPaths.map(readDocument).sort((a, b) => a.document.stage - b.document.stage);
  const expanded = sources.map(expand);
  for (let index = 0; index < expanded.length; index += 1) {
    if (expanded[index].stage !== index + 1) throw new Error(`输入必须从阶段一开始连续提供，目前缺少阶段${index + 1}`);
    if (index === 0) continue;
    for (const oldCell of expanded[index - 1].cells) {
      const inherited = expanded[index].cells.find(cell => cell.number === oldCell.number);
      if (!inherited || inherited.mapX !== oldCell.mapX || inherited.mapY !== oldCell.mapY) {
        throw new Error(`阶段${expanded[index].stage}没有原样继承${oldCell.number}号格`);
      }
    }
  }

  const latest = expanded.at(-1);
  const firstAppearance = new Map();
  for (const stage of expanded) {
    for (const cell of stage.cells) if (!firstAppearance.has(cell.number)) firstAppearance.set(cell.number, stage.stage - 1);
  }
  const slots = latest.cells.map((cell, index) => ({
    id: `slot-${String(cell.number).padStart(2, '0')}`,
    unlockStage: firstAppearance.get(cell.number),
    gx: (index % 12) * 2,
    gy: Math.floor(index / 12) * 2,
    mapX: cell.mapX,
    mapY: cell.mapY,
    zone: cell.zone,
  }));

  const output = {
    schema: 'lingshan.runtime-build-slots-candidate.v1',
    status: 'visual-confirmation-required',
    canvas: latest.canvas,
    cellBasis: latest.basis,
    buildingVisualScale: latest.visualScale,
    capacities: expanded.map(stage => stage.cells.length),
    sourceFiles: sources.map(source => ({ path: source.relative, sha256: source.sha256 })),
    slots,
    notes: [
      '此文件由视觉确认稿自动生成，未自动写入src。',
      '只有全部输入阶段经用户确认后，才允许作为v0.10.2运行时点位来源。',
      'mapX/mapY取每个交错等角格的几何中心，与满载模拟图脚点算法一致。',
    ],
  };
  const absoluteOutput = path.resolve(outputPath);
  fs.mkdirSync(path.dirname(absoluteOutput), { recursive: true });
  fs.writeFileSync(absoluteOutput, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
  console.log(`已生成候选点位: ${path.relative(process.cwd(), absoluteOutput)} (${slots.length}格)`);
} catch (error) {
  console.error(`生成失败: ${error.message}`);
  process.exit(1);
}

