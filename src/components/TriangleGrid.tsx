import { useEffect, useState } from "react"
import { Triangle } from "../types/triangle"
import { generateTriangleGrid, TRI_SIZE, TRI_HEIGHT } from "../utils/triangleGrid";
import { useInteraction } from "../context/InteractionContext";
import { PCNode } from "../types/pcNode";
import { generatePCNodes } from "../utils/pcNodes";
import { PCNodeLayer } from "./PCNodeLayer";
import { TransformationMap } from "../types/transformation";
import { generateTransformationMap } from "../utils/transformationMap";
import { TransformationLayer } from "./TransformationLayer";

export const ROWS = 10;
export const COLS = 20;

export const TriangleGrid = () => {
  const [triangles, setTriangles] = useState<Triangle[]>([]);
  const [pcNodes, setPcNodes] = useState<PCNode[]>([]);
  const [transformationMap, setTransformationMap] = useState<TransformationMap>({});
  const [showTransformations, setShowTransformations] = useState(false);
  const { selectedIds, toggleSelection, clearSelection } = useInteraction();

  useEffect(() => {
    const grid = generateTriangleGrid(ROWS, COLS);
    setTriangles(grid);
    setPcNodes(generatePCNodes(grid));
    const map = generateTransformationMap(grid);
    setTransformationMap(map);
  }, []);

  const gridWidth = COLS * (TRI_SIZE / 2);
  const gridHeight = ROWS * TRI_HEIGHT;

  return (
    <div style={{ position: "absolute", width: "100vw", height: "100vh", backgroundColor: "#f8f8f8", overflow: "auto", }}>
      <div
        style={{
          position: "absolute",
          top: "100px",
          right: "20px",
          zIndex: 20,
          background: "#fff",
          padding: "4px 8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          display: "flex",
          gap: "20px",
          fontSize: "14px",
          alignItems: "center",
          boxShadow: "0 0 6px rgba(0, 0, 0, 0.15)"
        }}
      >
        <label style={{ display: "flex", alignItems: "center", gap: "8px", padding: "4px 8px" }}>
          Show Transformations
          <input
            type="checkbox"
            checked={showTransformations}
            onChange={() => setShowTransformations(prev => !prev)}
          />
        </label>

        {showTransformations && (
          <button
            onClick={clearSelection}
            style={{
              padding: "4px 8px",
              fontSize: "14px",
              backgroundColor: "#eee",
              border: "1px solid #ddd",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Clear
          </button>
        )}
      </div>
      
      <div className="w-full h-full">
        <svg
          viewBox={`${-gridWidth / 2 - 80} ${-gridHeight / 2 - 80} ${gridWidth + 160} ${gridHeight + 160}`}
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

          {showTransformations && selectedIds.length  > 0 && (
            <TransformationLayer
              selectedIds={selectedIds}
              triangles={triangles}
              transformationMap={transformationMap}
            />
          )}
          
          <PCNodeLayer nodes={pcNodes} />
        </svg>
      </div>
    </div>
  );
};
