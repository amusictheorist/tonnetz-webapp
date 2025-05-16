export type TriangleID = string;
export type Orientation = '+' | '-';
export type Axis = 'fifths' | 'minorThirds' | 'majorThirds';
export type AxisLine = [number, number][];
export type HighlightAxes = Record<Axis, boolean>;
export type InteractionMode = 'select' | 'drawPath' | 'shortestPath';
export type Transformation = 'P' | 'L' | 'R' | 'N' | 'S';
export type PCNodeProps = { nodes: PCNode[] };
export type PCNode = {
  id: string;
  x: number;
  y: number;
  label: string;
};
export type AxisLinesProps = {
  highlightAxes: HighlightAxes;
  fifths: AxisLine[];
  majorThirds: AxisLine[];
  minorThirds: AxisLine[];
};
export type TransformationMap = {
  [fromId: string]: {
    [toId: string]: Transformation;
  };
};

export interface Triangle {
  id: TriangleID;
  row: number;
  col: number;
  orientation: Orientation;
  points: [number, number][];
  pitchClasses: number[];
  label: string;
  quality: 'major' | 'minor';
  root: number;
};
export interface AxisDropdownProps {
  selectedAxes: HighlightAxes;
  setSelectedAxes: React.Dispatch<React.SetStateAction<HighlightAxes>>;
};
export interface PathLayerProps {
  path: string[];
  shortestPaths?: string[][];
  triangles: Triangle[];
  mode: InteractionMode;
};
export interface TransformationProps {
  selectedIds: string[];
  triangles: Triangle[];
  transformationMap: TransformationMap;
};
export interface InteractionContextProps {
  mode: InteractionMode;
  setMode: (mode: InteractionMode) => void;
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  toggleSelection: (id: string) => void;
  path: string[];
  setPath: (path: string[]) => void;
  shortestPaths: string[][];
  setShortestPaths: React.Dispatch<React.SetStateAction<string[][]>>;
  reset: () => void;
  clearSelection: () => void;
};