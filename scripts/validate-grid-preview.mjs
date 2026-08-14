import fs from 'node:fs';
import path from 'node:path';

const [, , baselinePath, candidatePath] = process.argv;

if (!baselinePath) {
  console.error('用法: node scripts/validate-grid-preview.mjs <基线JSON> [候选JSON]');
  process.exit(2);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.resolve(filePath), 'utf8'));
}

function fail(message) {
  throw new Error(message);
}

function samePoint(a, b) {
  return a.x === b.x && a.y === b.y;
}

function expand(document, label) {
  if (document.schema !== 'lingshan.build-grid-preview.v1') {
    fail(`${label}: schema不正确`);
  }
  if (!document.canvas?.width || !document.canvas?.height) {
    fail(`${label}: 缺少画布尺寸`);
  }
  if (!samePoint(document.cellBasis?.column ?? {}, { x: 62, y: -15 }) ||
      !samePoint(document.cellBasis?.row ?? {}, { x: 24, y: 38 })) {
    fail(`${label}: 格位基向量不是已确认的(62,-15)/(24,38)`);
  }
  if (document.buildingVisualScale !== 0.6) {
    fail(`${label}: 建筑视觉比例不是60%`);
  }
  if (!Array.isArray(document.zones) || document.zones.length === 0) {
    fail(`${label}: 没有格位区域`);
  }

  const cells = [];
  for (const zone of document.zones) {
    if (!zone.origin || !Number.isInteger(zone.columns) || !Number.isInteger(zone.rows) ||
        zone.columns < 1 || zone.rows < 1 || !Number.isInteger(zone.firstCellId)) {
      fail(`${label}: 区域 ${zone.id ?? '(未命名)'} 参数不完整`);
    }
    let id = zone.firstCellId;
    for (let row = 0; row < zone.rows; row += 1) {
      for (let column = 0; column < zone.columns; column += 1) {
        const x = zone.origin.x + column * document.cellBasis.column.x + row * document.cellBasis.row.x;
        const y = zone.origin.y + column * document.cellBasis.column.y + row * document.cellBasis.row.y;
        const center = {
          x: x + (document.cellBasis.column.x + document.cellBasis.row.x) / 2,
          y: y + (document.cellBasis.column.y + document.cellBasis.row.y) / 2,
        };
        const corners = [
          { x, y },
          { x: x + document.cellBasis.column.x, y: y + document.cellBasis.column.y },
          { x: x + document.cellBasis.column.x + document.cellBasis.row.x, y: y + document.cellBasis.column.y + document.cellBasis.row.y },
          { x: x + document.cellBasis.row.x, y: y + document.cellBasis.row.y },
        ];
        if (corners.some(point => point.x < 0 || point.y < 0 || point.x > document.canvas.width || point.y > document.canvas.height)) {
          fail(`${label}: ${id}号格超出画布`);
        }
        cells.push({ id, x, y, center, state: zone.state ?? 'retained', zone: zone.id });
        id += 1;
      }
    }
  }

  cells.sort((a, b) => a.id - b.id);
  const expectedTotal = document.totalCells;
  if (!Number.isInteger(expectedTotal) || cells.length !== expectedTotal) {
    fail(`${label}: 展开后${cells.length}格，与totalCells=${expectedTotal}不一致`);
  }
  const ids = new Set(cells.map(cell => cell.id));
  if (ids.size !== cells.length) fail(`${label}: 存在重复编号`);
  for (let id = 1; id <= expectedTotal; id += 1) {
    if (!ids.has(id)) fail(`${label}: 缺少${id}号格`);
  }
  for (let i = 0; i < cells.length; i += 1) {
    for (let j = i + 1; j < cells.length; j += 1) {
      const distance = Math.hypot(cells[i].center.x - cells[j].center.x, cells[i].center.y - cells[j].center.y);
      if (distance < 40) fail(`${label}: ${cells[i].id}号与${cells[j].id}号格过度重叠(${distance.toFixed(1)}px)`);
    }
  }

  const retainedCount = cells.filter(cell => cell.state === 'retained').length;
  const newCount = cells.filter(cell => cell.state === 'new').length;
  if (Number.isInteger(document.retainedCells) && retainedCount !== document.retainedCells) {
    fail(`${label}: 保留格数量${retainedCount}与retainedCells=${document.retainedCells}不一致`);
  }
  if (Number.isInteger(document.newCells) && newCount !== document.newCells) {
    fail(`${label}: 新增格数量${newCount}与newCells=${document.newCells}不一致`);
  }
  return cells;
}

try {
  const baseline = readJson(baselinePath);
  const baselineCells = expand(baseline, '基线');
  console.log(`通过: 基线 ${baselineCells.length} 格，编号和几何关系正常`);

  if (candidatePath) {
    const candidate = readJson(candidatePath);
    const candidateCells = expand(candidate, '候选');
    for (const oldCell of baselineCells) {
      const inherited = candidateCells.find(cell => cell.id === oldCell.id);
      if (!inherited || inherited.x !== oldCell.x || inherited.y !== oldCell.y) {
        fail(`候选: ${oldCell.id}号格没有原坐标继承`);
      }
    }
    console.log(`通过: 候选 ${candidateCells.length} 格完整继承基线 ${baselineCells.length} 格`);
  }
} catch (error) {
  console.error(`失败: ${error.message}`);
  process.exit(1);
}
