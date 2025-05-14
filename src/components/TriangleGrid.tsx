import { useEffect, useMemo, useState } from "react";
import { Triangle } from "../types/triangle";
import { generateTriangleGrid, TRI_SIZE, TRI_HEIGHT } from "../utils/triangleGrid";
import { useInteraction } from "../context/InteractionContext";
import { PCNode } from "../types/pcNode";
import { generatePCNodes } from "../utils/pcNodes";
import { PCNodeLayer } from "./PCNodeLayer";
import { TransformationMap } from "../types/transformation";
import { generateTransformationMap } from "../utils/transformationMap";
import { TransformationLayer } from "./TransformationLayer";
import { AxisDropdown } from "./AxesDropdown";
import { HighlightAxes } from "../types/axis";
import { AXES, groupLinesByAxis } from "../utils/createAxes";
import { AxesLayer } from "./AxesLayer";

export const ROWS = 10;
export const COLS = 20;

export const TriangleGrid = () => {
  const [triangles, setTriangles] = useState<Triangle[]>([]);
  const [pcNodes, setPcNodes] = useState<PCNode[]>([]);
  const [transformationMap, setTransformationMap] = useState<TransformationMap>({});
  const [showTransformations, setShowTransformations] = useState(false);
  const [highlightAxes, setHighlightAxes] = useState<HighlightAxes>({
    fifths: false,
    minorThirds: false,
    majorThirds: false
  });

  const { selectedIds, toggleSelection, clearSelection } = useInteraction();

  useEffect(() => {
    const grid = generateTriangleGrid(ROWS, COLS);
    setTriangles(grid);
    setPcNodes(generatePCNodes(grid));
    setTransformationMap(generateTransformationMap(grid));
  }, []);

  const gridWidth = COLS * (TRI_SIZE / 2);
  const gridHeight = ROWS * TRI_HEIGHT;

  const { fifths, majorThirds, minorThirds } = useMemo(() => {
    return {
      fifths: groupLinesByAxis(pcNodes, AXES.fifths),
      majorThirds: groupLinesByAxis(pcNodes, AXES.majorThirds),
      minorThirds: groupLinesByAxis(pcNodes, AXES.minorThirds)
    }
  }, [pcNodes]);
  
  return (
    <div
      style={{
        position: "absolute",
        width: "100vw",
        height: "100vh",
        backgroundColor: "#f8f8f8",
        overflow: "auto",
      }}
    >
      {/* Control Panel */}
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
          boxShadow: "0 0 6px rgba(0, 0, 0, 0.15)",
        }}
      >
        {/* Dropdown for axes controls */}
        <AxisDropdown
          selectedAxes={highlightAxes}
          setSelectedAxes={setHighlightAxes}
        />

        {/* Show Transformations checkbox */}
        <label style={{ display: "flex", alignItems: "center", gap: "8px", padding: "4px 8px" }}>
          Show Transformations
          <input
            type="checkbox"
            checked={showTransformations}
            onChange={() => setShowTransformations((prev) => !prev)}
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
              cursor: "pointer",
            }}
          >
            Clear
          </button>
        )}
      </div>

      {/* SVG Grid */}
      <svg
        viewBox={`${-gridWidth / 2 - 80} ${-gridHeight / 2 - 80} ${gridWidth + 160} ${gridHeight + 160}`}
        className="w-full h-full bg-white"
      >
        {/* Base Triangles */}
        {triangles.map((tri) => {
          const isSelected = selectedIds.includes(tri.id)
          const isAnySelected = selectedIds.length > 0
          const opacity = isAnySelected ? (isSelected ? 1 : 0.3) : 1

          return (
            <polygon
              key={tri.id}
              points={tri.points.map(p => p.join(",")).join(" ")}
              fill="#ddd"
              stroke="#333"
              opacity={opacity}
              onClick={() => toggleSelection(tri.id)}
              style={{ cursor: "pointer" }}
            />
          )
        })}

        {/* Axis Lines */}
        <AxesLayer
          highlightAxes={highlightAxes}
          fifths={fifths}
          majorThirds={majorThirds}
          minorThirds={minorThirds}
        />

        {/* Transformation labels layer */}
        {showTransformations && selectedIds.length > 0 && (
          <TransformationLayer
            selectedIds={selectedIds}
            triangles={triangles}
            transformationMap={transformationMap}
          />
        )}

        {/* PC node layer */}
        <PCNodeLayer nodes={pcNodes} />
      </svg>
    </div>
  );
};
