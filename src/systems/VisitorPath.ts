import { V10MapPoint } from '../data/v10Map';

export interface VisitorObstacle {
  x: number;
  y: number;
  halfWidth: number;
  halfHeight: number;
}

interface SearchNode extends V10MapPoint {
  key: string;
  g: number;
  f: number;
  parent?: string;
}

const STEP = 28;
const NEIGHBORS = [
  [-1, 0], [1, 0], [0, -1], [0, 1],
  [-1, -1], [1, -1], [-1, 1], [1, 1],
] as const;

function pointInPolygon(point: V10MapPoint, polygon: ReadonlyArray<V10MapPoint>): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[i];
    const b = polygon[j];
    const crosses = (a.mapY > point.mapY) !== (b.mapY > point.mapY)
      && point.mapX < (b.mapX - a.mapX) * (point.mapY - a.mapY) / ((b.mapY - a.mapY) || 0.0001) + a.mapX;
    if (crosses) inside = !inside;
  }
  return inside;
}

function isBlocked(
  point: V10MapPoint,
  walkable: ReadonlyArray<V10MapPoint>,
  water: ReadonlyArray<V10MapPoint>,
  obstacles: ReadonlyArray<VisitorObstacle>,
): boolean {
  if (!pointInPolygon(point, walkable) || pointInPolygon(point, water)) return true;
  return obstacles.some(obstacle => (
    Math.abs(point.mapX - obstacle.x) <= obstacle.halfWidth
    && Math.abs(point.mapY - obstacle.y) <= obstacle.halfHeight
  ));
}

function segmentIsClear(
  from: V10MapPoint,
  to: V10MapPoint,
  walkable: ReadonlyArray<V10MapPoint>,
  water: ReadonlyArray<V10MapPoint>,
  obstacles: ReadonlyArray<VisitorObstacle>,
): boolean {
  const distance = Math.hypot(to.mapX - from.mapX, to.mapY - from.mapY);
  const samples = Math.max(1, Math.ceil(distance / 12));
  for (let i = 1; i < samples; i++) {
    const t = i / samples;
    if (isBlocked({
      mapX: from.mapX + (to.mapX - from.mapX) * t,
      mapY: from.mapY + (to.mapY - from.mapY) * t,
    }, walkable, water, obstacles)) return false;
  }
  return true;
}

function nearestFreeGridPoint(
  point: V10MapPoint,
  walkable: ReadonlyArray<V10MapPoint>,
  water: ReadonlyArray<V10MapPoint>,
  obstacles: ReadonlyArray<VisitorObstacle>,
): V10MapPoint | null {
  const baseX = Math.round(point.mapX / STEP);
  const baseY = Math.round(point.mapY / STEP);
  for (let radius = 0; radius <= 7; radius++) {
    const candidates: { point: V10MapPoint; distance: number }[] = [];
    for (let dx = -radius; dx <= radius; dx++) {
      for (let dy = -radius; dy <= radius; dy++) {
        if (radius > 0 && Math.abs(dx) !== radius && Math.abs(dy) !== radius) continue;
        const candidate = { mapX: (baseX + dx) * STEP, mapY: (baseY + dy) * STEP };
        if (isBlocked(candidate, walkable, water, obstacles)) continue;
        const distance = Math.hypot(candidate.mapX - point.mapX, candidate.mapY - point.mapY);
        candidates.push({ point: candidate, distance });
      }
    }
    if (candidates.length > 0) {
      candidates.sort((a, b) => a.distance - b.distance);
      return candidates[0].point;
    }
  }
  return null;
}

function gridKey(x: number, y: number): string {
  return `${x},${y}`;
}

function reconstruct(nodes: Map<string, SearchNode>, end: SearchNode): V10MapPoint[] {
  const result: V10MapPoint[] = [];
  let cursor: SearchNode | undefined = end;
  while (cursor) {
    result.push({ mapX: cursor.mapX, mapY: cursor.mapY });
    cursor = cursor.parent ? nodes.get(cursor.parent) : undefined;
  }
  return result.reverse();
}

function smoothPath(
  path: V10MapPoint[],
  walkable: ReadonlyArray<V10MapPoint>,
  water: ReadonlyArray<V10MapPoint>,
  obstacles: ReadonlyArray<VisitorObstacle>,
): V10MapPoint[] {
  if (path.length <= 2) return path;
  const result = [path[0]];
  let anchor = 0;
  while (anchor < path.length - 1) {
    let next = path.length - 1;
    while (next > anchor + 1 && !segmentIsClear(path[anchor], path[next], walkable, water, obstacles)) next--;
    result.push(path[next]);
    anchor = next;
  }
  return result;
}

export function findVisitorPath(
  start: V10MapPoint,
  target: V10MapPoint,
  walkable: ReadonlyArray<V10MapPoint>,
  water: ReadonlyArray<V10MapPoint>,
  obstacles: ReadonlyArray<VisitorObstacle>,
): V10MapPoint[] | null {
  const gridStart = nearestFreeGridPoint(start, walkable, water, obstacles);
  const gridTarget = nearestFreeGridPoint(target, walkable, water, obstacles);
  if (!gridStart || !gridTarget) return null;

  const startKey = gridKey(gridStart.mapX, gridStart.mapY);
  const targetKey = gridKey(gridTarget.mapX, gridTarget.mapY);
  const nodes = new Map<string, SearchNode>();
  const open = new Map<string, SearchNode>();
  const closed = new Set<string>();
  const first: SearchNode = {
    ...gridStart,
    key: startKey,
    g: 0,
    f: Math.hypot(gridTarget.mapX - gridStart.mapX, gridTarget.mapY - gridStart.mapY),
  };
  nodes.set(startKey, first);
  open.set(startKey, first);

  while (open.size > 0) {
    let current: SearchNode | undefined;
    for (const candidate of open.values()) {
      if (!current || candidate.f < current.f) current = candidate;
    }
    if (!current) break;
    open.delete(current.key);
    if (current.key === targetKey) {
      const gridPath = reconstruct(nodes, current);
      const safeTarget = isBlocked(target, walkable, water, obstacles) ? gridTarget : target;
      const combined = [start, ...gridPath, safeTarget];
      return smoothPath(combined, walkable, water, obstacles);
    }
    closed.add(current.key);

    for (const [dx, dy] of NEIGHBORS) {
      const next = { mapX: current.mapX + dx * STEP, mapY: current.mapY + dy * STEP };
      const key = gridKey(next.mapX, next.mapY);
      if (closed.has(key) || isBlocked(next, walkable, water, obstacles)) continue;
      if (dx !== 0 && dy !== 0) {
        const horizontal = { mapX: current.mapX + dx * STEP, mapY: current.mapY };
        const vertical = { mapX: current.mapX, mapY: current.mapY + dy * STEP };
        if (isBlocked(horizontal, walkable, water, obstacles) || isBlocked(vertical, walkable, water, obstacles)) continue;
      }
      const tentativeG = current.g + Math.hypot(dx, dy) * STEP;
      const known = nodes.get(key);
      if (known && tentativeG >= known.g) continue;
      const node: SearchNode = {
        ...next,
        key,
        g: tentativeG,
        f: tentativeG + Math.hypot(gridTarget.mapX - next.mapX, gridTarget.mapY - next.mapY),
        parent: current.key,
      };
      nodes.set(key, node);
      open.set(key, node);
    }
  }
  return null;
}
