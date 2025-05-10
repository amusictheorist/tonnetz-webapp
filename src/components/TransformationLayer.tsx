import { TransformationMap } from "../types/transformation";
import { Triangle } from "../types/triangle";

interface Props {
  selectedId: string | null;
  triangles: Triangle[];
  transformationMap: TransformationMap;
}

export const TransformationLayer = ({ selectedId, triangles, transformationMap }: Props) => {
  if (!selectedId) return null;

  return (
    <>
      {Object.entries(transformationMap[selectedId] || {}).map(([neighbourId, label]) => {
        const tri = triangles.find(t => t.id === neighbourId);
        if (!tri) return null;

        const [xSum, ySum] = tri.points.reduce(([sx, sy], [x, y]) => [sx + x, sy + y], [0, 0]);
        const x = xSum / 3;
        const y = ySum / 3;

        return (
          <text
            key={neighbourId}
            x={x}
            y={y}
            fontSize={12}
            textAnchor="middle"
            alignmentBaseline="middle"
            fill="black"
          >
            {label}
          </text>
        );
      })}
    </>
  );
};