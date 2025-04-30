import { useEffect, useRef, useState, useMemo } from "react";
import { buildTransformationMap, getTriangleVertices } from "../utils/geometry";
import { TransformationMap, Transformation, Triangle } from "../types/types";
import { cols, rows, sideLength, triangleHeight, pcNodes } from "../utils/constants";

function Tonnetz() {
  const [selectedTriangles, setSelectedTriangles] = useState<Set<string>>(new Set());
  const [transformationMap, setTransformationMap] = useState<TransformationMap | null>(null);
  const [highlightedTransformations, setHighlightedTransformations] = useState<
    { targetId: String, label: Transformation }[]
  >([]);
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
    setSelectedTriangles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
        setHighlightedTransformations([]);
      } else {
        newSet.add(id);
        if (transformationMap?.[id]) {
          const highlights = Object.entries(transformationMap[id]!).map(([label, targetId]) => ({
            targetId,
            label: label as Transformation
          }));
          setHighlightedTransformations(highlights);
        }
      }
      console.log('triangle id:', id);
      return newSet;
    });
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
        overflow: "scroll",
        backgroundColor: "#f8f8f8",
        border: "2px solid black",
        position: "relative"
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
          position: "fixed",
          top: "100px",
          right: "100px",
          transform: "rotate(-90deg)",
          transformOrigin: "top right",
          height: "100px",
          zIndex: 10
        }}
      />

      <div
        style={{
          width: 3000,
          height: 1200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${zoom})`,
          transformOrigin: "center center"
        }}
      >

        <svg
          viewBox={[-viewBoxSize / 2, -viewBoxSize / 2, viewBoxSize, viewBoxSize].join(" ")}
          width={3000}
          height={3000}
          style={{
            display: "block",
            backgroundColor: "#fff",
          }}
        >

          {triangles.map(({ id, vertices }) => {
            const isSelected = selectedTriangles.has(id);
            const opacity = isAnySelected ? (isSelected ? 1 : 0.3) : 1;
            
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

          {highlightedTransformations.map(({ targetId, label }) => {
            const tri = triangles.find(t => t.id === targetId);
            if (!tri) return null;

            const [a, b, c] = tri.vertices;
            const [x, y] = [
              (a[0] + b[0] + c[0]) / 3,
              -(a[1] + b[1] + c[1]) / 3
            ];

            return (
              <text
                key={`label-${targetId}`}
                x={x}
                y={y}
                fontSize={10}
                fill="black"
                textAnchor="middle"
                dominantBaseline="middle"
                pointerEvents="none"
                style={{ fontFamily: "sans-serif", opacity: 0.7 }}
              >
                {label}
              </text>
            );
          })}

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
    </div>
  );
};

export default Tonnetz;
