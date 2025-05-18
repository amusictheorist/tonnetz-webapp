import { createContext, ReactNode, useContext, useState } from "react";
import { InteractionMode, InteractionContextProps } from "../types/types";

const InteractionContext = createContext<InteractionContextProps | null>(null);
export const minZoom = 1;
export const maxZoom = 2.5;
export const midZoom = (minZoom + maxZoom) / 2;

export const InteractionProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<InteractionMode>('select');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [path, setPath] = useState<string[]>([]);
  const [shortestPaths, setShortestPaths] = useState<string[][]>([]);
  const [zoom, setZoom] = useState(midZoom);

  const toggleSelection = (id: string) => {
    if (mode === 'select') {
      setSelectedIds(prev =>
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
    } else if (mode === 'drawPath') {
      setPath(prev =>
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
    }
  };

  const reset = () => {
    setSelectedIds([]);
    setPath([]);
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  return (
    <InteractionContext.Provider
      value={{
        mode,
        setMode,
        selectedIds,
        setSelectedIds,
        toggleSelection,
        path,
        setPath,
        shortestPaths,
        setShortestPaths,
        reset,
        clearSelection,
        zoom,
        setZoom
      }}
    >
      {children}
    </InteractionContext.Provider>
  );
};

export const useInteraction = () => {
  const context = useContext(InteractionContext);
  if (!context) throw new Error('useInteraction must be used within an InteractionProvider');
  return context;
};