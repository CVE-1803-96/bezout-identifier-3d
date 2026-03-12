export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}

export function extendedGcd(a: number, b: number): { g: number; x: number; y: number } {
  if (a === 0) {
    return { g: Math.abs(b), x: 0, y: b >= 0 ? 1 : -1 };
  }
  if (b === 0) {
    return { g: Math.abs(a), x: a >= 0 ? 1 : -1, y: 0 };
  }

  let old_r = a, r = b;
  let old_s = 1, s = 0;
  let old_t = 0, t = 1;

  while (r !== 0) {
    const quotient = Math.floor(old_r / r);
    [old_r, r] = [r, old_r - quotient * r];
    [old_s, s] = [s, old_s - quotient * s];
    [old_t, t] = [t, old_t - quotient * t];
  }

  // Ensure gcd is positive
  if (old_r < 0) {
    return { g: -old_r, x: -old_s, y: -old_t };
  }
  return { g: old_r, x: old_s, y: old_t };
}

export interface BezoutSolution {
  x: number;
  y: number;
}

export function findBezoutSolutions(
  a: number,
  b: number,
  range: number = 20
): { g: number; x0: number; y0: number; solutions: BezoutSolution[] } {
  const { g, x: x0, y: y0 } = extendedGcd(a, b);

  if (g === 0) return { g: 0, x0: 0, y0: 0, solutions: [] };

  const solutions: BezoutSolution[] = [];
  const stepX = b / g;
  const stepY = -a / g;

  // Find solutions within range
  for (let t = -range; t <= range; t++) {
    const x = x0 + stepX * t;
    const y = y0 + stepY * t;
    if (Math.abs(x) <= range && Math.abs(y) <= range) {
      solutions.push({ x, y });
    }
  }

  return { g, x0, y0, solutions };
}
