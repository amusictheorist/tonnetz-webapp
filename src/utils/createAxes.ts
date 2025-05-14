import { PCNode } from "../types/types";

export const GROUP_TOLERANCE = 5;

export const groupLinesByAxis = (
  nodes: PCNode[],
  axis: [number, number]
): [number, number][][] => {
  const [dx, dy] = axis;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len;
  const uy = dy / len;
  
  const groups: Record<string, [number, number][]> = {};

  nodes.forEach(({ x, y }) => {
    const proj = Math.round((x * ux + y * uy) / GROUP_TOLERANCE) * GROUP_TOLERANCE;
    const key = proj.toString();
    if (!groups[key]) groups[key] = [];
    groups[key].push([x, y]);
  });

  return Object.values(groups)
    .filter(group => group.length > 1)
    .map(group =>
      group.sort(([x1, y1], [x2, y2]) => {
        const p1 = x1 * ux + y1 * uy;
        const p2 = x2 * ux + y2 * uy;
        return p1 - p2;
      })
    );
};

export const AXES: Record<string, [number, number]> = {
  fifths: [0, 1],
  majorThirds: [1.5, Math.sqrt(3) / 2],
  minorThirds: [-1.5, Math.sqrt(3) / 2]
};