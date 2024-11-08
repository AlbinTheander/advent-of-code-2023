import { Array2D, toChar2D } from "../utils/Array2D";

export function day21(data: string) {
    // part1(toChar2D(data, "X"));
    part2(toChar2D(data, "X"));
}

function part1(grid: Array2D<string, string>) {
    const y = grid.data.findIndex((row) => row.includes("S"));
    const x = grid.data[y].findIndex((ch) => ch === "S");

    for (let i = 1; i <= 20; i++) {
        walk(grid);
    }
    const result = [...grid.toString()].filter((c) => c === "S").length;
    console.log(grid.toString());
    console.log('Part 1: ', result);
}

function walk(grid: Array2D<string, string>) {
    const starts = [];
    for (let y = 0; y < grid.height; y++) {
        for (let x = 0; x < grid.width; x++) {
            if (grid.get(x, y) === "S") {
                starts.push([x, y]);
                grid.set(x, y, ".");
            }
        }
    }
    for (const [x, y] of starts) {
        if (grid.get(x + 1, y) === ".") grid.set(x + 1, y, "S");
        if (grid.get(x - 1, y) === ".") grid.set(x - 1, y, "S");
        if (grid.get(x, y + 1) === ".") grid.set(x, y + 1, "S");
        if (grid.get(x, y - 1) === ".") grid.set(x, y - 1, "S");
    }
}

function part2(originalGrid: Array2D<string, string>) {
  const MAX_STEPS = 26501365;
  const grid = getNumGrid(originalGrid);
  const y = originalGrid.data.findIndex((row) => row.includes('S'));
  const x = originalGrid.data[y].indexOf('S');
  let result = 0;
  // Straight North
  console.log('North');
  result = walkNorthSouth(originalGrid, x, grid.height-1, MAX_STEPS - y - 1, grid.height);
  // North-East
  console.log('North-East');
  result += walkToTheSideAndNorth(originalGrid, grid.width-1, grid.height-1, MAX_STEPS - x - y - 2);
  // Straight East
  console.log('East');
  result += walkNorthSouth(originalGrid, 0, y, MAX_STEPS - x - 1, grid.width);
  // South-East
  result += walkToTheSideAndNorth(originalGrid, 0, 0, MAX_STEPS - x - y - 2);
  // Straight South
  result += walkNorthSouth(originalGrid, x, 0, MAX_STEPS - y - 1, grid.height);
  // South-West
  result += walkToTheSideAndNorth(originalGrid, grid.width -1, 0, MAX_STEPS - x - y - 2);
  // Straight West
  result += walkEast(originalGrid, grid.width-1, y, MAX_STEPS - x - 1, grid.width);
  // North-West
  result += walkToTheSideAndNorth(originalGrid, 0, grid.height-1, MAX_STEPS - x - y - 2);

  result += walkAroundInCenter(originalGrid, x, y, MAX_STEPS);

  console.log(result);
}

function walkAroundInCenter(originalGrid: Array2D<string, string>, x: number, y: number, remainingSteps: number): number {
  const grid = getNumGrid(originalGrid);

  grid.set(x, y, 0);
  // Fill in distances
  for (let i = 0; i < 1000; i++) {
    if (!countingWalk(grid, i)) {
      break;
    }
  }

  const distances = [].concat(...grid.data).filter(isFinite);
  const odds = distances.filter((n) => n % 2 === 1);
  const evens = distances.filter((n) => n % 2 === 0);

  return remainingSteps % 2 === 0 ? evens.length : odds.length;
}

function walkNorthSouth(originalGrid: Array2D<string, string>, x: number, y: number, remainingSteps: number, jump: number): number {
  const grid = getNumGrid(originalGrid);

  grid.set(x, y, 0);
  // Fill in distances
  for (let i = 0; i < 1000; i++) {
    if (!countingWalk(grid, i)) {
      break;
    }
  }
  const distances = [].concat(...grid.data).filter(isFinite);
  const odds = distances.filter((n) => n % 2 === 1);
  const evens = distances.filter((n) => n % 2 === 0);
  const maxDist = Math.max(...distances)
  let count = 0;
  while (remainingSteps > 0) {
    if (remainingSteps >= maxDist) {
      count += (remainingSteps % 2 === 0) ? evens.length : odds.length;
    } else {
      const reached = (remainingSteps % 2 === 0 ? evens : odds).filter((n) => n <= remainingSteps).length;
      count += reached;
    }
    remainingSteps -= jump;
  }
  return count;
}

function walkToTheSideAndNorth(originalGrid: Array2D<string, string>, x: number, y: number, remainingSteps: number): number {
  let count = 0;
  while (true) {
    console.log('x', x, 'y', y, 'remainingSteps', remainingSteps);
    const northSteps = walkNorthSouth(originalGrid, x, y, remainingSteps, originalGrid.height);
    if (northSteps === 0) {
      break;
    }
    count += northSteps;
    remainingSteps -= originalGrid.width;
  }
  return count;
}

function walkEast(originalGrid: Array2D<string, string>, x: number, y: number, remainingSteps: number, jump: number): number {
  const grid = getNumGrid(originalGrid);

  grid.set(x, y, 0);
  // Fill in distances
  for (let i = 0; i < 1000; i++) {
    if (!countingWalk(grid, i)) {
      break;
    }
  }
  const distances = [].concat(...grid.data).filter(isFinite);
  const odds = distances.filter((n) => n % 2 === 1);
  const evens = distances.filter((n) => n % 2 === 0);
  const maxDist = Math.max(...distances)
  let count = 0;
  while (remainingSteps > 0) {
    if (remainingSteps >= maxDist) {
      count += (remainingSteps % 2 === 0) ? evens.length : odds.length;
    } else {
      const reached = (remainingSteps % 2 === 0 ? evens : odds).filter((n) => n <= remainingSteps).length;
      count += reached;
    }
    remainingSteps -= grid.width;
  }
  return count;
}



function getNumGrid(originalGrid: Array2D<string, string>): Array2D<number, number> {
  const data = originalGrid.data.map(
    (row) => row.map((ch) => (ch === "S") ? -1 : (ch === "." ? -1 : NaN)));
  return new Array2D(data, NaN);
}

function countingWalk(grid: Array2D<number, number>, current: number): boolean {
  const starts = [];
  for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {
          if (grid.get(x, y) === current) {
              starts.push([x, y]);
          }
      }
  }
  for (const [x, y] of starts) {
      if (grid.get(x + 1, y) === -1) grid.set(x + 1, y, current + 1);
      if (grid.get(x - 1, y) === -1) grid.set(x - 1, y, current + 1);
      if (grid.get(x, y + 1) === -1) grid.set(x, y + 1, current + 1);
      if (grid.get(x, y - 1) === -1) grid.set(x, y - 1, current + 1);
  }
  return starts.length > 0;
}
