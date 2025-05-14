import { Orientation, Triangle } from "../types/types";
import { assignTrianglePCs } from "./assignTrianglePitchClasses";

export const TRI_SIZE = 60;
export const TRI_HEIGHT = Math.sqrt(3) / 2 * TRI_SIZE;
export const ROWS = 10;
export const COLS = 20;
export const gridWidth = COLS * (TRI_SIZE / 2);
export const gridHeight = ROWS * TRI_HEIGHT;

export function generateTriangleGrid(rows: number, cols: number): Triangle[] {
  const triangles: Triangle[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const orientation: Orientation = (row + col) % 2 === 0 ? 'up' : 'down';
      const x = (col - cols / 2) * (TRI_SIZE / 2);
      const y = (row - rows / 2) * TRI_HEIGHT;
      const points = getTrianglePoints(x, y, TRI_SIZE, orientation);
      const id = `${row}-${col}`;

      triangles.push({ id, row, col, orientation, points, pitchClasses: [] });
    }
  }
  return assignTrianglePCs(triangles);
}

function getTrianglePoints(
  cx: number,
  cy: number,
  size: number,
  orientation: Orientation
): [number, number][] {
  const height = Math.sqrt(3) / 2 * size;

  if (orientation === 'up') {
    return [
      [cx, cy - height / 2],
      [cx - size / 2, cy + height / 2],
      [cx + size / 2, cy + height / 2]
    ];
  } else {
    return [
      [cx, cy + height / 2],
      [cx - size / 2, cy - height / 2],
      [cx + size / 2, cy - height / 2]
    ];
  }
};

export function getCentroid(triangle: Triangle): [number, number] {
  const [xSum, ySum] = triangle.points.reduce(
    ([sx, sy], [x, y]) => [sx + x, sy + y],
    [0, 0]
  );
  return [xSum / 3, ySum / 3];
};
