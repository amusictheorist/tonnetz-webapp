import Legend from "./Legend";
import Modal from "./Modal";
import ZoomSlider from "../utils/ZoomSlider";
import { useRef, useState, useMemo, useEffect } from "react";
import { getTriangleVertices } from "../utils/geometry";
import { Transformation, TriangleOld } from "../types/types";
import { cols, rows, sideLength, triangleHeight, pcNodes, viewBoxWidth, viewBoxHeight } from "../utils/constants";
import '../styles/Tonnetz.css';
import { useZoomControl } from "../hooks/useZoomControl";
import { useCenterScroll } from "../hooks/useCenterScroll";
import { useTransformationMap } from "../hooks/useTransformationMap";

function Tonnetz() {
  const [selectedTriangles, setSelectedTriangles] = useState<Set<string>>(new Set());
  const [highlightedTransformations, setHighlightedTransformations] = useState<Record<string, { targetId: String, label: Transformation }[]>>({});
  const [showTransformations, setShowTransformations] = useState(false);
  const [drawPath, setDrawPath] = useState(false);
  const [path, setPath] = useState<string[]>([]);
  const [initialTriad, setInitialTriad] = useState<string[] | null>(null);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useZoomControl(containerRef);

  useCenterScroll(containerRef as React.RefObject<HTMLElement>);
  
  const handleTriangleClick = (id: string) => {
    if (drawPath) {
      if (!path.includes(id)) {
        setPath(prev => {
          const newPath = [...prev, id];
          if (prev.length === 0) {
            setInitialTriad([id]);
          }
          return newPath;
        });
        setRedoStack([]);

        if (showTransformations && transformationMap?.[id]) {
          const highlights = Object.entries(transformationMap[id]!).map(([label, targetId]) => ({
            targetId,
            label: label as Transformation
          }));
          setHighlightedTransformations(prev => ({
            ...prev,
            [id]: highlights
          }));
        }
      }
    } else {
      setSelectedTriangles(prev => {
        const newSet = new Set(prev);
        const newHighlights = { ...highlightedTransformations };
        
        if (newSet.has(id)) {
          newSet.delete(id);
          delete newHighlights[id];
        } else {
          newSet.add(id);
          if (transformationMap?.[id]) {
            const highlights = Object.entries(transformationMap[id]!).map(([label, targetId]) => ({
              targetId,
              label: label as Transformation
            }));
            newHighlights[id] = highlights;
          }
        }
        
        setHighlightedTransformations(newHighlights);
        return newSet;
      });
    }
  };
  
  const isAnySelected = selectedTriangles.size > 0;
  
  const triangles = useMemo(() => {
    const newTriangles: TriangleOld[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const isUp = (row + col) % 2 === 0;
        const x = (col - cols / 2) * (sideLength / 2);
        const y = (rows / 2 - row) * triangleHeight;
        const vertices = getTriangleVertices(x, y, isUp);
        newTriangles.push({
          id: `${row}-${col}`, vertices,
          selected: false
        });
      }
    }
    return newTriangles;
  }, []);

  const transformationMap = useTransformationMap(triangles);

  useEffect(() => {
    if (showTransformations && drawPath && path.length > 0 && transformationMap) {
      const newHighlights: Record<string, { targetId: string, label: Transformation }[]> = {};
      path.forEach(id => {
        if (transformationMap[id]) {
          newHighlights[id] = Object.entries(transformationMap[id]!).map(([label, targetId]) => ({
            targetId,
            label: label as Transformation
          }));
        }
      });
      setHighlightedTransformations(newHighlights);
    }
  }, [showTransformations, drawPath, path, transformationMap]);

  const nodes = pcNodes;

  return (
    <div className="containerRef" ref={containerRef} >

      {/* checkboxes and slider container */}
      <div className="checkboxes" >

        {/* show transformations checkbox */}
        <label className="label" >
          Show Transformations
          <input
            type="checkbox"
            checked={showTransformations}
            onChange={(e) => {
              setShowTransformations(e.target.checked);
              if (!e.target.checked) {
                setHighlightedTransformations({});
              } else {
                if (drawPath && path.length > 0 && transformationMap) {
                  const newHighlights: Record<string, { targetId: string, label: Transformation }[]> = {};
                  path.forEach(id => {
                    if (transformationMap[id]) {
                      newHighlights[id] = Object.entries(transformationMap[id]!).map(([label, targetId]) => ({
                        targetId,
                        label: label as Transformation
                      }));
                    }
                  });
                  setHighlightedTransformations(newHighlights);
                }
              }
            }}
          />
        </label>
        
        {/* draw path checkbox */}
        <div className="label" >
        <label className="label" >
          Draw Path
          <input
            type="checkbox"
            checked={drawPath}
              onChange={(e) => {
                const isChecked = e.target.checked;
                setDrawPath(isChecked);
                setSelectedTriangles(new Set());
                if (!showTransformations) {
                  setHighlightedTransformations({});
                }
                setPath([]);
                setRedoStack([]);
              }}
            />
          </label>

          {drawPath && (
            <>
              <button
                className="button"
                disabled={path.length === 0}
                onClick={() => {
                  const newPath = path.slice(0, -1);
                  const last = path[path.length - 1];
                  setPath(newPath);
                  setRedoStack([last, ...redoStack]);
                }}
              >
                Undo
              </button>
              <button
                className="button"
                disabled={redoStack.length === 0}
                onClick={() => {
                  const [redoItem, ...rest] = redoStack;
                  setPath([...path, redoItem]);
                  setRedoStack(rest);
                }}
              >
                Redo
              </button>
              <button
                className="button"
                disabled={path.length === 0}
                onClick={() => {
                  if (initialTriad) {
                    setPath(initialTriad);
                    setRedoStack([]);
                  }
                }}
              >
                Reset
              </button>
            </>
          )}
        </div>
  
        {/* zoom slider */}
        <ZoomSlider zoom={zoom} setZoom={setZoom} />
      </div>
  
      {/* grid window */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100",
        }}
      >
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "top left",
            minWidth: `${viewBoxWidth}px`,
            minHeight: `${viewBoxHeight}px`,
          }}
        >
          <svg
            viewBox={`-${viewBoxWidth / 2} -${viewBoxHeight / 2} ${viewBoxWidth} ${viewBoxHeight}`}
            width={`${viewBoxWidth}px`}
            height={`${viewBoxHeight}px`}
            preserveAspectRatio="xMidYMid meet"
            style={{
              display: "block",
              backgroundColor: "#fff",
            }}
          >
            
            {/* arrowhead marker */}
            <defs>
              <marker
                id="arrowhead"
                markerWidth="6"
                markerHeight="4"
                refX="0"
                refY="2"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <polygon points="0 0, 6 2, 0 4" fill="blue" />
              </marker>
            </defs>
            
            {/* triangle grid */}
            {triangles.map(({ id, vertices }) => {
              const isSelected = selectedTriangles.has(id) || path.includes(id);
              const opacity = isAnySelected || path.length > 0 ? (isSelected ? 1 : 0.3) : 1;
              
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
            
            {/* transformation labels */}
            {showTransformations && (() => {
              const renderedTargets = new Set<string>();
              const dedupedLabels: { targetId: string; label: Transformation }[] = [];
              
              for (const list of Object.values(highlightedTransformations)) {
                for (const item of list as { targetId: string; label: Transformation }[]) {
                  if (!renderedTargets.has(item.targetId)) {
                    renderedTargets.add(item.targetId);
                    dedupedLabels.push(item);
                  }
                }
              }
              
              return dedupedLabels.map(({ targetId, label }, idx) => {
                const tri = triangles.find(t => t.id === targetId);
                if (!tri) return null;
                
                const [a, b, c] = tri.vertices;
                const [x, y] = [
                  (a[0] + b[0] + c[0]) / 3,
                  -(a[1] + b[1] + c[1]) / 3
                ];
                
                return (
                  <text
                    key={`label-${targetId}-${label}-${idx}`}
                    x={x}
                    y={y}
                    fontSize={10}
                    fill="red"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    pointerEvents="none"
                    style={{ fontFamily: "sans-serif", opacity: 0.7 }}
                  >
                    {label}
                  </text>
                );
              });
            })()}
            
            {/* path arrows */}
            {path.length > 1 && path.map((_id, i) => {
              if (i === path.length - 1) return null;
              const fromTri = triangles.find(t => t.id === path[i]);
              const toTri = triangles.find(t => t.id === path[i + 1]);
              if (!fromTri || !toTri) return null;
              
              const center = ([a, b, c]: [number, number][]) => [
                (a[0] + b[0] + c[0]) / 3,
                (a[1] + b[1] + c[1]) / 3
              ];
              const [x1, y1] = center(fromTri.vertices);
              const [x2, y2] = center(toTri.vertices);
              const isLast = i === path.length - 2;
              
              return (
                <line
                  key={`path-${i}`}
                  x1={x1}
                  y1={-y1}
                  x2={x2}
                  y2={-y2}
                  stroke="blue"
                  strokeWidth={2}
                  markerEnd={isLast ? "url(#arrowhead)" : undefined}
                />
              );
            })}
            
            {/* PC nodes */}
            {nodes.map(([x, y, label], idx) => (
              <g key={`node-${idx}`} transform={`translate(${x}, ${-y})`}>
                <circle
                  r={12.5}
                  fill="#fff"
                  stroke="#000"
                  strokeWidth={1}
                />
                <text
                  y={3}
                  textAnchor="middle"
                  fontSize={8}
                >
                  {label}
                </text>
              </g>
            ))}

            {/* draw path labels */}
            {drawPath && path.length > 0 && (() => {
              const startId = path[0];
              const endId = path[path.length - 1];
              const startTri = triangles.find(t => t.id === startId);
              const endTri = triangles.find(t => t.id === endId);

              const center = ([a, b, c]: [number, number][]) => [
                (a[0] + b[0] + c[0]) / 3,
                (a[1] + b[1] + c[1]) / 3
              ];

              return (
                <>
                  {startTri && (() => {
                    const [x, y] = center(startTri.vertices);
                    return (
                      <text
                        x={x}
                        y={-y - 12}
                        fontSize={6}
                        fill="blue"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{ fontFamily: "sans-serif", fontWeight: "bold" }}
                      >
                        START
                      </text>
                    );
                  })()}
                  {endTri && endId !== startId && (() => {
                    const [x, y] = center(endTri.vertices);
                    return (
                      <text
                        x={x}
                        y={-y - 12}
                        fontSize={6}
                        fill="blue"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{ fontFamily: "sans-serif", fontWeight: "bold" }}
                      >
                        END
                      </text>
                    );
                  })()}
                </>
              );
            })()}
          </svg>
        </div>
      </div>
      
      <Modal />
      <Legend />
    </div>
  );
};

export default Tonnetz;
