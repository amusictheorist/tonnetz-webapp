import { useEffect, useRef, useState } from "react";
import { Axis, AxisDropdownProps } from "../../types/types";

const AXIS_OPTIONS: { label: string; value: Axis }[] = [
  { label: 'Major Thirds', value: 'majorThirds' },
  { label: 'Minor Thirds', value: 'minorThirds' },
  { label: 'Fifths', value: 'fifths' }
];

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
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(prev => !prev)}
        className="px-2 py-1 rounded border border-gray-300 bg-white shadow-sm text-sm hover:bg-gray-100"
      >
      Highlight Axes ▾
      </button>
      {open && (
        <div className="absolute right-0 mt-1 bg-white border border-gray-300 rounded shadow-md p-2 z-50 min-w-[160px]">
          {AXIS_OPTIONS.map(({ label, value }) => (
            <label
            key={value}
              className="block text-sm text-gray-700 mb-1 last:mb-0 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedAxes[value]}
                onChange={() => toggleAxis(value)}
                disabled={
                  !selectedAxes[value] &&
                  Object.values(selectedAxes).filter(Boolean).length >= 2
                }
                className="mr-1"
              />
              {' ' + label}
            </label>
          ))}
        </div>
      )}
    </div>
  )
}