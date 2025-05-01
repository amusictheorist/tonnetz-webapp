import { useEffect, useRef, useState, useMemo } from "react";
import { buildTransformationMap, getTriangleVertices } from "../utils/geometry";
import { TransformationMap, Transformation, Triangle } from "../types/types";
import { cols, rows, sideLength, triangleHeight, pcNodes } from "../utils/constants";

function Tonnetz() {
  const [selectedTriangles, setSelectedTriangles] = useState<Set<string>>(new Set());
  const [transformationMap, setTransformationMap] = useState<TransformationMap | null>(null);
  const [highlightedTransformations, setHighlightedTransformations] = useState<
    Record<string, { targetId: String, label: Transformation }[]>
    >({});
  const [showTransformations, setShowTransformations] = useState(false);
  const [drawPath, setDrawPath] = useState(false);
  const [path, setPath] = useState<string[]>([]);
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoom = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZoom(parseFloat(e.target.value));
  };

  const handleWheel = (e: WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const direction = Math.sign(e.deltaY);
      setZoom(prev => {
        const newZoom = Math.min(3, Math.max(0.5, prev - direction * 0.1));
        return parseFloat(newZoom.toFixed(2));
      });
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollLeft = container.scrollWidth / 2 - container.clientWidth / 2;
      container.scrollTop = container.scrollHeight / 2 - container.clientHeight / 2;
      container.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      container?.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const handleTriangleClick = (id: string) => {
    if (drawPath) {
      setPath(prev => prev.includes(id) ? prev : [...prev, id]);
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
    const newTriangles: Triangle[] = [];
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

  useEffect(() => {
    if (triangles.length > 0) {
      const map = buildTransformationMap(triangles);
      setTransformationMap(map);
    }
  }, [triangles]);

  const nodes = pcNodes;

  const viewBoxSize = 1000;

  return (
    <div
      ref={containerRef}
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "auto", // Change to auto to prevent forcing scrollbars
        backgroundColor: "#f8f8f8",
        border: "2px solid black",
        position: "relative"
      }}
    >
      {/* checkboxes and slider container */}
      <div
        style={{
          position: "fixed",
          top: "100px",
          right: "50px", // Adjusted to fit both elements
          zIndex: 20,
          background: "#fff",
          padding: "4px 8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          display: "flex",
          flexDirection: "row",
          gap: "20px",
          fontSize: "14px",
          alignItems: "center"
        }}
      >
        {/* show transformations checkbox */}
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          Show Transformations
          <input
            type="checkbox"
            checked={showTransformations}
            onChange={(e) => setShowTransformations(e.target.checked)}
          />
        </label>
        
        {/* draw path checkbox */}
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          Draw Path
          <input
            type="checkbox"
            checked={drawPath}
            onChange={(e) => {
              setDrawPath(e.target.checked);
              setSelectedTriangles(new Set());
              setHighlightedTransformations({});
              setPath([]);
            }}
          />
        </label>
  
        {/* zoom slider */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <input
            type="range"
            min="0.3"
            max="1.5"
            step="0.01"
            value={zoom}
            onChange={handleZoom}
            style={{
              width: "100px", // Adjust the width to fit the container
              height: "10px"
            }}
          />
        </div>
      </div>
  
      {/* grid window */}
      <svg
        viewBox={[-viewBoxSize / 2, -viewBoxSize / 2, viewBoxSize, viewBoxSize].join(" ")}
        style={{
          display: "block",
          width: "100%", // Let the SVG take the full width of the container
          height: "100%", // Let the SVG take the full height of the container
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
            for (const item of list as { targetId: string;  label: Transformation }[]) {
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
        {path.length > 1 && path.map((id, i) => {
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
      </svg>
    </div>
  );
  
};

export default Tonnetz;
