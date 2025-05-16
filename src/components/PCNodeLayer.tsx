import { FC } from "react";
import { PCNodeProps } from "../types/types";

export const PCNodeLayer: FC<PCNodeProps> = ({ nodes }) => {
  return (
    <>
      {nodes.map(node => (
        <g key={node.id}>
          <circle cx={node.x} cy={node.y} r={12.5} fill="#fff" stroke="#000" />
          <text
            x={node.x}
            y={node.y + 3}
            fontSize={7}
            textAnchor="middle"
          >
            {node.label}
          </text>
        </g>
      ))}
    </>
  );
};