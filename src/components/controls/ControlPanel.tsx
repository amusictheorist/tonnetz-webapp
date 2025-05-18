import { ControlPanelProps } from "../../types/types";
import { AxisDropdown } from "./AxesDropdown";
import { PathControls } from "./PathControls";
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
  transformationMap
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
    </div>
  );
};