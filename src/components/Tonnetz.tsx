import Modal from "./Modal";
import Legend from "./Legend";
import { useMemo, useRef, useState } from "react";
import { useInteraction } from "../context/InteractionContext";
import { HighlightAxes } from "../types/types";
import { gridWidth, gridHeight } from "../utils/triangleGrid";
import { AXES, groupLinesByAxis } from "../utils/createAxes";
import { calculateViewBox } from "../utils/viewBox";
import { PCNodeLayer } from "./layers/PCNodeLayer";
import { TransformationLayer } from "./layers/TransformationLayer";
import { AxesLayer } from "./layers/AxesLayer";
import { PathLayer } from "./layers/PathLayer";
import { TrianglePolygons } from "./layers/TriangleLayer";
import { ControlPanel } from "./controls/ControlPanel";
import { useGenerateTonnetzData } from "../hooks/useGenerateTonnetzData";

export const Tonnetz = () => {
  const [showTransformations, setShowTransformations] = useState(false);
  
  const [highlightAxes, setHighlightAxes] = useState<HighlightAxes>({
    fifths: false,
    minorThirds: false,
    majorThirds: false,
  });
  
  const [center, setCenter] = useState({ x: 0, y: 0 });
  
  const DRAG_THRESHOLD_PX = 6;
  const dragRef = useRef<{
    pointerId: number;
    startClientX: number;
    startClientY: number;
    startCenterX: number;
    startCenterY: number;
    didPan: boolean;
  } | null>(null);

  const {
    selectedIds,
    toggleSelection,
    clearSelection,
    mode,
    path,
    setPath,
    shortestPaths,
    zoom,
  } = useInteraction();
  
  const svgRef = useRef<SVGSVGElement>(null);
  const { triangles, pcNodes, transformationMap } = useGenerateTonnetzData();
  
  const viewBox = useMemo(
    () => calculateViewBox(center.x, center.y, zoom, gridWidth, gridHeight),
    [center.x, center.y, zoom]
  );

  const { fifths, majorThirds, minorThirds } = useMemo(() => {
    return {
      fifths: groupLinesByAxis(pcNodes, AXES.fifths),
      majorThirds: groupLinesByAxis(pcNodes, AXES.majorThirds),
      minorThirds: groupLinesByAxis(pcNodes, AXES.minorThirds),
    };
  }, [pcNodes]);

  const handleClick = (id: string) => () => {
    if (dragRef.current?.didPan) return;

    if (mode === 'select') toggleSelection(id);
    else if (mode === 'drawPath') {
      if (path.length === 0 || path[path.length - 1] !== id) {
        setPath([...path, id]);
      }
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (zoom <= 1) return;

    dragRef.current = {
      pointerId: e.pointerId,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startCenterX: center.x,
      startCenterY: center.y,
      didPan: false
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;

    const dxPx = e.clientX - d.startClientX;
    const dyPx = e.clientY - d.startClientY;

    if (!d.didPan) {
      const dist = Math.hypot(dxPx, dyPx);
      if (dist < DRAG_THRESHOLD_PX) return;
      d.didPan = true;
      svgRef.current?.setPointerCapture(d.pointerId);
    }

    const svg = svgRef.current;
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const [, , vbW, vbH] = viewBox.split(' ').map(Number);

    const worldPerPxX = vbW / rect.width;
    const worldPerPxY = vbH / rect.height;

    setCenter({
      x: d.startCenterX - dxPx * worldPerPxX,
      y: d.startCenterY - dyPx * worldPerPxY
    });
  };

  const onPointerUp = () => {
    const d = dragRef.current;
    if (d?.didPan) {
      svgRef.current?.releasePointerCapture(d.pointerId);
    }
    dragRef.current = null;
  };

  return (
    <div className="w-screen h-screen overflow-hidden relative bg-white">
      <ControlPanel
        highlighAxes={highlightAxes}
        setHighlightAxes={setHighlightAxes}
        showTransformations={showTransformations}
        setShowTransformations={setShowTransformations}
        clearSelection={clearSelection}
        mode={mode}
        triangles={triangles}
        transformationMap={transformationMap}
        disableTransformations={mode === 'shortestPath'}
        svgRef={svgRef}
        zoom={zoom}
      />
      
      <svg
        ref={svgRef}
        className="absolute inset-0 block w-full h-full"
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid meet"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="6"
            markerHeight="4"
            refX="5"
            refY="2"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <polygon points="0 0, 6 2, 0 4" fill="blue" />
          </marker>
        </defs>

        <g>
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
              <TrianglePolygons
                key={tri.id}
                id={tri.id}
                points={tri.points}
                isSelected={isSelected}
                opacity={opacity}
                onClick={handleClick(tri.id)}
              />
            );
          })}
            
          <AxesLayer
            highlightAxes={highlightAxes}
            fifths={fifths}
            majorThirds={majorThirds}
            minorThirds={minorThirds}
          />

          {showTransformations &&
            (mode === "select"
              ? selectedIds.length > 0 && (
                <TransformationLayer
                  selectedIds={selectedIds}
                  triangles={triangles}
                  transformationMap={transformationMap} transformations={[]}
                />
              )
              : path.length > 0 && (
                <TransformationLayer
                  selectedIds={[path[path.length - 1]]}
                  triangles={triangles}
                  transformationMap={transformationMap} transformations={[]}
                />
              ))}
            
          {["drawPath", "shortestPath"].includes(mode) && path.length > 1 && (
            <PathLayer
              path={path}
              shortestPaths={shortestPaths}
              triangles={triangles}
              mode={mode}
            />
          )}

          <PCNodeLayer nodes={pcNodes} />

        </g>
      </svg>
      <Modal />
      <Legend />
    </div>
  );
};
