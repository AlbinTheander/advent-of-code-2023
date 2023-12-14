import { Array2D, toChar2D } from "../utils/Array2D";

export function day14(data: string) {
    const grid = toChar2D(data, " ");
    const value1 = part1(grid);
    const value2 = part2(grid);

    console.log(
        "The load on the north support beams after one tilt is",
        value1
    );
    console.log("The load after 1 billion cycles is", value2);
}

function part1(grid: Array2D<string, string>) {
    tiltNorth(grid);
    return loadOfNorthBeams(grid);
}

function part2(grid: Array2D<string, string>) {
    const map = new Map<string, number>();
    let jumped = false;
    const LOOPS = 1000000000;
    for (let i = 0; i < LOOPS; i++) {
        tiltNorth(grid);
        tiltWest(grid);
        tiltSouth(grid);
        tiltEast(grid);
        if (!jumped) {
            const key = grid.toString();
            if (map.has(key)) {
                // We found a cycle. Let's use it to jump ahead
                let cycle = i - map.get(key);
                let jump =
                    Math.floor((LOOPS - i) / cycle) * cycle;
                i += jump;
                jumped = true;
            } else {
                map.set(key, i);
            }
        }
    }

    return loadOfNorthBeams(grid);
}

function loadOfNorthBeams(grid: Array2D<string, string>): number {
  let sum = 0;
  for (let row = 0; row < grid.height; row++) {
      for (let col = 0; col < grid.width; col++) {
          if (grid.get(col, row) === "O") sum += grid.height - row;
      }
  }
  return sum;
}

function tiltNorth(grid: Array2D<string, string>) {
    for (let col = 0; col < grid.width; col++) {
        let row = 0;
        let freeRow = 0;
        while (row < grid.height) {
            const ch = grid.get(col, row);
            if (ch === "#") freeRow = row + 1;
            if (ch === "O") {
                grid.set(col, row, ".");
                grid.set(col, freeRow, "O");
                freeRow++;
            }
            row++;
        }
    }
}

function tiltSouth(grid: Array2D<string, string>) {
    for (let col = 0; col < grid.width; col++) {
        let row = grid.height - 1;
        let freeRow = row;
        while (row >= 0) {
            const ch = grid.get(col, row);
            if (ch === "#") freeRow = row - 1;
            if (ch === "O") {
                grid.set(col, row, ".");
                grid.set(col, freeRow, "O");
                freeRow--;
            }
            row--;
        }
    }
}

function tiltWest(grid: Array2D<string, string>) {
    for (let row = 0; row < grid.height; row++) {
        let col = 0;
        let freeCol = 0;
        while (col < grid.width) {
            const ch = grid.get(col, row);
            if (ch === "#") freeCol = col + 1;
            if (ch === "O") {
                grid.set(col, row, ".");
                grid.set(freeCol, row, "O");
                freeCol++;
            }
            col++;
        }
    }
}

function tiltEast(grid: Array2D<string, string>) {
    for (let row = 0; row < grid.height; row++) {
        let col = grid.width - 1;
        let freeCol = col;
        while (col >= 0) {
            const ch = grid.get(col, row);
            if (ch === "#") freeCol = col - 1;
            if (ch === "O") {
                grid.set(col, row, ".");
                grid.set(freeCol, row, "O");
                freeCol--;
            }
            col--;
        }
    }
}
