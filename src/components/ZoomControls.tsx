import { useInteraction } from "../context/InteractionContext";

export const ZoomSlider = ({
  minZoom = 1,
  maxZoom = 3
}: {
  minZoom?: number;
  maxZoom?: number;
}) => {
  const { zoom, setZoom } = useInteraction();
  const percent = ((zoom - minZoom) / (maxZoom - minZoom)) * 100;

  return (
    <label style={{ display: "flex", flexDirection: "column", fontSize: "14px" }}>
      Zoom: {percent.toFixed(0)}%
      <input
        type="range"
        min={minZoom}
        max={maxZoom}
        step={0.01}
        value={zoom}
        onChange={(e) => setZoom(parseFloat(e.target.value))}
        style={{ width: "100px", height: "10px", cursor: "pointer" }}
      />
    </label>
  );
};