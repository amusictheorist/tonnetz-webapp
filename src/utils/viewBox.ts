export const calculateViewBox = (
  centerX: number,
  centerY: number,
  zoom: number,
  worldW: number,
  worldH: number,
  margin = 80
) => {
  const viewW = worldW / zoom;
  const viewH = worldH / zoom;
  const m = margin / zoom;
  const x = centerX - viewW / 2 - m; 
  const y = centerY - viewH / 2 - m;

  return `${x} ${y} ${viewW + 2 * m} ${viewH + 2 * m}`;
};