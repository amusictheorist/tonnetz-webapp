import { AxisLine, HighlightAxes } from "../types/axis";

type AxisLinesProps = {
  highlightAxes: HighlightAxes;
  fifths: AxisLine[];
  majorThirds: AxisLine[];
  minorThirds: AxisLine[];
};

export const AxesLayer = ({ highlightAxes, fifths, majorThirds, minorThirds }: AxisLinesProps) => {
  return (
    <>
      {highlightAxes.fifths &&
        fifths.map((line, i) => (
          <polyline
            key={`fifth-${i}`}
            points={line.map(([x, y]) => `${x},${y}`).join(" ")}
            stroke="#333"
            strokeWidth={3}
          />
        ))}
      {highlightAxes.majorThirds &&
        majorThirds.map((line, i) => (
          <polyline
            key={`maj3-${i}`}
            points={line.map(([x, y]) => `${x},${y}`).join(" ")}
            stroke="#333"
            strokeWidth={3}
          />
        ))}
      {highlightAxes.minorThirds &&
        minorThirds.map((line, i) => (
          <polyline
            key={`min3-${i}`}
            points={line.map(([x, y]) => `${x},${y}`).join(" ")}
            stroke="#333"
            strokeWidth={3}
          />
        ))}
    </>
  );
};
