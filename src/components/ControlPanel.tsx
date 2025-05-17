import { ControlPanelProps } from "../types/types";
import { AxisDropdown } from "./AxesDropdown"
import { PathControls } from "./PathControls"
import { ZoomSlider } from "./ZoomControls";

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
    <div
      style={{
        position: "fixed",
        top: "100px",
        right: "20px",
        zIndex: 20,
        background: "#fff",
        padding: "4px 8px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        display: "flex",
        gap: "8px",
        fontSize: "14px",
        alignItems: "center",
        boxShadow: "0 0 6px rgba(0,0,0,0.15)"
      }}
    >
      <AxisDropdown
        selectedAxes={highlighAxes}
        setSelectedAxes={setHighlightAxes}
      />

      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "4px 8px"
        }}
      >
        Show Transformations
        <input
          type="checkbox"
          checked={showTransformations}
          onChange={() => setShowTransformations((prev) => !prev)}
        />
      </label>

      {showTransformations && mode === 'select' && (
        <button
          onClick={clearSelection}
          style={{
            padding: "4px 8px",
            fontSize: "14px",
            backgroundColor: "#eee",
            border: "1px solid #ddd",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
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