import { FC } from "react";
import { PCNode } from "../types/pcNode"

type Props = {
  nodes: PCNode[];
};

export const PCNodeLayer: FC<Props> = ({ nodes }) => {
  return (
    <>
      {nodes.map(node => (
        <g key={node.id}>
          <circle cx={node.x} cy={node.y} r={12.5} fill="#fff" stroke="#000" />
          <text
            x={node.x}
            y={node.y + 3}
            fontSize={8}
            textAnchor="middle"
          >
            {node.label}
          </text>
        </g>
      ))}
    </>
  );
};