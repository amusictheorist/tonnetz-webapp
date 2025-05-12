import { TransformationMap } from "../types/transformation";
import { Triangle } from "../types/triangle";

interface Props {
  selectedIds: string[];
  triangles: Triangle[];
  transformationMap: TransformationMap;
}

export const TransformationLayer = ({ selectedIds, triangles, transformationMap }: Props) => {
  if (!selectedIds || selectedIds.length === 0) return null;

  // Map from triangle ID to array of labels from multiple selected triangles
  const labelMap: Record<string, { label: string; from: string }[]> = {};

  for (const fromId of selectedIds) {
    const neighbors = transformationMap[fromId] || {};
    for (const [toId, label] of Object.entries(neighbors)) {
      if (!labelMap[toId]) {
        labelMap[toId] = [];
      }
      labelMap[toId].push({ label, from: fromId });
    }
  }

  return (
    <>
      {Object.entries(labelMap).map(([triId, labels]) => {
        const tri = triangles.find(t => t.id === triId);
        if (!tri) return null;

        const [xSum, ySum] = tri.points.reduce(
          ([sx, sy], [x, y]) => [sx + x, sy + y],
          [0, 0]
        );
        const x = xSum / 3;
        const y = ySum / 3;

        return labels.map(({ label, from }, index) => (
          <text
            key={`${triId}-${from}`}
            x={x}
            y={y + index * 12 - (labels.length - 1) * 6}
            fontSize={10}
            fill="red"
            textAnchor="middle"
            alignmentBaseline="middle"
            style={{ fontFamily: "sans-serif", opacity: 0.7 }}
          >
            {label}
          </text>
        ));
      })}
    </>
  );
};
