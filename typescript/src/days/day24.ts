
type Line = {
  x0: bigint;
  y0: bigint;
  z0: bigint;
  dx: bigint;
  dy: bigint;
  dz: bigint;
}
export function day24(data : string) {
  const lines = data.split('\n').map(line => {
    const [x0, y0, z0, dx, dy, dz] = line.match(/-?\d+/g).map(BigInt);
    return { x0, y0, z0, dx, dy, dz }
  })

  const answer1 = part1(lines);
  const [x, y, z] = part2(lines);

  console.log('The number of lines that will intersect within the area is', answer1)
  console.log(`The sum of the coordinates (${x}, ${y}, ${z}} is`, x + y + z);
}

function part1(lines: Line[]) {
  const min = 200000000000000;
  const max = 400000000000000;
  let collisions = 0;
  for (let i = 0; i < lines.length; i++) {
    for (let j = i + 1; j < lines.length; j++) {
      const p = intersection2D(lines[i], lines[j]);
      if (p) {
        const {t1, t2, x, y} = p;
        if (t1 < 0 || t2 < 0) {} // console.log('Collision in past', t1, t2);
        else if (x < min || x > max || y < min || y > max) {} // console.log(`Collision outside`, x, y);
        else {
          collisions++;
        }
      }
    }
  }
  return collisions;
}

function part2(lines: Line[]) {
  /* OK, this is more algebra than code. So this is how I though.
  *  
  *  The line we are searching for is (x0, y0, z0) + t * (dx, dy, dz)
  *  If we intersect another line at t, then we have the following equations:
  *  x0 + t * dx = X1 + t1 * dX1 => t = (X1 - x0) / (dx - dX1)
  *  y0 + t * dy = Y1 + t1 * dY1 => t = (Y1 - y0) / (dy - dY1)
  * 
  *  Since both are equal to t, we have:
  *  (X1 - x0) / (dx - dX1) = (Y1 - y0) / (dy - dY1)
  * 
  *  Moving things around, we can put the multiplications of the unknown quantities on one side:
  *  x0 * dy - y0 * dx = x0 * dY1 - y0 * dX1 - dx * Y1 + dy * X1 + Y1 * dX1 - X1 * dY1
  * 
  * The right side only contains terms of the unknown line, so it is the same no matter which other
  * line we intersect with. So we can write this as a system of equations. Using this, we come up with the 
  * formulas below: 
  */
  
  // Let's get the coefficients from the first couple of lines
  const { x0: x1, y0: y1, dx: dx1, dy: dy1, z0: z1, dz: dz1 } = lines[0];
  const { x0: x2, y0: y2, dx: dx2, dy: dy2, z0: z2, dz: dz2 } = lines[1];
  const { x0: x3, y0: y3, dx: dx3, dy: dy3 } = lines[2];
  const { x0: x4, y0: y4, dx: dx4, dy: dy4 } = lines[3];
  const { x0: x5, y0: y5, dx: dx5, dy: dy5 } = lines[4];

  //
  // We 
  // It's four variables, so we need four equations:
  // a * x + b * y + c * dx + d * dy + e = 0
  // f * x + g * y + h * dx + i * dy + j = 0
  // k * x + l * y + m * dx + n * dy + o = 0
  // p * x + q * y + r * dx + s * dy + t = 0

  const abcde = [dy1 - dy2, dx2 - dx1, y2-y1, x1-x2, x1*dy1 - y1*dx1 - x2*dy2 + y2*dx2];
  const fghij = [dy1 - dy3, dx3 - dx1, y3-y1, x1-x3, x1*dy1 - y1*dx1 - x3*dy3 + y3*dx3];
  const klmno = [dy1 - dy4, dx4 - dx1, y4-y1, x1-x4, x1*dy1 - y1*dx1 - x4*dy4 + y4*dx4];
  const pqrst = [dy1 - dy5, dx5 - dx1, y5-y1, x1-x5, x1*dy1 - y1*dx1 - x5*dy5 + y5*dx5];
  
  const [x0, y0, dx, dy] = solve(abcde, fghij, klmno, pqrst);

  // Now, x0 + t * dx == x1 + t * dx1, so we get t by
  const t1 = (x1 - x0) / (dx - dx1);
  const t2 = (x2 - x0) / (dx - dx2);

  // And for z, we got that a new system with 
  // * z0 + t1 * dz = z1 + t * dz1
  // * z0 + t2 * dz = z2 + t * dz2

  // We can solve this by elimination, which gives us:
  const dz = (z1 + t1 * dz1 - z2 - t2 * dz2) / (t1 - t2);
  const z0 = (z1 + t1 * dz1 - dz * t1)

  // console.log('Answer: ', {x0, y0, z0, dx, dy, dz});
  // console.log('Sum:', x0 + y0 + z0);

  return [x0, y0, z0];
}



