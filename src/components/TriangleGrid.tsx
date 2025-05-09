import { useEffect, useState } from "react"
import { Triangle } from "../types/triangle"
import { generateTriangleGrid, TRI_SIZE, TRI_HEIGHT } from "../utils/triangleGrid";
import { useInteraction } from "../context/InteractionContext";
import { PCNode } from "../types/pcNode";
import { generatePCNodes } from "../utils/pcNodes";
import { PCNodeLayer } from "./PCNodeLayer";

export const ROWS = 10;
export const COLS = 20;

export const TriangleGrid = () => {
  const [triangles, setTriangles] = useState<Triangle[]>([]);
  const [pcNodes, setPcNodes] = useState<PCNode[]>([]);
  const { selectedIds, toggleSelection } = useInteraction();

  useEffect(() => {
    const grid = generateTriangleGrid(ROWS, COLS);
    setTriangles(grid);
    setPcNodes(generatePCNodes(grid));
  }, []);

  const gridWidth = COLS * (TRI_SIZE / 2);
  const gridHeight = ROWS * TRI_HEIGHT;

  return (
    <svg
      viewBox={`${-gridWidth / 2 - 80} ${-gridHeight/ 2 - 80} ${gridWidth + 160} ${gridHeight + 160}`}
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

      <PCNodeLayer nodes={pcNodes} />
    </svg>
  );
};