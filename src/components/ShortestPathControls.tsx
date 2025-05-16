import { useState } from "react";
import { pitchClasses } from "../utils/pcNodes";
import { useInteraction } from "../context/InteractionContext";
import { TransformationMap, Triangle } from "../types/types";
import { findShortestPath } from "../utils/findShortestPath";

type ShortestPathControlsProps = {
  triangles: Triangle[];
  transformationMap: TransformationMap;
};

export const ShortestPathControls = ({ triangles, transformationMap }: ShortestPathControlsProps) => {
  const { mode, setPath } = useInteraction();
  const [startTriad, setStartTriad] = useState('C');
  const [startQuality, setStartQuality] = useState<'major' | 'minor'>('major');
  const [targetTriad, setTargetTriad] = useState('G');
  const [targetQuality, setTargetQuality] = useState<'major' | 'minor'>('major');
  const isShortest = mode === 'shortestPath';
  const QUALITIES = ['major', 'minor'];

  return (
    <>
      {isShortest && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
          <div style={{ display: "flex", gap: "12px" }}>
            <div>
              <label>Start Triad</label><br />
              <select value={startTriad} onChange={e => setStartTriad(e.target.value)}>
                {pitchClasses.map(pc => <option key={pc} value={pc}>{pc}</option>)}
              </select>
              <select value={startQuality} onChange={e => setStartQuality(e.target.value)}>
                {QUALITIES.map(q => <option key={q} value={q}>{q}</option>)}
              </select>
            </div>

            <div>
              <label>Target Triad</label><br />
              <select value={targetTriad} onChange={e => setTargetTriad(e.target.value)}>
                {pitchClasses.map(pc => <option key={pc} value={pc}>{pc}</option>)}
              </select>
              <select value={targetQuality} onChange={e => setTargetQuality(e.target.value)}>
                {QUALITIES.map(q => <option key={q} value={q}>{q}</option>)}
              </select>
            </div>
          </div>

          <button
            onClick={() => {
              const startRoot = pitchClasses.indexOf(startTriad);
              const targetRoot = pitchClasses.indexOf(targetTriad);
              const results = findShortestPath(
                triangles,
                transformationMap,
                startRoot,
                startQuality,
                targetRoot,
                targetQuality
              );

              if (results.length > 0) {
                const best = results[0];
                setPath(best.path);
                console.log('transformations:', best.transformations);
              } else {
                alert('no path found');
              }
            }}
            style={{
              padding: "6px 12px",
              fontSize: "14px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              backgroundColor: "#f0f0f0",
              cursor: "pointer",
              marginTop: "4px"
            }}
          >
            Find Shortest Path
          </button>
        </div>
      )}
    </>
  );
};