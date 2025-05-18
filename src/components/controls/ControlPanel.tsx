import { ControlPanelProps } from "../../types/types";
import { AxisDropdown } from "./AxesDropdown";
import { PathControls } from "./PathControls";
import { ExportButton } from "./ExportButton";
import { ZoomSlider } from "./ZoomControls";
import '../../styles/ControlPanel.css';

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
    <div className="controls" >
      <AxisDropdown
        selectedAxes={highlighAxes}
        setSelectedAxes={setHighlightAxes}
      />

      <label className="control-label" >
        Show Transformations
        <input
          type="checkbox"
          checked={showTransformations}
          onChange={() => setShowTransformations((prev) => !prev)}
          disabled={disableTransformations}
        />
      </label>

      {showTransformations && mode === 'select' && (
        <button className="control-button" onClick={clearSelection} >
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