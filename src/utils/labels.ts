import { Triangle } from "../types/types";
import { edgeNormal, mid } from "./geometry";

const EDGE_OFFSET = 0;

export function labelPos(from: Triangle, label: string): [number, number] {
  const [A, B, C] = from.points;
  let eA: [number, number], eB: [number, number];

  const isMajor = from.orientation === '+';

  if (label === 'P') {
    eA = B; eB = C;
  } else if (label === 'L') {
    eA = A;
    eB = isMajor ? C : B;
  } else if (label === 'R') {
    eA = A;
    eB = isMajor ? B : C;
  } else {
    const cx = (A[0] + B[0] + C[0]) / 3;
    const cy = (A[1] + B[1] + C[1]) / 3;
    return [cx, cy];
  }

  const m = mid(eA, eB);
  if (EDGE_OFFSET === 0) return m;

  const [nx, ny] = edgeNormal(eA, eB, from);
  return [m[0] + nx * EDGE_OFFSET, m[1] + ny * EDGE_OFFSET];
}

export function getPlacedLabels(
  selectedIds: string[],
  triangles: Triangle[],
  transformationMap: Record<string, Record<string, string>>
) {
  const triById = new Map(triangles.map((t) => [t.id, t]));
  const placed = new Map<string, { x: number; y: number; label: string }>();

  for (const fromId of selectedIds) {
    const from = triById.get(fromId);
    if (!from) continue;

    const neighbors = transformationMap[fromId] || {};
    for (const [, label] of Object.entries(neighbors)) {
      const [x, y] = labelPos(from, label);
      const key = `${label}|${Math.round(x * 100) / 100},${Math.round(y * 100) / 100}`;
      if (!placed.has(key)) placed.set(key, { x, y, label });
    }
  }

  return [...placed.values()];
}