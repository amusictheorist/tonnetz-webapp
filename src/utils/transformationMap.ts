import { Transformation, TransformationMap, Triangle } from "../types/types";

export function generateTransformationMap(triangles: Triangle[]): TransformationMap {
  const map: TransformationMap = {};
  const triangleMap = new Map<string, Triangle>();

  for (const tri of triangles) {
    triangleMap.set(`${tri.row}-${tri.col}`, tri);
  }

  for (const tri of triangles) {
    const { row, col, id } = tri;
    map[id] = {};

    const isEvenRow = row % 2 === 0;
    const isMajor = (isEvenRow && col % 2 === 0) || (!isEvenRow && col % 2 === 1);

    const neighbors: { label: Transformation; key: string }[] = [];

    if (isMajor) {
      neighbors.push(
        { label: 'L', key: `${row}-${col + 1}` },
        { label: 'R', key: `${row}-${col - 1}` },
        { label: 'P', key: `${row + 1}-${col}` }
      );
    } else {
      neighbors.push(
        { label: 'R', key: `${row}-${col + 1}` },
        { label: 'L', key: `${row}-${col - 1}` },
        { label: 'P', key: `${row - 1}-${col}` }
      );
    }

    for (const { label, key } of neighbors) {
      const neighbor = triangleMap.get(key);
      if (neighbor) {
        map[id][neighbor.id] = label;
      }
    }
  }

  console.log('map:', map);
  return map;
}
