import { useEffect, useMemo, useRef, useState } from "react";
import { Triangle, PCNode, TransformationMap, HighlightAxes } from "../types/types";
import { generateTriangleGrid, gridWidth, gridHeight, ROWS, COLS } from "../utils/triangleGrid";
import { useInteraction } from "../context/InteractionContext";
import { generatePCNodes } from "../utils/pcNodes";
import { PCNodeLayer } from "./PCNodeLayer";
import { generateTransformationMap } from "../utils/transformationMap";
import { TransformationLayer } from "./TransformationLayer";
import { AxisDropdown } from "./AxesDropdown";
import { AXES, groupLinesByAxis } from "../utils/createAxes";
import { AxesLayer } from "./AxesLayer";
import { PathControls } from "./PathControls";
import { PathLayer } from "./PathLayer";
import Modal from "./Modal";
import Legend from "./Legend";

export const Tonnetz = () => {
  const [triangles, setTriangles] = useState<Triangle[]>([]);
  const [pcNodes, setPcNodes] = useState<PCNode[]>([]);
  const [transformationMap, setTransformationMap] = useState<TransformationMap>({});
  const [showTransformations, setShowTransformations] = useState(false);
  const [highlightAxes, setHighlightAxes] = useState<HighlightAxes>({
    fifths: false,
    minorThirds: false,
    majorThirds: false,
  });
  const {
    selectedIds,
    toggleSelection,
    clearSelection,
    mode,
    path,
    setPath,
    shortestPaths,
  } = useInteraction();
  const minZoom = 1;
  const maxZoom = 3;
  const midZoom = (minZoom + maxZoom) / 2;
  const [zoom, setZoom] = useState(midZoom);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = generateTriangleGrid(ROWS, COLS);
    setTriangles(grid);
    setPcNodes(generatePCNodes(grid));
    setTransformationMap(generateTransformationMap(grid));
  }, []);

  useEffect(() => {
    const node = scrollRef.current;
    if (node) {
      node.scrollTop = (node.scrollHeight - node.clientHeight) / 2;
    }
  }, []);

  const { fifths, majorThirds, minorThirds } = useMemo(() => {
    return {
      fifths: groupLinesByAxis(pcNodes, AXES.fifths),
      majorThirds: groupLinesByAxis(pcNodes, AXES.majorThirds),
      minorThirds: groupLinesByAxis(pcNodes, AXES.minorThirds),
    };
  }, [pcNodes]);
  const extraMargin = 80 / zoom;
  const scaledViewBox = `${-gridWidth / 2 - extraMargin} ${-gridHeight / 2 - extraMargin} ${gridWidth + extraMargin * 2} ${gridHeight + extraMargin * 2}`;

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Control Panel */}
      <div
        style={{
          position: "fixed",
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
        <AxisDropdown
          selectedAxes={highlightAxes}
          setSelectedAxes={setHighlightAxes}
        />

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "4px 8px",
          }}
        >
          Show Transformations
          <input
            type="checkbox"
            checked={showTransformations}
            onChange={() => setShowTransformations((prev) => !prev)}
          />
        </label>

        {showTransformations && mode === "select" && (
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

        <PathControls
          triangles={triangles}
          transformationMap={transformationMap}
        />

        <label>
          Zoom: {((zoom - minZoom) / (maxZoom - minZoom) * 100).toFixed(0)}%
          <input
            style={{ width: "100px", height: "10px", cursor: "pointer" }}
            type="range"
            min={minZoom}
            max={maxZoom}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
          />
        </label>
      </div>

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        style={{
          position: "absolute",
          top: "100px",
          bottom: 0,
          left: 0,
          right: 0,
          overflowY: "auto",
          overflowX: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          backgroundColor: "#fff",
        }}
      >
        {/* SVG Grid */}
        <svg
          viewBox={scaledViewBox}
          style={{ display: "block", width: "100%", height: "100%" }}
        >

          <defs>
            <marker
              id="arrowhead"
              markerWidth="6"
              markerHeight="4"
              refX="6"
              refY="2"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <polygon points="0 0, 6 2, 0 4" fill="blue" />
            </marker>
          </defs>

          <g transform={`scale(${zoom})`}>
            {/* Base Triangles */}
            {triangles.map((tri) => {
              const isSelectMode = mode === "select";

              const isSelected = isSelectMode
                ? selectedIds.includes(tri.id)
                : mode === "shortestPath"
                ? shortestPaths.some((p) => p.includes(tri.id))
                : path.includes(tri.id);

              const isAnySelected = isSelectMode
                ? selectedIds.length > 0
                : mode === "shortestPath"
                ? shortestPaths.length > 0
                : path.length > 0;

              const opacity = isAnySelected ? (isSelected ? 1 : 0.3) : 1;

              return (
                <polygon
                  key={tri.id}
                  points={tri.points.map((p) => p.join(",")).join(" ")}
                  fill="#ddd"
                  stroke="#333"
                  opacity={opacity}
                  onClick={() => {
                    if (mode === "select") {
                      toggleSelection(tri.id);
                    } else if (mode === "drawPath") {
                      if (path.length === 0 || path[path.length - 1] !== tri.id) {
                        setPath([...path, tri.id]);
                      }
                    }
                  }}
                  style={{ cursor: "pointer" }}
                />
              );
            })}

            {/* Axis Lines */}
            <AxesLayer
              highlightAxes={highlightAxes}
              fifths={fifths}
              majorThirds={majorThirds}
              minorThirds={minorThirds}
            />

            {/* Transformation labels layer */}
            {showTransformations &&
              (mode === "select"
                ? selectedIds.length > 0 && (
                    <TransformationLayer
                  selectedIds={selectedIds}
                  triangles={triangles}
                  transformationMap={transformationMap} transformations={[]}                    />
                  )
                : path.length > 0 && (
                    <TransformationLayer
                  selectedIds={[path[path.length - 1]]}
                  triangles={triangles}
                  transformationMap={transformationMap} transformations={[]}                    />
                  ))}

            {/* Path layer */}
            {["drawPath", "shortestPath"].includes(mode) && path.length > 1 && (
              <PathLayer
                path={path}
                shortestPaths={shortestPaths}
                triangles={triangles}
                mode={mode}
              />
            )}

            {/* PC node layer */}
            <PCNodeLayer nodes={pcNodes} />
          </g>
        </svg>
      </div>
      <Modal />
      <Legend />
    </div>
  );
};
