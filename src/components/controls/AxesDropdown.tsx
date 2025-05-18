import { useEffect, useRef, useState } from "react";
import { Axis, AxisDropdownProps } from "../../types/types";
import '../../styles/AxesDropdown.css';

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
    <div className="dropdown" ref={dropdownRef}>
      <button className="dropdown-button" onClick={() => setOpen(prev => !prev)} >
      Highlight Axes ▾
      </button>
      {open && (
        <div className="dropdown-items" >
          {AXIS_OPTIONS.map(({ label, value }) => (
            <label className="dropdown-label" key={value} >
              <input
                type="checkbox"
                checked={selectedAxes[value]}
                onChange={() => toggleAxis(value)}
                disabled={
                  !selectedAxes[value] &&
                  Object.values(selectedAxes).filter(Boolean).length >= 2
                }
              />
              {' ' + label}
            </label>
          ))}
        </div>
      )}
    </div>
  )
}