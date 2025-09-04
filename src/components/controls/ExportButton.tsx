import { exportSvg } from "../../utils/exportSvg";

interface ExportButtonProps {
  svgRef: React.RefObject<SVGSVGElement | null>;
  filename?: string;
  zoom?: number;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  svgRef,
  filename = "tonnetz.png",
  zoom = 1,
}) => {
  const handleClick = () => {
    if (svgRef.current) {
      exportSvg(svgRef.current, filename, zoom);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="m-2 px-3 py-1 text-sm font-medium rounded border border-gray-300 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      Export Image
    </button>
  );
};
