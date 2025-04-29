import { useEffect, useRef, useState } from "react";
import { PITCH_CLASSES, hexCenters } from "../utils/constants";
import { getHexTriangles } from "../utils/geometry";

function Tonnetz() {
  const [selectedTriangles, setSelectedTriangles] = useState<Set<string>>(new Set());
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoom = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZoom(parseFloat(e.target.value));
  };

  const handleWheel = (e: WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const direction = Math.sign(e.deltaY)
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
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const isAnySelected = selectedTriangles.size > 0;

  const triangles = hexCenters.flatMap(([cx, cy], hexIdx) => {
    return getHexTriangles(cx, cy).map((vertices, triIdx) => ({
      id: `${hexIdx}-${triIdx}`,
      vertices,
    }));
  });

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
          transform: "rotate(-90deg",
          transformOrigin: "top right",
          height: "100px",
          zIndex: 10
        }}
      />

      <div
        style={{
          width: 3000,
          height: 3000,
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
        </svg>
      </div>
    </div>
  );
};

export default Tonnetz;
