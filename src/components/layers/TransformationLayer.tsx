import { TransformationProps, Triangle } from "../../types/types";

export const TransformationLayer = ({
  selectedIds,
  triangles,
  transformationMap
}: TransformationProps) => {
  if (!selectedIds || selectedIds.length === 0) return null;

  const FONT_SIZE = 12;
  const EDGE_OFFSET = 0;

  const triById = new Map(triangles.map(t => [t.id, t]));
  const mid = (a: [number, number], b: [number, number]) =>
    [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2] as [number, number];

  function edgeNormal(a: [number, number], b: [number, number], from: Triangle) {
    const vx = b[0] - a[0];
    const vy = b[1] - a[1];

    const cx = (from.points[0][0] + from.points[1][0] + from.points[2][0]) / 3;
    const cy = (from.points[0][1] + from.points[1][1] + from.points[2][1]) / 3;

    let n1x = -vy, n1y = vx;
    let n2x = vy, n2y = -vx;

    const m = mid(a, b);
    const toCenx = cx - m[0];
    const toCeny = cy - m[1];

    const dot1 = n1x * toCenx + n1y * toCeny;
    const nx = dot1 < 0 ? n1x : n2x;
    const ny = dot1 < 0 ? n1y : n2y;

    const len = Math.hypot(nx, ny) || 1;
    return [nx / len, ny / len] as [number, number];
  }

  function labelPos(from: Triangle, label: string): [number, number] {
  const [A, B, C] = from.points;
    let eA: [number, number], eB: [number, number];
    
    const isMajor = from.orientation === '+';

  if (label === 'P') {
    eA = B; eB = C;
  } else if (label === 'L') {
    if (isMajor) {
      eA = A; eB = C;
    } else {
      eA = A; eB = B;
    }
  } else if (label === 'R') {
    if (isMajor) {
      eA = A; eB = B;
    } else {
      eA = A; eB = C;
    }
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

  return (
    <>
      {[...placed.values()].map(({ x, y, label }, i) => (
        <text
          key={i}
          x={x}
          y={y}
          fontSize={FONT_SIZE}
          fill="red"
          textAnchor="middle"
          alignmentBaseline="middle"
          pointerEvents='none'
          style={{ fontFamily: 'sans-serif', opacity: 0.85 }}
        >
          {label}
        </text>
      ))}
    </>
  );
};
