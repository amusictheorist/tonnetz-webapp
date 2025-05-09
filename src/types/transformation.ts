export type Transformation = 'P' | 'L' | 'R' | 'N' | 'S';

export type TransformationMap = {
  [fromId: string]: {
    [toId: string]: Transformation;
  };
};