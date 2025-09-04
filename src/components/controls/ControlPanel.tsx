import { ControlPanelProps } from "../../types/types";
import { AxisDropdown } from "./AxesDropdown";
import { PathControls } from "./PathControls";
import { ExportButton } from "./ExportButton";
import { ZoomSlider } from "./ZoomControls";

export const ControlPanel = ({
  highlighAxes,
  setHighlightAxes,
  showTransformations,
  setShowTransformations,
  clearSelection,
  mode,
  triangles,
  transformationMap,
  disableTransformations,
  svgRef,
  zoom
}: ControlPanelProps) => {

  return (
    <div className="fixed top-[100px] right-5 z-20 bg-white p-2 border border-gray-300 rounded shadow-sm flex items-center gap-2 text-sm">
      <AxisDropdown
        selectedAxes={highlighAxes}
        setSelectedAxes={setHighlightAxes}
      />

      <label className="flex items-center gap-2 px-2 py-1">
        Show Transformations
        <input
          type="checkbox"
          checked={showTransformations}
          onChange={() => setShowTransformations((prev) => !prev)}
          disabled={disableTransformations}
        />
      </label>

      {showTransformations && mode === 'select' && (
        <button
          onClick={clearSelection}
          className="px-2 py-1 text-sm border border-gray-300 rounded bg-gray-100 hover:bg-gray-200 cursor-pointer"
        >
          Clear
        </button>
      )}

      <PathControls
        triangles={triangles}
        transformationMap={transformationMap}
      />

      <ZoomSlider />
      <ExportButton svgRef={svgRef} filename="tonnetz.png" zoom={zoom} />
    </div>
  );
};