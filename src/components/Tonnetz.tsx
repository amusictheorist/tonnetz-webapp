import { useState } from "react";
import { HEX_RADIUS, PITCH_CLASSES, hexCenters } from "../utils/constants";
import { getHexTriangles } from "../utils/geometry";
import { Point, Triangle, Node } from "../types/types";

function Tonnetz() {
  const [selectedTriangles, setSelectedTriangles] = useState<Set<string>>(new Set());

  const handleTriangleClick = (id: string) => {
    setSelectedTriangles(prev => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const triangles = hexCenters.flatMap(([cx, cy], hexIdx) => {
    return getHexTriangles(cx, cy).map((vertices, triIdx) => ({
      id: `${hexIdx}-${triIdx}`,
      vertices,
    }));
  });

  const viewBoxSize = 1000;

  return (
    <svg
      viewBox={[-viewBoxSize / 2, -viewBoxSize / 2, viewBoxSize, viewBoxSize].join(" ")}
      width="100%"
      height="100%"
      style={{ backgroundColor: "#fff" }}
    >
      {triangles.map(({ id, vertices }) => (
        <polygon
          key={id}
          points={vertices.map(([x, y]) => `${x},${-y}`).join(" ")}
          fill={selectedTriangles.has(id) ? "#88f" : "#ccc"}
          stroke="#333"
          onClick={() => handleTriangleClick(id)}
        />
      ))}

    </svg>
  );
};

export default Tonnetz;