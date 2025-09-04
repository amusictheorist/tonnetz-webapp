import { useState } from "react";
import { pitchClasses } from "../../utils/pcNodes";
import { useInteraction } from "../../context/InteractionContext";
import { ShortestPathControlsProps } from "../../types/types";
import { findShortestPath } from "../../utils/findShortestPath";

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
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex gap-3">
            <div className="flex flex-col">
              <label className="mb-1">Start Triad</label><br />
              <select
                value={startTriad}
                onChange={e => setStartTriad(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1"
              >
                {pitchClasses.map(pc => (
                  <option key={pc} value={pc}>
                    {pc}
                  </option>
                ))}
              </select>

              <select
                value={startQuality}
                onChange={e => setStartQuality(e.target.value as 'major' | 'minor')}
                className="border border-gray-300 rounded px-2 py-1"
              >
                {QUALITIES.map(q => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="mb-1">Target Triad</label><br />
              <select
                value={targetTriad}
                onChange={e => setTargetTriad(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1"
              >
                {pitchClasses.map(pc => (
                  <option key={pc} value={pc}>
                    {pc}
                  </option>
                ))}
              </select>

              <select
                value={targetQuality}
                onChange={e => setTargetQuality(e.target.value as 'major' | 'minor')}
                className="border border-gray-300 rounded px-2 py-1"
              >
                {QUALITIES.map(q => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))}
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
                setPath(results[0].path);
                setShortestPaths(results.map(r => r.path));
              } else {
                alert('No path found');
              }
            }}
            className="mt-1 px-3 py-1 text-sm border border-gray-300 rounded bg-gray-200 hover:bg-gray-300 cursor-pointer"
          >
            Find Shortest Path
          </button>
        </div>
      )}
    </>
  );
};