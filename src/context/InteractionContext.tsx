import { createContext, ReactNode, useContext, useState } from "react";
import { InteractionMode } from "../types/mode";

interface InteractionContextProps {
  mode: InteractionMode;
  setMode: (mode: InteractionMode) => void;
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  toggleSelection: (id: string) => void;
  path: string[];
  setPath: (path: string[]) => void;
  reset: () => void;
}

const InteractionContext = createContext<InteractionContextProps | null>(null);

export const InteractionProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<InteractionMode>('select');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [path, setPath] = useState<string[]>([]);

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

  return (
    <InteractionContext.Provider
      value={{ mode, setMode, selectedIds, setSelectedIds, toggleSelection, path, setPath, reset }}
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