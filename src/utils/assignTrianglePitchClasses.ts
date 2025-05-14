import { Triangle } from "../types/types";

function applyL(triad: number[]): number[] {
  return [
    (triad[0] + 4) % 12,
    (triad[1] + 3) % 12,
    (triad[2] + 4) % 12
  ];
}

function applyR(triad: number[]): number[] {
  return [
    (triad[0] + 3) % 12,
    (triad[1] + 4) % 12,
    (triad[2] + 3) % 12
  ];
}

export function assignTrianglePCs(triangles: Triangle[]): Triangle[] {
  const grid: Record<number, Record<number, Triangle>> = {};

  for (const tri of triangles) {
    if (!grid[tri.row]) grid[tri.row] = {};
    grid[tri.row][tri.col] = tri;
  }

  for (const rowStr in grid) {
    const row = parseInt(rowStr);
    const cols = Object.keys(grid[row]).map(Number).sort((a, b) => a - b);

    const isEvenRow = row % 2 === 0;
    const pattern: ('L' | 'R')[] = [];

    for (let i = 0; i < cols.length; i++) {
      pattern.push((isEvenRow ? ['L', 'R'] : ['R', 'L'])[i % 2] as 'L' | 'R');
    }

    const rowOffset = Math.floor(row / 2);
    const root = (8 - rowOffset + 12) % 12;
    let triad = isEvenRow
      ? [root, (root + 4) % 12, (root + 7) % 12]
      : [root, (root + 3) % 12, (root + 7) % 12];

    for (let i = 0; i < cols.length; i++) {
      const col = cols[i];
      const tri = grid[row][col];
      tri.pitchClasses = [...triad];

      triad = pattern[i] === 'L' ? applyL(triad) : applyR(triad);
    }
  }

  return triangles;
}
