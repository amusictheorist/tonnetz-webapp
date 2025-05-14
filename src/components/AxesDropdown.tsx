import { useEffect, useRef, useState } from "react";
import { Axis, AxisDropdownProps } from "../types/types";

export const AxisDropdown: React.FC<AxisDropdownProps> = ({
  selectedAxes,
  setSelectedAxes
}: {
  selectedAxes: Record<Axis, boolean>
  setSelectedAxes: (update: (prev: Record<Axis, boolean>) => Record<Axis, boolean>) => void
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleAxis = (axis: Axis) => {
    setSelectedAxes(prev => {
      const currentlySelected = Object.keys(prev).filter(k => prev[k as Axis]) as Axis[];
      if (currentlySelected.includes(axis)) {
        return { ...prev, [axis]: false }
      } else if (currentlySelected.length < 2) {
        return { ...prev, [axis]: true }
      } else {
        return prev;
      }
    })
  }

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button onClick={() => setOpen(prev => !prev)} style={{ padding: "4px 8px" }}>
      Highlight Axes ▾
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "4px",
            boxShadow: "0 2px 6px rgba(0,0,0,02)",
            padding: "8px",
            zIndex: 100
          }}
        >
          {(['fifths', 'minorThirds', 'majorThirds'] as Axis[]).map(axis => (
            <label key={axis} style={{ display: "block", marginBottom: "4px" }}>
              <input
                type="checkbox"
                checked={selectedAxes[axis]}
                onChange={() => toggleAxis(axis)}
                disabled={
                  !selectedAxes[axis] &&
                  Object.values(selectedAxes).filter(Boolean).length >= 2
              }
              />
              {' ' + axis}
            </label>
          ))}
        </div>
      )}
    </div>
  )
}