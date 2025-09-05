import { TransformationProps } from "../../types/types";
import { getPlacedLabels } from "../../utils/labels";

export const TransformationLayer = ({
  selectedIds,
  triangles,
  transformationMap
}: TransformationProps) => {
  if (!selectedIds || selectedIds.length === 0) return null;

  const FONT_SIZE = 12;
  const placed = getPlacedLabels(selectedIds, triangles, transformationMap);

  return (
    <>
      {placed.map(({ x, y, label }, i) => (
        <text
          key={i}
          x={x}
          y={y}
          fontSize={FONT_SIZE}
          fill="red"
          textAnchor="middle"
          alignmentBaseline="middle"
          pointerEvents='none'
          style={{ fontFamily: 'sans-serif', opacity: 0.85 }}
        >
          {label}
        </text>
      ))}
    </>
  );
};
