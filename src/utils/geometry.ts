import { sideLength, triangleHeight } from "./constants";
import { Point, TriangleOld, TransformationMap } from "../types/types";

export function getTriangleVertices(centerX: number, centerY: number, isUp: boolean): [Point, Point, Point] {
  const s = sideLength;
  const h = triangleHeight;

  if (isUp) {
    return [
      [centerX, centerY - h / 2],
      [centerX - s / 2, centerY + h / 2],
      [centerX + s / 2, centerY + h / 2]
    ];
  } else {
    return [
      [centerX - s / 2, centerY - h / 2],
      [centerX + s / 2, centerY - h / 2],
      [centerX, centerY + h / 2]
    ];
  }
}

function isPointingUp(triangle: TriangleOld): boolean {
  const [a, b, c] = triangle.vertices;
  const centroidY = (a[1] + b[1] + c[1]) / 3;
  
  const sortedY = [a[1], b[1], c[1]].sort((y1, y2) => y1 - y2);
  const baseY = sortedY[1];
  
  const result = centroidY > baseY;
  
  return result;
}

export function buildTransformationMap(triangles: TriangleOld[]): TransformationMap {
  const map: TransformationMap = {};

  for (let i = 0; i < triangles.length; i++) {
    const tri = triangles[i];
    const triId = tri.id;
    const triUp = isPointingUp(tri);
    map[triId] = {};
    
    for (let j = 0; j < triangles.length; j++) {
      if (i === j) continue;
      
      const other = triangles[j];
      const [row, col] = triId.split('-').map(Number);
      const [otherRow, otherCol] = other.id.split('-').map(Number);

      if (triUp) {
        if (otherRow === row + 1 && otherCol === col) map[triId]['P'] = other.id;
        if (otherRow === row && otherCol === col + 1) map[triId]['L'] = other.id;
        if (otherRow === row && otherCol === col - 1) map[triId]['R'] = other.id;
        if (otherRow === row + 1 && otherCol === col - 2) map[triId]['N'] = other.id;
        if (otherRow === row - 1 && otherCol === col) map[triId]['S'] = other.id;
      } else {
        if (otherRow === row - 1 && otherCol === col) map[triId]['P'] = other.id;
        if (otherRow === row && otherCol === col - 1) map[triId]['L'] = other.id;
        if (otherRow === row && otherCol === col + 1) map[triId]['R'] = other.id;
        if (otherRow === row - 1 && otherCol === col + 2) map[triId]['N'] = other.id;
        if (otherRow === row + 1 && otherCol === col) map[triId]['S'] = other.id;
      }
    }
  }

  return map;
}
