import { Transformation, TransformationMap } from "../types/transformation";
import { Triangle } from "../types/triangle";

export function generateTransformationMap(triangles: Triangle[]): TransformationMap {
  const map: TransformationMap = {};

  for (const triA of triangles) {
    map[triA.id] = {};
    for (const triB of triangles) {
      if (triA.id === triB.id) continue;
      const label = getTransformationLabel(triA, triB);
      if (label) {
        map[triA.id][triB.id] = label;
      }
    }
  }

  return map;
}

function pcEqual(a: number, b: number): boolean {
  return ((a - b + 12) % 12) === 0;
}

function getTransformationLabel(triA: Triangle, triB: Triangle): Transformation | null {
  const pcsA = [...triA.pitchClasses].map(pc => pc % 12).sort((a, b) => a - b);
  const pcsB = [...triB.pitchClasses].map(pc => pc % 12).sort((a, b) => a - b);

  const shared = pcsA.filter(pc => pcsB.includes(pc));
  if (shared.length !== 2) return null;
  
  const sharedSorted = shared.sort((a, b) => a - b);
  if (pcEqual(sharedSorted[0], pcsA[0]) && pcEqual(sharedSorted[1], pcsA[2])) return 'P';
  if (pcEqual(sharedSorted[1], pcsA[2])) return 'L';
  if (pcEqual(sharedSorted[0], pcsA[1])) return 'R';

  return null;
}