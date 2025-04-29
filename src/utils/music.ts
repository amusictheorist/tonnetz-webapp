export function classifyTriad(pcs: number[]): { type: '+' | '-' | null, root: number | null } {
  const sorted = pcs.slice().sort((a, b) => a - b);
  const candidates = [
    [sorted[0], sorted[1], sorted[2]],
    [sorted[1], sorted[2], sorted[0] + 12],
    [sorted[2], sorted[0] + 12, sorted[1] + 12]
  ];

  for (const [a, b, c] of candidates) {
    const iv1 = (b - a + 12) % 12;
    const iv2 = (c - a + 12) % 12;
    if (iv1 === 4 && iv2 === 7) return { type: '+', root: a % 12 };
    if (iv1 === 3 && iv2 === 7) return { type: '-', root: a % 12 };
  }

  return { type: null, root: null };
};

export function findClosestNode(
  x: number,
  y: number,
  nodes: [number, number, number][],
  tolerance = 1e-3
): number | null {
  for (const [nx, ny, pc] of nodes) {
    if (Math.abs(nx - x) < tolerance && Math.abs(ny - y) < tolerance) {
      return pc;
    }
  }
  return null;
};

export function getTriadPCs(
  vertices: [number, number][],
  nodes: [number, number, number][]
): number[] | null {
  const pcs: number[] = [];

  for (const [x, y] of vertices) {
    const pc = findClosestNode(x, y, nodes);
    if (pc === null) return null;
    pcs.push(pc);
  }
  return pcs;
};
