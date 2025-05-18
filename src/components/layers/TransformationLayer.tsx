import { TransformationProps } from "../../types/types";

export const TransformationLayer = ({ selectedIds, triangles, transformationMap }: TransformationProps) => {
  if (!selectedIds || selectedIds.length === 0) return null;

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

  function formatLabel(label: string, isMajor: boolean): string {
    if (isMajor) {
      switch (label) {
        case "L": return "← L";
        case "R": return "R →";
        case "P": return "P ↑";
      }
    } else {
      switch (label) {
        case "L": return "L →";
        case "R": return "← R";
        case "P": return "P ↓";
      }
    }
    return label;
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

        return labels.map(({ label, from }, index) => {
          const fromTri = triangles.find(t => t.id === from);
          const isMajor = fromTri?.orientation === "+";

          return (
            <text
              key={`${triId}-${from}-${index}`}
              x={x}
              y={y + index * 12 - (labels.length - 1) * 6}
              fontSize={8}
              fill="red"
              textAnchor="middle"
              alignmentBaseline="middle"
              style={{ fontFamily: "sans-serif", opacity: 0.8 }}
            >
              {formatLabel(label, isMajor)}
            </text>
          );
        });
      })}
    </>
  );
};
