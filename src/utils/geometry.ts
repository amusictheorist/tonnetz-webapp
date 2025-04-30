import { sideLength, triangleHeight } from "./constants";
import { Point, Triangle, Transformation, TransformationMap } from "../types/types";

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

function shareEdge(triA: Triangle, triB: Triangle): boolean {
  const aVertices = triA.vertices.map(p => p.join(','));
  const bVertices = triB.vertices.map(p => p.join(','));

  const shared = aVertices.filter(p => bVertices.includes(p));

  return shared.length === 2;
}

function isPointingUp(triangle: Triangle): boolean {
  const [a, b, c] = triangle.vertices;
  const centroidY = (a[1] + b[1] + c[1]) / 3;
  
  const sortedY = [a[1], b[1], c[1]].sort((y1, y2) => y1 - y2);
  const baseY = sortedY[1];
  
  const result = centroidY > baseY;
  
  return result;
}

function edgeDirection(tri: Triangle, neighbor: Triangle): 'bottom' | 'left' | 'right' | null {
  const [a, b, c] = tri.vertices;
  const edges = [
    [a, b],
    [b, c],
    [c, a]
  ];

  const sharedEdge = neighbor.vertices.filter(v =>
    tri.vertices.some(tv => tv[0] === v[0] && tv[1] === v[1])
  );

  if (sharedEdge.length !== 2) return null;

  const key = sharedEdge.map(p => p.join(',')).sort().join('|');
  const edgeKeys = edges.map(([p1, p2]) => [p1, p2].map(p => p.join(',')).sort().join('|'));

  const index = edgeKeys.indexOf(key);
  if (index === -1) return null;

  return ['bottom', 'left', 'right'][index] as 'bottom' | 'left' | 'right';
}

export function buildTransformationMap(triangles: Triangle[]): TransformationMap {
  const map: TransformationMap = {};

  for (let i = 0; i < triangles.length; i++) {
    const tri = triangles[i];
    const triId = tri.id;
    const triUp = isPointingUp(tri);
    map[triId] = {};
    
    for (let j = 0; j < triangles.length; j++) {
      if (i === j) continue;
      
      const other = triangles[j];
      if (!shareEdge(tri, other)) continue;

      const direction = edgeDirection(tri, other);
      if (!direction) continue;

      let label: Transformation;
      if (triUp) {
        if (direction === 'bottom') label = 'P';
        else if (direction === 'left') label = 'L';
        else label = 'R';
      } else {
        if (direction === 'bottom') label = 'L';
        else if (direction === 'left') label = 'P';
        else label = 'R';
      }

      map[triId]![label] = other.id;
    }
  }

  return map;
}
