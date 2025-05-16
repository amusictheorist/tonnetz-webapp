import { Transformation, TransformationMap, Triangle } from "../types/types";

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
  const targetIds = new Set(
    triangles.filter(t => t.root === targetRoot && t.quality === targetQuality)
      .map(t => t.id)
  );

  const paths: { path: string[], transformations: Transformation[] }[] = [];
  const queue: { path: string[], transformations: Transformation[] }[] = [];

  for (const tri of startTriangles) {
    queue.push({ path: [tri.id], transformations: [] });
  }

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

  const minLength = Math.min(...paths.map(p => p.path.length));
  return paths.filter(p => p.path.length === minLength);
};