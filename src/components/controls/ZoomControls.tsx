import { maxZoom, minZoom, useInteraction } from "../../context/InteractionContext";

export const ZoomSlider = () => {
  const { zoom, setZoom } = useInteraction();
  const percent = ((zoom - minZoom) / (maxZoom - minZoom)) * 100;

  return (
    <label className="flex flex-col text-sm">
      Zoom: {percent.toFixed(0)}%
      <input
        type="range"
        min={minZoom}
        max={maxZoom}
        step={0.01}
        value={zoom}
        onChange={(e) => setZoom(parseFloat(e.target.value))}
        className="w-24 h-2 mt-1 cursor-pointer accent-blue-500"
      />
    </label>
  );
};
