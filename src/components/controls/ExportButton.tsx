import { exportSvg } from "../../utils/exportSvg";

interface ExportButtonProps {
  svgRef: React.RefObject<SVGSVGElement | null>;
  filename?: string;
  zoom?: number;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  svgRef,
  filename = 'tonnetz.png',
  zoom = 1
}) => {
  const handleClick = () => {
    if (svgRef.current) {
      exportSvg(svgRef.current, filename, zoom);
    }
  };

  return (
    <button onClick={handleClick} style={{ margin: "10px" }}>
      Export Image
    </button>
  );
};