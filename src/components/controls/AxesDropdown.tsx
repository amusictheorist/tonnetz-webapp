import { useRef, useState } from "react";
import { Axis, AxisDropdownProps } from "../../types/types";
import { toggleAxisSelection } from "../../utils/createAxes";
import { useOutsideClick } from "../../hooks/useOutsideClick";

const AXIS_OPTIONS: { label: string; value: Axis }[] = [
  { label: 'Major Thirds', value: 'majorThirds' },
  { label: 'Minor Thirds', value: 'minorThirds' },
  { label: 'Fifths', value: 'fifths' }
];

export const AxisDropdown: React.FC<AxisDropdownProps> = ({
  selectedAxes,
  setSelectedAxes
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOutsideClick(dropdownRef, () => setOpen(false));
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="px-2 py-1 rounded border border-gray-300 bg-white shadow-sm hover:bg-gray-100"
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
                type='checkbox'
                checked={selectedAxes[value]}
                onChange={() =>
                  setSelectedAxes((prev) => toggleAxisSelection(prev, value))
                }
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
  );
};