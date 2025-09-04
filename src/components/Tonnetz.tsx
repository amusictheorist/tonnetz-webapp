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
import { useScrollToCenter } from "../hooks/useScrollToCenter";

export const Tonnetz = () => {
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
    zoom,
  } = useInteraction();
  const scrollRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const { triangles, pcNodes, transformationMap } = useGenerateTonnetzData();
  const scaledViewBox = useMemo(() => calculateViewBox(zoom, gridWidth, gridHeight), [zoom]);

  useScrollToCenter(scrollRef);

  const { fifths, majorThirds, minorThirds } = useMemo(() => {
    return {
      fifths: groupLinesByAxis(pcNodes, AXES.fifths),
      majorThirds: groupLinesByAxis(pcNodes, AXES.majorThirds),
      minorThirds: groupLinesByAxis(pcNodes, AXES.minorThirds),
    };
  }, [pcNodes]);


  const handleClick = (id: string) => () => {
    if (mode === 'select') {
      toggleSelection(id);
    } else if (mode === 'drawPath') {
      if (path.length === 0 || path[path.length - 1] !== id) {
        setPath([...path, id]);
      }
    }
  };

  return (
    <div className="w-screen h-screen relative overflow-hidden">
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
      
      <div
        className="absolute top-[100px] bottom-0 left-0 right-0 overflow-y-auto overflow-x-hidden flex justify-center items-start bg-white"
        ref={scrollRef}
      >
        <svg className="block w-full h-full" viewBox={scaledViewBox} ref={svgRef}>

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

          <g transform={`scale(${zoom})`}>
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
      </div>
      <Modal />
      <Legend />
    </div>
  );
};
