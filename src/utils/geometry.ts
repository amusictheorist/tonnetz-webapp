import { HEX_RADIUS } from "./constants";
import { Point } from "../types/types";

export const polarToCartesian = (
  cx: number,
  cy: number,
  angleDeg: number,
  radius: number = HEX_RADIUS
): Point => {
  const rad = (Math.PI / 180) * angleDeg;
  return [cx + radius * Math.cos(rad), cy + radius * Math.sin(rad)];
};

export const getHexCorners = (cx: number, cy: number): Point[] => {
  return Array.from({ length: 6 }, (_, i) =>
    polarToCartesian(cx, cy, 60 * i)
  );
};

export const getHexTriangles = (cx: number, cy: number): [Point, Point, Point][] => {
  const corners = getHexCorners(cx, cy);
  return corners.map((corner, i) => [
    [cx, cy],
    corner,
    corners[(i + 1) % 6]
  ]);
};