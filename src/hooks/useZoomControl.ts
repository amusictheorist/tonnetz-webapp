import { useEffect, useState } from "react";
import { minZoom, maxZoom, step } from "../utils/constants";

export function useZoomControl(containerRef: React.RefObject<HTMLElement | null>) {
  const [zoom, setZoom] = useState((minZoom + maxZoom) / 2);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const direction = Math.sign(e.deltaY);
        setZoom(prev => {
          const newZoom = Math.min(maxZoom, Math.max(minZoom, prev - direction * step));
          return parseFloat(newZoom.toFixed(2));
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      container?.removeEventListener('wheel', handleWheel);
    };
  }, [containerRef]);

  return [zoom, setZoom] as const;
};