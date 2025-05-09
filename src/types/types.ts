export type Point = [number, number];

export interface TriangleOld {
  vertices: [Point, Point, Point];
  id: string;
  selected: boolean;
}

export interface Node {
  position: Point;
  label: string;
}

export type Transformation = 'P' | 'L' | 'R' | 'N' | 'S';

export type TransformationMap = Record<
  string,
  Partial<Record<Transformation, string>>
  >;

export type ZoomSliderProps = {
  zoom: number;
  setZoom: (value: number) => void;
};