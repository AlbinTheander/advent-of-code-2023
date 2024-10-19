import { Array2D, toChar2D } from "../utils/Array2D";

export function day21(data: string) {
    const grid = toChar2D(data, "X");

    part2(grid);
}

function part1(grid: Array2D<string, string>) {
    const y = grid.data.findIndex((row) => row.includes("S"));
    const x = grid.data[y].findIndex((ch) => ch === "S");

    console.log(grid.toString());
    for (let i = 1; i <= 64; i++) {
        walk(grid);
        console.log("Round", i);
        console.log(grid.toString());
    }
    const result = [...grid.toString()].filter((c) => c === "S").length;
    console.log(result);
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

function part2(grid: Array2D<string, string>) {
    const y = grid.data.findIndex((row) => row.includes("S"));
    const x = grid.data[y].findIndex((ch) => ch === "S");
    for (let y1 = 0; y1 < grid.height; y1++) {
        if (grid.get(x, y1) === "#") console.log("Nooooo");
    }
    for (let x1 = 0; x1 < grid.width; x1++) {
        if (grid.get(x1, y) === "#") console.log("Nooooo");
    }
    console.log(grid.width, grid.height, x, y);
    console.log("OK");
}
