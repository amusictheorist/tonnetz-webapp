export type Axis = 'fifths' | 'minorThirds' | 'majorThirds';

export type HighlightAxes = Record<Axis, boolean>;

export interface AxisDropdownProps {
  selectedAxes: HighlightAxes;
  setSelectedAxes: React.Dispatch<React.SetStateAction<HighlightAxes>>;
};