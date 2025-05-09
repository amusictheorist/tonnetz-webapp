import { useEffect, useState } from "react"
import { Triangle } from "../types/triangle"
import { generateTriangleGrid, TRI_SIZE, TRI_HEIGHT } from "../utils/triangleGrid";

const ROWS = 10;
const COLS = 20;

export const TriangleGrid = () => {
  const [triangles, setTriangles] = useState<Triangle[]>([]);

  useEffect(() => {
    const grid = generateTriangleGrid(ROWS, COLS);
    console.log('grid:', grid);
    setTriangles(grid);
  }, []);

  const gridWidth = COLS * (TRI_SIZE / 2);
  const gridHeight = ROWS * TRI_HEIGHT;

  return (
    <svg
      viewBox={`${-gridWidth / 2 - 20} ${-gridHeight/ 2 - 20} ${gridWidth + 40} ${gridHeight + 40}`}
      className="w-full h-full bg-white"
    >
      {triangles.map(tri => (
        <polygon
          key={tri.id}
          points={tri.points.map(p => p.join(',')).join(' ')}
          fill="#eee"
          stroke="#000"
          strokeWidth={0.5}
        />
      ))}
    </svg>
  );
};