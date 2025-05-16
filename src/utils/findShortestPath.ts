import { Transformation, TransformationMap, Triangle } from "../types/types";
import { colCenter as centerX, rowCenter as centerY } from "./triangleGrid";

function distanceToCenter(triangle: Triangle, centerX: number, centerY: number) {
  const centroidX = triangle.points.reduce((sum, p) => sum + p[0], 0) / triangle.points.length;
  const centroidY = triangle.points.reduce((sum, p) => sum + p[1], 0) / triangle.points.length;
  return Math.sqrt((centroidX - centerX) ** 2 + (centroidY - centerY) ** 2);
}

export function findShortestPath(
  triangles: Triangle[],
  transformationMap: TransformationMap,
  startRoot: number,
  startQuality: 'major' | 'minor',
  targetRoot: number,
  targetQuality: 'major' | 'minor'
): { path: string[], transformations: Transformation[] }[] {
  const startTriangles = triangles.filter(
    t => t.root === startRoot && t.quality === startQuality
  );

  const startTriangle = startTriangles.reduce((closest, tri) => {
    const dist = distanceToCenter(tri, centerX, centerY);
    return !closest || dist < closest.dist ? { tri, dist } : closest;
  }, null as { tri: Triangle; dist: number } | null)?.tri;

  if (!startTriangle) return [];

  const targetIds = new Set(
    triangles
      .filter(t => t.root === targetRoot && t.quality === targetQuality)
      .map(t => t.id)
  );

  const paths: { path: string[], transformations: Transformation[] }[] = [];
  const queue: { path: string[], transformations: Transformation[] }[] = [
    { path: [startTriangle.id], transformations: [] }
  ];

  const visited = new Set<string>();

  while (queue.length > 0) {
    const { path, transformations } = queue.shift()!;
    const current = path[path.length - 1];

    if (targetIds.has(current)) {
      paths.push({ path, transformations });
      continue;
    }

    visited.add(current);

    for (const [neighborId, trans] of Object.entries(transformationMap[current] || {})) {
      if (!visited.has(neighborId)) {
        queue.push({
          path: [...path, neighborId],
          transformations: [...transformations, trans]
        });
      }
    }
  }

  if (paths.length === 0) return [];

  const minLength = Math.min(...paths.map(p => p.path.length));
  return paths.filter(p => p.path.length === minLength);
};
