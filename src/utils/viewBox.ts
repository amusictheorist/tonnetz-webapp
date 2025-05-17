export const calculateViewBox = (zoom: number, gridWidth: number, gridHeight: number) => {
  const extraMargin = 80 / zoom;
  return `${-gridWidth / 2 - extraMargin} ${-gridHeight / 2 - extraMargin} ${gridWidth + extraMargin * 2} ${gridHeight + extraMargin * 2}`;
};