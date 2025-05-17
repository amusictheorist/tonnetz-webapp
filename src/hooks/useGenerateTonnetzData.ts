import { useEffect, useState } from "react"
import { PCNode, TransformationMap, Triangle } from "../types/types"
import { COLS, generateTriangleGrid, ROWS } from "../utils/triangleGrid";
import { generatePCNodes } from "../utils/pcNodes";
import { generateTransformationMap } from "../utils/transformationMap";

export const useGenerateTonnetzData = () => {
  const [triangles, setTriangles] = useState<Triangle[]>([]);
  const [pcNodes, setPcNodes] = useState<PCNode[]>([]);
  const [transformationMap, setTransformationMap] = useState<TransformationMap>({});

  useEffect(() => {
    const grid = generateTriangleGrid(ROWS, COLS);
    setTriangles(grid);
    setPcNodes(generatePCNodes(grid));
    setTransformationMap(generateTransformationMap(grid));
  }, []);

  return { triangles, pcNodes, transformationMap };
};