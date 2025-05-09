import { PCNode } from "../types/pcNode";
import { Triangle } from "../types/triangle";

const pitchClasses = ['C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B'];

export function generatePCNodes(triangles: Triangle[]): PCNode[] {
  const cornerMap = new Map<string, [number, number]>();

  triangles.forEach(tri => {
    tri.points.forEach(([x, y]) => {
      const key = `${x.toFixed(2)},${y.toFixed(2)}`;
      if (!cornerMap.has(key)) {
        cornerMap.set(key, [x, y]);
      }
    });
  });

  const corners = Array.from(cornerMap.values());
  const tolerance = 5;
  const rows: [number, number][][] = [];
  
  corners.forEach(([x, y]) => {
    let row = rows.find(r => Math.abs(r[0][1] - y) < tolerance);
    if (row) {
      row.push([x, y]);
    } else {
      rows.push([[x, y]]);
    }
  });
  
  rows.sort((a, b) => a[0][1] - b[0][1]);
  rows.forEach(row => row.sort((a, b) => a[0] - b[0]));

  const pcNodes: PCNode[] = [];
  let startLabelIndex = 0;

  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    const row = rows[rowIndex];
    let labelIndex = startLabelIndex;
    for (const [x, y] of row) {
      pcNodes.push({
        id: `${x},${y}`,
        x,
        y,
        label: pitchClasses[labelIndex]
      });

      labelIndex = (labelIndex + 7) % 12;
    }

    if (rowIndex % 2 === 0) {
      startLabelIndex = (startLabelIndex + 8) % 12;
    } else {
      startLabelIndex = (startLabelIndex + 3) % 12;
    }
  }

  return pcNodes;
}
