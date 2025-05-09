import { useEffect, useState } from "react"
import { Triangle } from "../types/triangle"
import { generateTriangleGrid, TRI_SIZE, TRI_HEIGHT } from "../utils/triangleGrid";
import { useInteraction } from "../context/InteractionContext";

const ROWS = 10;
const COLS = 20;

export const TriangleGrid = () => {
  const [triangles, setTriangles] = useState<Triangle[]>([]);
  const { selectedIds, toggleSelection } = useInteraction();

  useEffect(() => {
    setTriangles(generateTriangleGrid(ROWS, COLS));
  }, []);

  const gridWidth = COLS * (TRI_SIZE / 2);
  const gridHeight = ROWS * TRI_HEIGHT;

  return (
    <svg
      viewBox={`${-gridWidth / 2 - 20} ${-gridHeight/ 2 - 20} ${gridWidth + 40} ${gridHeight + 40}`}
      className="w-full h-full bg-white"
    >
      {triangles.map(tri => {
        const isSelected = selectedIds.includes(tri.id);
        const isAnySelected = selectedIds.length > 0;
        const opacity = isAnySelected ? (isSelected ? 1 : 0.3) : 1;
        return (
          
          <polygon
            key={tri.id}
            points={tri.points.map(p => p.join(',')).join(' ')}
            fill="#ddd"
            opacity={opacity}
            stroke="#333"
            onClick={() => toggleSelection(tri.id)}
            style={{ cursor: "pointer" }}
          />
        );
      })}
    </svg>
  );
};