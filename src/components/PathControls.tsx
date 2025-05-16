import { useState } from "react";
import { useInteraction } from "../context/InteractionContext"
import { ShortestPathControls } from "./ShortestPathControls";
import { TransformationMap, Triangle } from "../types/types";

type PathControlProps = {
  triangles: Triangle[];
  transformationMap: TransformationMap;
};

export const PathControls = ({ triangles, transformationMap }: PathControlProps) => {
  const { mode, setMode, path, setPath, clearSelection } = useInteraction();
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const isDrawing = mode === 'drawPath';
  const isShortest = mode === 'shortestPath';

  const handleToggle = (checked: boolean) => {
    setMode(checked ? 'drawPath' : 'select');
    setPath([]);
    setRedoStack([]);

    if (checked) {
      clearSelection();
    }
  };

  const handleUndo = () => {
    if (path.length > 0) {
      const newPath = path.slice(0, -1);
      const last = path[path.length - 1];
      setPath(newPath);
      setRedoStack([last, ...redoStack]);
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const [redoItem, ...rest] = redoStack;
      setPath([...path, redoItem]);
      setRedoStack(rest);
    }
  };

  const handleReset = () => {
    if (path.length > 0) {
      setPath([path[0]]);
      setRedoStack([]);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        Draw Path
        <input
          type="checkbox"
          checked={isDrawing}
          onChange={(e) => handleToggle(e.target.checked)}
        />
      </label>

      <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        Shortest Path
        <input
          type="checkbox"
          checked={isShortest}
          onChange={(e) => {
            const checked = e.target.checked;
            setMode(checked ? 'shortestPath' : 'select');
            setPath([]);
            setRedoStack([]);
            clearSelection();
          }}
        />
      </label>

      {isDrawing && (
        <>
          <button
            style={{
              padding: "4px 8px",
              fontSize: "12px",
              borderRadius: "4px",
              border: "1px solid #999",
              backgroundColor: "#eee",
              cursor: "pointer"
            }}
            disabled={path.length === 0}
            onClick={handleUndo}
          >
            Undo
          </button>
          
          <button
            style={{
              padding: "4px 8px",
              fontSize: "12px",
              borderRadius: "4px",
              border: "1px solid #999",
              backgroundColor: "#eee",
              cursor: "pointer"
            }}
            disabled={path.length === 0}
            onClick={handleRedo}
          >
            Redo
          </button>
          
          <button
            style={{
              padding: "4px 8px",
              fontSize: "12px",
              borderRadius: "4px",
              border: "1px solid #999",
              backgroundColor: "#eee",
              cursor: "pointer"
            }}
            disabled={path.length === 0}
            onClick={handleReset}
          >
            Reset
          </button>

        </>
      )}

      <ShortestPathControls
        triangles={triangles}
        transformationMap={transformationMap}
      />
    </div>
  );
};