function intersection2D(l1: Line, l2: Line) {
  const { x0: x10, y0: y10, dx: dx1, dy: dy1 } = l1;
  const { x0: x20, y0: y20, dx: dx2, dy: dy2 } = l2;

  const denominator = dx1 * dy2 - dy1 * dx2;

  if (denominator === 0n) {
    // Lines are parallel or coincident
    const t1 = (x20 - x10) / dx1;
    const t2 = (y20 - y10) / dy1;
    if (t1 === t2) console.log('Coincident lines');
    return null;
  }

  const t1 = ((x20 - x10) * dy2 - (y20 - y10) * dx2) / denominator;
  const t2 = ((x20 - x10) * dy1 - (y20 - y10) * dx1) / denominator;

  const x = x10 + t1 * dx1;
  const y = y10 + t1 * dy1;

  return { t1, t2, x, y };
}

function solve(abcde: bigint[], fghij: bigint[], klmno: bigint[], pqrst: bigint[]) {

  const [a, b, c, d, e] = abcde;
  const [f, g, h, i, j] = fghij;
  const [k, l, m, n, o] = klmno;
  const [p, q, r, s, t] = pqrst;

  // We'll solve this by elimination
  // First, we'll eliminate X from the second equation
  const f1 = a * f - f * a;
  const g1 = a * g - f * b;
  const h1 = a * h - f * c;
  const i1 = a * i - f * d;
  const j1 = a * j - f * e;

  // Next, we'll eliminate X from the third equation
  const k1 = a * k - k * a;
  const l1 = a * l - k * b;
  const m1 = a * m - k * c;
  const n1 = a * n - k * d;
  const o1 = a * o - k * e;

  // Finally, we'll eliminate X from the fourth equation
  const p1 = a * p - p * a;
  const q1 = a * q - p * b;
  const r1 = a * r - p * c;
  const s1 = a * s - p * d;
  const t1 = a * t - p * e;

  // Now we have a system of three equations with three unknowns
  // We'll solve this by elimination
  // First, we'll eliminate Y from the third equation
  const l2 = l1 * g1 - g1 * l1
  const m2 = l1 * h1 - g1 * m1
  const n2 = l1 * i1 - g1 * n1
  const o2 = l1 * j1 - g1 * o1

  // Finally, we'll eliminate Y from the fourth equation
  const q2 = l1 * q1 - q1 * l1
  const r2 = l1 * r1 - q1 * m1
  const s2 = l1 * s1 - q1 * n1
  const t2 = l1 * t1 - q1 * o1

  // Now we have a system of two equations with two unknowns
  // We'll solve this by elimination
  // Let's eliminate DX from the fourth equation
  const r3 = m2 * r2 - r2 * m2
  const s3 = m2 * s2 - r2 * n2
  const t3 = m2 * t2 - r2 * o2

  const dy = t3 / s3;
  const dx = (t2 - s2 * dy) / r2;
  const y0 = (t1 - r1 * dx - s1 * dy) / q1;
  const x0 = (t - q * y0 - r * dx - s * dy) / p;

  return [x0, y0, dx, dy];
}
