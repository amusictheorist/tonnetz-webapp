import { useEffect, useState } from "react";
import { TransformationMap, Triangle } from "../types/types";
import { buildTransformationMap } from "../utils/geometry";

export function useTransformationMap(triangles: Triangle[]) {
  const [transformationMap, setTransformationMap] = useState <TransformationMap | null > (null);

  useEffect(() => {
    if (triangles.length > 0) {
      setTransformationMap(buildTransformationMap(triangles));
    }
  }, [triangles]);

  return transformationMap;
}