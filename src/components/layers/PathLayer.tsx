import { useMemo } from "react";
import { PathLayerProps } from "../../types/types";
import { getCentroid } from "../../utils/triangleGrid";

export const PathLayer = ({ path, shortestPaths = [], triangles, mode }: PathLayerProps) => {
  const centroidMap = useMemo(() => {
    const map: Record<string, [number, number]> = {};
    for (const tri of triangles) {
      map[tri.id] = getCentroid(tri);
    }
    return map;
  }, [triangles]);

  const isShortest = mode === 'shortestPath';
  const pathsToRender = isShortest ? shortestPaths : [path];

  if (pathsToRender.length === 0) return null;

  return (
    <>
      {pathsToRender.map((p, idx) => {
        const points = p.map(id => centroidMap[id]).filter(Boolean);
        if (points.length === 0) return null;
        const isSameStartEnd = path.length > 1 && path[0] === path[path.length - 1];

        return (
          <g key={idx}>
            <polyline
              points={points.map(([x, y]) => `${x},${y}`).join(' ')}
              stroke="blue"
              strokeWidth={2}
              fill="none"
              markerEnd="url(#arrowhead)"
              opacity={0.8}
            />
            <text
              x={points[0][0]}
              y={points[0][1] - 10}
              fontSize={8}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="blue"
              style={{ fontFamily: "sans-serif" }}
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
              style={{ fontFamily: "sans-serif" }}
            >
              END
            </text>
          </g>
        );
      })}
    </>
  );
};