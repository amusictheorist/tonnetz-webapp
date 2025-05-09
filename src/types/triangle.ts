export type Orientation = 'up' | 'down';
export type TriangleID = string;
export interface Triangle {
  id: TriangleID;
  row: number;
  col: number;
  orientation: Orientation;
  points: [number, number][];
  pitchClasses: number[];
}