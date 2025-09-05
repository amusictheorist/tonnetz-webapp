import { TriangleProps } from "../../types/types";

export const TrianglePolygons = ({ id, points, opacity, onClick }: TriangleProps) => {
  // console.log(id, points);
  return (
    <polygon
      key={id}
      points={points.map((p) => p.join(',')).join(' ')}
      fill="#ddd"
      stroke="#333"
      opacity={opacity}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    />

  );
};