import { useState } from "react";
import { PITCH_CLASSES, hexCenters } from "../utils/constants";
import { getHexTriangles } from "../utils/geometry";

function Tonnetz() {
  const [selectedTriangles, setSelectedTriangles] = useState<Set<string>>(new Set());

  const handleTriangleClick = (id: string) => {
    setSelectedTriangles(prev => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const isAnySelected = selectedTriangles.size > 0;

  const triangles = hexCenters.flatMap(([cx, cy], hexIdx) => {
    return getHexTriangles(cx, cy).map((vertices, triIdx) => ({
      id: `${hexIdx}-${triIdx}`,
      vertices,
    }));
  });

  const viewBoxSize = 500;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh"
      }}
    >
      <svg
        viewBox={[-viewBoxSize / 2, -viewBoxSize / 2, viewBoxSize, viewBoxSize].join(" ")}
        width="180vh"
        height="100vh"
        style={{
          backgroundColor: "#fff",
          border: "2px solid black"
        }}
      >
        {triangles.map(({ id, vertices }) => {
          const isSelected = selectedTriangles.has(id);
          const opacity = selectedTriangles.size === 0 ? 1 : isSelected ? 1 : 0.3;
          
          return (
            <polygon
              key={id}
              points={vertices.map(([x, y]) => `${x},${-y}`).join(" ")}
              fill="#ddd"
              stroke="#333"
              opacity={opacity}
              onClick={() => handleTriangleClick(id)}
              style={{ cursor: "pointer" }}
            />
          );
        })}
      </svg>
    </div>
  );
};

export default Tonnetz;
