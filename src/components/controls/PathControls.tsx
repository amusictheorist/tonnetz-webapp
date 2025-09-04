import { useState } from "react";
import { useInteraction } from "../../context/InteractionContext";
import { ShortestPathControls } from "./ShortestPathControls";
import { PathControlProps } from "../../types/types";

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
    <div className="flex items-center gap-2">
      <label className="flex items-center gap-2">
        Draw Path
        <input
          type="checkbox"
          checked={isDrawing}
          onChange={(e) => handleToggle(e.target.checked)}
          className="cursor-pointer"
          />
      </label>

      <label className="flex items-center gap-2">
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
          className="cursor-pointer"
        />
      </label>

      {isDrawing && (
        <>
          <button
            onClick={handleUndo}
            className="px-2 py-1 text-xs border border-gray-400 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Undo
          </button>
          
          <button
            onClick={handleRedo}
            className="px-2 py-1 text-xs border border-gray-400 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Redo
          </button>
          
          <button onClick={handleReset}
            className="px-2 py-1 text-xs border border-gray-400 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
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