import { useMemo } from "react";
import { PathLayerProps } from "../types/types";
import { getCentroid } from "../utils/triangleGrid";

export const PathLayer = ({ path, triangles }: PathLayerProps) => {
  const centroidMap = useMemo(() => {
    const map: Record<string, [number, number]> = {};
    for (const tri of triangles) {
      map[tri.id] = getCentroid(tri);
    }
    return map;
  }, [triangles]);

  const points = path.map(id => centroidMap[id]).filter(Boolean);
  if (points.length === 0) return null;

  const isSameStartEnd = path.length > 1 && path[0] === path[path.length - 1];

  return (
    <>
      <polyline
        points={points.map(([x, y]) => `${x},${y}`).join(' ')}
        stroke="blue"
        strokeWidth={2}
        fill="none"
        markerEnd="url(#arrowhead)"
      />
      <defs>
        <marker
          id="arrowhead"
          markerWidth="6"
          markerHeight="4"
          refX="0"
          refY="2"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <polygon points="0 0, 6 2, 0 4" fill="blue" />
        </marker>
      </defs>

      <text
        x={points[0][0]}
        y={points[0][1] - 10}
        fontSize={8}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="blue"
        style={{fontFamily: "sans-serif"}}
        >
        START
      </text>
      <text
        x={points[points.length - 1][0]}
        y={points[points.length - 1][1] - (isSameStartEnd ? -8 : 12)}
        fontSize={8}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="blue"
        style={{fontFamily: "sans-serif"}}
      >
        END
      </text>
    </>
  );
};