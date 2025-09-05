import { Triangle } from "../types/types";

export const mid = (a: [number, number], b: [number, number]) =>
  [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2] as [number, number];

export function edgeNormal(
  a: [number, number],
  b: [number, number],
  from: Triangle
): [number, number] {
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
};