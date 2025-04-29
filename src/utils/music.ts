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