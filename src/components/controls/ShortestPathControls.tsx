import { useState } from "react";
import { pitchClasses } from "../../utils/pcNodes";
import { useInteraction } from "../../context/InteractionContext";
import { ShortestPathControlsProps } from "../../types/types";
import { findShortestPath } from "../../utils/findShortestPath";
import '../../styles/ShortestPathControls.css';

export const ShortestPathControls = ({ triangles, transformationMap }: ShortestPathControlsProps) => {
  const { mode, setPath, setShortestPaths } = useInteraction();
  const [startTriad, setStartTriad] = useState('C');
  const [startQuality, setStartQuality] = useState<'major' | 'minor'>('major');
  const [targetTriad, setTargetTriad] = useState('G');
  const [targetQuality, setTargetQuality] = useState<'major' | 'minor'>('major');
  const isShortest = mode === 'shortestPath';
  const QUALITIES = ['major', 'minor'];

  return (
    <>
      {isShortest && (
        <div className="shortest-path" >
          <div className="checkboxes" >
            <div>
              <label>Start Triad</label><br />
              <select value={startTriad} onChange={e => setStartTriad(e.target.value)}>
                {pitchClasses.map(pc => <option key={pc} value={pc}>{pc}</option>)}
              </select>
              <select value={startQuality} onChange={e => setStartQuality(e.target.value as 'major' | 'minor')}>
                {QUALITIES.map(q => <option key={q} value={q}>{q}</option>)}
              </select>
            </div>

            <div>
              <label>Target Triad</label><br />
              <select value={targetTriad} onChange={e => setTargetTriad(e.target.value)}>
                {pitchClasses.map(pc => <option key={pc} value={pc}>{pc}</option>)}
              </select>
              <select value={targetQuality} onChange={e => setTargetQuality(e.target.value as 'major' | 'minor')}>
                {QUALITIES.map(q => <option key={q} value={q}>{q}</option>)}
              </select>
            </div>
          </div>

          <button
            className="button"
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
                setPath(results[0].path);
                setShortestPaths(results.map(r => r.path));
              } else {
                alert('No path found');
              }
              
            }}
          >
            Find Shortest Path
          </button>
        </div>
      )}
    </>
  );
};