export type Point = [number, number];

export interface Triangle {
  vertices: [Point, Point, Point];
  id: string;
  selected: boolean;
}

export interface Node {
  position: Point;
  label: string;
}